from rest_framework import serializers
from .models import MaintenanceLog, ReturnRecord
from apps.appliances.serializers import ApplianceSerializer
from apps.rentals.serializers import RentalSerializer

class MaintenanceLogSerializer(serializers.ModelSerializer):
    appliance_name = serializers.CharField(source='appliance.name', read_only=True)
    appliance_code = serializers.CharField(source='appliance.appliance_code', read_only=True)
    category_name = serializers.CharField(source='appliance.category.name', read_only=True)

    class Meta:
        model = MaintenanceLog
        fields = [
            'id', 'log_id', 'appliance', 'appliance_name', 'appliance_code', 'category_name',
            'service_date', 'condition', 'status', 'technician_name', 'cost',
            'description', 'resolution_notes', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'log_id', 'created_at', 'updated_at']

class ReturnRecordSerializer(serializers.ModelSerializer):
    rental_details = RentalSerializer(source='rental', read_only=True)

    class Meta:
        model = ReturnRecord
        fields = [
            'id', 'rental', 'rental_details', 'return_date', 'condition',
            'status', 'deductions', 'refund_amount', 'inspection_notes',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
