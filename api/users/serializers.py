from rest_framework import serializers
from django.contrib.auth import get_user_model


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ["id", "email", "name", "password", "role"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        user = get_user_model().objects.create_user(**validated_data)
        return user


class UserProfileSerializer(serializers.ModelSerializer):
    profile = serializers.SerializerMethodField()

    class Meta:
        model = get_user_model()
        fields = ["id", "email", "name", "role", "profile"]

    def get_profile(self, obj):
        profile = obj.profile
        if profile:
            if obj.role == get_user_model().Role.STUDENT:
                from students.serializers import StudentSerializer
                return StudentSerializer(profile, context=self.context).data
            elif obj.role == get_user_model().Role.GUARDIAN:
                from students.serializers import GuardianSerializer
                return GuardianSerializer(profile, context=self.context).data
            elif obj.role == get_user_model().Role.PROFESSOR:
                from school.serializers import ProfessorSerializer
                return ProfessorSerializer(profile, context=self.context).data
        return None
