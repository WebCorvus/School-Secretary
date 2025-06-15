from rest_framework import viewsets, filters
from rest_framework.decorators import action

from .models import Student, Grade, Guardian, Contract, Presence
from .serializers import (
    StudentSerializer,
    GradeSerializer,
    GuardianSerializer,
    ContractSerializer,
    PresenceSerializer,
)
from utils.pdfgen import pdfgen
from utils.subject_utils import get_subject_names


class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = [
        "full_name",
        "registration_number",
        "phone_number",
        "email",
        "cpf",
    ]

    @action(detail=True, methods=["get"], url_path="download-grades")
    def download_grades_pdf(self, request, pk=None):
        student = self.get_object()
        subjects = get_subject_names()
        data = {}
        for subject in subjects:
            data[subject] = Grade.objects.filter(
                student=student,
                subject__full_name=subject,
            )
        return pdfgen(
            "grades.html",
            {
                "student": student,
                "data": data,
            },
            f"Grades_{student.full_name}.pdf",
        )

    @action(detail=True, methods=["get"], url_path="download-presence")
    def download_presence_pdf(self, request, pk=None):
        student = self.get_object()
        presence_records = Presence.objects.filter(student=student)
        return pdfgen(
            "presence.html",
            {
                "student": student,
                "data": presence_records,
            },
            f"Presence_{student.full_name}.pdf",
        )


class GradeViewSet(viewsets.ModelViewSet):
    queryset = Grade.objects.all()
    serializer_class = GradeSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = [
        "student__full_name",
        "subject__name",
        "year",
        "bimester",
        "value",
    ]


class GuardianViewSet(viewsets.ModelViewSet):
    queryset = Guardian.objects.all()
    serializer_class = GuardianSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = [
        "full_name",
        "student__full_name",
        "phone_number",
        "cpf",
        "email",
    ]


class ContractViewSet(viewsets.ModelViewSet):
    queryset = Contract.objects.all()
    serializer_class = ContractSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = [
        "guardian__full_name",
        "student__full_name",
    ]

    @action(detail=True, methods=["get"], url_path="download-contract")
    def download_contract_pdf(self, request, pk=None):
        contract = self.get_object()
        return pdfgen(
            "contract.html",
            {
                "data": contract,
            },
            f"Contract_{contract.id}_{contract.guardian.full_name}-{contract.student.full_name}.pdf",
        )


class PresenceViewSet(viewsets.ModelViewSet):
    queryset = Presence.objects.all()
    serializer_class = PresenceSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = [
        "student__full_name",
        "date",
        "presence",
    ]
