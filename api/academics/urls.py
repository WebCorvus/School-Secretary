from rest_framework import routers

from .views import (
    SubjectViewSet,
    ItineraryViewSet,
    GroupViewSet,
    LessonViewSet,
    WeeklyLessonPlanViewSet,
    GradeViewSet,
    PresenceViewSet,
    EnrollmentViewSet,
)

router = routers.DefaultRouter()
router.register(r"subjects", SubjectViewSet, basename="subjects")
router.register(r"itineraries", ItineraryViewSet, basename="itineraries")
router.register(r"groups", GroupViewSet, basename="groups")
router.register(r"lessons", LessonViewSet, basename="lessons")
router.register(r"weekly-plans", WeeklyLessonPlanViewSet, basename="weekly-plans")
router.register(r"grades", GradeViewSet, basename="grades")
router.register(r"presences", PresenceViewSet, basename="presences")
router.register(r"enrollments", EnrollmentViewSet, basename="enrollments")

urlpatterns = router.urls
