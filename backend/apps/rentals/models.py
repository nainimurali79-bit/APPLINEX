from django.db import models
from django.conf import settings
from apps.appliances.models import Appliance
import datetime
import random

class Rental(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Booking Requested'),
        ('approved', 'Booking Approved'),
        ('payment_completed', 'Payment Completed'),
        ('active', 'Rental Active'),
        ('return_requested', 'Return Requested'),
        ('returned', 'Returned'),
        ('completed', 'Completed'),
        ('rejected', 'Rejected'),
    )

    rental_id = models.CharField(max_length=50, unique=True, blank=True)
    customer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='rentals')
    appliance = models.ForeignKey(Appliance, on_delete=models.CASCADE, related_name='rentals')
    
    duration_months = models.PositiveIntegerField(default=1)
    start_date = models.DateField(default=datetime.date.today)
    end_date = models.DateField()
    
    monthly_rate = models.DecimalField(max_digits=10, decimal_places=2)
    discount_percent = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)
    delivery_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    security_deposit = models.DecimalField(max_digits=10, decimal_places=2, default=1000.00)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    
    delivery_address = models.TextField()
    delivery_phone = models.CharField(max_length=20)
    delivery_city = models.CharField(max_length=100, blank=True, default='')
    
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
        
        # Initialize timeline events if empty
        if not self.timeline_events:
            self.timeline_events = [
                {
                    'status': 'Booking Requested',
                    'timestamp': datetime.datetime.now().strftime('%d %b %Y, %I:%M %p'),
                    'description': f'Rental booking requested for {self.duration_months} month(s).'
                }
            ]
        super().save(*args, **kwargs)

    def add_timeline_event(self, status_label, description):
        if not isinstance(self.timeline_events, list):
            self.timeline_events = []
        self.timeline_events.append({
            'status': status_label,
            'timestamp': datetime.datetime.now().strftime('%d %b %Y, %I:%M %p'),
            'description': description
        })
        self.save(update_fields=['timeline_events', 'updated_at'])

    def __str__(self):
        return f"{self.rental_id} - {self.appliance.name} ({self.customer.get_full_name() or self.customer.email})"
