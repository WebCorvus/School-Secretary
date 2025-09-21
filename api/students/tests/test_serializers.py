from rest_framework.test import APITestCase
from rest_framework import serializers
from students.serializers import (
    StudentCompactSerializer,
    GuardianCompactSerializer,
    GradeCompactSerializer,
    PresenceCompactSerializer,
    GuardianSerializer,
    ContractSerializer,
    GradeSerializer,
    PresenceSerializer,
    StudentSerializer,
)
from students.models import Student, Grade, Guardian, Contract, Presence
from school.models import Group, Subject
from django.contrib.auth import get_user_model
from django.utils import timezone
import datetime


class StudentSerializersTest(APITestCase):

    def setUp(self):
        self.User = get_user_model()
        self.user_student = self.User.objects.create_user(
            email="student_user_s@example.com", password="password123"
        )
        self.user_guardian = self.User.objects.create_user(
            email="guardian_user_s@example.com", password="password123"
        )
        self.group = Group.objects.create(full_name="Test Group S", short_name="TGS")
        self.subject = Subject.objects.create(
            full_name="Test Subject S", short_name="TSS"
        )

        self.student = Student.objects.create(
            user=self.user_student,
            full_name="Student Test S",
            registration_number="STU001",
            phone_number="(86) 98870-1869",
            cpf="07788387061",
            birthday="2005-01-01",
            address="71880729",
            group=self.group,
        )
        self.guardian = Guardian.objects.create(
            user=self.user_guardian,
            full_name="Guardian Test S",
            student=self.student,
            phone_number="(86) 98870-1869",
            cpf="11368158056",
            birthday="1980-01-01",
            address="71880729",
        )
        self.contract = Contract.objects.create(
            guardian=self.guardian, student=self.student
        )
        self.grade = Grade.objects.create(
            student=self.student,
            subject=self.subject,
            year=2024,
            bimester="1B",
            value=8.5,
        )
        self.presence = Presence.objects.create(
            student=self.student, date=timezone.now().date(), presence=True
        )

    def test_student_compact_serializer(self):
        serializer = StudentCompactSerializer(self.student)
        self.assertEqual(serializer.data["full_name"], "Student Test S")
        self.assertEqual(serializer.data["cpf"], "07788387061")

    def test_guardian_compact_serializer(self):
        serializer = GuardianCompactSerializer(self.guardian)
        self.assertEqual(serializer.data["full_name"], "Guardian Test S")
        self.assertEqual(serializer.data["cpf"], "11368158056")

    def test_grade_compact_serializer(self):
        serializer = GradeCompactSerializer(self.grade)
        self.assertEqual(serializer.data["value"], 8.5)
        self.assertEqual(serializer.data["bimester"], "1B")

    def test_presence_compact_serializer(self):
        serializer = PresenceCompactSerializer(self.presence)
        self.assertEqual(serializer.data["presence"], True)
        self.assertEqual(serializer.data["date"], str(timezone.now().date()))

    def test_guardian_serializer(self):
        new_guardian_user = self.User.objects.create_user(
            email="new_guardian_test@example.com", password="password123"
        )
        data = {
            "user": new_guardian_user.id,
            "full_name": "New Guardian",
            "student": self.student.id,
            "phone_number": "(86) 98870-1869",
            "cpf": "30087100002",
            "birthday": "1995-05-05",
            "address": "71880729",
        }
        serializer = GuardianSerializer(data=data)
        self.assertTrue(serializer.is_valid(), serializer.errors)
        guardian = serializer.save(user=new_guardian_user)
        self.assertEqual(guardian.full_name, "New Guardian")
        self.assertIn("student_details", serializer.data)

    def test_contract_serializer(self):
        data = {"guardian": self.guardian.id, "student": self.student.id}
        serializer = ContractSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        contract = serializer.save()
        self.assertEqual(contract.guardian, self.guardian)
        self.assertIn("guardian_details", serializer.data)
        self.assertIn("student_details", serializer.data)

    def test_grade_serializer(self):
        data = {
            "student": self.student.id,
            "subject": self.subject.id,
            "year": 2023,
            "bimester": "2B",
            "value": 7.0,
        }
        serializer = GradeSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        grade = serializer.save()
        self.assertEqual(grade.value, 7.0)
        self.assertIn("student_details", serializer.data)
        self.assertIn("subject_details", serializer.data)

    def test_presence_serializer(self):
        data = {"student": self.student.id, "date": "2024-01-15", "presence": False}
        serializer = PresenceSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        presence = serializer.save()
        self.assertEqual(presence.presence, False)
        self.assertIn("student_details", serializer.data)

    def test_student_serializer(self):
        new_student_user = self.User.objects.create_user(
            email="new_student_test@example.com", password="password123"
        )
        data = {
            "user": new_student_user.id,
            "full_name": "New Student",
            "registration_number": "STU015",
            "phone_number": "(86) 98870-1869",
            "cpf": "57343332040",
            "birthday": "2010-10-10",
            "address": "71880729",
            "group": self.group.id,
        }
        serializer = StudentSerializer(data=data)
        self.assertTrue(serializer.is_valid(), serializer.errors)
        student = serializer.save(user=new_student_user)
        self.assertEqual(student.full_name, "New Student")
        self.assertIn("group_details", serializer.data)
        self.assertIn("grades_details", serializer.data)
        self.assertIn("presence_details", serializer.data)
        self.assertIn("guardians_details", serializer.data)
