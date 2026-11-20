"""
URL configuration for Pathway project.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import TokenRefreshView

from django.http import JsonResponse

def api_root(request):
    return JsonResponse({
        "name": "Pathway API",
        "version": "1.0",
        "status": "running",
        "endpoints": "/api/"
    })

urlpatterns = [
    # Root
    path('', api_root, name='api-root'),
    # Admin
    path('admin/', admin.site.urls),
    
    # JWT Token Refresh
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # App URLs
    path('api/users/', include('users.urls')),
    path('api/tasks/', include('tasks.urls')),
    path('api/community/', include('community.urls')),
    path('api/ai/', include('ai_companion.urls')),
    path('api/resources/', include('resources.urls')),
    path('api/safety/', include('safety.urls')),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
