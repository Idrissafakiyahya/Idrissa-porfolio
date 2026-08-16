"""
URL configuration for portfolio_site project.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse

# Health check endpoint (no database required)
def health_check(request):
    try:
        return JsonResponse({"status": "ok", "message": "Backend is running"})
    except Exception as e:
        return JsonResponse({"status": "error", "error": str(e)}, status=500)


def diag(request):
    try:
        # diagnostic endpoint: returns non-sensitive runtime settings useful for debugging
        return JsonResponse({
            "debug": bool(settings.DEBUG),
            "allowed_hosts": settings.ALLOWED_HOSTS,
            "secret_key_set": bool(settings.SECRET_KEY and settings.SECRET_KEY != 'django-insecure-dev-key-change-in-production'),
        })
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


def whoami(request):
    try:
        # return host-related headers to help diagnose issues
        return JsonResponse({
            "http_host": request.META.get('HTTP_HOST', 'NOT SET'),
            "x_forwarded_host": request.META.get('HTTP_X_FORWARDED_HOST', 'NOT SET'),
            "x_forwarded_proto": request.META.get('HTTP_X_FORWARDED_PROTO', 'NOT SET'),
        })
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

urlpatterns = [
    path('', health_check, name='health-check'),  # Root endpoint
    path('health/', health_check, name='health-check-alt'),
    path('admin/', admin.site.urls),
    path('diag/', diag, name='diagnostics'),
    path('whoami/', whoami, name='whoami'),
    path('api/', include('portfolio.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
