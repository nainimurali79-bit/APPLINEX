from rest_framework import serializers
from .models import Payment
from apps.rentals.serializers import RentalSerializer
from apps.authentication.serializers import UserSerializer

class PaymentSerializer(serializers.ModelSerializer):
    customer_name = serializers.CharField(source='customer.get_full_name', read_only=True)
    customer_email = serializers.CharField(source='customer.email', read_only=True)
    rental_code = serializers.CharField(source='rental.rental_id', read_only=True)
    appliance_name = serializers.CharField(source='rental.appliance.name', read_only=True)

    class Meta:
        model = Payment
        fields = [
            'id', 'payment_id', 'rental', 'rental_code', 'appliance_name',
            'customer', 'customer_name', 'customer_email',
            'amount', 'payment_method', 'status', 'transaction_reference',
            'gateway_order_id', 'payment_date', 'updated_at'
        ]
        read_only_fields = ['id', 'payment_id', 'transaction_reference', 'payment_date', 'updated_at']

class PaymentProcessSerializer(serializers.Serializer):
    rental_id = serializers.IntegerField()
    payment_method = serializers.CharField(default='card')
    gateway_token = serializers.CharField(required=False, default='tok_simulated_success')
