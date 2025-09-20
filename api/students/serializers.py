from rest_framework import serializers
from .models import Student, Grade, Guardian, Contract, Presence
from school.serializers import SubjectCompactSerializer, GroupCompactSerializer


class StudentCompactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = ["id", "full_name", "registration_number"]


class GuardianCompactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Guardian
        fields = ["id", "full_name", "phone_number"]


class GradeSerializer(serializers.ModelSerializer):
    student_details = StudentCompactSerializer(source="student", read_only=True)
    subject_details = SubjectCompactSerializer(source="subject", read_only=True)

    class Meta:
        model = Grade
        fields = "__all__"


class PresenceSerializer(serializers.ModelSerializer):
    student_details = StudentCompactSerializer(source="student", read_only=True)

    class Meta:
        model = Presence
        fields = "__all__"


class GuardianSerializer(serializers.ModelSerializer):
    student_details = StudentCompactSerializer(source="student", read_only=True)

    class Meta:
        model = Guardian
        fields = "__all__"
        extra_kwargs = {"user": {"read_only": True}}


class ContractSerializer(serializers.ModelSerializer):
    guardian_details = GuardianCompactSerializer(source="guardian", read_only=True)
    student_details = StudentCompactSerializer(source="student", read_only=True)

    class Meta:
        model = Contract
        fields = "__all__"


class StudentSerializer(serializers.ModelSerializer):
    group_details = GroupCompactSerializer(source="group", read_only=True)
    grades_details = GradeSerializer(source="grade", many=True, read_only=True)
    presence_details = PresenceSerializer(source="presence", many=True, read_only=True)
    guardians_details = GuardianSerializer(
        source="guardians", many=True, read_only=True
    )

    class Meta:
        model = Student
        fields = "__all__"
        extra_kwargs = {"user": {"read_only": True}}
