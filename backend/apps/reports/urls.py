from django.urls import path
from .views import (
    AdminDashboardAnalyticsView,
    RentalReportsView,
    StockReportsView,
    RevenueReportsView
)

urlpatterns = [
    path('analytics/', AdminDashboardAnalyticsView.as_view(), name='dashboard_analytics'),
    path('rentals/', RentalReportsView.as_view(), name='reports_rentals'),
    path('stock/', StockReportsView.as_view(), name='reports_stock'),
    path('revenue/', RevenueReportsView.as_view(), name='reports_revenue'),
]
