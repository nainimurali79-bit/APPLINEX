from rest_framework import status, views, permissions
from rest_framework.response import Response
from django.db import transaction
from django.utils import timezone
from apps.appliances.models import Appliance, ApplianceUnit
from apps.payments.models import Payment
from .models import Rental, MonthlyInvoice
from .serializers import (
    RentalSerializer, 
    RentalCalculationSerializer, 
    RentalCreateSerializer,
    MonthlyInvoiceSerializer
)
import datetime
from dateutil.relativedelta import relativedelta
import random

SERVICEABLE_PINCODES = ['560', '400', '110', '500', '411', '600'] # Bangalore, Mumbai, Delhi-NCR, Hyderabad, Pune, Chennai

def calculate_rental_pricing(appliance, duration_months=3, start_date=None, damage_protection_opt_in=True, delivery_pincode='560001'):
    if not start_date:
        start_date = timezone.localdate()
    
    end_date = start_date + relativedelta(months=duration_months)
    monthly_base_price = float(appliance.monthly_price)
    
    # Rentomojo Tenure Discount Tiers
    if duration_months >= 24:
        discount_percent = 15.0
        delivery_fee = 0.0
    elif duration_months >= 12:
        discount_percent = 10.0
        delivery_fee = 0.0
    elif duration_months >= 6:
        discount_percent = 5.0
        delivery_fee = 0.0
    elif duration_months >= 3:
        discount_percent = 0.0
        delivery_fee = 0.0
    else:
        discount_percent = 0.0
        delivery_fee = 199.0
        
    effective_monthly_rent = round(monthly_base_price * (1.0 - (discount_percent / 100.0)), 2)
    damage_fee = 99.0 if damage_protection_opt_in else 0.0
    security_deposit = float(appliance.security_deposit)
    
    # 1. Rentomojo Upfront Checkout Due
    upfront_total_due = round(effective_monthly_rent + security_deposit + delivery_fee + damage_fee, 2)
    
    # 2. Subsequent Monthly Recurring Rent
    monthly_recurring_due = round(effective_monthly_rent + damage_fee, 2)
    
    # 3. Full Contract Life Value
    contract_subtotal = round(effective_monthly_rent * duration_months, 2)
    contract_total_value = round(contract_subtotal + delivery_fee + security_deposit + (damage_fee * duration_months), 2)

    # Check Pincode serviceability
    is_serviceable = any(delivery_pincode.startswith(prefix) for prefix in SERVICEABLE_PINCODES) if delivery_pincode else True

    return {
        'appliance_id': appliance.id,
        'appliance_name': appliance.name,
        'appliance_code': appliance.appliance_code,
        'base_monthly_price': monthly_base_price,
        'discount_percent': discount_percent,
        'effective_monthly_price': effective_monthly_rent,
        'duration_months': duration_months,
        'start_date': str(start_date),
        'end_date': str(end_date),
        
        # Upfront Payment Breakup (Rentomojo Standard)
        'first_month_rent': effective_monthly_rent,
        'security_deposit': security_deposit,
        'delivery_fee': delivery_fee,
        'damage_protection_fee': damage_fee,
        'damage_protection_opt_in': damage_protection_opt_in,
        'upfront_total_due': upfront_total_due,
        
        # Subsequent monthly payments
        'monthly_recurring_due': monthly_recurring_due,
        
        # Contract Totals
        'subtotal': contract_subtotal,
        'total_contract_amount': contract_total_value,
        
        # Serviceability
        'is_serviceable': is_serviceable,
        'estimated_delivery': 'Within 24 to 48 Hours' if is_serviceable else 'Out of Service Area'
    }

class RentalCalculateView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RentalCalculationSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        
        appliance_id = serializer.validated_data['appliance_id']
        duration_months = serializer.validated_data.get('duration_months', 3)
        start_date = serializer.validated_data.get('start_date', timezone.localdate())
        damage_opt = serializer.validated_data.get('damage_protection_opt_in', True)
        pincode = serializer.validated_data.get('delivery_pincode', '560001')

        try:
            appliance = Appliance.objects.get(pk=appliance_id)
        except Appliance.DoesNotExist:
            return Response({'error': 'Appliance not found.'}, status=status.HTTP_404_NOT_FOUND)

        calc = calculate_rental_pricing(
            appliance=appliance,
            duration_months=duration_months,
            start_date=start_date,
            damage_protection_opt_in=damage_opt,
            delivery_pincode=pincode
        )
        return Response(calc, status=status.HTTP_200_OK)


