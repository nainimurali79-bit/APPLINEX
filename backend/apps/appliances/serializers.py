from rest_framework import serializers
from .models import Category, Appliance

class CategorySerializer(serializers.ModelSerializer):
    appliances_count = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'icon_name', 'description', 'image_url', 'appliances_count']

    def get_appliances_count(self, obj):
        return obj.appliances.count()

class ApplianceSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    category_slug = serializers.CharField(source='category.slug', read_only=True)

    class Meta:
        model = Appliance
        fields = [
            'id', 'appliance_code', 'name', 'category', 'category_name', 'category_slug',
            'subcategory', 'appliance_type', 'brand', 'model_number',
            'monthly_price', 'security_deposit', 'status', 'rating', 'reviews_count',
            'featured', 'image_url', 'gallery_images', 'capacity', 'energy_rating',
            'dimensions', 'power_consumption', 'warranty_period', 'features',
            'specifications', 'description', 'created_at', 'updated_at'
        ]

class ApplianceCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appliance
        fields = '__all__'
