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
    queryset = Professor.objects.all()
    serializer_class = ProfessorSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = [
        "full_name",
        "phone_number",
        "email",
        "cpf",
        "subject__full_name",
    ]


class SubjectViewSet(viewsets.ModelViewSet):
    queryset = Subject.objects.all()
    serializer_class = SubjectSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = [
        "name",
    ]


class ItineraryViewSet(viewsets.ModelViewSet):
    queryset = Itinerary.objects.all()
    serializer_class = ItinerarySerializer
    filter_backends = [filters.SearchFilter]
    search_fields = [
        "name",
    ]


class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = [
        "full_name",
        "short_name",
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
    queryset = SchoolRecord.objects.all()
    serializer_class = SchoolRecordSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = [
        "student__full_name",
        "descrition",
    ]


class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = [
        "name",
        "tenant__full_name",
        "author",
        "summary",
    ]


class LessonViewSet(viewsets.ModelViewSet):
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = [
        "professor__full_name",
        "subject__full_name",
        "time",
        "day",
    ]
