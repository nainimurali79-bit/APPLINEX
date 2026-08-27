from rest_framework import status, views, permissions
from rest_framework.response import Response
from apps.rentals.models import Rental
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

    def post(self, request):
        """Process real payment for a rental"""
        serializer = PaymentProcessSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        rental_id = serializer.validated_data['rental_id']
        payment_method = serializer.validated_data['payment_method']

        try:
            rental = Rental.objects.get(pk=rental_id)
        except Rental.DoesNotExist:
            return Response({'error': 'Rental record not found.'}, status=status.HTTP_404_NOT_FOUND)

        if rental.customer != request.user and request.user.role != 'admin':
            return Response({'error': 'Access denied.'}, status=status.HTTP_403_FORBIDDEN)

        # Check if already paid
        if rental.status in ['payment_completed', 'active']:
            return Response({'error': 'Payment for this rental has already been completed.'}, status=status.HTTP_400_BAD_REQUEST)

        # Create Payment Record
        payment = Payment.objects.create(
            rental=rental,
            customer=request.user,
            amount=rental.total_amount,
            payment_method=payment_method,
            status='successful'
        )

        # Update Rental Status and Timeline
        rental.status = 'active'
        rental.add_timeline_event(
            'Payment Completed',
            f'Payment of ₹{rental.total_amount} received via {payment.get_payment_method_display()}. Ref: {payment.transaction_reference}'
        )
        rental.add_timeline_event(
            'Rental Active',
            'Appliance dispatched and rental agreement active.'
        )
        rental.save()

        # Update Appliance status to rented
        rental.appliance.status = 'rented'
        rental.appliance.save(update_fields=['status'])

        return Response({
            'message': 'Payment successful. Rental is now active.',
            'payment': PaymentSerializer(payment).data,
            'rental_id': rental.rental_id,
            'appliance_name': rental.appliance.name,
            'amount': str(rental.total_amount),
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
            },
            'rental': {
                'rental_id': rental.rental_id,
                'appliance_name': rental.appliance.name,
                'appliance_code': rental.appliance.appliance_code,
                'category': rental.appliance.category.name,
                'brand': rental.appliance.brand,
                'duration_months': rental.duration_months,
                'start_date': str(rental.start_date),
                'end_date': str(rental.end_date),
            },
            'financial_breakdown': {
                'monthly_rate': float(rental.monthly_rate),
                'duration_months': rental.duration_months,
                'subtotal': float(rental.subtotal),
                'delivery_fee': float(rental.delivery_fee),
                'security_deposit': float(rental.security_deposit),
                'total_amount': float(payment.amount),
            },
            'organization': {
                'name': 'APPLINEX Technologies Inc.',
                'tagline': 'Smart Living, Simplified.',
                'gstin': '29ABCDE1234F1Z5',
                'support_email': 'support@applinex.com',
                'website': 'https://applinex.com'
            }
        }
        return Response(receipt_data)

class PaymentRefundView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

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
