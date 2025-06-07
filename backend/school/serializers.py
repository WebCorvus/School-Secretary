from rest_framework import serializers


class ProfessorSerializer(serializers.ModelSerializer):
    class Meta:
        fields: "__all__"
