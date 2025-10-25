from rest_framework import serializers
from .models import (
    Professor,
    Subject,
    Itinerary,
    Group,
    SchoolRecord,
    Book,
    Lesson,
    AgendaItem,
    WeeklyLessonPlan,
    Event,
    EventRegistration,
    Resource,
    ResourceLoan,
    Room,
    RoomReservation,
    Notification,
)


class SubjectCompactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = ["id", "short_name", "full_name"]


class ItineraryCompactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Itinerary
        fields = ["id", "short_name", "full_name"]


class GroupCompactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ["id", "short_name", "full_name"]


class ProfessorCompactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Professor
        fields = ["id", "full_name", "cpf", "phone_number"]


class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = "__all__"


class ItinerarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Itinerary
        fields = "__all__"


class GroupSerializer(serializers.ModelSerializer):
    itinerary_details = ItineraryCompactSerializer(source="itinerary", read_only=True)

    class Meta:
        model = Group
        fields = "__all__"


class ProfessorSerializer(serializers.ModelSerializer):
    subject_details = SubjectCompactSerializer(source="subject", read_only=True)

    class Meta:
        model = Professor
        exclude = ["user"]
        extra_kwargs = {"user": {"read_only": True}}


class SchoolRecordSerializer(serializers.ModelSerializer):
    student_details = serializers.SerializerMethodField()

    class Meta:
        model = SchoolRecord
        fields = "__all__"

    def get_student_details(self, obj):
        from students.serializers import StudentCompactSerializer

        return StudentCompactSerializer(obj.student).data


class BookSerializer(serializers.ModelSerializer):
    tenant_details = serializers.SerializerMethodField()

    class Meta:
        model = Book
        fields = "__all__"

    def get_tenant_details(self, obj):
        from students.serializers import StudentCompactSerializer

        return StudentCompactSerializer(obj.tenant).data


class LessonSerializer(serializers.ModelSerializer):
    group_details = GroupCompactSerializer(source="group", read_only=True)
    professor_details = ProfessorCompactSerializer(source="professor", read_only=True)
    subject_details = SubjectCompactSerializer(source="subject", read_only=True)

    class Meta:
        model = Lesson
        fields = "__all__"


class AgendaItemSerializer(serializers.ModelSerializer):
    subject_details = SubjectCompactSerializer(source="subject", read_only=True)

    class Meta:
        model = AgendaItem
        fields = "__all__"


class WeeklyLessonPlanSerializer(serializers.ModelSerializer):
    professor_details = ProfessorCompactSerializer(source="professor", read_only=True)
    lesson_details = LessonSerializer(source="lesson", read_only=True)

    class Meta:
        model = WeeklyLessonPlan
        fields = "__all__"


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
