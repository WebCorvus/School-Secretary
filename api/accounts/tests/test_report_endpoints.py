from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from accounts.models import Student, Guardian
from academics.models import Subject, Group, Grade, Presence
from students.models import Warning, Suspension
from datetime import date

User = get_user_model()


class StudentReportEndpointsTest(TestCase):
    """Test the PDF report generation endpoints for students"""

    def setUp(self):
        # Create users
        self.staff_user = User.objects.create_user(
            email="staff@test.com",
            password="testpass123",
            role=User.Role.STAFF,
            is_staff=True
        )
        
        self.student_user = User.objects.create_user(
            email="student@test.com",
            password="testpass123",
            role=User.Role.STUDENT
        )
        
        self.guardian_user = User.objects.create_user(
            email="guardian@test.com",
            password="testpass123",
            role=User.Role.GUARDIAN
        )
        
        self.other_student_user = User.objects.create_user(
            email="other@test.com",
            password="testpass123",
            role=User.Role.STUDENT
        )
        
        # Create group
        self.group = Group.objects.create(
            full_name="Test Group",
            short_name="TG"
        )
        
        # Create students
        self.student = Student.objects.create(
            user=self.student_user,
            full_name="Test Student",
            registration_number="STU001",
            phone_number="(11) 98765-4321",
            cpf="12345678901",
            birthday=date(2005, 1, 1),
            address="12345678",
            group=self.group
        )
        
        self.other_student = Student.objects.create(
            user=self.other_student_user,
            full_name="Other Student",
            registration_number="STU002",
            phone_number="(11) 98765-4322",
            cpf="12345678902",
            birthday=date(2005, 1, 2),
            address="12345679",
            group=self.group
        )
        
        # Create guardian linked to student
        self.guardian = Guardian.objects.create(
            user=self.guardian_user,
            full_name="Test Guardian",
            student=self.student,
            phone_number="(11) 98765-4320",
            cpf="12345678900",
            birthday=date(1980, 1, 1),
            address="12345677"
        )
        
        # Create subjects and grades
        self.subject = Subject.objects.create(
            full_name="Mathematics",
            short_name="Math"
        )
        
        Grade.objects.create(
            student=self.student,
            subject=self.subject,
            year=2024,
            bimester="1B",
            value=8.5
        )
        
        # Create attendance records
        Presence.objects.create(
            student=self.student,
            date=date(2024, 3, 1),
            presence=True
        )
        Presence.objects.create(
            student=self.student,
            date=date(2024, 3, 2),
            presence=False
        )
        
        # Create disciplinary records
        Warning.objects.create(
            student=self.student,
            reason="Test warning",
            date=date(2024, 3, 1),
            issued_by=self.staff_user
        )
        
        self.client = APIClient()

    def test_bulletin_as_staff(self):
        """Staff should be able to download any student's bulletin"""
        self.client.force_authenticate(user=self.staff_user)
        response = self.client.get(f'/accounts/students/{self.student.id}/bulletin/')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response['Content-Type'], 'application/pdf')
        self.assertIn('boletim_STU001.pdf', response['Content-Disposition'])

    def test_bulletin_as_student_self(self):
        """Student should be able to download their own bulletin"""
        self.client.force_authenticate(user=self.student_user)
        response = self.client.get(f'/accounts/students/{self.student.id}/bulletin/')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response['Content-Type'], 'application/pdf')

    def test_bulletin_as_guardian(self):
        """Guardian should be able to download their student's bulletin"""
        self.client.force_authenticate(user=self.guardian_user)
        response = self.client.get(f'/accounts/students/{self.student.id}/bulletin/')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response['Content-Type'], 'application/pdf')

    def test_bulletin_unauthorized_student(self):
        """Student should NOT be able to download another student's bulletin"""
        self.client.force_authenticate(user=self.other_student_user)
        response = self.client.get(f'/accounts/students/{self.student.id}/bulletin/')
        
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertIn('permissão', response.data['detail'].lower())

    def test_bulletin_unauthenticated(self):
        """Unauthenticated users should not access bulletins"""
        response = self.client.get(f'/accounts/students/{self.student.id}/bulletin/')
        
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_academic_history_as_staff(self):
        """Staff should be able to download any student's academic history"""
        self.client.force_authenticate(user=self.staff_user)
        response = self.client.get(f'/accounts/students/{self.student.id}/academic_history/')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response['Content-Type'], 'application/pdf')
        self.assertIn('historico_STU001.pdf', response['Content-Disposition'])

    def test_academic_history_as_student_self(self):
        """Student should be able to download their own academic history"""
        self.client.force_authenticate(user=self.student_user)
        response = self.client.get(f'/accounts/students/{self.student.id}/academic_history/')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response['Content-Type'], 'application/pdf')

    def test_academic_history_as_guardian(self):
        """Guardian should be able to download their student's academic history"""
        self.client.force_authenticate(user=self.guardian_user)
        response = self.client.get(f'/accounts/students/{self.student.id}/academic_history/')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response['Content-Type'], 'application/pdf')

    def test_academic_history_unauthorized_student(self):
        """Student should NOT be able to download another student's academic history"""
        self.client.force_authenticate(user=self.other_student_user)
        response = self.client.get(f'/accounts/students/{self.student.id}/academic_history/')
        
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertIn('permissão', response.data['detail'].lower())
