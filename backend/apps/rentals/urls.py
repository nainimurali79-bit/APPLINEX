from django.urls import path
from .views import (
    RentalCalculateView,
    RentalListCreateView,
    RentalDetailView,
    RentalStatusUpdateView,
    RentalReturnRequestView,
    RentalRelocationView,
    RentalDepositSettlementView,
    RentalInvoicePayView
)

urlpatterns = [
    path('calculate/', RentalCalculateView.as_view(), name='rental_calculate'),
    path('', RentalListCreateView.as_view(), name='rental_list_create'),
    path('<int:pk>/status/', RentalStatusUpdateView.as_view(), name='rental_status_update'),
    path('<int:pk>/request-return/', RentalReturnRequestView.as_view(), name='rental_return_request'),
    path('<int:pk>/relocate/', RentalRelocationView.as_view(), name='rental_relocate'),
    path('<int:pk>/settle-deposit/', RentalDepositSettlementView.as_view(), name='rental_settle_deposit'),
    path('invoices/<int:invoice_id>/pay/', RentalInvoicePayView.as_view(), name='rental_invoice_pay'),
    path('<str:pk_or_code>/', RentalDetailView.as_view(), name='rental_detail'),
]
