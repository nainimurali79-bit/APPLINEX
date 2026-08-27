from rest_framework import status, views, permissions
from rest_framework.response import Response
from django.contrib.auth import authenticate, get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import UserSerializer, RegisterSerializer, LoginSerializer, ProfileUpdateSerializer

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
        return Response(UserSerializer(users, many=True).data)
