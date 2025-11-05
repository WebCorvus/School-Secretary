from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from users.permissions import IsStaff, IsProfessor
from .models import (
    Subject,
    Itinerary,
    Group,
    Lesson,
    WeeklyLessonPlan,
    Grade,
    Presence,
    Enrollment,
)
from .serializers import (
    SubjectSerializer,
    ItinerarySerializer,
    GroupSerializer,
    LessonSerializer,
    WeeklyLessonPlanSerializer,
    GradeSerializer,
    PresenceSerializer,
    EnrollmentSerializer,
)


class SubjectViewSet(viewsets.ModelViewSet):
    queryset = Subject.objects.all().order_by("full_name")
    serializer_class = SubjectSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ["full_name", "short_name"]


class ItineraryViewSet(viewsets.ModelViewSet):
    queryset = Itinerary.objects.all().order_by("full_name")
    serializer_class = ItinerarySerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ["full_name", "short_name"]


class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all().order_by("full_name")
    serializer_class = GroupSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ["full_name", "short_name"]


class LessonViewSet(viewsets.ModelViewSet):
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = [
        "professor__full_name",
        "subject__full_name",
        "group__full_name",
    ]


class WeeklyLessonPlanViewSet(viewsets.ModelViewSet):
    queryset = WeeklyLessonPlan.objects.all()
    serializer_class = WeeklyLessonPlanSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = [
        "professor__full_name",
        "lesson__subject__full_name",
        "planning_content",
    ]


class GradeViewSet(viewsets.ModelViewSet):
    queryset = Grade.objects.all()
    serializer_class = GradeSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = [
        "student__full_name",
        "subject__full_name",
    ]


class PresenceViewSet(viewsets.ModelViewSet):
    queryset = Presence.objects.all()
    serializer_class = PresenceSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ["student__full_name"]


class EnrollmentViewSet(viewsets.ModelViewSet):
    queryset = Enrollment.objects.all()
    serializer_class = EnrollmentSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = [
        "student__full_name",
        "group__full_name",
    ]
