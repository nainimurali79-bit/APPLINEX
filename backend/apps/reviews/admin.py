from django.contrib import admin
from .models import Review

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('customer', 'appliance', 'rating', 'status', 'created_at')
    list_filter = ('rating', 'status', 'created_at')
    search_fields = ('customer__email', 'appliance__name', 'review_text')
