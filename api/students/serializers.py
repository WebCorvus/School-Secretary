from rest_framework import serializers
from .models import Student, Grade, Guardian, Contract, Presence
from school.serializers import SubjectCompactSerializer, GroupCompactSerializer
from school.models import (
    Subject,
)


class StudentCompactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = ["id", "full_name", "cpf", "phone_number"]


class GuardianCompactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Guardian
        fields = ["id", "full_name", "cpf", "phone_number"]


class GradeCompactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Grade
        fields = ["id", "value", "year", "bimester"]


class PresenceCompactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Presence
        fields = ["id", "date", "presence"]


class GuardianSerializer(serializers.ModelSerializer):
    student_details = StudentCompactSerializer(source="student", read_only=True)

    class Meta:
        model = Guardian
        exclude = ["user"]
        extra_kwargs = {"user": {"read_only": True}}


class ContractSerializer(serializers.ModelSerializer):
    guardian_details = GuardianCompactSerializer(source="guardian", read_only=True)
    student_details = StudentCompactSerializer(source="student", read_only=True)

    class Meta:
        model = Contract
        fields = "__all__"


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


class StudentSerializer(serializers.ModelSerializer):
    group_details = GroupCompactSerializer(source="group", read_only=True)
    grades_details = serializers.SerializerMethodField()
    presence_details = PresenceSerializer(source="presence", many=True, read_only=True)
    guardians_details = GuardianSerializer(
        source="guardians", many=True, read_only=True
    )

    class Meta:
        model = Student
        exclude = ["user"]
        extra_kwargs = {"user": {"read_only": True}}

    def get_grades_details(self, obj):
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
