from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .views import UserViewSet

router = DefaultRouter()
router.register(r"", UserViewSet)

urlpatterns = [
    path("", include(router.urls)),
    path(
        "token/",
        TokenObtainPairView.as_view(permission_classes=[AllowAny]),
        name="token_obtain_pair",
    ),
    path(
        "token/refresh/",
        TokenRefreshView.as_view(permission_classes=[AllowAny]),
        name="token_refresh",
    ),
]
