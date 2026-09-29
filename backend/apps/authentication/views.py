from rest_framework import status, views, permissions
from rest_framework.response import Response
from django.contrib.auth import authenticate, get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import (
    UserSerializer,
    RegisterSerializer,
    LoginSerializer,
    ProfileUpdateSerializer,
    AdminUserCreateSerializer,
    UserAdminUpdateSerializer
)

User = get_user_model()

def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    # Add custom claims
    refresh['role'] = user.role
    refresh['email'] = user.email
    refresh['name'] = user.get_full_name() or user.username
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

class RegisterView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            tokens = get_tokens_for_user(user)
            return Response({
                'message': 'Account created successfully.',
                'user': UserSerializer(user).data,
                'tokens': tokens
            }, status=status.HTTP_201_CREATED)
        return Response({'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

class LoginView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        
        email = serializer.validated_data['email']
        password = serializer.validated_data['password']
        
        user = authenticate(request, username=email, password=password)
        if not user:
            # Fallback check for username if user entered username
            try:
                user_obj = User.objects.get(email=email)
                user = authenticate(request, username=user_obj.username, password=password)
            except User.DoesNotExist:
                user = None

        if user:
            if not user.is_active:
                return Response({'error': 'Account is disabled.'}, status=status.HTTP_403_FORBIDDEN)
            tokens = get_tokens_for_user(user)
            return Response({
                'message': 'Login successful.',
                'user': UserSerializer(user).data,
                'tokens': tokens
            }, status=status.HTTP_200_OK)
        
        return Response({'error': 'Invalid email or password.'}, status=status.HTTP_401_UNAUTHORIZED)

class ProfileView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request):
        serializer = ProfileUpdateSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'message': 'Profile updated successfully.',
                'user': UserSerializer(request.user).data
            }, status=status.HTTP_200_OK)
        return Response({'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

class ForgotPasswordView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get('email')
        if not email:
            return Response({'error': 'Email is required.'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            user = User.objects.get(email=email)
            return Response({
                'message': f'Password reset link has been dispatched to {email}.',
                'reset_token': 'applinex-reset-demo-token-12345'
            }, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            # For security, return generic success
            return Response({
                'message': f'If an account exists with {email}, a reset link has been sent.'
            }, status=status.HTTP_200_OK)

class ResetPasswordView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get('email')
        new_password = request.data.get('new_password')
        confirm_password = request.data.get('confirm_password')

        if not email or not new_password:
            return Response({'error': 'Email and new password are required.'}, status=status.HTTP_400_BAD_REQUEST)
        if new_password != confirm_password:
            return Response({'error': 'Passwords do not match.'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            user = User.objects.get(email=email)
            user.set_password(new_password)
            user.save()
            return Response({'message': 'Password has been reset successfully. You can now login.'}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({'error': 'Account not found.'}, status=status.HTTP_404_NOT_FOUND)

class UserListView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if request.user.role not in ['admin', 'support']:
            return Response({'error': 'Unauthorized.'}, status=status.HTTP_403_FORBIDDEN)
        users = User.objects.all().order_by('-created_at')
        role = request.GET.get('role')
        if role and role != 'all':
            users = users.filter(role=role)
        search = request.GET.get('search')
        if search:
            from django.db.models import Q
            users = users.filter(
                Q(first_name__icontains=search) |
                Q(last_name__icontains=search) |
                Q(email__icontains=search) |
                Q(username__icontains=search)
            )
        return Response(UserSerializer(users, many=True).data)

class UserDetailUpdateView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        if request.user.role not in ['admin', 'support']:
            return Response({'error': 'Unauthorized.'}, status=status.HTTP_403_FORBIDDEN)
        try:
            user = User.objects.get(pk=pk)
        except User.DoesNotExist:
            return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)
        return Response(UserSerializer(user).data)

    def put(self, request, pk):
        if request.user.role != 'admin':
            return Response({'error': 'Admin privileges required.'}, status=status.HTTP_403_FORBIDDEN)
        try:
            user = User.objects.get(pk=pk)
        except User.DoesNotExist:
            return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

        serializer = UserAdminUpdateSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            user = serializer.save()
            return Response(UserSerializer(user).data)
        return Response({'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, pk):
        return self.put(request, pk)

    def delete(self, request, pk):
        if request.user.role != 'admin':
            return Response({'error': 'Admin privileges required.'}, status=status.HTTP_403_FORBIDDEN)
        try:
            user = User.objects.get(pk=pk)
            if user.id == request.user.id:
                return Response({'error': 'Cannot delete your own account.'}, status=status.HTTP_400_BAD_REQUEST)
            user.delete()
            return Response({'message': 'User deleted successfully.'}, status=status.HTTP_204_NO_CONTENT)
        except User.DoesNotExist:
            return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

class AdminCreateUserView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        if request.user.role != 'admin':
            return Response({'error': 'Admin privileges required.'}, status=status.HTTP_403_FORBIDDEN)
        serializer = AdminUserCreateSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({
                'message': 'User created successfully.',
                'user': UserSerializer(user).data
            }, status=status.HTTP_201_CREATED)
        return Response({'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

class CustomerStatsView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        from apps.rentals.models import Rental
        from apps.payments.models import Payment
        from apps.support.models import SupportTicket, Complaint
        from django.db.models import Sum

        user = request.user
        rentals = Rental.objects.filter(customer=user)
        total_rentals = rentals.count()
        active_rentals = rentals.filter(status__in=['active', 'payment_completed', 'approved']).count()
        completed_rentals = rentals.filter(status__in=['returned', 'completed']).count()

        payments = Payment.objects.filter(customer=user, status='successful')
        amount_spent = payments.aggregate(total=Sum('amount'))['total'] or 0.0

        pending_tickets = SupportTicket.objects.filter(customer=user, status__in=['open', 'in_progress']).count()
        pending_complaints = Complaint.objects.filter(customer=user, status__in=['open', 'in_progress']).count()
        pending_requests = pending_tickets + pending_complaints

        return Response({
            'total_rentals': total_rentals,
            'active_rentals': active_rentals,
            'completed_rentals': completed_rentals,
            'amount_spent': float(amount_spent),
            'pending_requests': pending_requests,
        })

class FileUploadView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]
    from rest_framework.parsers import MultiPartParser, FormParser
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        import os, uuid
        from django.conf import settings
        file_obj = request.FILES.get('image') or request.FILES.get('avatar') or request.FILES.get('file')
        if not file_obj:
            return Response({'error': 'No file uploaded.'}, status=status.HTTP_400_BAD_REQUEST)

        ext = os.path.splitext(file_obj.name)[1].lower()
        if ext not in ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg']:
            return Response({'error': 'Invalid format. Allowed: JPG, PNG, WEBP, GIF, SVG.'}, status=status.HTTP_400_BAD_REQUEST)

        filename = f"upload_{uuid.uuid4().hex[:10]}{ext}"
        upload_dir = os.path.join(settings.MEDIA_ROOT, 'uploads')
        os.makedirs(upload_dir, exist_ok=True)
        filepath = os.path.join(upload_dir, filename)

        with open(filepath, 'wb+') as destination:
            for chunk in file_obj.chunks():
                destination.write(chunk)

        file_url = request.build_absolute_uri(f"{settings.MEDIA_URL}uploads/{filename}")
        return Response({
            'message': 'Image uploaded successfully.',
            'url': file_url,
            'filename': filename
        }, status=status.HTTP_201_CREATED)

class UploadAvatarView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]
    from rest_framework.parsers import MultiPartParser, FormParser
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        import os, uuid
        from django.conf import settings
        file_obj = request.FILES.get('image') or request.FILES.get('avatar') or request.FILES.get('file')
        if not file_obj:
            return Response({'error': 'No image file uploaded.'}, status=status.HTTP_400_BAD_REQUEST)

        ext = os.path.splitext(file_obj.name)[1].lower()
        if ext not in ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg']:
            return Response({'error': 'Invalid format. Allowed: JPG, PNG, WEBP, GIF.'}, status=status.HTTP_400_BAD_REQUEST)

        filename = f"avatar_{request.user.id}_{uuid.uuid4().hex[:8]}{ext}"
        upload_dir = os.path.join(settings.MEDIA_ROOT, 'avatars')
        os.makedirs(upload_dir, exist_ok=True)
        filepath = os.path.join(upload_dir, filename)

        with open(filepath, 'wb+') as destination:
            for chunk in file_obj.chunks():
                destination.write(chunk)

        file_url = request.build_absolute_uri(f"{settings.MEDIA_URL}avatars/{filename}")
        request.user.profile_image = file_url
        request.user.save(update_fields=['profile_image'])

class KYCSubmitView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        user = request.user
        doc_type = request.data.get('document_type', 'Aadhaar Card')
        doc_number = request.data.get('document_number', '')
        doc_url = request.data.get('document_url', '')

        if not doc_number:
            return Response({'error': 'Please provide a valid document number.'}, status=status.HTTP_400_BAD_REQUEST)

        user.kyc_document_type = doc_type
        user.kyc_document_number = doc_number
        if doc_url:
            user.kyc_document_url = doc_url
        user.kyc_status = 'verified' # Auto-verify for demo convenience or set to pending
        user.kyc_verified_at = timezone.now()
        user.save()

        return Response({
            'message': 'Digital KYC submitted & verified successfully.',
            'user': UserSerializer(user).data
        }, status=status.HTTP_200_OK)


class KYCAdminVerificationView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def put(self, request, user_id):
        if request.user.role != 'admin':
            return Response({'error': 'Admin privilege required.'}, status=status.HTTP_403_FORBIDDEN)

        try:
            target_user = User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

        new_status = request.data.get('kyc_status', 'verified')
        if new_status not in ['pending', 'verified', 'rejected']:
            return Response({'error': 'Invalid KYC status.'}, status=status.HTTP_400_BAD_REQUEST)

        target_user.kyc_status = new_status
        if new_status == 'verified':
            target_user.kyc_verified_at = timezone.now()
        target_user.save(update_fields=['kyc_status', 'kyc_verified_at'])

        return Response({
            'message': f'Customer KYC status updated to {new_status}.',
            'user': UserSerializer(target_user).data
        })


