from django.contrib import admin
from .models import Rental

@admin.register(Rental)
class RentalAdmin(admin.ModelAdmin):
    list_display = ('rental_id', 'customer', 'appliance', 'duration_months', 'total_amount', 'status', 'start_date', 'end_date')
    list_filter = ('status', 'duration_months', 'start_date')
    search_fields = ('rental_id', 'customer__email', 'appliance__name')
