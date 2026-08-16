"""
URL configuration for portfolio_site project.
"""
from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse, JsonResponse

# Minimal diagnostic endpoints with zero dependencies
def health_check(request):
    return HttpResponse("OK", content_type="text/plain")

def diag_simple(request):
    return HttpResponse("App is running", content_type="text/plain")

urlpatterns = [
    path('', health_check),  # Root
    path('health/', health_check),
    path('diag/', diag_simple),
    path('admin/', admin.site.urls),
    path('api/', include('portfolio.urls')),
]
