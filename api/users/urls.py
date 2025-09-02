from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import UserViewSet, CustomTokenObtainPairView, CustomTokenRefreshView

router = DefaultRouter()
router.register(r"", UserViewSet, basename="users")

urlpatterns = [
    path(
        "token/",
        CustomTokenObtainPairView.as_view(),
        name="token_obtain_pair",
    ),
    path(
        "token/refresh/",
        CustomTokenRefreshView.as_view(),
        name="token_refresh",
    ),
    path("", include(router.urls)),
]
