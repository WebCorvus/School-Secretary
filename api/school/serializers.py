from rest_framework import serializers
from .models import (
    Professor,
    Subject,
    Itinerary,
    Group,
    SchoolRecord,
    Book,
    Lesson,
    AgendaItem,
    Event,
)
from students.serializers import StudentCompactSerializer


class SubjectCompactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = ["id", "short_name", "full_name"]


class ItineraryCompactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Itinerary
        fields = ["id", "short_name", "full_name"]


class GroupCompactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ["id", "short_name", "full_name"]


class ProfessorCompactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Professor
        fields = ["id", "full_name", "email"]


class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = "__all__"


class ItinerarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Itinerary
        fields = "__all__"


class GroupSerializer(serializers.ModelSerializer):
    itinerary_details = ItineraryCompactSerializer(source="itinerary", read_only=True)

    class Meta:
        model = Group
        fields = "__all__"


class ProfessorSerializer(serializers.ModelSerializer):
    subject_details = SubjectCompactSerializer(source="subject", read_only=True)

    class Meta:
        model = Professor
        fields = "__all__"
        extra_kwargs = {"user": {"read_only": True}}


class SchoolRecordSerializer(serializers.ModelSerializer):
    student_details = StudentCompactSerializer(source="student", read_only=True)

    class Meta:
        model = SchoolRecord
        fields = "__all__"


class BookSerializer(serializers.ModelSerializer):
    tenant_details = StudentCompactSerializer(source="tenant", read_only=True)

    class Meta:
        model = Book
        fields = "__all__"


class LessonSerializer(serializers.ModelSerializer):
    group_details = GroupCompactSerializer(source="group", read_only=True)
    professor_details = ProfessorCompactSerializer(source="professor", read_only=True)
    subject_details = SubjectCompactSerializer(source="subject", read_only=True)

    class Meta:
        model = Lesson
        fields = "__all__"


class AgendaItemSerializer(serializers.ModelSerializer):
    subject_details = SubjectCompactSerializer(source="subject", read_only=True)

    class Meta:
        model = AgendaItem
        fields = "__all__"


class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = "__all__"
