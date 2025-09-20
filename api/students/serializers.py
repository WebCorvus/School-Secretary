from rest_framework import serializers
from .models import Student, Grade, Guardian, Contract, Presence


class StudentSerializer(serializers.ModelSerializer):
    group_details = serializers.SerializerMethodField()
    grades_details = serializers.SerializerMethodField()

    class Meta:
        model = Student
        fields = "__all__"
        extra_kwargs = {"user": {"read_only": True}}

    def get_group_details(self, obj):
        from school.serializers import GroupSerializer

        if obj.group:
            return GroupSerializer(obj.group, context=self.context).data
        return None

    def get_grades_details(self, obj):
        from .serializers import GradeSerializer

        grades = obj.grade.all().order_by("year", "bimester")
        grouped = {}
        for grade in grades:
            year = grade.year
            if year not in grouped:
                grouped[year] = []
            grouped[year].append(GradeSerializer(grade, context=self.context).data)

        result = [
            {"year": year, "grades": grades_list}
            for year, grades_list in sorted(grouped.items())
        ]
        return result


class GradeSerializer(serializers.ModelSerializer):
    student_details = serializers.SerializerMethodField()
    subject_details = serializers.SerializerMethodField()

    class Meta:
        model = Grade
        fields = "__all__"

    def get_student_details(self, obj):
        from .serializers import StudentSerializer

        if obj.student:
            return StudentSerializer(obj.student, context=self.context).data
        return None

    def get_subject_details(self, obj):
        from school.serializers import SubjectSerializer

        if obj.subject:
            return SubjectSerializer(obj.subject, context=self.context).data
        return None


class GuardianSerializer(serializers.ModelSerializer):
    student_details = serializers.SerializerMethodField()

    class Meta:
        model = Guardian
        fields = "__all__"
        extra_kwargs = {"user": {"read_only": True}}

    def get_student_details(self, obj):
        from .serializers import StudentSerializer

        if obj.student:
            return StudentSerializer(obj.student, context=self.context).data
        return None


class ContractSerializer(serializers.ModelSerializer):
    guardian_details = serializers.SerializerMethodField()
    student_details = serializers.SerializerMethodField()

    class Meta:
        model = Contract
        fields = "__all__"

    def get_guardian_details(self, obj):
        from .serializers import GuardianSerializer

        if obj.guardian:
            return GuardianSerializer(obj.guardian, context=self.context).data
        return None

    def get_student_details(self, obj):
        from .serializers import StudentSerializer

        if obj.student:
            return StudentSerializer(obj.student, context=self.context).data
        return None


class PresenceSerializer(serializers.ModelSerializer):
    student_details = serializers.SerializerMethodField()

    class Meta:
        model = Presence
        fields = "__all__"

    def get_student_details(self, obj):
        from .serializers import StudentSerializer

        if obj.student:
            return StudentSerializer(obj.student, context=self.context).data
        return None
