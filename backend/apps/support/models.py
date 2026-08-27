from django.db import models
from django.conf import settings
from apps.appliances.models import Appliance
from apps.rentals.models import Rental
import datetime
import random

class SupportTicket(models.Model):
    PRIORITY_CHOICES = (
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('urgent', 'Urgent'),
    )

    STATUS_CHOICES = (
        ('open', 'Open'),
        ('in_progress', 'In Progress'),
        ('resolved', 'Resolved'),
        ('closed', 'Closed'),
    )

    ticket_id = models.CharField(max_length=50, unique=True, blank=True)
    customer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='support_tickets')
    appliance = models.ForeignKey(Appliance, on_delete=models.SET_NULL, null=True, blank=True, related_name='tickets')
    rental = models.ForeignKey(Rental, on_delete=models.SET_NULL, null=True, blank=True, related_name='tickets')
    
    subject = models.CharField(max_length=255)
    description = models.TextField()
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='medium')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='open')
    assigned_staff = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_tickets')
    staff_notes = models.TextField(blank=True, default='')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def save(self, *args, **kwargs):
        if not self.ticket_id:
            year = datetime.datetime.now().year
            rand_num = random.randint(100, 999)
            self.ticket_id = f"TKT-{year}-{rand_num}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.ticket_id} - {self.subject} ({self.status})"

class Complaint(models.Model):
    STATUS_CHOICES = (
        ('open', 'Open'),
        ('in_progress', 'In Progress'),
        ('resolved', 'Resolved'),
    )

    complaint_id = models.CharField(max_length=50, unique=True, blank=True)
    customer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='complaints')
    rental = models.ForeignKey(Rental, on_delete=models.SET_NULL, null=True, blank=True, related_name='complaints')
    
    issue = models.CharField(max_length=255)
    description = models.TextField(blank=True, default='')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='open')
    resolution = models.TextField(blank=True, default='')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def save(self, *args, **kwargs):
        if not self.complaint_id:
            year = datetime.datetime.now().year
            rand_num = random.randint(100, 999)
            self.complaint_id = f"CMP-{year}-{rand_num}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.complaint_id} - {self.issue} ({self.status})"
