from rest_framework import serializers
from .models import Student, Grade, Guardian, Contract, Presence


class StudentSerializer(serializers.ModelSerializer):
    def is_valid(self, raise_exception=False):
        result = super().is_valid(raise_exception=raise_exception)
        if self.errors:
            import logging, traceback
            logger = logging.getLogger("api_error_audit")
            logger.error({
                "event": "serializer_validation_error",
                "serializer": self.__class__.__name__,
                "errors": self.errors,
                "data": self.initial_data,
                "traceback": traceback.format_exc(limit=3),
            })
        return result
    from school.serializers import GroupSerializer

    group_details = GroupSerializer(source="group", read_only=True)

    class Meta:
        model = Student
        fields = "__all__"
        extra_fields = ["group_details"]


class GradeSerializer(serializers.ModelSerializer):
    from school.serializers import SubjectSerializer

    student_details = StudentSerializer(source="student", read_only=True)
    subject_details = SubjectSerializer(source="subject", read_only=True)

    class Meta:
        model = Grade
        fields = "__all__"
        extra_fields = ["student_details", "subject_details"]


class GuardianSerializer(serializers.ModelSerializer):
    student_details = StudentSerializer(source="student", read_only=True)

    class Meta:
        model = Guardian
        fields = "__all__"
        extra_fields = ["student_details"]


class ContractSerializer(serializers.ModelSerializer):
    guardian_details = GuardianSerializer(source="guardian", read_only=True)
    student_details = StudentSerializer(source="student", read_only=True)

    class Meta:
        model = Contract
        fields = "__all__"
        extra_fields = ["guardian_details", "student_details"]


class PresenceSerializer(serializers.ModelSerializer):
    student_details = StudentSerializer(source="student", read_only=True)

    class Meta:
        model = Presence
        fields = "__all__"
        extra_fields = ["student_details"]
