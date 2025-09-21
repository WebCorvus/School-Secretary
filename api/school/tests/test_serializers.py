from rest_framework.test import APITestCase
from rest_framework import serializers
from school.serializers import (
    SubjectCompactSerializer,
    ItineraryCompactSerializer,
    GroupCompactSerializer,
    ProfessorCompactSerializer,
    SubjectSerializer,
    ItinerarySerializer,
    GroupSerializer,
    ProfessorSerializer,
    SchoolRecordSerializer,
    BookSerializer,
    LessonSerializer,
    AgendaItemSerializer,
    EventSerializer,
)
from school.models import (
    Subject,
    Itinerary,
    Group,
    Professor,
    SchoolRecord,
    Book,
    Lesson,
    AgendaItem,
    Event,
)
from students.models import (
    Student,
)  # Needed for SchoolRecordSerializer and BookSerializer
from django.contrib.auth import get_user_model
from django.utils import timezone
import datetime


class SchoolSerializersTest(APITestCase):

    def setUp(self):
        self.User = get_user_model()
        self.user = self.User.objects.create_user(
            email="test@example.com", password="password123"
        )
        self.student_user = self.User.objects.create_user(
            email="student@example.com", password="password123"
        )
        self.student = Student.objects.create(
            user=self.student_user,
            full_name="Test Student",
            registration_number="STU007",
            phone_number="(86) 98870-1869",
            cpf="83200170093",
            birthday="2000-01-01",
            address="71880729",
        )
        self.subject = Subject.objects.create(
            short_name="MATH", full_name="Mathematics"
        )
        self.itinerary = Itinerary.objects.create(
            short_name="FUND", full_name="Fundamental"
        )
        self.group = Group.objects.create(
            short_name="A1", full_name="Group A1", itinerary=self.itinerary
        )
        self.professor_user = self.User.objects.create_user(
            email="prof@example.com", password="password123"
        )
        self.professor = Professor.objects.create(
            user=self.professor_user,
            full_name="Test Professor",
            phone_number="(86) 98870-1869",
            cpf="05401403097",
            birthday="1980-05-10",
            address="71880729",
            subject=self.subject,
        )
        self.lesson = Lesson.objects.create(
            group=self.group,
            professor=self.professor,
            subject=self.subject,
            time=1,
            day=1,
        )
        self.agenda_item = AgendaItem.objects.create(
            title="Homework",
            subject=self.subject,
            description="Read chapter 5",
            date=timezone.now().date(),
            time=timezone.now().time(),
        )
        self.event = Event.objects.create(
            title="School Play",
            description="Annual school play performance",
            location="School Auditorium",
            start_date=datetime.date(2024, 10, 26),
            end_date=datetime.date(2024, 10, 26),
            start_time=datetime.time(18, 0),
            end_time=datetime.time(20, 0),
        )
        self.school_record = SchoolRecord.objects.create(
            student=self.student, description="Good behavior"
        )
        self.book = Book.objects.create(
            name="The Great Book",
            tenant=self.student,
            author="Author Name",
            summary="A summary of the book.",
        )

    def test_subject_compact_serializer(self):
        serializer = SubjectCompactSerializer(self.subject)
        self.assertEqual(serializer.data["short_name"], "MATH")
        self.assertEqual(serializer.data["full_name"], "Mathematics")

    def test_itinerary_compact_serializer(self):
        serializer = ItineraryCompactSerializer(self.itinerary)
        self.assertEqual(serializer.data["short_name"], "FUND")
        self.assertEqual(serializer.data["full_name"], "Fundamental")

    def test_group_compact_serializer(self):
        serializer = GroupCompactSerializer(self.group)
        self.assertEqual(serializer.data["short_name"], "A1")
        self.assertEqual(serializer.data["full_name"], "Group A1")

    def test_professor_compact_serializer(self):
        serializer = ProfessorCompactSerializer(self.professor)
        self.assertEqual(serializer.data["full_name"], "Test Professor")
        self.assertEqual(serializer.data["cpf"], "05401403097")

    def test_subject_serializer(self):
        data = {"short_name": "CHEM", "full_name": "Chemistry"}
        serializer = SubjectSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        subject = serializer.save()
        self.assertEqual(subject.short_name, "CHEM")

    def test_itinerary_serializer(self):
        data = {"short_name": "ADV", "full_name": "Advanced"}
        serializer = ItinerarySerializer(data=data)
        self.assertTrue(serializer.is_valid())
        itinerary = serializer.save()
        self.assertEqual(itinerary.short_name, "ADV")

    def test_group_serializer(self):
        data = {
            "short_name": "B2",
            "full_name": "Group B2",
            "itinerary": self.itinerary.id,
        }
        serializer = GroupSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        group = serializer.save()
        self.assertEqual(group.short_name, "B2")
        self.assertEqual(group.itinerary, self.itinerary)
        self.assertIn("itinerary_details", serializer.data)

    def test_professor_serializer(self):
        data = {
            "user": self.user.id,  # user is excluded, but needed for creation
            "full_name": "New Professor",
            "phone_number": "(86) 98870-1869",
            "cpf": "41516086058",
            "birthday": "1990-01-01",
            "address": "71880729",
            "subject": self.subject.id,
        }
        serializer = ProfessorSerializer(data=data)
        self.assertTrue(serializer.is_valid(), serializer.errors)
        professor = serializer.save(
            user=self.user
        )  # user is excluded, so pass it explicitly
        self.assertEqual(professor.full_name, "New Professor")
        self.assertIn("subject_details", serializer.data)

    def test_school_record_serializer(self):
        data = {"student": self.student.id, "description": "New record"}
        serializer = SchoolRecordSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        school_record = serializer.save()
        self.assertEqual(school_record.description, "New record")
        self.assertIn("student_details", serializer.data)

    def test_book_serializer(self):
        data = {
            "name": "New Book",
            "tenant": self.student.id,
            "author": "New Author",
            "summary": "New summary.",
        }
        serializer = BookSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        book = serializer.save()
        self.assertEqual(book.name, "New Book")
        self.assertIn("tenant_details", serializer.data)

    def test_lesson_serializer(self):
        data = {
            "group": self.group.id,
            "professor": self.professor.id,
            "subject": self.subject.id,
            "time": 2,
            "day": 2,
        }
        serializer = LessonSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        lesson = serializer.save()
        self.assertEqual(lesson.time, 2)
        self.assertIn("group_details", serializer.data)
        self.assertIn("professor_details", serializer.data)
        self.assertIn("subject_details", serializer.data)

    def test_agenda_item_serializer(self):
        data = {
            "title": "New Agenda Item",
            "subject": self.subject.id,
            "description": "New description",
            "date": "2024-11-01",
            "time": "10:00:00",
        }
        serializer = AgendaItemSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        agenda_item = serializer.save()
        self.assertEqual(agenda_item.title, "New Agenda Item")
        self.assertIn("subject_details", serializer.data)

    def test_event_serializer(self):
        data = {
            "title": "New Event",
            "description": "New event description",
            "location": "New Location",
            "start_date": "2024-12-01",
            "end_date": "2024-12-01",
            "start_time": "09:00:00",
            "end_time": "17:00:00",
        }
        serializer = EventSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        event = serializer.save()
        self.assertEqual(event.title, "New Event")
