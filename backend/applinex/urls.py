from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

from apps.authentication.views import FileUploadView
from .views import api_root

urlpatterns = [
    path('', api_root, name='api_root'),
    path('admin/', admin.site.urls),
    path('api/auth/', include('apps.authentication.urls')),
    path('api/upload/', FileUploadView.as_view(), name='global_upload'),
    path('api/', include('apps.appliances.urls')),
    path('api/rentals/', include('apps.rentals.urls')),
    path('api/payments/', include('apps.payments.urls')),
    path('api/reviews/', include('apps.reviews.urls')),
    path('api/maintenance/', include('apps.maintenance.urls')),
    path('api/support/', include('apps.support.urls')),
    path('api/reports/', include('apps.reports.urls')),
    path('api/ai/', include('apps.ai_engine.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
