from rest_framework import serializers
from django.contrib.auth import get_user_model
from students.models import Student, Guardian
from school.models import Professor
from students.serializers import StudentSerializer, GuardianSerializer
from school.serializers import ProfessorSerializer


class UserSerializer(serializers.ModelSerializer):
    profile = serializers.JSONField(write_only=True)

    class Meta:
        model = get_user_model()
        fields = ["id", "email", "name", "password", "role", "profile"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        profile_data = validated_data.pop("profile")
        user = get_user_model().objects.create_user(**validated_data)

        if user.role == get_user_model().Role.STUDENT:
            profile_serializer = StudentSerializer(data=profile_data)
        elif user.role == get_user_model().Role.GUARDIAN:
            profile_serializer = GuardianSerializer(data=profile_data)
        elif user.role == get_user_model().Role.PROFESSOR:
            profile_serializer = ProfessorSerializer(data=profile_data)
        else:
            profile_serializer = None

        if profile_serializer:
            profile_serializer.is_valid(raise_exception=True)
            profile_serializer.save(user=user)

        return user


class UserProfileSerializer(serializers.ModelSerializer):
    profile_details = serializers.SerializerMethodField()

    class Meta:
        model = get_user_model()
        fields = ["id", "email", "name", "role", "profile_details"]

    def get_profile_details(self, obj):
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
