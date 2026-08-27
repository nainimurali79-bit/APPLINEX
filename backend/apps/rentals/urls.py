from django.urls import path
from .views import (
    RentalCalculateView,
    RentalListCreateView,
    RentalDetailView,
    RentalStatusUpdateView,
    RentalReturnRequestView
)

urlpatterns = [
    path('calculate/', RentalCalculateView.as_view(), name='rental_calculate'),
    path('', RentalListCreateView.as_view(), name='rental_list_create'),
    path('<str:pk_or_code>/', RentalDetailView.as_view(), name='rental_detail'),
    path('<int:pk>/status/', RentalStatusUpdateView.as_view(), name='rental_status_update'),
    path('<int:pk>/request-return/', RentalReturnRequestView.as_view(), name='rental_return_request'),
]
