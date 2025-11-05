from rest_framework import serializers
from .models import Student, Guardian, Professor, Contract


class StudentCompactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = ["id", "full_name", "cpf", "phone_number"]


class GuardianCompactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Guardian
        fields = ["id", "full_name", "cpf", "phone_number"]


class ProfessorCompactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Professor
        fields = ["id", "full_name", "cpf", "phone_number"]


class StudentSerializer(serializers.ModelSerializer):
    group_details = serializers.SerializerMethodField()

    class Meta:
        model = Student
        exclude = ["user"]
        extra_kwargs = {"user": {"read_only": True}}

    def get_group_details(self, obj):
        from academics.serializers import GroupCompactSerializer
        if obj.group:
            return GroupCompactSerializer(obj.group).data
        return None


class GuardianSerializer(serializers.ModelSerializer):
    student_details = StudentCompactSerializer(source="student", read_only=True)

    class Meta:
        model = Guardian
        exclude = ["user"]
        extra_kwargs = {"user": {"read_only": True}}


class ProfessorSerializer(serializers.ModelSerializer):
    subject_details = serializers.SerializerMethodField()

    class Meta:
        model = Professor
        exclude = ["user"]
        extra_kwargs = {"user": {"read_only": True}}

    def get_subject_details(self, obj):
        from academics.serializers import SubjectCompactSerializer
        if obj.subject:
            return SubjectCompactSerializer(obj.subject).data
        return None


class ContractSerializer(serializers.ModelSerializer):
    guardian_details = GuardianCompactSerializer(source="guardian", read_only=True)
    student_details = StudentCompactSerializer(source="student", read_only=True)

    class Meta:
        model = Contract
        fields = "__all__"
