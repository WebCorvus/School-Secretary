from rest_framework import routers

from .views import (
    StudentViewSet,
    GradeViewSet,
    GuardianViewSet,
    ContractViewSet,
    PresenceViewSet,
    WarningViewSet,
    SuspensionViewSet,
    TuitionViewSet,
    EnrollmentViewSet,
)

router = routers.DefaultRouter()
router.register(r"", StudentViewSet, basename="students")
router.register(r"grades", GradeViewSet, basename="grades")
router.register(r"guardians", GuardianViewSet, basename="guardians")
router.register(r"contracts", ContractViewSet, basename="contracts")
router.register(r"presences", PresenceViewSet, basename="presences")
router.register(r"warnings", WarningViewSet, basename="warnings")
router.register(r"suspensions", SuspensionViewSet, basename="suspensions")
router.register(r"tuitions", TuitionViewSet, basename="tuitions")
router.register(r"enrollments", EnrollmentViewSet, basename="enrollments")

urlpatterns = router.urls
