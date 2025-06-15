from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from utils.day_util import get_day_name

from .models import Professor, Subject, Itinerary, Group, SchoolRecord, Book, Lesson
from .serializers import (
    ProfessorSerializer,
    SubjectSerializer,
    ItinerarySerializer,
    GroupSerializer,
    SchoolRecordSerializer,
    BookSerializer,
    LessonSerializer,
)
from .models import LESSONS_PER_DAY


class ProfessorViewSet(viewsets.ModelViewSet):
    queryset = Professor.objects.all().order_by("full_name")
    serializer_class = ProfessorSerializer
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
    search_fields = [
        "full_name",
        "short_name",
        "created_at",
    ]


class ItineraryViewSet(viewsets.ModelViewSet):
    queryset = Itinerary.objects.all().order_by("full_name")
    serializer_class = ItinerarySerializer
    filter_backends = [filters.SearchFilter]
    search_fields = [
        "full_name",
        "short_name",
        "created_at",
    ]


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

    @action(detail=True, methods=["get"], url_path="get-lessons")
    def get_lessons(self, request, pk=None):
        group = self.get_object()
        raw_data = Lesson.objects.filter(group=group)
        formated_data = []
        for day in range(7):
            lessons = []
            for time in range(LESSONS_PER_DAY):
                lesson = raw_data.filter(day=day, time=time).first()
                if lesson:
                    lessons.append(LessonSerializer(lesson).data)
                else:
                    lessons.append(None)
            formated_data.append(
                {
                    "day": get_day_name(day),
                    "lessons": lessons,
                }
            )
        return Response(formated_data)


class SchoolRecordViewSet(viewsets.ModelViewSet):
    queryset = SchoolRecord.objects.all().order_by("-created_at")
    serializer_class = SchoolRecordSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = [
        "student__full_name",
        "student__registration_number",
        "descrition",
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
