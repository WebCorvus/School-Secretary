from django.test import TestCase
from django.utils import timezone
from resources.models import Resource, ResourceLoan
from accounts.models import Student
from django.contrib.auth import get_user_model


class ResourceModelsTest(TestCase):

    def setUp(self):
        self.User = get_user_model()
        self.user_student = self.User.objects.create_user(
            email="student_user@example.com", password="password123"
        )
        self.student = Student.objects.create(
            user=self.user_student,
            full_name="Student Test",
            registration_number="STU001",
            phone_number="(86) 98870-1869",
            cpf="64382979099",
            birthday="2005-01-01",
            address="71880729",
        )
        self.resource = Resource.objects.create(
            name="Test Resource",
            resource_type="COMPUTER",
            description="A test computer.",
        )

    def test_resource_creation(self):
        self.assertEqual(self.resource.name, "Test Resource")
        self.assertEqual(self.resource.resource_type, "COMPUTER")
        self.assertEqual(self.resource.status, "AVAILABLE")
        self.assertIsNotNone(self.resource.created_at)

    def test_resource_loan_creation(self):
        loan = ResourceLoan.objects.create(
            resource=self.resource,
            student=self.student,
            loan_date=timezone.now().date(),
            return_date=timezone.now().date() + timezone.timedelta(days=7),
        )
        self.assertEqual(loan.resource, self.resource)
        self.assertEqual(loan.student, self.student)
        self.assertIsNotNone(loan.created_at)
