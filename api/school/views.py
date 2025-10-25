from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from users.permissions import IsStaff, IsProfessor
from django.utils import timezone
from utils.date import get_day_name
from utils.reports import (
    generate_group_performance_report,
    generate_efficiency_analysis,
    calculate_approval_rate,
    calculate_dropout_rate,
)

from .models import (
    Professor,
    Subject,
    Itinerary,
    Group,
    SchoolRecord,
    Book,
    Lesson,
    AgendaItem,
    WeeklyLessonPlan,
    Event,
    EventRegistration,
    Room,
    RoomReservation,
    Notification,
)
from .serializers import (
    ProfessorSerializer,
    SubjectSerializer,
    ItinerarySerializer,
    GroupSerializer,
    SchoolRecordSerializer,
    BookSerializer,
    LessonSerializer,
    AgendaItemSerializer,
    WeeklyLessonPlanSerializer,
    EventSerializer,
    EventRegistrationSerializer,
    RoomSerializer,
    RoomReservationSerializer,
    NotificationSerializer,
)
from .models import LESSONS_PER_DAY


class ProfessorViewSet(viewsets.ModelViewSet):
    queryset = Professor.objects.all().order_by("full_name")
    serializer_class = ProfessorSerializer
    permission_classes = [IsStaff]
    filter_backends = [filters.SearchFilter]
    search_fields = [
        "full_name",
        "phone_number",
        "email",
        "cpf",
        "birthday",
        "address",
        "subject__full_name",
        "subject__short_name",
    ]


class SubjectViewSet(viewsets.ModelViewSet):
    queryset = Subject.objects.all().order_by("full_name")
    serializer_class = SubjectSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ["full_name", "short_name", "created_at"]

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            self.permission_classes = [IsAuthenticated]
        else:
            self.permission_classes = [IsStaff]
        return super().get_permissions()


class ItineraryViewSet(viewsets.ModelViewSet):
    queryset = Itinerary.objects.all().order_by("full_name")
    serializer_class = ItinerarySerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ["full_name", "short_name", "created_at"]

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            self.permission_classes = [IsAuthenticated]
        else:
            self.permission_classes = [IsStaff]
        return super().get_permissions()


class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all().order_by("full_name")
    serializer_class = GroupSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = [
        "full_name",
        "short_name",
        "itinerary__full_name",
        "itinerary__short_name",
        "created_at",
    ]

    def get_permissions(self):
        if self.action in ["list", "retrieve", "get_lessons", "performance_report", "efficiency_analysis"]:
            self.permission_classes = [IsAuthenticated]
        else:
            self.permission_classes = [IsStaff]
        return super().get_permissions()

    @action(detail=True, methods=["get"], url_path="get-lessons")
    def get_lessons(self, request, pk=None):
        group = self.get_object()
        group_lessons = Lesson.objects.filter(group=group)
        week_lessons = []

        for day in range(7):
            day_lessons = []
            for time in range(LESSONS_PER_DAY):
                lesson = group_lessons.filter(day=day, time=time + 1).first()
                day_lessons.append(LessonSerializer(lesson).data if lesson else None)
            week_lessons.append({"day": get_day_name(day), "lessons": day_lessons})

        return Response(week_lessons)

    @action(detail=True, methods=["get"], url_path="performance-report")
    def performance_report(self, request, pk=None):
        """Generate performance report for group"""
        group = self.get_object()
        report = generate_group_performance_report(group)
        return Response(report)

    @action(detail=True, methods=["get"], url_path="efficiency-analysis")
    def efficiency_analysis(self, request, pk=None):
        """Generate efficiency analysis (approval and dropout rates) for group"""
        group = self.get_object()
        year = request.query_params.get('year', None)
        if year:
            year = int(year)
        analysis = generate_efficiency_analysis(group, year)
        return Response(analysis)


class SchoolRecordViewSet(viewsets.ModelViewSet):
    queryset = SchoolRecord.objects.all().order_by("-created_at")
    serializer_class = SchoolRecordSerializer
    permission_classes = [IsStaff]
    filter_backends = [filters.SearchFilter]
    search_fields = [
        "student__full_name",
        "student__registration_number",
        "description",
        "created_at",
    ]


class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all().order_by("name")
    serializer_class = BookSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = [
        "name",
        "tenant__full_name",
        "tenant__registration_number",
        "author",
        "summary",
        "created_at",
    ]

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            self.permission_classes = [IsAuthenticated]
        else:
            self.permission_classes = [IsStaff]
        return super().get_permissions()


class LessonViewSet(viewsets.ModelViewSet):
    queryset = Lesson.objects.all().order_by("day", "time")
    serializer_class = LessonSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = [
        "group__full_name",
        "group__short_name",
        "professor__full_name",
        "professor__email",
        "subject__full_name",
        "subject__short_name",
        "time",
        "day",
        "created_at",
    ]

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            self.permission_classes = [IsAuthenticated]
        else:
            self.permission_classes = [IsStaff]
        return super().get_permissions()


