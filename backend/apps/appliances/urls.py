from django.urls import path
from .views import CategoryListView, ApplianceListCreateView, ApplianceDetailView, ApplianceFilterMetaView

urlpatterns = [
    path('categories/', CategoryListView.as_view(), name='categories_list'),
    path('appliances/', ApplianceListCreateView.as_view(), name='appliances_list_create'),
    path('appliances/filter-meta/', ApplianceFilterMetaView.as_view(), name='appliance_filter_meta'),
    path('appliances/<int:pk>/', ApplianceDetailView.as_view(), name='appliance_detail'),
]
