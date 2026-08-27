from rest_framework import serializers
from .models import Rental
from apps.appliances.serializers import ApplianceSerializer
from apps.authentication.serializers import UserSerializer
import datetime

class RentalSerializer(serializers.ModelSerializer):
    appliance_details = ApplianceSerializer(source='appliance', read_only=True)
    customer_details = UserSerializer(source='customer', read_only=True)

    class Meta:
        model = Rental
        fields = [
            'id', 'rental_id', 'customer', 'customer_details', 'appliance', 'appliance_details',
            'duration_months', 'start_date', 'end_date', 'monthly_rate',
            'discount_percent', 'subtotal', 'delivery_fee', 'security_deposit',
            'total_amount', 'delivery_address', 'delivery_phone', 'delivery_city',
            'status', 'timeline_events', 'notes', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'rental_id', 'monthly_rate', 'subtotal', 'total_amount', 'timeline_events', 'created_at', 'updated_at']

class RentalCalculationSerializer(serializers.Serializer):
    appliance_id = serializers.IntegerField()
    duration_months = serializers.IntegerField(min_value=1, max_value=24)
    start_date = serializers.DateField(required=False)

class RentalCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rental
        fields = [
            'appliance', 'duration_months', 'start_date',
            'delivery_address', 'delivery_phone', 'delivery_city', 'notes'
        ]
