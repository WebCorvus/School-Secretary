from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Student, Grades
from .serializers import StudentDataSerializer


class StudentDataViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentDataSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = [
        "full_name",
        "registration_number",
        "cpf",
    ]

    @action(detail=True, methods=["get"], url_path="download-grades")
    def download_grades_pdf(self, request, pk=None):
        student = self.get_object()
        return student.generate_grades_pdf()

    @action(detail=True, methods=["get"], url_path="download-presence")
    def download_presence_pdf(self, request, pk=None):
        student = self.get_object()
        return student.generate_presence_pdf()
