from rest_framework import serializers
from .models import (
    Warning,
    Suspension,
    Tuition,
)
from accounts.serializers import StudentCompactSerializer


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
