from django.db import models
from django.conf import settings
from django.utils import timezone
from apps.appliances.models import Appliance, ApplianceUnit
import datetime
import random

class Rental(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Booking Requested'),
        ('approved', 'Booking Approved'),
        ('payment_completed', '1st Month Paid & Confirmed'),
        ('dispatched', 'Dispatched for Delivery'),
        ('active', 'Rental Active (In Use)'),
        ('relocation_requested', 'Relocation Requested'),
        ('return_requested', 'Return Requested'),
        ('returned', 'Returned (QC Pending)'),
        ('completed', 'Completed & Deposit Settled'),
        ('rejected', 'Rejected'),
    )

    rental_id = models.CharField(max_length=50, unique=True, blank=True)
    customer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='rentals')
    appliance = models.ForeignKey(Appliance, on_delete=models.CASCADE, related_name='rentals')
    assigned_unit = models.ForeignKey(ApplianceUnit, on_delete=models.SET_NULL, null=True, blank=True, related_name='rentals')
    
    # Tenure & Timeline
    duration_months = models.PositiveIntegerField(default=3)
    start_date = models.DateField(default=datetime.date.today)
    end_date = models.DateField()
    
    # Rentomojo-style Financials
    monthly_rate = models.DecimalField(max_digits=10, decimal_places=2)
    discount_percent = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    
    # Upfront Due at Checkout (Month 1 + Deposit + Delivery + Damage Waiver)
    first_month_rent = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    security_deposit = models.DecimalField(max_digits=10, decimal_places=2, default=1000.00)
    delivery_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    
    damage_protection_opt_in = models.BooleanField(default=True)
    damage_protection_fee = models.DecimalField(max_digits=10, decimal_places=2, default=99.00)
    
    upfront_total_paid = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    subtotal = models.DecimalField(max_digits=10, decimal_places=2, default=0.00) # Contract subtotal
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00) # Total contract value
    
    # Delivery & Logistics
    delivery_address = models.TextField()
    delivery_phone = models.CharField(max_length=20)
    delivery_city = models.CharField(max_length=100, blank=True, default='Bangalore')
    delivery_pincode = models.CharField(max_length=10, blank=True, default='560001')
    delivery_date_slot = models.CharField(max_length=60, blank=True, default='Tomorrow, 9 AM - 1 PM')
    installation_required = models.BooleanField(default=True)
    
    # KYC & Security
    kyc_status = models.CharField(max_length=30, default='verified')
    
    # Deposit Settlement on Return
    deposit_refunded = models.BooleanField(default=False)
    deposit_refund_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    deposit_deduction_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    deposit_deduction_reason = models.TextField(blank=True, default='')
    refund_transaction_ref = models.CharField(max_length=100, blank=True, default='')
    
    # Relocation Request
    relocation_requested = models.BooleanField(default=False)
    relocation_address = models.TextField(blank=True, default='')
    
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='pending')
    timeline_events = models.JSONField(default=list, blank=True)
    notes = models.TextField(blank=True, default='')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def save(self, *args, **kwargs):
        if not self.rental_id:
            year = datetime.datetime.now().year
            rand_num = random.randint(100000, 999999)
            self.rental_id = f"RN-{year}-{rand_num}"
        
        # Calculate upfront total if not set
        if not self.upfront_total_paid:
            damage_charge = self.damage_protection_fee if self.damage_protection_opt_in else 0
            self.first_month_rent = self.monthly_rate
            self.upfront_total_paid = float(self.first_month_rent) + float(self.security_deposit) + float(self.delivery_fee) + float(damage_charge)

        if not self.timeline_events:
            self.timeline_events = [
                {
                    'status': 'Booking Requested',
                    'timestamp': timezone.now().strftime('%d %b %Y, %I:%M %p'),
                    'description': f'Rental booking requested for {self.duration_months} month(s). Delivery scheduled for {self.delivery_date_slot}.'
                }
            ]
        super().save(*args, **kwargs)

    def add_timeline_event(self, status_label, description):
        if not isinstance(self.timeline_events, list):
            self.timeline_events = []
        self.timeline_events.append({
            'status': status_label,
            'timestamp': timezone.now().strftime('%d %b %Y, %I:%M %p'),
            'description': description
        })
        self.save(update_fields=['timeline_events', 'updated_at'])

    def __str__(self):
        return f"{self.rental_id} - {self.appliance.name} ({self.customer.get_full_name() or self.customer.email})"


class MonthlyInvoice(models.Model):
    INVOICE_STATUS_CHOICES = (
        ('paid', 'Paid'),
        ('unpaid', 'Payment Due'),
        ('overdue', 'Overdue'),
    )

    rental = models.ForeignKey(Rental, on_delete=models.CASCADE, related_name='invoices')
    invoice_number = models.CharField(max_length=60, unique=True)
    billing_month_number = models.PositiveIntegerField(default=1) # Month 1, Month 2...
    billing_cycle_start = models.DateField()
    billing_cycle_end = models.DateField()
    due_date = models.DateField()
    
    rent_amount = models.DecimalField(max_digits=10, decimal_places=2)
    damage_protection_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    tax_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00) # GST 18%
    total_due = models.DecimalField(max_digits=10, decimal_places=2)
    
    status = models.CharField(max_length=20, choices=INVOICE_STATUS_CHOICES, default='unpaid')
    paid_at = models.DateTimeField(null=True, blank=True)
    transaction_reference = models.CharField(max_length=100, blank=True, default='')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['billing_month_number']

    def __str__(self):
        return f"Invoice {self.invoice_number} (Month {self.billing_month_number}) - ₹{self.total_due} [{self.status.upper()}]"
