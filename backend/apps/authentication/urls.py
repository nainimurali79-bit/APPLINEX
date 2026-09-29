from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    RegisterView,
    LoginView,
    ProfileView,
    ForgotPasswordView,
    ResetPasswordView,
    UserListView,
    UserDetailUpdateView,
    AdminCreateUserView,
    CustomerStatsView,
    FileUploadView,
    UploadAvatarView,
    KYCSubmitView,
    KYCAdminVerificationView
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('upload-avatar/', UploadAvatarView.as_view(), name='upload_avatar'),
    path('upload/', FileUploadView.as_view(), name='file_upload'),
    path('forgot-password/', ForgotPasswordView.as_view(), name='forgot_password'),
    path('reset-password/', ResetPasswordView.as_view(), name='reset_password'),
    path('customer-stats/', CustomerStatsView.as_view(), name='customer_stats'),
    path('admin/create-user/', AdminCreateUserView.as_view(), name='admin_create_user'),
    path('users/', UserListView.as_view(), name='users_list'),
    path('users/<int:pk>/', UserDetailUpdateView.as_view(), name='user_detail_update'),
    path('kyc/submit/', KYCSubmitView.as_view(), name='kyc_submit'),
    path('admin/users/<int:user_id>/kyc/', KYCAdminVerificationView.as_view(), name='kyc_admin_verify'),
]
