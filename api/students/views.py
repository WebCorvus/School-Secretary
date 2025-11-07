from rest_framework import filters, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from users.permissions import IsProfessor, IsStaff
from utils.pdfgen import pdfgen
from utils.reports import (
    generate_efficiency_analysis,
    generate_financial_report,
    generate_student_academic_report,
    identify_students_needing_notification,
)
from utils.subject_utils import get_subject_names

from .models import (
    Student,
    Guardian,
    Professor,
    Contract,
    Warning,
    Suspension,
    Tuition,
    Warning,
)
from .serializers import (
    StudentSerializer,
    GuardianSerializer,
    ProfessorSerializer,
    ContractSerializer,
    WarningSerializer,
    SuspensionSerializer,
    TuitionSerializer,
)
from academics.models import Grade, Presence, Enrollment
from academics.serializers import GradeSerializer, PresenceSerializer, EnrollmentSerializer
from utils.pdfgen import pdfgen
from utils.subject_utils import get_subject_names
from utils.reports import (
    generate_student_academic_report,
    generate_financial_report,
    identify_students_needing_notification,
    generate_efficiency_analysis,
)


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
            "academic_report",
            "download_academic_report",
            "bulletin",
            "academic_history",
            "students_needing_attention",
            "efficiency_analysis",
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

    @action(detail=True, methods=["get"], url_path="academic-report")
    def academic_report(self, request, pk=None):
        """Generate comprehensive academic report for student"""
        student = self.get_object()
        report = generate_student_academic_report(student)
        return Response(report)

    @action(detail=True, methods=["get"], url_path="download-academic-report")
    def download_academic_report(self, request, pk=None):
        """Download comprehensive academic report PDF"""
        from django.utils import timezone as tz

        student = self.get_object()
        report = generate_student_academic_report(student)

        context = {
            "student": student,
            "grades": report["grades"],
            "attendance": report["attendance"],
            "discipline": report["discipline"],
            "now": tz.now(),
        }

        return pdfgen(
            "academic_report.html",
            context,
            f"Relatorio_Academico_{student.full_name}.pdf",
        )

    @action(detail=True, methods=['get'], url_path="bulletin")
    def bulletin(self, request, pk=None):
        """
        Generate and download bulletin (Boletim) PDF for a student.
        Contains: personal data, grades, and attendance.
        """
        from academics.models import Subject, Grade, Presence
        from django.utils import timezone

        student = self.get_object()
        
        # Check permission: student themselves, their guardian, or staff
        user = request.user
        is_authorized = False
        
        if user.is_staff:
            is_authorized = True
        elif hasattr(user, 'student_profile') and user.student_profile and user.student_profile.id == student.id:
            is_authorized = True
        elif hasattr(user, 'guardian_profile') and user.guardian_profile:
            # Check if this guardian is responsible for this student
            if user.guardian_profile.student and user.guardian_profile.student.id == student.id:
                is_authorized = True
        
        if not is_authorized:
            return Response({"detail": "Você não tem permissão para acessar este boletim."}, status=403)
        
        # Collect grades data
        grades_by_subject = {}
        all_subjects = Subject.objects.all()
        
        for subject in all_subjects:
            grades = Grade.objects.filter(student=student, subject=subject).order_by('bimester')
            bimester_grades = {
                '1B': None,
                '2B': None,
                '3B': None,
                '4B': None
            }
            
            for grade in grades:
                bimester_grades[grade.bimester] = grade.value
            
            # Calculate average
            valid_grades = [g for g in bimester_grades.values() if g is not None]
            average = sum(valid_grades) / len(valid_grades) if valid_grades else None
            
            grades_by_subject[subject.full_name] = {
                'grades': bimester_grades,
                'average': round(average, 2) if average else None
            }
        
        # Collect attendance data
        total_days = Presence.objects.filter(student=student).count()
        absences = Presence.objects.filter(student=student, presence=False).count()
        presences = Presence.objects.filter(student=student, presence=True).count()
        absence_rate = (absences / total_days * 100) if total_days > 0 else 0
        
        context = {
            'student': student,
            'grades': grades_by_subject,
            'attendance': {
                'total_days': total_days,
                'presences': presences,
                'absences': absences,
                'absence_rate': round(absence_rate, 2),
                'needs_attention': absence_rate > 25
            },
            'now': timezone.now()
        }
        
        filename = f"boletim_{student.registration_number}.pdf"
        return pdfgen('bulletin_report.html', context, filename)

    @action(detail=True, methods=['get'], url_path="academic-history")
    def academic_history(self, request, pk=None):
        """
        Generate and download academic history (Histórico Escolar) PDF for a student.
        Contains: personal data, warnings, and suspensions.
        """
        from django.utils import timezone

        student = self.get_object()
        
        # Check permission: student themselves, their guardian, or staff
        user = request.user
        is_authorized = False
        
        if user.is_staff:
            is_authorized = True
        elif hasattr(user, 'student_profile') and user.student_profile and user.student_profile.id == student.id:
            is_authorized = True
        elif hasattr(user, 'guardian_profile') and user.guardian_profile:
            # Check if this guardian is responsible for this student
            if user.guardian_profile.student and user.guardian_profile.student.id == student.id:
                is_authorized = True
        
        if not is_authorized:
            return Response({"detail": "Você não tem permissão para acessar este histórico."}, status=403)
        
        # Use existing report generation function
        report_data = generate_student_academic_report(student)
        
        # Prepare context for template
        context = {
            'student': student,
            'grades': report_data['grades'],
            'attendance': report_data['attendance'],
            'discipline': report_data['discipline'],
            'now': timezone.now()
        }
        
        filename = f"historico_{student.registration_number}.pdf"
        return pdfgen('academic_report.html', context, filename)

    @action(detail=False, methods=["get"], url_path="students-needing-attention")
    def students_needing_attention(self, request):
        """Identify students needing notifications"""
        notifications = identify_students_needing_notification()
        return Response(notifications)

    @action(detail=False, methods=["get"], url_path="efficiency-analysis")
    def efficiency_analysis(self, request):
        """Generate efficiency analysis (approval and dropout rates) for all students"""
        year = request.query_params.get("year", None)
        if year:
            year = int(year)
        analysis = generate_efficiency_analysis(None, year)
        return Response(analysis)


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
        if self.action in ["list", "retrieve", "absence_report"]:
            self.permission_classes = [IsAuthenticated]
        else:
            self.permission_classes = [IsProfessor]
        return super().get_permissions()

    @action(detail=False, methods=["get"], url_path="absence-report")
    def absence_report(self, request):
        """Generate absence report and identify students with >25% absences"""
        students_with_absences = []

        for student in Student.objects.all():
            total_days = Presence.objects.filter(student=student).count()
            if total_days == 0:
                continue

            absences = Presence.objects.filter(student=student, presence=False).count()
            absence_rate = (absences / total_days) * 100

            students_with_absences.append(
                {
                    "student_id": student.id,
                    "student_name": student.full_name,
                    "total_days": total_days,
                    "absences": absences,
                    "absence_rate": round(absence_rate, 2),
                    "needs_notification": absence_rate > 25,
                }
            )

        return Response(students_with_absences)


