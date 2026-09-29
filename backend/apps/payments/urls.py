from django.urls import path
from .views import (
    PaymentListCreateView,
    PaymentReceiptView,
    PaymentRefundView,
    PaymentDetailView
)

urlpatterns = [
    path('', PaymentListCreateView.as_view(), name='payment_list_create'),
    path('<int:pk>/', PaymentDetailView.as_view(), name='payment_detail'),
    path('<int:pk>/receipt/', PaymentReceiptView.as_view(), name='payment_receipt'),
    path('<int:pk>/refund/', PaymentRefundView.as_view(), name='payment_refund'),
]
