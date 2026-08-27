from django.contrib import admin
from .models import Category, Appliance

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'icon_name')
    prepopulated_fields = {'slug': ('name',)}

@admin.register(Appliance)
class ApplianceAdmin(admin.ModelAdmin):
    list_display = ('appliance_code', 'name', 'category', 'brand', 'monthly_price', 'status', 'rating', 'featured')
    list_filter = ('category', 'brand', 'status', 'featured')
    search_fields = ('name', 'appliance_code', 'brand', 'model_number')
