from rest_framework import status, views, permissions
from rest_framework.response import Response
from .models import MaintenanceLog, ReturnRecord
from apps.appliances.models import Appliance
from apps.rentals.models import Rental
from .serializers import MaintenanceLogSerializer, ReturnRecordSerializer

class MaintenanceListCreateView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if request.user.role not in ['admin', 'support']:
            return Response({'error': 'Unauthorized.'}, status=status.HTTP_403_FORBIDDEN)
        logs = MaintenanceLog.objects.all()
        status_filter = request.GET.get('status')
        if status_filter and status_filter != 'all':
            logs = logs.filter(status=status_filter)
        return Response(MaintenanceLogSerializer(logs, many=True).data)

    def post(self, request):
        if request.user.role != 'admin':
            return Response({'error': 'Admin privileges required.'}, status=status.HTTP_403_FORBIDDEN)
        serializer = MaintenanceLogSerializer(data=request.data)
        if serializer.is_valid():
            log = serializer.save()
            # Update appliance status to maintenance
            appliance = log.appliance
            appliance.status = 'maintenance'
            appliance.save(update_fields=['status'])
            return Response(MaintenanceLogSerializer(log).data, status=status.HTTP_201_CREATED)
        return Response({'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

class MaintenanceDetailUpdateView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        if request.user.role not in ['admin', 'support']:
            return Response({'error': 'Unauthorized.'}, status=status.HTTP_403_FORBIDDEN)
        try:
            log = MaintenanceLog.objects.get(pk=pk)
        except MaintenanceLog.DoesNotExist:
            return Response({'error': 'Log not found.'}, status=status.HTTP_404_NOT_FOUND)
        return Response(MaintenanceLogSerializer(log).data)

    def put(self, request, pk):
        if request.user.role not in ['admin', 'support']:
            return Response({'error': 'Privileges required.'}, status=status.HTTP_403_FORBIDDEN)
        try:
            log = MaintenanceLog.objects.get(pk=pk)
        except MaintenanceLog.DoesNotExist:
            return Response({'error': 'Log not found.'}, status=status.HTTP_404_NOT_FOUND)

        serializer = MaintenanceLogSerializer(log, data=request.data, partial=True)
        if serializer.is_valid():
            log = serializer.save()
            if log.status == 'completed':
                appliance = log.appliance
                appliance.status = 'available'
                appliance.save(update_fields=['status'])
            return Response(MaintenanceLogSerializer(log).data)
        return Response({'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, pk):
        return self.put(request, pk)

    def delete(self, request, pk):
        if request.user.role != 'admin':
            return Response({'error': 'Admin privileges required.'}, status=status.HTTP_403_FORBIDDEN)
        try:
            log = MaintenanceLog.objects.get(pk=pk)
            log.delete()
            return Response({'message': 'Maintenance log deleted successfully.'}, status=status.HTTP_204_NO_CONTENT)
        except MaintenanceLog.DoesNotExist:
            return Response({'error': 'Log not found.'}, status=status.HTTP_404_NOT_FOUND)

class ReturnsListView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if request.user.role not in ['admin', 'support']:
            return Response({'error': 'Unauthorized.'}, status=status.HTTP_403_FORBIDDEN)
        records = ReturnRecord.objects.all()
        return Response(ReturnRecordSerializer(records, many=True).data)

class ProcessReturnActionView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        """Process return for a Rental (pk = rental_id or return_record id)"""
        if request.user.role not in ['admin', 'support']:
            return Response({'error': 'Unauthorized.'}, status=status.HTTP_403_FORBIDDEN)

        try:
            rental = Rental.objects.get(pk=pk)
        except Rental.DoesNotExist:
            try:
                ret_rec = ReturnRecord.objects.get(pk=pk)
                rental = ret_rec.rental
            except ReturnRecord.DoesNotExist:
                return Response({'error': 'Rental or Return Record not found.'}, status=status.HTTP_404_NOT_FOUND)

        condition = request.data.get('condition', 'good')
        deductions = float(request.data.get('deductions', 0.0))
        notes = request.data.get('inspection_notes', 'Inspection completed successfully.')

        deposit = float(rental.security_deposit)
        refund_amount = max(0.0, deposit - deductions)

        return_rec, created = ReturnRecord.objects.get_or_create(
            rental=rental,
            defaults={
                'condition': condition,
                'status': 'deposit_refunded',
                'deductions': deductions,
                'refund_amount': refund_amount,
                'inspection_notes': notes
            }
        )
        if not created:
            return_rec.condition = condition
            return_rec.status = 'deposit_refunded'
            return_rec.deductions = deductions
            return_rec.refund_amount = refund_amount
            return_rec.inspection_notes = notes
            return_rec.save()

        # Update Rental Status
        rental.status = 'returned'
        rental.add_timeline_event(
            'Returned & Inspected',
            f'Appliance condition: {condition.title()}. Security deposit refund of ₹{refund_amount} processed.'
        )
        rental.save()

        # Update Appliance status
        if condition in ['damaged', 'needs_repair']:
            rental.appliance.status = 'maintenance'
            # Create maintenance log automatically
            MaintenanceLog.objects.create(
                appliance=rental.appliance,
                condition=condition,
                status='scheduled',
                description=f'Automatic inspection maintenance post-return. Notes: {notes}'
            )
        else:
            rental.appliance.status = 'available'
        rental.appliance.save(update_fields=['status'])

        return Response({
            'message': 'Return processed successfully.',
            'return_record': ReturnRecordSerializer(return_rec).data
        })
