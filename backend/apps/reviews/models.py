from django.db import models
from django.conf import settings
from apps.appliances.models import Appliance
from apps.rentals.models import Rental

class Review(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending Moderation'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    )

    customer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='reviews')
    appliance = models.ForeignKey(Appliance, on_delete=models.CASCADE, related_name='reviews')
    rental = models.ForeignKey(Rental, on_delete=models.SET_NULL, null=True, blank=True, related_name='reviews')
    
    rating = models.PositiveSmallIntegerField(default=5)
    review_text = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='approved')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.customer.get_full_name()} on {self.appliance.name} ({self.rating} stars)"
