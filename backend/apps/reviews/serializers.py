from rest_framework import serializers
from .models import Review
from apps.authentication.serializers import UserSerializer
from apps.appliances.serializers import ApplianceSerializer

class ReviewSerializer(serializers.ModelSerializer):
    customer_name = serializers.CharField(source='customer.get_full_name', read_only=True)
    customer_email = serializers.CharField(source='customer.email', read_only=True)
    customer_avatar = serializers.CharField(source='customer.profile_image', read_only=True)
    appliance_name = serializers.CharField(source='appliance.name', read_only=True)
    appliance_image = serializers.CharField(source='appliance.image_url', read_only=True)

    class Meta:
        model = Review
        fields = [
            'id', 'customer', 'customer_name', 'customer_email', 'customer_avatar',
            'appliance', 'appliance_name', 'appliance_image', 'rental',
            'rating', 'review_text', 'status', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'status', 'created_at', 'updated_at']

class ReviewCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ['appliance', 'rental', 'rating', 'review_text']
