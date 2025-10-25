from rest_framework import routers
from .views import ResourceViewSet, ResourceLoanViewSet

router = routers.DefaultRouter()
router.register(r"", ResourceViewSet, basename="resource")
router.register(r"loans", ResourceLoanViewSet, basename="resource-loan")

urlpatterns = router.urls
