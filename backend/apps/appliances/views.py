from rest_framework import status, views, permissions
from rest_framework.response import Response
from django.db.models import Q
from .models import Category, Appliance
from .serializers import CategorySerializer, ApplianceSerializer, ApplianceCreateUpdateSerializer

class CategoryListView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        categories = Category.objects.all()
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data)

    def post(self, request):
        if not request.user.is_authenticated or request.user.role != 'admin':
            return Response({'error': 'Admin privileges required.'}, status=status.HTTP_403_FORBIDDEN)
        serializer = CategorySerializer(data=request.data)
        if serializer.is_valid():
            category = serializer.save()
            return Response(CategorySerializer(category).data, status=status.HTTP_201_CREATED)
        return Response({'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

class ApplianceListCreateView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        queryset = Appliance.objects.all()

        # Query Filters
        category = request.GET.get('category')
        subcategory = request.GET.get('subcategory')
        appliance_type = request.GET.get('type')
        brand = request.GET.get('brand')
        status_param = request.GET.get('status')
        min_price = request.GET.get('min_price')
        max_price = request.GET.get('max_price')
        min_rating = request.GET.get('rating')
        featured = request.GET.get('featured')
        search = request.GET.get('search')
        sort_by = request.GET.get('sort_by', 'popular')

        if category and category != 'all':
            queryset = queryset.filter(Q(category__slug=category) | Q(category__name__iexact=category))
        if subcategory and subcategory != 'all':
            queryset = queryset.filter(subcategory__iexact=subcategory)
        if appliance_type and appliance_type != 'all':
            queryset = queryset.filter(appliance_type__icontains=appliance_type)
        if brand and brand != 'all':
            queryset = queryset.filter(brand__iexact=brand)
        if status_param and status_param != 'all':
            queryset = queryset.filter(status=status_param)
        if min_price:
            try:
                queryset = queryset.filter(monthly_price__gte=float(min_price))
            except ValueError:
                pass
        if max_price:
            try:
                queryset = queryset.filter(monthly_price__lte=float(max_price))
            except ValueError:
                pass
        if min_rating:
            try:
                queryset = queryset.filter(rating__gte=float(min_rating))
            except ValueError:
                pass
        if featured == 'true':
            queryset = queryset.filter(featured=True)
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) |
                Q(brand__icontains=search) |
                Q(model_number__icontains=search) |
                Q(appliance_code__icontains=search) |
                Q(category__name__icontains=search) |
                Q(subcategory__icontains=search) |
                Q(description__icontains=search)
            )

        # Sorting
        if sort_by == 'price_low':
            queryset = queryset.order_by('monthly_price')
        elif sort_by == 'price_high':
            queryset = queryset.order_by('-monthly_price')
        elif sort_by == 'rating':
            queryset = queryset.order_by('-rating')
        elif sort_by == 'newest':
            queryset = queryset.order_by('-created_at')
        else: # popular / default
            queryset = queryset.order_by('-featured', '-rating', 'name')

        serializer = ApplianceSerializer(queryset, many=True)
        return Response(serializer.data)

    def post(self, request):
        if not request.user.is_authenticated or request.user.role != 'admin':
            return Response({'error': 'Admin privileges required.'}, status=status.HTTP_403_FORBIDDEN)
        
        serializer = ApplianceCreateUpdateSerializer(data=request.data)
        if serializer.is_valid():
            appliance = serializer.save()
            return Response(ApplianceSerializer(appliance).data, status=status.HTTP_201_CREATED)
        return Response({'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

class ApplianceDetailView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, pk):
        try:
            appliance = Appliance.objects.get(pk=pk)
        except Appliance.DoesNotExist:
            return Response({'error': 'Appliance not found.'}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = ApplianceSerializer(appliance)
        return Response(serializer.data)

    def put(self, request, pk):
        if not request.user.is_authenticated or request.user.role != 'admin':
            return Response({'error': 'Admin privileges required.'}, status=status.HTTP_403_FORBIDDEN)
        try:
            appliance = Appliance.objects.get(pk=pk)
        except Appliance.DoesNotExist:
            return Response({'error': 'Appliance not found.'}, status=status.HTTP_404_NOT_FOUND)

        serializer = ApplianceCreateUpdateSerializer(appliance, data=request.data, partial=True)
        if serializer.is_valid():
            appliance = serializer.save()
            return Response(ApplianceSerializer(appliance).data)
        return Response({'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        if not request.user.is_authenticated or request.user.role != 'admin':
            return Response({'error': 'Admin privileges required.'}, status=status.HTTP_403_FORBIDDEN)
        try:
            appliance = Appliance.objects.get(pk=pk)
        except Appliance.DoesNotExist:
            return Response({'error': 'Appliance not found.'}, status=status.HTTP_404_NOT_FOUND)
        
        appliance.delete()
        return Response({'message': 'Appliance deleted successfully.'}, status=status.HTTP_200_OK)

class ApplianceFilterMetaView(views.APIView):
    """Provides unique brands, types, and subcategories for dynamic filters"""
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        brands = list(Appliance.objects.values_list('brand', flat=True).distinct().order_by('brand'))
        subcategories = list(Appliance.objects.exclude(subcategory='').values_list('subcategory', flat=True).distinct())
        types = list(Appliance.objects.exclude(appliance_type='').values_list('appliance_type', flat=True).distinct())
        return Response({
            'brands': brands,
            'subcategories': subcategories,
            'types': types,
        })
