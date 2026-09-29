from rest_framework import status, views, permissions
from rest_framework.response import Response
from django.db import transaction
from django.utils import timezone
from apps.rentals.models import Rental, MonthlyInvoice
from .models import Payment
from .serializers import PaymentSerializer, PaymentProcessSerializer
import datetime

class PaymentListCreateView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if request.user.role in ['admin', 'support']:
            payments = Payment.objects.all()
        else:
            payments = Payment.objects.filter(customer=request.user)

        status_param = request.GET.get('status')
        if status_param and status_param != 'all':
            payments = payments.filter(status=status_param)

        serializer = PaymentSerializer(payments, many=True)
        return Response(serializer.data)

    @transaction.atomic
    def post(self, request):
        """Process payment for a rental (Upfront or Monthly)"""
        serializer = PaymentProcessSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        rental_id = serializer.validated_data['rental_id']
        payment_method = serializer.validated_data.get('payment_method', 'card')

        try:
            rental = Rental.objects.get(pk=rental_id)
        except Rental.DoesNotExist:
            return Response({'error': 'Rental record not found.'}, status=status.HTTP_404_NOT_FOUND)

        if rental.customer != request.user and request.user.role != 'admin':
            return Response({'error': 'Access denied.'}, status=status.HTTP_403_FORBIDDEN)

        # Determine pay amount (Upfront or Monthly)
        pay_amount = float(request.data.get('amount') or rental.upfront_total_paid or rental.total_amount)

        # Check if already paid upfront
        existing_successful = Payment.objects.filter(rental=rental, status='successful').exists()
        if existing_successful and rental.status == 'active':
            # Check for any unpaid monthly invoice
            unpaid_inv = rental.invoices.filter(status='unpaid').order_by('billing_month_number').first()
            if unpaid_inv:
                unpaid_inv.status = 'paid'
                unpaid_inv.paid_at = timezone.now()
                unpaid_inv.save()

        # Create Payment Record
        payment = Payment.objects.create(
            rental=rental,
            customer=request.user,
            amount=pay_amount,
            payment_method=payment_method,
            status='successful'
        )

        # Update Rental Status and Timeline if pending
        if rental.status in ['pending', 'approved', 'payment_completed']:
            rental.status = 'active'
            rental.add_timeline_event(
                'Payment Completed',
                f'Payment of ₹{pay_amount} received via {payment.get_payment_method_display()}. (Ref: {payment.transaction_reference})'
            )
            rental.add_timeline_event(
                'Rental Active',
                'Rental agreement active and scheduled for delivery setup.'
            )
            rental.save()

        # Mark 1st invoice as paid
        first_inv = rental.invoices.filter(billing_month_number=1).first()
        if first_inv and first_inv.status != 'paid':
            first_inv.status = 'paid'
            first_inv.paid_at = timezone.now()
            first_inv.transaction_reference = payment.transaction_reference
            first_inv.save()

        # Update Appliance / Unit status
        if rental.assigned_unit:
            rental.assigned_unit.status = 'rented'
            rental.assigned_unit.save(update_fields=['status'])

        return Response({
            'message': 'Payment successful. Rental is now active.',
            'payment': PaymentSerializer(payment).data,
            'rental_id': rental.rental_id,
            'appliance_name': rental.appliance.name,
            'amount': str(pay_amount),
            'transaction_reference': payment.transaction_reference,
            'start_date': str(rental.start_date),
            'end_date': str(rental.end_date),
            'duration_months': rental.duration_months
        }, status=status.HTTP_201_CREATED)


class PaymentReceiptView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        try:
            payment = Payment.objects.get(pk=pk)
        except Payment.DoesNotExist:
            return Response({'error': 'Payment not found.'}, status=status.HTTP_404_NOT_FOUND)

        if payment.customer != request.user and request.user.role not in ['admin', 'support']:
            return Response({'error': 'Access denied.'}, status=status.HTTP_403_FORBIDDEN)

        rental = payment.rental
        receipt_data = {
            'receipt_number': f"REC-{payment.payment_id}",
            'transaction_reference': payment.transaction_reference,
            'date': payment.payment_date.strftime('%d %b %Y, %I:%M %p'),
            'status': payment.status,
            'payment_method': payment.get_payment_method_display(),
            'customer': {
                'name': payment.customer.get_full_name() or payment.customer.username,
                'email': payment.customer.email,
                'phone': payment.customer.phone or rental.delivery_phone,
                'address': rental.delivery_address,
                'city': rental.delivery_city,
                'pincode': rental.delivery_pincode or '560038'
            },
            'rental': {
                'rental_id': rental.rental_id,
                'appliance_name': rental.appliance.name,
                'appliance_code': rental.appliance.appliance_code,
                'category': rental.appliance.category.name,
                'brand': rental.appliance.brand,
                'serial_number': rental.assigned_unit.serial_number if rental.assigned_unit else 'SN-APX-89421',
                'duration_months': rental.duration_months,
                'start_date': str(rental.start_date),
                'end_date': str(rental.end_date),
            },
            'financial_breakdown': {
                'first_month_rent': float(rental.first_month_rent or rental.monthly_rate),
                'monthly_rate': float(rental.monthly_rate),
                'duration_months': rental.duration_months,
                'security_deposit': float(rental.security_deposit),
                'delivery_fee': float(rental.delivery_fee),
                'damage_protection_fee': float(rental.damage_protection_fee if rental.damage_protection_opt_in else 0.0),
                'total_amount_paid': float(payment.amount),
            },
            'organization': {
                'name': 'APPLINEX Technologies Inc.',
                'tagline': 'Smart Household Appliance Rentals',
                'gstin': '29ABCDE1234F1Z5',
                'support_email': 'support@applinex.com',
                'website': 'https://applinex.com'
            }
        }
        return Response(receipt_data)


class PaymentRefundView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    @transaction.atomic
    def post(self, request, pk):
        if request.user.role != 'admin':
            return Response({'error': 'Admin privileges required.'}, status=status.HTTP_403_FORBIDDEN)

        try:
            payment = Payment.objects.get(pk=pk)
        except Payment.DoesNotExist:
            return Response({'error': 'Payment not found.'}, status=status.HTTP_404_NOT_FOUND)

        payment.status = 'refunded'
        payment.save(update_fields=['status'])

        payment.rental.add_timeline_event(
            'Payment Refunded',
            f'Payment of ₹{payment.amount} has been refunded (Ref: {payment.transaction_reference}).'
        )

        return Response({
            'message': 'Payment refunded successfully.',
            'payment': PaymentSerializer(payment).data
        })


class PaymentDetailView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        try:
            payment = Payment.objects.get(pk=pk)
        except Payment.DoesNotExist:
            return Response({'error': 'Payment not found.'}, status=status.HTTP_404_NOT_FOUND)

        if payment.customer != request.user and request.user.role not in ['admin', 'support']:
            return Response({'error': 'Access denied.'}, status=status.HTTP_403_FORBIDDEN)

        return Response(PaymentSerializer(payment).data)
