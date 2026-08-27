from django.urls import path
from .views import ReviewListCreateView, ReviewModerationListView, ReviewModerateActionView

urlpatterns = [
    path('', ReviewListCreateView.as_view(), name='reviews_list_create'),
    path('moderation/', ReviewModerationListView.as_view(), name='reviews_moderation_list'),
    path('<int:pk>/moderate/', ReviewModerateActionView.as_view(), name='review_moderate_action'),
]
