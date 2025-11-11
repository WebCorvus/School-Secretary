from rest_framework import serializers
from .models import (
    SchoolRecord,
    Book,
    AgendaItem,
    Event,
    EventRegistration,
    Room,
    RoomReservation,
    Notification,
)


class SchoolRecordSerializer(serializers.ModelSerializer):
    student_details = serializers.SerializerMethodField()

    class Meta:
        model = SchoolRecord
        fields = "__all__"

    def get_student_details(self, obj):
        from students.serializers import StudentCompactSerializer
        if obj.student:
            return StudentCompactSerializer(obj.student).data
        return None


class BookSerializer(serializers.ModelSerializer):
    tenant_details = serializers.SerializerMethodField()

    class Meta:
        model = Book
        fields = "__all__"

    def get_tenant_details(self, obj):
        from students.serializers import StudentCompactSerializer
        if obj.tenant:
            return StudentCompactSerializer(obj.tenant).data
        return None


class AgendaItemSerializer(serializers.ModelSerializer):
    subject_details = serializers.SerializerMethodField()

    class Meta:
        model = AgendaItem
        fields = "__all__"

    def get_subject_details(self, obj):
        from academics.serializers import SubjectCompactSerializer
        if obj.subject:
            return SubjectCompactSerializer(obj.subject).data
        return None


class EventSerializer(serializers.ModelSerializer):
    registrations_count = serializers.SerializerMethodField()

    class Meta:
        model = Event
        fields = "__all__"

    def get_registrations_count(self, obj):
        return obj.registrations.count()


class EventRegistrationSerializer(serializers.ModelSerializer):
    event_details = EventSerializer(source="event", read_only=True)
    student_name = serializers.CharField(source="student.full_name", read_only=True)

    class Meta:
        model = EventRegistration
        fields = "__all__"


class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = "__all__"


class RoomReservationSerializer(serializers.ModelSerializer):
    room_details = RoomSerializer(source="room", read_only=True)
    professor_name = serializers.CharField(
        source="reserved_by.full_name", read_only=True
    )

    class Meta:
        model = RoomReservation
        fields = "__all__"


class NotificationSerializer(serializers.ModelSerializer):
    recipient_name = serializers.CharField(source="recipient.name", read_only=True)

    class Meta:
        model = Notification
        fields = "__all__"
