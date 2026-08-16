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
    return JsonResponse({"status": "ok", "message": "Backend is running"})


def diag(request):
    # diagnostic endpoint: returns non-sensitive runtime settings useful for debugging
    return JsonResponse({
        "debug": bool(settings.DEBUG),
        "allowed_hosts": settings.ALLOWED_HOSTS,
    })


def whoami(request):
    # return host-related headers to help diagnose Bad Request (400)
    return JsonResponse({
        "request_get_host": request.get_host(),
        "http_host": request.META.get('HTTP_HOST'),
        "x_forwarded_host": request.META.get('HTTP_X_FORWARDED_HOST'),
        "x_forwarded_for": request.META.get('HTTP_X_FORWARDED_FOR'),
        "x_forwarded_proto": request.META.get('HTTP_X_FORWARDED_PROTO'),
    })

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
