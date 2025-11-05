from rest_framework import routers

from .views import (
    StudentViewSet,
    GuardianViewSet,
    ProfessorViewSet,
    ContractViewSet,
)

router = routers.DefaultRouter()
router.register(r"students", StudentViewSet, basename="students")
router.register(r"guardians", GuardianViewSet, basename="guardians")
router.register(r"professors", ProfessorViewSet, basename="professors")
router.register(r"contracts", ContractViewSet, basename="contracts")

urlpatterns = router.urls
