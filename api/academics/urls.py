from django.urls import path, include
from rest_framework.routers import DefaultRouter

# For future use when we need academic-specific endpoints
router = DefaultRouter()

urlpatterns = [
    path("", include(router.urls)),
]
