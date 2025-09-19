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
        try:
            from students.serializers import StudentSerializer
        except ImportError:
            return None

        if hasattr(obj, "profile") and obj.profile:
            return StudentSerializer(obj.profile, context=self.context).data
        return None
