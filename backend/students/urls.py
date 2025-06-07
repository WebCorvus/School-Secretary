from rest_framework import routers

from .views import StudentDataViewSet, GradeViewSet

router = routers.DefaultRouter()
router.register(r"data", StudentDataViewSet)
router.register(r"grade", GradeViewSet)

urlpatterns = router.urls
