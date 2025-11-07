from rest_framework import serializers
from .models import (
    Warning,
    Suspension,
    Tuition,
    Student,
    Guardian,
    Professor,
    Contract
)


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


class WarningSerializer(serializers.ModelSerializer):
    student_details = StudentCompactSerializer(source="student", read_only=True)
    issued_by_name = serializers.CharField(source="issued_by.name", read_only=True)

    class Meta:
        model = Warning
        fields = "__all__"


class SuspensionSerializer(serializers.ModelSerializer):
    student_details = StudentCompactSerializer(source="student", read_only=True)
    issued_by_name = serializers.CharField(source="issued_by.name", read_only=True)

    class Meta:
        model = Suspension
        fields = "__all__"


class TuitionSerializer(serializers.ModelSerializer):
    student_details = StudentCompactSerializer(source="student", read_only=True)

    class Meta:
        model = Tuition
        fields = "__all__"



class StudentSerializer(serializers.ModelSerializer):
    group_details = serializers.SerializerMethodField()
    grades_details = serializers.SerializerMethodField()
    presence_details = serializers.SerializerMethodField()
    guardians_details = serializers.SerializerMethodField()
    warnings_details = serializers.SerializerMethodField()
    suspensions_details = serializers.SerializerMethodField()

    class Meta:
        model = Student
        exclude = ["user"]
        extra_kwargs = {"user": {"read_only": True}}

    def get_group_details(self, obj):
        from academics.serializers import GroupCompactSerializer
        if obj.group:
            return GroupCompactSerializer(obj.group).data
        return None

    def get_grades_details(self, obj):
        from academics.models import Subject, Grade
        grades_details_list = []

        all_subjects = Subject.objects.all()

        for subject in all_subjects:
            grades_for_subject = [None] * 4
            for grade in obj.grade.filter(subject=subject):
                if grade.bimester == "1B":
                    grades_for_subject[0] = grade.value
                elif grade.bimester == "2B":
                    grades_for_subject[1] = grade.value
                elif grade.bimester == "3B":
                    grades_for_subject[2] = grade.value
                elif grade.bimester == "4B":
                    grades_for_subject[3] = grade.value

            grades_details_list.append(
                {"subject": subject.full_name, "grades": grades_for_subject}
            )

        return grades_details_list

    def get_presence_details(self, obj):
        from academics.serializers import PresenceSerializer
        return PresenceSerializer(obj.presence, many=True).data

    def get_guardians_details(self, obj):
        return GuardianCompactSerializer(obj.guardians, many=True).data

    def get_warnings_details(self, obj):
        from students.serializers import WarningSerializer
        return WarningSerializer(obj.warnings, many=True).data

    def get_suspensions_details(self, obj):
        from students.serializers import SuspensionSerializer
        return SuspensionSerializer(obj.suspensions, many=True).data


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
