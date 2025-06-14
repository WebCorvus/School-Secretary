from rest_framework import serializers
from .models import Professor, Subject, Itinerary, Group, SchoolRecord, Book, Schedule


class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = "__all__"


class ProfessorSerializer(serializers.ModelSerializer):
    subject_details = SubjectSerializer(source="subject", read_only=True)

    class Meta:
        model = Professor
        fields = "__all__"
        extra_fields = ["subject_details"]


class ItinerarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Itinerary
        fields = "__all__"


class GroupSerializer(serializers.ModelSerializer):
    itinerary_details = ItinerarySerializer(source="itinerary", read_only=True)

    class Meta:
        model = Group
        fields = "__all__"
        extra_fields = ["itinerary_details"]


class SchoolRecordSerializer(serializers.ModelSerializer):
    from students.serializers import StudentSerializer as BaseStudentSerializer

    student_details = BaseStudentSerializer(source="student", read_only=True)

    class Meta:
        model = SchoolRecord
        fields = "__all__"
        extra_fields = ["student_details"]


class BookSerializer(serializers.ModelSerializer):
    from students.serializers import StudentSerializer as BaseStudentSerializer

    tenant_details = BaseStudentSerializer(source="tenant", read_only=True)

    class Meta:
        model = Book
        fields = "__all__"
        extra_fields = ["tenant_details"]


class ScheduleSerializer(serializers.ModelSerializer):
    professor_details = ProfessorSerializer(source="professor", read_only=True)

    class Meta:
        model = Schedule
        fields = "__all__"
        extra_fields = ["professor_details"]
