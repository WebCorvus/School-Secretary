from rest_framework import routers

from .views import (
    WarningViewSet,
    SuspensionViewSet,
    TuitionViewSet,
)

router = routers.DefaultRouter()
router.register(r"warnings", WarningViewSet, basename="warnings")
router.register(r"suspensions", SuspensionViewSet, basename="suspensions")
router.register(r"tuitions", TuitionViewSet, basename="tuitions")

urlpatterns = router.urls
