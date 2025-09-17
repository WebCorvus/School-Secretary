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
    Event,
)


class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = "__all__"


class ProfessorSerializer(serializers.ModelSerializer):
    def is_valid(self, raise_exception=False):
        result = super().is_valid(raise_exception=raise_exception)
        if self.errors:
            import logging, traceback
            logger = logging.getLogger("api_error_audit")
            logger.error(str({
                "event": "serializer_validation_error",
                "serializer": self.__class__.__name__,
                "errors": self.errors,
                "data": self.initial_data,
                "traceback": traceback.format_exc(limit=3),
            }))
            # Registrar inconsistência no model
            try:
                from utils.inconsistency_logger import log_inconsistency
                user = None
                # Tenta pegar usuário do contexto
                if hasattr(self, 'context') and self.context.get('request'):
                    req = self.context['request']
                    user = req.user if hasattr(req, 'user') and getattr(req.user, 'is_authenticated', False) else None
                log_inconsistency(
                    user=user,
                    form_name="ProfessorForm",
                    error_type="ValidationError",
                    error_message=str(self.errors),
                    data_sent=self.initial_data
                )
            except Exception as e:
                logger.error(f"Erro ao registrar inconsistencia: {e}")
        return result
    subject_details = SubjectSerializer(source="subject", read_only=True)

    class Meta:
        model = Professor
        fields = "__all__"
        extra_fields = ["subject_details"]


class ItinerarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Itinerary
        fields = "__all__"


class GroupSerializer(serializers.ModelSerializer):
    itinerary_details = ItinerarySerializer(source="itinerary", read_only=True)

    class Meta:
        model = Group
        fields = "__all__"
        extra_fields = ["itinerary_details"]


class SchoolRecordSerializer(serializers.ModelSerializer):
    from students.serializers import StudentSerializer as BaseStudentSerializer

    student_details = BaseStudentSerializer(source="student", read_only=True)

    class Meta:
        model = SchoolRecord
        fields = "__all__"
        extra_fields = ["student_details"]


class BookSerializer(serializers.ModelSerializer):
    from students.serializers import StudentSerializer as BaseStudentSerializer

    tenant_details = BaseStudentSerializer(source="tenant", read_only=True)

    class Meta:
        model = Book
        fields = "__all__"
        extra_fields = ["tenant_details"]


class LessonSerializer(serializers.ModelSerializer):
    group_details = GroupSerializer(source="group", read_only=True)
    professor_details = ProfessorSerializer(source="professor", read_only=True)
    subject_details = SubjectSerializer(source="subject", read_only=True)

    class Meta:
        model = Lesson
        fields = "__all__"
        extra_fields = ["group_details", "professor_details", "subject_details"]


class AgendaItemSerializer(serializers.ModelSerializer):
    subject_details = SubjectSerializer(source="subject", read_only=True)

    class Meta:
        model = AgendaItem
        fields = "__all__"
        extra_fields = ["subject_details"]


class EventSerializer(serializers.ModelSerializer):

    class Meta:
        model = Event
        fields = "__all__"