class WarningViewSet(viewsets.ModelViewSet):
    queryset = Warning.objects.all().order_by("-date")
    serializer_class = WarningSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = [
        "student__full_name",
        "student__registration_number",
        "reason",
        "date",
    ]

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            self.permission_classes = [IsAuthenticated]
        else:
            self.permission_classes = [IsStaff]
        return super().get_permissions()


class SuspensionViewSet(viewsets.ModelViewSet):
    queryset = Suspension.objects.all().order_by("-start_date")
    serializer_class = SuspensionSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = [
        "student__full_name",
        "student__registration_number",
        "reason",
        "start_date",
        "end_date",
    ]

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            self.permission_classes = [IsAuthenticated]
        else:
            self.permission_classes = [IsStaff]
        return super().get_permissions()


class TuitionViewSet(viewsets.ModelViewSet):
    queryset = Tuition.objects.all().order_by("-due_date")
    serializer_class = TuitionSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = [
        "student__full_name",
        "student__registration_number",
        "status",
        "due_date",
        "reference_month",
    ]

    def get_permissions(self):
        if self.action in [
            "list",
            "retrieve",
            "payment_history",
            "financial_report",
            "download_financial_report",
        ]:
            self.permission_classes = [IsAuthenticated]
        else:
            self.permission_classes = [IsStaff]
        return super().get_permissions()

    @action(detail=False, methods=["get"], url_path="payment-history")
    def payment_history(self, request):
        """Get payment history for all students"""
        student_id = request.query_params.get("student_id")
        if student_id:
            tuitions = Tuition.objects.filter(student_id=student_id).order_by(
                "-reference_month"
            )
        else:
            tuitions = Tuition.objects.all().order_by("-reference_month")

        serializer = self.get_serializer(tuitions, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=["get"], url_path="financial-report")
    def financial_report(self, request):
        """Generate financial report"""
        student_id = request.query_params.get("student_id")
        student = Student.objects.get(id=student_id) if student_id else None
        report = generate_financial_report(student)
        return Response(report)

    @action(detail=False, methods=["get"], url_path="download-financial-report")
    def download_financial_report(self, request):
        """Download financial report PDF"""
        from django.utils import timezone as tz

        student_id = request.query_params.get("student_id")
        student = Student.objects.get(id=student_id) if student_id else None
        report = generate_financial_report(student)

        context = {
            "student": student,
            "summary": report["summary"],
            "payment_history": report["payment_history"],
            "now": tz.now(),
        }

        filename = (
            f"Relatorio_Financeiro_{student.full_name}.pdf"
            if student
            else "Relatorio_Financeiro_Geral.pdf"
        )

        return pdfgen(
            "financial_report.html",
            context,
            filename,
        )


class EnrollmentViewSet(viewsets.ModelViewSet):
    queryset = Enrollment.objects.all().order_by("-year", "-enrollment_date")
    serializer_class = EnrollmentSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = [
        "student__full_name",
        "student__registration_number",
        "group__full_name",
        "year",
        "status",
    ]

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            self.permission_classes = [IsAuthenticated]
        else:
            self.permission_classes = [IsStaff]
        return super().get_permissions()


class ProfessorViewSet(viewsets.ModelViewSet):
    queryset = Professor.objects.all().order_by("full_name")
    serializer_class = ProfessorSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = [
        "full_name",
        "cpf",
        "phone_number",
        "subject__full_name",
    ]
