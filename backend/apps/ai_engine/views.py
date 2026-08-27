from rest_framework import status, views, permissions
from rest_framework.response import Response
from .services import generate_ai_recommendations, generate_ai_demand_forecast
from apps.appliances.serializers import ApplianceSerializer

class AiRecommendationsView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        user = request.user if request.user.is_authenticated else None
        recommendations = generate_ai_recommendations(user=user, limit=6)
        
        response_data = []
        for rec in recommendations:
            app_data = ApplianceSerializer(rec['appliance']).data
            response_data.append({
                'appliance': app_data,
                'match_percentage': rec['match_percentage'],
                'reason': rec['reason'],
            })
            
        return Response(response_data)

class AiDemandForecastView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if request.user.role not in ['admin', 'support']:
            return Response({'error': 'Unauthorized.'}, status=status.HTTP_403_FORBIDDEN)

        category = request.GET.get('category')
        forecast_result = generate_ai_demand_forecast(category_slug=category)
        return Response(forecast_result)
