from rest_framework import serializers
from .models import Student, Grade


class StudentDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = "__all__"


class GradeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Grade
        fields = "__all__"
