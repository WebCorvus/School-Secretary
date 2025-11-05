from rest_framework import serializers
from .models import (
    Subject,
    Itinerary,
    Group,
    Lesson,
    WeeklyLessonPlan,
    Grade,
    Presence,
    Enrollment,
)


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


class GradeCompactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Grade
        fields = ["id", "value", "year", "bimester"]


class PresenceCompactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Presence
        fields = ["id", "date", "presence"]


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
    student_count = serializers.SerializerMethodField()

    class Meta:
        model = Group
        fields = "__all__"

    def get_student_count(self, obj):
        return obj.students.count()


class LessonSerializer(serializers.ModelSerializer):
    group_details = GroupCompactSerializer(source="group", read_only=True)
    professor_details = serializers.SerializerMethodField()
    subject_details = SubjectCompactSerializer(source="subject", read_only=True)

    class Meta:
        model = Lesson
        fields = "__all__"

    def get_professor_details(self, obj):
        from accounts.serializers import ProfessorCompactSerializer
        if obj.professor:
            return ProfessorCompactSerializer(obj.professor).data
        return None


class WeeklyLessonPlanSerializer(serializers.ModelSerializer):
    professor_details = serializers.SerializerMethodField()
    lesson_details = LessonSerializer(source="lesson", read_only=True)

    class Meta:
        model = WeeklyLessonPlan
        fields = "__all__"

    def get_professor_details(self, obj):
        from accounts.serializers import ProfessorCompactSerializer
        if obj.professor:
            return ProfessorCompactSerializer(obj.professor).data
        return None


class GradeSerializer(serializers.ModelSerializer):
    student_details = serializers.SerializerMethodField()
    subject_details = SubjectCompactSerializer(source="subject", read_only=True)

    class Meta:
        model = Grade
        fields = "__all__"

    def get_student_details(self, obj):
        from accounts.serializers import StudentCompactSerializer
        if obj.student:
            return StudentCompactSerializer(obj.student).data
        return None


class PresenceSerializer(serializers.ModelSerializer):
    student_details = serializers.SerializerMethodField()

    class Meta:
        model = Presence
        fields = "__all__"

    def get_student_details(self, obj):
        from accounts.serializers import StudentCompactSerializer
        if obj.student:
            return StudentCompactSerializer(obj.student).data
        return None


class EnrollmentSerializer(serializers.ModelSerializer):
    student_details = serializers.SerializerMethodField()
    group_details = GroupCompactSerializer(source="group", read_only=True)

    class Meta:
        model = Enrollment
        fields = "__all__"

    def get_student_details(self, obj):
        from accounts.serializers import StudentCompactSerializer
        if obj.student:
            return StudentCompactSerializer(obj.student).data
        return None
