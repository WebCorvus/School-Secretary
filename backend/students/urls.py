from django.urls import path, include
from rest_framework import routers

from .views import StudentDataViewSet

router = routers.DefaultRouter()
router.register(r"data", StudentDataViewSet)

urlpatterns = router.urls
