from rest_framework import serializers
from .models import SupportTicket, Complaint
from apps.authentication.serializers import UserSerializer
from apps.appliances.serializers import ApplianceSerializer
from apps.rentals.serializers import RentalSerializer

class SupportTicketSerializer(serializers.ModelSerializer):
    customer_name = serializers.CharField(source='customer.get_full_name', read_only=True)
    customer_email = serializers.CharField(source='customer.email', read_only=True)
    customer_phone = serializers.CharField(source='customer.phone', read_only=True)
    appliance_name = serializers.CharField(source='appliance.name', read_only=True)
    rental_code = serializers.CharField(source='rental.rental_id', read_only=True)

    class Meta:
        model = SupportTicket
        fields = [
            'id', 'ticket_id', 'customer', 'customer_name', 'customer_email', 'customer_phone',
            'appliance', 'appliance_name', 'rental', 'rental_code',
            'subject', 'description', 'priority', 'status',
            'assigned_staff', 'staff_notes', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'ticket_id', 'customer', 'created_at', 'updated_at']

    def to_internal_value(self, data):
        data = data.copy() if hasattr(data, 'copy') else dict(data)
        if 'title' in data and 'subject' not in data:
            data['subject'] = data['title']
        return super().to_internal_value(data)

class ComplaintSerializer(serializers.ModelSerializer):
    customer_name = serializers.CharField(source='customer.get_full_name', read_only=True)
    customer_email = serializers.CharField(source='customer.email', read_only=True)
    rental_code = serializers.CharField(source='rental.rental_id', read_only=True)

    class Meta:
        model = Complaint
        fields = [
            'id', 'complaint_id', 'customer', 'customer_name', 'customer_email',
            'rental', 'rental_code', 'issue', 'description',
            'status', 'resolution', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'complaint_id', 'customer', 'created_at', 'updated_at']

    def to_internal_value(self, data):
        data = data.copy() if hasattr(data, 'copy') else dict(data)
        if 'title' in data and 'issue' not in data:
            data['issue'] = data['title']
        elif 'subject' in data and 'issue' not in data:
            data['issue'] = data['subject']
        return super().to_internal_value(data)

