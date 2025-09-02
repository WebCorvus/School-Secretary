from rest_framework import routers

from .views import (
    StudentViewSet,
    GradeViewSet,
    GuardianViewSet,
    ContractViewSet,
    PresenceViewSet,
)

router = routers.DefaultRouter()
router.register(r"", StudentViewSet, basename="students")
router.register(r"grades", GradeViewSet, basename="grades")
router.register(r"guardians", GuardianViewSet, basename="guardians")
router.register(r"contracts", ContractViewSet, basename="contracts")
router.register(r"presences", PresenceViewSet, basename="presences")

urlpatterns = router.urls
