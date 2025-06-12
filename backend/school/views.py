from rest_framework import viewsets, filters

from .models import Professor, Subject, Itinerary, Group, SchoolRecord, Book, Schedule
from .serializers import (
    ProfessorSerializer,
    SubjectSerializer,
    ItinerarySerializer,
    GroupSerializer,
    SchoolRecordSerializer,
    BookSerializer,
    ScheduleSerializer,
)


class ProfessorViewSet(viewsets.ModelViewSet):
    queryset = Professor.objects.all()
    serializer_class = ProfessorSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = [
        "full_name",
        "phone_number",
        "email",
        "cpf",
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
        "name",
    ]


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


class ScheduleViewSet(viewsets.ModelViewSet):
    queryset = Schedule.objects.all()
    serializer_class = ScheduleSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = [
        "professor__full_name",
        "descrition",
    ]
