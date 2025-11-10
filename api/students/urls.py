from rest_framework import routers

from .views import (
    StudentViewSet,
    GuardianViewSet,
    ProfessorViewSet,
    ContractViewSet,
    WarningViewSet,
    SuspensionViewSet,
    TuitionViewSet,
    WarningViewSet,
    EnrollmentViewSet,
)

router = routers.DefaultRouter()
router.register(r"students", StudentViewSet, basename="students")
router.register(r"guardians", GuardianViewSet, basename="guardians")
router.register(r"professors", ProfessorViewSet, basename="professors")
router.register(r"contracts", ContractViewSet, basename="contracts")
router.register(r"warnings", WarningViewSet, basename="warnings")
router.register(r"suspensions", SuspensionViewSet, basename="suspensions")
router.register(r"tuitions", TuitionViewSet, basename="tuitions")
router.register(r"enrollments", EnrollmentViewSet, basename="enrollments")

urlpatterns = router.urls
