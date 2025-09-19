from rest_framework import viewsets, filters
from rest_framework.decorators import action
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
    permission_classes = [IsStaff]
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

    def create(self, request, *args, **kwargs):
        from school.test_create_methods import generic_create
        return generic_create(self, request, "StudentForm")

    def update(self, request, *args, **kwargs):
        response = super().update(request, *args, **kwargs)
        if response.status_code == 400:
            from utils.inconsistency_logger import log_inconsistency
            user = request.user if request.user.is_authenticated else None
            log_inconsistency(
                user=user,
                form_name="StudentForm",
                error_type="ValidationError",
                error_message=str(response.data),
                data_sent=request.data
            )
        return response

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
    queryset = Grade.objects.all().order_by(
        "student__full_name", "subject__full_name", "year", "bimester"
    )
    serializer_class = GradeSerializer
    permission_classes = [IsProfessor]
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

    def create(self, request, *args, **kwargs):
        from school.test_create_methods import generic_create
        return generic_create(self, request, "GradeForm")

    def update(self, request, *args, **kwargs):
        response = super().update(request, *args, **kwargs)
        if response.status_code == 400:
            from utils.inconsistency_logger import log_inconsistency
            user = request.user if request.user.is_authenticated else None
            log_inconsistency(
                user=user,
                form_name="GradeForm",
                error_type="ValidationError",
                error_message=str(response.data),
                data_sent=request.data
            )
        return response


class GuardianViewSet(viewsets.ModelViewSet):
    queryset = Guardian.objects.all().order_by("full_name")
    serializer_class = GuardianSerializer
    permission_classes = [IsStaff]
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

    def create(self, request, *args, **kwargs):
        from school.test_create_methods import generic_create
        return generic_create(self, request, "GuardianForm")

    def update(self, request, *args, **kwargs):
        response = super().update(request, *args, **kwargs)
        if response.status_code == 400:
            from utils.inconsistency_logger import log_inconsistency
            user = request.user if request.user.is_authenticated else None
            log_inconsistency(
                user=user,
                form_name="GuardianForm",
                error_type="ValidationError",
                error_message=str(response.data),
                data_sent=request.data
            )
        return response


class ContractViewSet(viewsets.ModelViewSet):
    queryset = Contract.objects.all().order_by("-created_at")
    serializer_class = ContractSerializer
    permission_classes = [IsStaff]
    filter_backends = [filters.SearchFilter]
    search_fields = [
        "guardian__full_name",
        "guardian__cpf",
        "student__full_name",
        "student__registration_number",
        "created_at",
    ]

    def create(self, request, *args, **kwargs):
        from school.test_create_methods import generic_create
        return generic_create(self, request, "ContractForm")

    def update(self, request, *args, **kwargs):
        response = super().update(request, *args, **kwargs)
        if response.status_code == 400:
            from utils.inconsistency_logger import log_inconsistency
            user = request.user if request.user.is_authenticated else None
            log_inconsistency(
                user=user,
                form_name="ContractForm",
                error_type="ValidationError",
                error_message=str(response.data),
                data_sent=request.data
            )
        return response

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
    queryset = Presence.objects.all().order_by("student__full_name", "date")
    serializer_class = PresenceSerializer
    permission_classes = [IsProfessor]
    filter_backends = [filters.SearchFilter]
    search_fields = [
        "student__full_name",
        "student__registration_number",
        "date",
        "presence",
        "created_at",
    ]

    def create(self, request, *args, **kwargs):
        from school.test_create_methods import generic_create
        return generic_create(self, request, "PresenceForm")

    def update(self, request, *args, **kwargs):
        response = super().update(request, *args, **kwargs)
        if response.status_code == 400:
            from utils.inconsistency_logger import log_inconsistency
            user = request.user if request.user.is_authenticated else None
            log_inconsistency(
                user=user,
                form_name="PresenceForm",
                error_type="ValidationError",
                error_message=str(response.data),
                data_sent=request.data
            )
        return response