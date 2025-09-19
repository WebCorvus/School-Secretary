
from django.test import TestCase
from .models import Subject, Itinerary, Group, Professor, SchoolRecord, Book, Lesson, AgendaItem, Event
from django.utils import timezone

class SubjectModelTest(TestCase):
	def test_create_subject(self):
		subject = Subject.objects.create(short_name="Math", full_name="Mathematics", created_at=timezone.now())
		self.assertEqual(subject.short_name, "Math")
		self.assertEqual(subject.full_name, "Mathematics")

class ItineraryModelTest(TestCase):
	def test_create_itinerary(self):
		itinerary = Itinerary.objects.create(short_name="Sci", full_name="Science", created_at=timezone.now())
		self.assertEqual(itinerary.short_name, "Sci")
		self.assertEqual(itinerary.full_name, "Science")

class GroupModelTest(TestCase):
	def test_create_group(self):
		itinerary = Itinerary.objects.create(short_name="Hum", full_name="Humanities", created_at=timezone.now())
		group = Group.objects.create(short_name="G1", full_name="Group 1", itinerary=itinerary, created_at=timezone.now())
		self.assertEqual(group.short_name, "G1")
		self.assertEqual(group.itinerary, itinerary)

class ProfessorModelTest(TestCase):
	def test_create_professor(self):
		subject = Subject.objects.create(short_name="Bio", full_name="Biology", created_at=timezone.now())
		professor = Professor.objects.create(full_name="Dr. Smith", subject=subject, created_at=timezone.now())
		self.assertEqual(professor.full_name, "Dr. Smith")
		self.assertEqual(professor.subject, subject)

class SchoolRecordModelTest(TestCase):
	def test_create_school_record(self):
		# Student model is in students app, so we skip FK here
		record = SchoolRecord.objects.create(descrition="Excellent progress", created_at=timezone.now())
		self.assertEqual(record.descrition, "Excellent progress")

class BookModelTest(TestCase):
	def test_create_book(self):
		book = Book.objects.create(name="Book A", author="Author A", summary="Summary", created_at=timezone.now())
		self.assertEqual(book.name, "Book A")
		self.assertEqual(book.author, "Author A")

class LessonModelTest(TestCase):
	def test_create_lesson(self):
		group = Group.objects.create(short_name="G2", full_name="Group 2", created_at=timezone.now())
		professor = Professor.objects.create(full_name="Dr. Jane", created_at=timezone.now())
		subject = Subject.objects.create(short_name="Chem", full_name="Chemistry", created_at=timezone.now())
		lesson = Lesson.objects.create(group=group, professor=professor, subject=subject, time=1, day=1, created_at=timezone.now())
		self.assertEqual(lesson.group, group)
		self.assertEqual(lesson.professor, professor)
		self.assertEqual(lesson.subject, subject)

class AgendaItemModelTest(TestCase):
	def test_create_agenda_item(self):
		subject = Subject.objects.create(short_name="Geo", full_name="Geography", created_at=timezone.now())
		agenda = AgendaItem.objects.create(title="Meeting", subject=subject, description="Discuss", date=timezone.now().date())
		self.assertEqual(agenda.title, "Meeting")
		self.assertEqual(agenda.subject, subject)

class EventModelTest(TestCase):
	def test_create_event(self):
		event = Event.objects.create(title="Holiday", description="School closed", start_date=timezone.now().date())
		self.assertEqual(event.title, "Holiday")
