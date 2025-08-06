from rest_framework import routers

from .views import (
    StudentViewSet,
    GradeViewSet,
    GuardianViewSet,
    ContractViewSet,
    PresenceViewSet,
)

router = routers.DefaultRouter()
router.register(r"data", StudentViewSet)
router.register(r"grade", GradeViewSet)
router.register(r"guardian", GuardianViewSet)
router.register(r"contract", ContractViewSet)
router.register(r"presence", PresenceViewSet)

urlpatterns = router.urls