class RentalListCreateView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        status_filter = request.GET.get('status')
        tab_filter = request.GET.get('tab')

        if request.user.role in ['admin', 'support']:
            queryset = Rental.objects.all()
        else:
            queryset = Rental.objects.filter(customer=request.user)

        if status_filter and status_filter != 'all':
            queryset = queryset.filter(status=status_filter)

        if tab_filter:
            if tab_filter == 'active':
                queryset = queryset.filter(status__in=['approved', 'payment_completed', 'active', 'dispatched'])
            elif tab_filter == 'pending':
                queryset = queryset.filter(status='pending')
            elif tab_filter == 'returned':
                queryset = queryset.filter(status__in=['return_requested', 'returned'])
            elif tab_filter == 'completed':
                queryset = queryset.filter(status='completed')

        serializer = RentalSerializer(queryset, many=True)
        return Response(serializer.data)

    @transaction.atomic
    def post(self, request):
        serializer = RentalCreateSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        appliance = serializer.validated_data['appliance']
        duration_months = serializer.validated_data.get('duration_months', 3)
        start_date = serializer.validated_data.get('start_date', timezone.localdate())
        damage_opt = serializer.validated_data.get('damage_protection_opt_in', True)
        delivery_pincode = serializer.validated_data.get('delivery_pincode', '560001')
        
        # Calculate pricing
        pricing = calculate_rental_pricing(
            appliance=appliance,
            duration_months=duration_months,
            start_date=start_date,
            damage_protection_opt_in=damage_opt,
            delivery_pincode=delivery_pincode
        )
        
        # Find or reserve an available physical unit
        assigned_unit = appliance.units.filter(status='available').first()
        if not assigned_unit:
            # Create a dedicated unit if needed
            assigned_unit = ApplianceUnit.objects.create(
                appliance=appliance,
                serial_number=f"SN-{appliance.brand[:3].upper()}-{random.randint(100000, 999999)}",
                status='available',
                city=serializer.validated_data.get('delivery_city', 'Bangalore'),
                warehouse_location='Regional Fulfillment Hub'
            )
        
        assigned_unit.status = 'rented'
        assigned_unit.save(update_fields=['status'])

        # Create Rental Record
        rental = Rental.objects.create(
            customer=request.user,
            appliance=appliance,
            assigned_unit=assigned_unit,
            duration_months=duration_months,
            start_date=start_date,
            end_date=datetime.datetime.strptime(pricing['end_date'], '%Y-%m-%d').date(),
            monthly_rate=pricing['effective_monthly_price'],
            discount_percent=pricing['discount_percent'],
            first_month_rent=pricing['first_month_rent'],
            security_deposit=pricing['security_deposit'],
            delivery_fee=pricing['delivery_fee'],
            damage_protection_opt_in=damage_opt,
            damage_protection_fee=pricing['damage_protection_fee'],
            upfront_total_paid=pricing['upfront_total_due'],
            subtotal=pricing['subtotal'],
            total_amount=pricing['total_contract_amount'],
            delivery_address=serializer.validated_data.get('delivery_address', request.user.address or 'Standard Delivery Address'),
            delivery_phone=serializer.validated_data.get('delivery_phone', request.user.phone or '9999999999'),
            delivery_city=serializer.validated_data.get('delivery_city', request.user.city or 'Bangalore'),
            delivery_pincode=delivery_pincode,
            delivery_date_slot=serializer.validated_data.get('delivery_date_slot', 'Tomorrow, 9 AM - 1 PM'),
            installation_required=serializer.validated_data.get('installation_required', True),
            kyc_status=request.user.kyc_status or 'verified',
            notes=serializer.validated_data.get('notes', ''),
            status='payment_completed'
        )

        # Generate Monthly Invoices Schedule
        for m in range(1, duration_months + 1):
            cycle_start = start_date + relativedelta(months=m - 1)
            cycle_end = start_date + relativedelta(months=m)
            due_d = cycle_start
            
            is_first_month = (m == 1)
            inv_status = 'paid' if is_first_month else 'unpaid'
            inv_tx_ref = f"TXN-APX-INIT-{random.randint(100000, 999999)}" if is_first_month else ''
            
            MonthlyInvoice.objects.create(
                rental=rental,
                invoice_number=f"INV-{rental.rental_id}-M{m:02d}",
                billing_month_number=m,
                billing_cycle_start=cycle_start,
                billing_cycle_end=cycle_end,
                due_date=due_d,
                rent_amount=pricing['effective_monthly_price'],
                damage_protection_amount=pricing['damage_protection_fee'],
                tax_amount=round(pricing['effective_monthly_price'] * 0.18, 2),
                total_due=pricing['monthly_recurring_due'] if not is_first_month else pricing['upfront_total_due'],
                status=inv_status,
                paid_at=timezone.now() if is_first_month else None,
                transaction_reference=inv_tx_ref
            )

        # Create Initial Payment Entry
        Payment.objects.create(
            rental=rental,
            customer=request.user,
            amount=pricing['upfront_total_due'],
            payment_method='card',
            status='successful',
            transaction_reference=f"TXN-APX-{random.randint(100000, 999999)}"
        )

        return Response(RentalSerializer(rental).data, status=status.HTTP_201_CREATED)


