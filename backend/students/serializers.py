from rest_framework import serializers
from .models import Student, Grade, Guardian, Contract, Presence


class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = "__all__"


class GradeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Grade
        fields = "__all__"


class GuardianSerializer(serializers.ModelSerializer):
    class Meta:
        model = Guardian
        fields = "__all__"


class ContractSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contract
        fields = "__all__"


class PresenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Presence
        fields = "__all__"
