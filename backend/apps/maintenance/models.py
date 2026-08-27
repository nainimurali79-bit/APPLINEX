from django.db import models
from apps.appliances.models import Appliance
from apps.rentals.models import Rental
import datetime
import random

class MaintenanceLog(models.Model):
    CONDITION_CHOICES = (
        ('excellent', 'Excellent'),
        ('good', 'Good / Working'),
        ('minor_wear', 'Minor Wear'),
        ('needs_repair', 'Needs Repair'),
        ('damaged', 'Damaged'),
    )

    STATUS_CHOICES = (
        ('scheduled', 'Scheduled'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    )

    log_id = models.CharField(max_length=50, unique=True, blank=True)
    appliance = models.ForeignKey(Appliance, on_delete=models.CASCADE, related_name='maintenance_logs')
    service_date = models.DateField(default=datetime.date.today)
    condition = models.CharField(max_length=30, choices=CONDITION_CHOICES, default='good')
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='scheduled')
    technician_name = models.CharField(max_length=120, default='APPLINEX Certified Technician')
    cost = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    description = models.TextField(blank=True, default='')
    resolution_notes = models.TextField(blank=True, default='')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-service_date', '-created_at']

    def save(self, *args, **kwargs):
        if not self.log_id:
            year = datetime.datetime.now().year
            rand_num = random.randint(100, 999)
            self.log_id = f"MNT-{year}-{rand_num}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.log_id} - {self.appliance.name} ({self.status})"

class ReturnRecord(models.Model):
    RETURN_STATUS = (
        ('pending', 'Pending Inspection'),
        ('inspected', 'Inspected & Approved'),
        ('deposit_refunded', 'Deposit Refunded & Closed'),
    )

    rental = models.OneToOneField(Rental, on_delete=models.CASCADE, related_name='return_record')
    return_date = models.DateField(default=datetime.date.today)
    condition = models.CharField(max_length=30, choices=MaintenanceLog.CONDITION_CHOICES, default='good')
    status = models.CharField(max_length=30, choices=RETURN_STATUS, default='pending')
    deductions = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    refund_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    inspection_notes = models.TextField(blank=True, default='')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Return for {self.rental.rental_id} - {self.status}"
