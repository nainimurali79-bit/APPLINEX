from django.urls import path
from .views import AiRecommendationsView, AiDemandForecastView

urlpatterns = [
    path('recommendations/', AiRecommendationsView.as_view(), name='ai_recommendations'),
    path('demand-forecast/', AiDemandForecastView.as_view(), name='ai_demand_forecast'),
]