class RentalDetailView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk_or_code):
        try:
            if str(pk_or_code).isdigit():
                rental = Rental.objects.get(pk=int(pk_or_code))
            else:
                rental = Rental.objects.get(rental_id=pk_or_code)
        except Rental.DoesNotExist:
            return Response({'error': 'Rental record not found.'}, status=status.HTTP_404_NOT_FOUND)

        if request.user.role not in ['admin', 'support'] and rental.customer != request.user:
            return Response({'error': 'Access denied.'}, status=status.HTTP_403_FORBIDDEN)

        serializer = RentalSerializer(rental)
        return Response(serializer.data)


class RentalRelocationView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        try:
            rental = Rental.objects.get(pk=pk)
        except Rental.DoesNotExist:
            return Response({'error': 'Rental record not found.'}, status=status.HTTP_404_NOT_FOUND)

        if rental.customer != request.user and request.user.role != 'admin':
            return Response({'error': 'Access denied.'}, status=status.HTTP_403_FORBIDDEN)

        new_address = request.data.get('new_address', '')
        if not new_address:
            return Response({'error': 'Please provide the new relocation delivery address.'}, status=status.HTTP_400_BAD_REQUEST)

        rental.relocation_requested = True
        rental.relocation_address = new_address
        rental.add_timeline_event(
            'Relocation Requested',
            f'Customer requested free annual relocation to: {new_address}. Logistics team will coordinate uninstallation & transfer.'
        )
        rental.save()

        return Response({
            'message': 'Free Relocation request submitted successfully. Our technician will coordinate moving.',
            'rental': RentalSerializer(rental).data
        })


class RentalDepositSettlementView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    @transaction.atomic
    def post(self, request, pk):
        if request.user.role not in ['admin', 'support']:
            return Response({'error': 'Unauthorized. Admin privilege required.'}, status=status.HTTP_403_FORBIDDEN)

        try:
            rental = Rental.objects.get(pk=pk)
        except Rental.DoesNotExist:
            return Response({'error': 'Rental record not found.'}, status=status.HTTP_404_NOT_FOUND)

        deduction = float(request.data.get('deduction_amount', 0.0))
        reason = request.data.get('deduction_reason', 'Normal wear & tear - Full refund approved.')
        
        deposit = float(rental.security_deposit)
        refund_amount = max(0.0, deposit - deduction)
        
        rental.status = 'completed'
        rental.deposit_refunded = True
        rental.deposit_deduction_amount = deduction
        rental.deposit_deduction_reason = reason
        rental.deposit_refund_amount = refund_amount
        rental.refund_transaction_ref = f"REF-APX-{random.randint(100000, 999999)}"
        
        # Release unit back to available
        if rental.assigned_unit:
            rental.assigned_unit.status = 'available'
            rental.assigned_unit.save(update_fields=['status'])

        rental.add_timeline_event(
            'Deposit Refund Settled',
            f'QC Inspection Completed. Deposit ₹{deposit} settled. Refund ₹{refund_amount} transferred (Txn: {rental.refund_transaction_ref}).'
        )
        rental.save()

        return Response({
            'message': 'Security deposit settled successfully.',
            'rental': RentalSerializer(rental).data
        })


