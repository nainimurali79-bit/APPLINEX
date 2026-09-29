from django.db import models
from django.conf import settings
from apps.rentals.models import Rental
import datetime
import random

class Payment(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('successful', 'Successful'),
        ('failed', 'Failed'),
        ('refunded', 'Refunded'),
    )

    METHOD_CHOICES = (
        ('card', 'Credit / Debit Card'),
        ('upi', 'UPI / NetBanking'),
        ('razorpay', 'Razorpay'),
        ('stripe', 'Stripe'),
        ('paypal', 'PayPal'),
    )

    payment_id = models.CharField(max_length=50, unique=True, blank=True)
    rental = models.ForeignKey(Rental, on_delete=models.CASCADE, related_name='payments')
    customer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='payments')
    
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_method = models.CharField(max_length=30, choices=METHOD_CHOICES, default='card')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='successful')
    transaction_reference = models.CharField(max_length=100, unique=True, blank=True)
    gateway_order_id = models.CharField(max_length=100, blank=True, default='')
    
    payment_date = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-payment_date']

    def save(self, *args, **kwargs):
        if not self.payment_id:
            year = datetime.datetime.now().year
            rand_num = random.randint(100000, 999999)
            self.payment_id = f"PMT-{year}-{rand_num}"
        if not self.transaction_reference:
            rand_hex = hex(random.randint(0x1000000, 0xFFFFFFF))[2:].upper()
            self.transaction_reference = f"TXN-APX-{rand_hex}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.payment_id} - ₹{self.amount} ({self.status})"
