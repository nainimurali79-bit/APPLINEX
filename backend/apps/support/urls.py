from django.urls import path
from .views import (
    SupportTicketListCreateView,
    SupportTicketDetailUpdateView,
    ComplaintListCreateView,
    ComplaintDetailUpdateView,
    SupportDashboardOverviewView
)

urlpatterns = [
    path('tickets/', SupportTicketListCreateView.as_view(), name='support_tickets'),
    path('tickets/<int:pk>/', SupportTicketDetailUpdateView.as_view(), name='support_ticket_detail'),
    path('complaints/', ComplaintListCreateView.as_view(), name='complaints_list_create'),
    path('complaints/<int:pk>/', ComplaintDetailUpdateView.as_view(), name='complaint_detail'),
    path('dashboard/', SupportDashboardOverviewView.as_view(), name='support_dashboard'),
]
