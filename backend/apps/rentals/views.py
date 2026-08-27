from rest_framework import status, views, permissions
from rest_framework.response import Response
from apps.appliances.models import Appliance
from .models import Rental
from .serializers import RentalSerializer, RentalCalculationSerializer, RentalCreateSerializer
import datetime
from dateutil.relativedelta import relativedelta

def calculate_rental_pricing(appliance, duration_months, start_date=None):
    if not start_date:
        start_date = datetime.date.today()
    
    # Calculate end date based on duration
    end_date = start_date + relativedelta(months=duration_months)
    
    monthly_price = float(appliance.monthly_price)
    
    # Discount tier
    if duration_months >= 12:
        discount_percent = 15.0
        delivery_fee = 0.0
    elif duration_months >= 6:
        discount_percent = 10.0
        delivery_fee = 0.0
    elif duration_months >= 3:
        discount_percent = 5.0
        delivery_fee = 0.0
    else:
        discount_percent = 0.0
        delivery_fee = 199.0
        
    gross_monthly = monthly_price * (1.0 - (discount_percent / 100.0))
    subtotal = gross_monthly * duration_months
    security_deposit = float(appliance.security_deposit)
    total_amount = subtotal + delivery_fee + security_deposit

    return {
        'appliance_id': appliance.id,
        'appliance_name': appliance.name,
        'appliance_code': appliance.appliance_code,
        'base_monthly_price': monthly_price,
        'discount_percent': discount_percent,
        'effective_monthly_price': round(gross_monthly, 2),
        'duration_months': duration_months,
        'start_date': str(start_date),
        'end_date': str(end_date),
        'subtotal': round(subtotal, 2),
        'delivery_fee': round(delivery_fee, 2),
        'security_deposit': round(security_deposit, 2),
        'total_amount': round(total_amount, 2),
    }

class RentalCalculateView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RentalCalculationSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        
        appliance_id = serializer.validated_data['appliance_id']
        duration_months = serializer.validated_data['duration_months']
        start_date = serializer.validated_data.get('start_date', datetime.date.today())

        try:
            appliance = Appliance.objects.get(pk=appliance_id)
        except Appliance.DoesNotExist:
            return Response({'error': 'Appliance not found.'}, status=status.HTTP_404_NOT_FOUND)

        calc = calculate_rental_pricing(appliance, duration_months, start_date)
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
                queryset = queryset.filter(status__in=['approved', 'payment_completed', 'active'])
            elif tab_filter == 'pending':
                queryset = queryset.filter(status='pending')
            elif tab_filter == 'returned':
                queryset = queryset.filter(status__in=['return_requested', 'returned'])
            elif tab_filter == 'completed':
                queryset = queryset.filter(status='completed')

        serializer = RentalSerializer(queryset, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = RentalCreateSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        appliance = serializer.validated_data['appliance']
        if appliance.status == 'rented':
            return Response({'error': 'This appliance is currently rented.'}, status=status.HTTP_400_BAD_REQUEST)
        if appliance.status == 'maintenance':
            return Response({'error': 'This appliance is currently undergoing scheduled maintenance.'}, status=status.HTTP_400_BAD_REQUEST)

        duration_months = serializer.validated_data['duration_months']
        start_date = serializer.validated_data.get('start_date', datetime.date.today())
        
        pricing = calculate_rental_pricing(appliance, duration_months, start_date)
        
        rental = Rental.objects.create(
            customer=request.user,
            appliance=appliance,
            duration_months=duration_months,
            start_date=start_date,
            end_date=datetime.datetime.strptime(pricing['end_date'], '%Y-%m-%d').date(),
            monthly_rate=pricing['effective_monthly_price'],
            discount_percent=pricing['discount_percent'],
            subtotal=pricing['subtotal'],
            delivery_fee=pricing['delivery_fee'],
            security_deposit=pricing['security_deposit'],
            total_amount=pricing['total_amount'],
            delivery_address=serializer.validated_data.get('delivery_address', request.user.address or 'Standard Address'),
            delivery_phone=serializer.validated_data.get('delivery_phone', request.user.phone or '9999999999'),
            delivery_city=serializer.validated_data.get('delivery_city', request.user.city or 'Bangalore'),
            notes=serializer.validated_data.get('notes', ''),
            status='pending'
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

        # Update Appliance status
        if new_status in ['active', 'payment_completed', 'approved']:
            rental.appliance.status = 'rented'
            rental.appliance.save(update_fields=['status'])
        elif new_status in ['returned', 'completed', 'rejected']:
            rental.appliance.status = 'available'
            rental.appliance.save(update_fields=['status'])

        return Response({
            'message': 'Rental status updated successfully.',
            'rental': RentalSerializer(rental).data
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

        if rental.status not in ['active', 'payment_completed']:
            return Response({'error': 'Return can only be requested for active rentals.'}, status=status.HTTP_400_BAD_REQUEST)

        rental.status = 'return_requested'
        rental.add_timeline_event('Return Requested', 'Customer has requested appliance return and pickup.')
        rental.save()

        return Response({
            'message': 'Return request submitted successfully. Our team will schedule pickup.',
            'rental': RentalSerializer(rental).data
        })
