from rest_framework import serializers
from .models import Rental, MonthlyInvoice
from apps.appliances.models import ApplianceUnit
from apps.appliances.serializers import ApplianceSerializer
from apps.authentication.serializers import UserSerializer
import datetime

class ApplianceUnitSerializer(serializers.ModelSerializer):
    class Meta:
        model = ApplianceUnit
        fields = [
            'id', 'serial_number', 'status', 'condition',
            'city', 'warehouse_location', 'qr_code_id'
        ]

class MonthlyInvoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = MonthlyInvoice
        fields = [
            'id', 'invoice_number', 'billing_month_number',
            'billing_cycle_start', 'billing_cycle_end', 'due_date',
            'rent_amount', 'damage_protection_amount', 'tax_amount',
            'total_due', 'status', 'paid_at', 'transaction_reference',
            'created_at'
        ]

class RentalSerializer(serializers.ModelSerializer):
    appliance_details = ApplianceSerializer(source='appliance', read_only=True)
    customer_details = UserSerializer(source='customer', read_only=True)
    assigned_unit_details = ApplianceUnitSerializer(source='assigned_unit', read_only=True)
    invoices = MonthlyInvoiceSerializer(many=True, read_only=True)

    class Meta:
        model = Rental
        fields = [
            'id', 'rental_id', 'customer', 'customer_details', 'appliance', 'appliance_details',
            'assigned_unit', 'assigned_unit_details', 'duration_months', 'start_date', 'end_date',
            'monthly_rate', 'discount_percent', 'first_month_rent', 'security_deposit', 'delivery_fee',
            'damage_protection_opt_in', 'damage_protection_fee', 'upfront_total_paid',
            'subtotal', 'total_amount', 'delivery_address', 'delivery_phone',
            'delivery_city', 'delivery_pincode', 'delivery_date_slot', 'installation_required',
            'kyc_status', 'deposit_refunded', 'deposit_refund_amount', 'deposit_deduction_amount',
            'deposit_deduction_reason', 'refund_transaction_ref', 'relocation_requested',
            'relocation_address', 'status', 'timeline_events', 'notes', 'invoices',
            'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'rental_id', 'monthly_rate', 'subtotal', 'total_amount', 'upfront_total_paid',
            'timeline_events', 'invoices', 'created_at', 'updated_at'
        ]

class RentalCalculationSerializer(serializers.Serializer):
    appliance_id = serializers.IntegerField()
    duration_months = serializers.IntegerField(min_value=1, max_value=24, default=3)
    start_date = serializers.DateField(required=False)
    damage_protection_opt_in = serializers.BooleanField(required=False, default=True)
    delivery_pincode = serializers.CharField(required=False, default='560001')

class RentalCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rental
        fields = [
            'appliance', 'duration_months', 'start_date',
            'delivery_address', 'delivery_phone', 'delivery_city',
            'delivery_pincode', 'delivery_date_slot', 'installation_required',
            'damage_protection_opt_in', 'notes'
        ]

    def to_internal_value(self, data):
        data = data.copy() if hasattr(data, 'copy') else dict(data)
        if 'appliance_id' in data and 'appliance' not in data:
            data['appliance'] = data['appliance_id']
        return super().to_internal_value(data)
