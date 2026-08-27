from django.contrib import admin
from .models import SupportTicket, Complaint

@admin.register(SupportTicket)
class SupportTicketAdmin(admin.ModelAdmin):
    list_display = ('ticket_id', 'customer', 'subject', 'priority', 'status', 'created_at')
    list_filter = ('priority', 'status', 'created_at')

@admin.register(Complaint)
class ComplaintAdmin(admin.ModelAdmin):
    list_display = ('complaint_id', 'customer', 'issue', 'status', 'created_at')
    list_filter = ('status', 'created_at')
