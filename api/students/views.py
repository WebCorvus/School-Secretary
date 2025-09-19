from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from users.permissions import IsStaff, IsProfessor
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
    queryset = Student.objects.all().order_by("full_name")
    serializer_class = StudentSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = [
        "full_name",
        "registration_number",
        "phone_number",
        "email",
        "cpf",
        "birthday",
        "address",
        "group__full_name",
        "group__short_name",
        "group__itinerary__full_name",
        "group__itinerary__short_name",
        "created_at",
    ]

    def get_permissions(self):
        if self.action in [
            "list",
            "retrieve",
            "download_grades_pdf",
            "download_presence_pdf",
        ]:
            self.permission_classes = [IsAuthenticated]
        else:
            self.permission_classes = [IsStaff]
        return super().get_permissions()

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
            {"student": student, "data": data},
            f"Grades_{student.full_name}.pdf",
        )

    @action(detail=True, methods=["get"], url_path="download-presence")
    def download_presence_pdf(self, request, pk=None):
        student = self.get_object()
        presence_records = Presence.objects.filter(student=student)
        return pdfgen(
            "presence.html",
            {"student": student, "data": presence_records},
            f"Presence_{student.full_name}.pdf",
        )


class GradeViewSet(viewsets.ModelViewSet):
    queryset = Grade.objects.all().order_by(
        "student__full_name", "subject__full_name", "year", "bimester"
    )
    serializer_class = GradeSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = [
        "student__full_name",
        "student__registration_number",
        "subject__full_name",
        "subject__short_name",
        "year",
        "bimester",
        "value",
        "created_at",
    ]

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            self.permission_classes = [IsAuthenticated]
        else:
            self.permission_classes = [IsProfessor]
        return super().get_permissions()


class GuardianViewSet(viewsets.ModelViewSet):
    queryset = Guardian.objects.all().order_by("full_name")
    serializer_class = GuardianSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = [
        "full_name",
        "student__full_name",
        "student__registration_number",
        "phone_number",
        "cpf",
        "email",
        "birthday",
        "address",
        "created_at",
    ]

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            self.permission_classes = [IsAuthenticated]
        else:
            self.permission_classes = [IsStaff]
        return super().get_permissions()


class ContractViewSet(viewsets.ModelViewSet):
    queryset = Contract.objects.all().order_by("-created_at")
    serializer_class = ContractSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = [
        "guardian__full_name",
        "guardian__cpf",
        "student__full_name",
        "student__registration_number",
        "created_at",
    ]

    def get_permissions(self):
        if self.action in ["list", "retrieve", "download_contract_pdf"]:
            self.permission_classes = [IsAuthenticated]
        else:
            self.permission_classes = [IsStaff]
        return super().get_permissions()

    @action(detail=True, methods=["get"], url_path="download-contract")
    def download_contract_pdf(self, request, pk=None):
        contract = self.get_object()
        return pdfgen(
            "contract.html",
            {"data": contract},
            f"Contract_{contract.id}_{contract.guardian.full_name}-{contract.student.full_name}.pdf",
        )


class PresenceViewSet(viewsets.ModelViewSet):
    queryset = Presence.objects.all().order_by("student__full_name", "date")
    serializer_class = PresenceSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = [
        "student__full_name",
        "student__registration_number",
        "date",
        "presence",
        "created_at",
    ]

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            self.permission_classes = [IsAuthenticated]
        else:
            self.permission_classes = [IsProfessor]
        return super().get_permissions()
