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
    AgendaItemViewSet,
    EventViewSet,
)

router = DefaultRouter()
router.register(r"professors", ProfessorViewSet, basename="professor")
router.register(r"subjects", SubjectViewSet, basename="subject")
router.register(r"itineraries", ItineraryViewSet, basename="itinerary")
router.register(r"groups", GroupViewSet, basename="group")
router.register(r"schoolrecords", SchoolRecordViewSet, basename="schoolrecord")
router.register(r"books", BookViewSet, basename="book")
router.register(r"lessons", LessonViewSet, basename="lesson")
router.register(r"agenda", AgendaItemViewSet, basename="agendaitem")
router.register(r"events", EventViewSet, basename="event")

urlpatterns = router.urls
