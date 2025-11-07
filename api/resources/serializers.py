from rest_framework import serializers

from .models import Resource, ResourceLoan


class ResourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resource
        fields = "__all__"


class ResourceLoanSerializer(serializers.ModelSerializer):
    resource_details = ResourceSerializer(source="resource", read_only=True)
    student_name = serializers.CharField(source="student.full_name", read_only=True)

    class Meta:
        model = ResourceLoan
        fields = "__all__"
