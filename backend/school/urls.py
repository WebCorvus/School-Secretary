from django.urls import path, include
from .views import ProfessorViewSet

from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r"professor", ProfessorViewSet, basename="professor")

urlpatterns = router.urls
