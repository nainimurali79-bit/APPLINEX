from django.contrib import admin
from .models import Payment

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ('payment_id', 'rental', 'customer', 'amount', 'payment_method', 'status', 'payment_date')
    list_filter = ('status', 'payment_method', 'payment_date')
    search_fields = ('payment_id', 'transaction_reference', 'customer__email')
