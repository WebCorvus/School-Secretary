from rest_framework.test import APITestCase
from resources.serializers import ResourceSerializer, ResourceLoanSerializer
from resources.models import Resource, ResourceLoan
from students.models import Student
from django.contrib.auth import get_user_model
from django.utils import timezone


class ResourceSerializersTest(APITestCase):
    def setUp(self):
        self.User = get_user_model()
        self.user_student = self.User.objects.create_user(
            email="student_user_s@example.com", password="password123"
        )

        self.student = Student.objects.create(
            user=self.user_student,
            full_name="Student Test S",
            registration_number="STU001",
            phone_number="(86) 98870-1869",
            cpf="07788387061",
            birthday="2005-01-01",
            address="71880729",
        )

        self.resource = Resource.objects.create(
            name="Test Resource",
            resource_type="COMPUTER",
            description="A test computer.",
        )

    def test_resource_serializer(self):
        serializer = ResourceSerializer(self.resource)
        data = serializer.data
        self.assertEqual(data["name"], "Test Resource")
        self.assertEqual(data["resource_type"], "COMPUTER")

    def test_resource_loan_serializer(self):
        loan = ResourceLoan.objects.create(
            resource=self.resource,
            student=self.student,
            loan_date=timezone.now().date(),
            return_date=timezone.now().date() + timezone.timedelta(days=7),
        )
        serializer = ResourceLoanSerializer(loan)
        data = serializer.data
        self.assertEqual(data["resource"], self.resource.id)
        self.assertEqual(data["student"], self.student.id)
        self.assertIn("resource_details", data)
        self.assertIn("student_name", data)
