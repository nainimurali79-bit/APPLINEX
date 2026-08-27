from rest_framework import status, views, permissions
from rest_framework.response import Response
from django.db.models import Avg
from .models import Review
from apps.appliances.models import Appliance
from .serializers import ReviewSerializer, ReviewCreateSerializer

class ReviewListCreateView(views.APIView):
    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def get(self, request):
        appliance_id = request.GET.get('appliance_id')
        user_only = request.GET.get('user_only')

        if user_only == 'true' and request.user.is_authenticated:
            reviews = Review.objects.filter(customer=request.user)
        elif appliance_id:
            reviews = Review.objects.filter(appliance_id=appliance_id, status='approved')
        else:
            if request.user.is_authenticated and request.user.role in ['admin', 'support']:
                reviews = Review.objects.all()
            else:
                reviews = Review.objects.filter(status='approved')

        serializer = ReviewSerializer(reviews, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = ReviewCreateSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        review = serializer.save(customer=request.user, status='approved')

        # Recalculate appliance average rating
        appliance = review.appliance
        avg_rating = Review.objects.filter(appliance=appliance, status='approved').aggregate(Avg('rating'))['rating__avg']
        count = Review.objects.filter(appliance=appliance, status='approved').count()
        if avg_rating:
            appliance.rating = round(avg_rating, 1)
            appliance.reviews_count = count
            appliance.save(update_fields=['rating', 'reviews_count'])

        return Response({
            'message': 'Thank you! Your review has been submitted.',
            'review': ReviewSerializer(review).data
        }, status=status.HTTP_201_CREATED)

class ReviewModerationListView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if request.user.role not in ['admin', 'support']:
            return Response({'error': 'Unauthorized.'}, status=status.HTTP_403_FORBIDDEN)
        
        status_filter = request.GET.get('status', 'all')
        if status_filter != 'all':
            reviews = Review.objects.filter(status=status_filter)
        else:
            reviews = Review.objects.all()
            
        serializer = ReviewSerializer(reviews, many=True)
        return Response(serializer.data)

class ReviewModerateActionView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def put(self, request, pk):
        if request.user.role not in ['admin', 'support']:
            return Response({'error': 'Unauthorized.'}, status=status.HTTP_403_FORBIDDEN)

        try:
            review = Review.objects.get(pk=pk)
        except Review.DoesNotExist:
            return Response({'error': 'Review not found.'}, status=status.HTTP_404_NOT_FOUND)

        action = request.data.get('action') # 'approve' or 'reject'
        if action == 'approve':
            review.status = 'approved'
        elif action == 'reject':
            review.status = 'rejected'
        else:
            return Response({'error': 'Invalid action. Must be approve or reject.'}, status=status.HTTP_400_BAD_REQUEST)

        review.save(update_fields=['status'])
        
        # Update appliance rating
        appliance = review.appliance
        avg_rating = Review.objects.filter(appliance=appliance, status='approved').aggregate(Avg('rating'))['rating__avg'] or 4.8
        count = Review.objects.filter(appliance=appliance, status='approved').count()
        appliance.rating = round(avg_rating, 1)
        appliance.reviews_count = count
        appliance.save(update_fields=['rating', 'reviews_count'])

        return Response({
            'message': f'Review {review.status}.',
            'review': ReviewSerializer(review).data
        })
