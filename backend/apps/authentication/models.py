from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLE_CHOICES = (
        ('customer', 'Customer'),
        ('admin', 'Admin'),
        ('support', 'Support Staff'),
    )
    
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='customer')
    phone = models.CharField(max_length=20, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    postal_code = models.CharField(max_length=20, blank=True, null=True)
    profile_image = models.URLField(max_length=500, blank=True, null=True)
    
    # Digital KYC
    kyc_status = models.CharField(max_length=20, choices=[('pending', 'Pending Verification'), ('verified', 'Verified'), ('rejected', 'Rejected')], default='verified')
    kyc_document_type = models.CharField(max_length=50, blank=True, default='Aadhaar Card')
    kyc_document_number = models.CharField(max_length=50, blank=True, default='•••• •••• 8899')
    kyc_document_url = models.URLField(max_length=500, blank=True, null=True)
    kyc_verified_at = models.DateTimeField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return f"{self.get_full_name() or self.username} ({self.role})"
