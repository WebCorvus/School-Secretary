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


class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = "__all__"


class ProfessorSerializer(serializers.ModelSerializer):
    subject_details = serializers.SerializerMethodField()

    class Meta:
        model = Professor
        fields = "__all__"
        extra_kwargs = {"user": {"read_only": True}}

    def get_subject_details(self, obj):
        from .serializers import SubjectSerializer

        if obj.subject:
            return SubjectSerializer(obj.subject, context=self.context).data
        return None


class ItinerarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Itinerary
        fields = "__all__"


class GroupSerializer(serializers.ModelSerializer):
    itinerary_details = serializers.SerializerMethodField()

    class Meta:
        model = Group
        fields = "__all__"

    def get_itinerary_details(self, obj):
        from .serializers import ItinerarySerializer

        if obj.itinerary:
            return ItinerarySerializer(obj.itinerary, context=self.context).data
        return None


class SchoolRecordSerializer(serializers.ModelSerializer):
    student_details = serializers.SerializerMethodField()

    class Meta:
        model = SchoolRecord
        fields = "__all__"

    def get_student_details(self, obj):
        from students.serializers import StudentSerializer

        if obj.student:
            return StudentSerializer(obj.student, context=self.context).data
        return None


class BookSerializer(serializers.ModelSerializer):
    tenant_details = serializers.SerializerMethodField()

    class Meta:
        model = Book
        fields = "__all__"

    def get_tenant_details(self, obj):
        from students.serializers import StudentSerializer

        if obj.tenant:
            return StudentSerializer(obj.tenant, context=self.context).data
        return None


class LessonSerializer(serializers.ModelSerializer):
    group_details = serializers.SerializerMethodField()
    professor_details = serializers.SerializerMethodField()
    subject_details = serializers.SerializerMethodField()

    class Meta:
        model = Lesson
        fields = "__all__"

    def get_group_details(self, obj):
        from .serializers import GroupSerializer

        if obj.group:
            return GroupSerializer(obj.group, context=self.context).data
        return None

    def get_professor_details(self, obj):
        from .serializers import ProfessorSerializer

        if obj.professor:
            return ProfessorSerializer(obj.professor, context=self.context).data
        return None

    def get_subject_details(self, obj):
        from .serializers import SubjectSerializer

        if obj.subject:
            return SubjectSerializer(obj.subject, context=self.context).data
        return None


class AgendaItemSerializer(serializers.ModelSerializer):
    subject_details = serializers.SerializerMethodField()

    class Meta:
        model = AgendaItem
        fields = "__all__"

    def get_subject_details(self, obj):
        from .serializers import SubjectSerializer

        if obj.subject:
            return SubjectSerializer(obj.subject, context=self.context).data
        return None


class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = "__all__"
