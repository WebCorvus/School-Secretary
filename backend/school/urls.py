from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ProfessorViewSet,
    SubjectViewSet,
    ItineraryViewSet,
    GroupViewSet,
    SchoolRecordViewSet,
    BookViewSet,
    LessonViewSet,
)

router = DefaultRouter()
router.register(r"professor", ProfessorViewSet, basename="professor")
router.register(r"subject", SubjectViewSet, basename="subject")
router.register(r"itinerary", ItineraryViewSet, basename="itinerary")
router.register(r"group", GroupViewSet, basename="group")
router.register(r"schoolrecord", SchoolRecordViewSet, basename="schoolrecord")
router.register(r"book", BookViewSet, basename="book")
router.register(r"lesson", LessonViewSet, basename="lesson")

urlpatterns = router.urls
