from rest_framework import routers

from .views import (
    StudentViewSet,
    GradeViewSet,
    GuardianViewSet,
    ContractViewSet,
    PresenceViewSet,
)

router = routers.DefaultRouter()
router.register(r"", StudentViewSet)
router.register(r"grades", GradeViewSet)
router.register(r"guardians", GuardianViewSet)
router.register(r"contracts", ContractViewSet)
router.register(r"presences", PresenceViewSet)

urlpatterns = router.urls
