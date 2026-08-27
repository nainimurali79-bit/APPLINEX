from django.contrib import admin
from .models import MaintenanceLog, ReturnRecord

@admin.register(MaintenanceLog)
class MaintenanceLogAdmin(admin.ModelAdmin):
    list_display = ('log_id', 'appliance', 'condition', 'status', 'service_date', 'cost')
    list_filter = ('condition', 'status', 'service_date')

@admin.register(ReturnRecord)
class ReturnRecordAdmin(admin.ModelAdmin):
    list_display = ('rental', 'return_date', 'condition', 'status', 'refund_amount')