class AgendaItemViewSet(viewsets.ModelViewSet):
    queryset = AgendaItem.objects.all().order_by("-date", "-time")
    serializer_class = AgendaItemSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ["title", "description", "date"]

    def get_permissions(self):
        if self.action in ["list", "retrieve", "get_pendents"]:
            self.permission_classes = [IsAuthenticated]
        else:
            self.permission_classes = [IsProfessor]
        return super().get_permissions()

    @action(detail=False, methods=["get"], url_path="pendents")
    def get_pendents(self, request):
        pendents = (
            self.get_queryset()
            .filter(date__gte=timezone.now().date())
            .order_by("date", "time")
        )
        serializer = self.get_serializer(pendents, many=True)
        return Response(serializer.data)


class WeeklyLessonPlanViewSet(viewsets.ModelViewSet):
    queryset = WeeklyLessonPlan.objects.all().order_by("-week_start_date")
    serializer_class = WeeklyLessonPlanSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = [
        "professor__full_name",
        "lesson__subject__full_name",
        "lesson__group__full_name",
        "week_start_date",
        "planning_content",
    ]

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            self.permission_classes = [IsAuthenticated]
        else:
            self.permission_classes = [IsProfessor]
        return super().get_permissions()

    def get_queryset(self):
        """Filter plans for the authenticated user if they are a professor"""
        queryset = super().get_queryset()
        user = self.request.user
        
        # If user is a professor, show only their plans (unless staff/superuser)
        if hasattr(user, 'professor_profile') and not (user.is_staff or user.is_superuser):
            queryset = queryset.filter(professor=user.professor_profile)
        
        return queryset


class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all().order_by("-start_date", "-start_time")
    serializer_class = EventSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ["title", "description", "location", "start_date"]

    def get_permissions(self):
        if self.action in ["list", "retrieve", "get_pendents", "register"]:
            self.permission_classes = [IsAuthenticated]
        else:
            self.permission_classes = [IsStaff]
        return super().get_permissions()

    @action(detail=False, methods=["get"], url_path="pendents")
    def get_pendents(self, request):
        pendents = (
            self.get_queryset()
            .filter(start_date__gte=timezone.now().date())
            .order_by("start_date", "start_time")
        )
        serializer = self.get_serializer(pendents, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=["post"], url_path="register")
    def register(self, request, pk=None):
        """Register student in event"""
        event = self.get_object()
        student = request.user.profile

        if not student or not hasattr(student, "id"):
            return Response(
                {"error": "Only students can register for events"},
                status=status.HTTP_403_FORBIDDEN,
            )

        if not event.allow_registration:
            return Response(
                {"error": "This event does not allow registration"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if (
            event.max_participants
            and event.registrations.count() >= event.max_participants
        ):
            return Response(
                {"error": "Event is full"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        registration, created = EventRegistration.objects.get_or_create(
            event=event, student=student
        )

        if created:
            return Response(
                {"message": "Successfully registered for event"},
                status=status.HTTP_201_CREATED,
            )
        else:
            return Response(
                {"message": "Already registered for this event"},
                status=status.HTTP_200_OK,
            )


class EventRegistrationViewSet(viewsets.ModelViewSet):
    queryset = EventRegistration.objects.all().order_by("-registration_date")
    serializer_class = EventRegistrationSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = [
        "event__title",
        "student__full_name",
        "student__registration_number",
    ]

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            self.permission_classes = [IsAuthenticated]
        else:
            self.permission_classes = [IsStaff]
        return super().get_permissions()


class RoomViewSet(viewsets.ModelViewSet):
    queryset = Room.objects.all().order_by("name")
    serializer_class = RoomSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ["name", "room_type", "capacity"]

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            self.permission_classes = [IsAuthenticated]
        else:
            self.permission_classes = [IsStaff]
        return super().get_permissions()


class RoomReservationViewSet(viewsets.ModelViewSet):
    queryset = RoomReservation.objects.all().order_by("-date", "-start_time")
    serializer_class = RoomReservationSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = [
        "room__name",
        "reserved_by__full_name",
        "purpose",
        "date",
    ]

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            self.permission_classes = [IsAuthenticated]
        else:
            self.permission_classes = [IsProfessor]
        return super().get_permissions()


class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all().order_by("-created_at")
    serializer_class = NotificationSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ["title", "message", "notification_type"]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Users can only see their own notifications"""
        if self.request.user.is_staff or self.request.user.is_superuser:
            return Notification.objects.all()
        return Notification.objects.filter(recipient=self.request.user)

    @action(detail=True, methods=["post"], url_path="mark-read")
    def mark_read(self, request, pk=None):
        """Mark notification as read"""
        notification = self.get_object()
        notification.read = True
        notification.save()
        return Response({"message": "Notification marked as read"})

    @action(detail=False, methods=["post"], url_path="mark-all-read")
    def mark_all_read(self, request):
        """Mark all user notifications as read"""
        Notification.objects.filter(recipient=request.user, read=False).update(
            read=True
        )
        return Response({"message": "All notifications marked as read"})
