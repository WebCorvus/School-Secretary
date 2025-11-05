from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from users.permissions import IsStaff, IsProfessor
from .models import Student, Guardian, Professor, Contract
from .serializers import (
    StudentSerializer,
    GuardianSerializer,
    ProfessorSerializer,
    ContractSerializer,
)
from utils.pdfgen import pdfgen
from utils.reports import generate_student_academic_report
from academics.models import Grade, Subject
from students.models import Warning, Suspension
from django.utils import timezone


class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all().order_by("full_name")
    serializer_class = StudentSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = [
        "full_name",
        "registration_number",
        "phone_number",
        "cpf",
        "birthday",
        "address",
        "group__full_name",
    ]

    @action(detail=True, methods=['get'], permission_classes=[IsAuthenticated])
    def bulletin(self, request, pk=None):
        """
        Generate and download bulletin (Boletim) PDF for a student.
        Contains: personal data, grades, and attendance.
        """
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
        from academics.models import Presence
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
    
    @action(detail=True, methods=['get'], permission_classes=[IsAuthenticated])
    def academic_history(self, request, pk=None):
        """
        Generate and download academic history (Histórico Escolar) PDF for a student.
        Contains: personal data, warnings, and suspensions.
        """
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


class GuardianViewSet(viewsets.ModelViewSet):
    queryset = Guardian.objects.all().order_by("full_name")
    serializer_class = GuardianSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = [
        "full_name",
        "phone_number",
        "cpf",
        "student__full_name",
    ]


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


class ContractViewSet(viewsets.ModelViewSet):
    queryset = Contract.objects.all()
    serializer_class = ContractSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = [
        "guardian__full_name",
        "student__full_name",
    ]
