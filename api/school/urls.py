from rest_framework.routers import DefaultRouter

from .views import (
    AgendaItemViewSet,
    BookViewSet,
    EventRegistrationViewSet,
    EventViewSet,
    GroupViewSet,
    ItineraryViewSet,
    LessonViewSet,
    NotificationViewSet,
    ProfessorViewSet,
    RoomReservationViewSet,
    RoomViewSet,
    SchoolRecordViewSet,
    SubjectViewSet,
    WeeklyLessonPlanViewSet,
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
router.register(r"weekly-plans", WeeklyLessonPlanViewSet, basename="weeklylessonplan")
router.register(r"events", EventViewSet, basename="event")
router.register(
    r"event-registrations", EventRegistrationViewSet, basename="event-registration"
)
router.register(r"rooms", RoomViewSet, basename="room")
router.register(
    r"room-reservations", RoomReservationViewSet, basename="room-reservation"
)
router.register(r"notifications", NotificationViewSet, basename="notification")

urlpatterns = router.urls
