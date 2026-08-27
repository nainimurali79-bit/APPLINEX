from django.db import models

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=120, unique=True)
    icon_name = models.CharField(max_length=50, default='Box')
    description = models.TextField(blank=True, null=True)
    image_url = models.URLField(max_length=500, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "Categories"
        ordering = ['name']

    def __str__(self):
        return self.name

class Appliance(models.Model):
    STATUS_CHOICES = (
        ('available', 'Available'),
        ('rented', 'Rented'),
        ('maintenance', 'Maintenance'),
    )

    appliance_code = models.CharField(max_length=50, unique=True)
    name = models.CharField(max_length=255)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='appliances')
    subcategory = models.CharField(max_length=100, blank=True, default='')
    appliance_type = models.CharField(max_length=100, blank=True, default='')
    brand = models.CharField(max_length=100)
    model_number = models.CharField(max_length=100, blank=True, default='')
    
    monthly_price = models.DecimalField(max_digits=10, decimal_places=2)
    security_deposit = models.DecimalField(max_digits=10, decimal_places=2, default=1000.00)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='available')
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=4.8)
    reviews_count = models.PositiveIntegerField(default=0)
    featured = models.BooleanField(default=False)
    
    image_url = models.URLField(max_length=500)
    gallery_images = models.JSONField(default=list, blank=True)
    
    capacity = models.CharField(max_length=100, blank=True, default='')
    energy_rating = models.CharField(max_length=50, blank=True, default='5 Star')
    dimensions = models.CharField(max_length=150, blank=True, default='')
    power_consumption = models.CharField(max_length=100, blank=True, default='')
    warranty_period = models.CharField(max_length=150, blank=True, default='Full Free Maintenance & Replacement Included')
    
    features = models.JSONField(default=list, blank=True)
    specifications = models.JSONField(default=dict, blank=True)
    description = models.TextField(blank=True, default='')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-featured', '-rating', 'name']

    def __str__(self):
        return f"{self.appliance_code} - {self.name} ({self.brand})"
