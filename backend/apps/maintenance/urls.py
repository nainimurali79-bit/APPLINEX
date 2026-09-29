from django.urls import path
from .views import (
    MaintenanceListCreateView,
    MaintenanceDetailUpdateView,
    ReturnsListView,
    ProcessReturnActionView
)

urlpatterns = [
    path('', MaintenanceListCreateView.as_view(), name='maintenance_list_create'),
    path('returns/', ReturnsListView.as_view(), name='returns_list'),
    path('returns/<int:pk>/process/', ProcessReturnActionView.as_view(), name='process_return'),
    path('<int:pk>/', MaintenanceDetailUpdateView.as_view(), name='maintenance_detail_update'),
]