class RentalInvoicePayView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    @transaction.atomic
    def post(self, request, invoice_id):
        try:
            invoice = MonthlyInvoice.objects.get(pk=invoice_id)
        except MonthlyInvoice.DoesNotExist:
            return Response({'error': 'Invoice not found.'}, status=status.HTTP_404_NOT_FOUND)

        if invoice.rental.customer != request.user and request.user.role != 'admin':
            return Response({'error': 'Access denied.'}, status=status.HTTP_403_FORBIDDEN)

        if invoice.status == 'paid':
            return Response({'message': 'Invoice is already paid.'}, status=status.HTTP_200_OK)

        invoice.status = 'paid'
        invoice.paid_at = timezone.now()
        invoice.transaction_reference = f"TXN-INV-{random.randint(100000, 999999)}"
        invoice.save()

        # Add Payment entry
        Payment.objects.create(
            rental=invoice.rental,
            customer=request.user,
            amount=invoice.total_due,
            payment_method='card',
            status='successful',
            transaction_reference=invoice.transaction_reference
        )

        invoice.rental.add_timeline_event(
            f'Month {invoice.billing_month_number} Rent Paid',
            f'Recurring monthly rent of ₹{invoice.total_due} paid successfully (Txn: {invoice.transaction_reference}).'
        )

        return Response({
            'message': f'Month {invoice.billing_month_number} rent paid successfully!',
            'invoice': MonthlyInvoiceSerializer(invoice).data
        })


class RentalReturnRequestView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        try:
            rental = Rental.objects.get(pk=pk)
        except Rental.DoesNotExist:
            return Response({'error': 'Rental record not found.'}, status=status.HTTP_404_NOT_FOUND)

        if rental.customer != request.user and request.user.role != 'admin':
            return Response({'error': 'Access denied.'}, status=status.HTTP_403_FORBIDDEN)

        if rental.status not in ['active', 'payment_completed', 'dispatched']:
            return Response({'error': 'Return can only be requested for active rentals.'}, status=status.HTTP_400_BAD_REQUEST)

        rental.status = 'return_requested'
        rental.add_timeline_event('Return Requested', 'Customer has requested appliance return and pickup for QC.')
        rental.save()

        return Response({
            'message': 'Return request submitted successfully. Our logistics technician will inspect and pick up.',
            'rental': RentalSerializer(rental).data
        })


class RentalStatusUpdateView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def put(self, request, pk):
        if request.user.role not in ['admin', 'support']:
            return Response({'error': 'Unauthorized.'}, status=status.HTTP_403_FORBIDDEN)

        try:
            rental = Rental.objects.get(pk=pk)
        except Rental.DoesNotExist:
            return Response({'error': 'Rental record not found.'}, status=status.HTTP_404_NOT_FOUND)

        new_status = request.data.get('status')
        description = request.data.get('description', f'Status updated to {new_status}')

        if new_status not in [c[0] for c in Rental.STATUS_CHOICES]:
            return Response({'error': f'Invalid status: {new_status}'}, status=status.HTTP_400_BAD_REQUEST)

        rental.status = new_status
        status_display_map = dict(Rental.STATUS_CHOICES)
        rental.add_timeline_event(status_display_map.get(new_status, new_status.title()), description)

        # Sync unit status
        if rental.assigned_unit:
            if new_status in ['active', 'payment_completed', 'approved', 'dispatched']:
                rental.assigned_unit.status = 'rented'
                rental.assigned_unit.save(update_fields=['status'])
            elif new_status in ['completed', 'rejected']:
                rental.assigned_unit.status = 'available'
                rental.assigned_unit.save(update_fields=['status'])

        return Response({
            'message': 'Rental status updated successfully.',
            'rental': RentalSerializer(rental).data
        })

    def patch(self, request, pk):
        return self.put(request, pk)
