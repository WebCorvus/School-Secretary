
from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from users.permissions import IsStaff, IsProfessor
from django.utils import timezone
from utils.day_util import get_day_name

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
from .serializers import (
    ProfessorSerializer,
    SubjectSerializer,
    ItinerarySerializer,
    GroupSerializer,
    SchoolRecordSerializer,
    BookSerializer,
    LessonSerializer,
    AgendaItemSerializer,
    EventSerializer,
)
from .models import LESSONS_PER_DAY


class ProfessorViewSet(viewsets.ModelViewSet):
    def create(self, request, *args, **kwargs):
        from .test_create_methods import generic_create
        return generic_create(self, request, "ProfessorForm")

    def update(self, request, *args, **kwargs):
        response = super().update(request, *args, **kwargs)
        if response.status_code == 400:
            from utils.inconsistency_logger import log_inconsistency
            user = request.user if request.user.is_authenticated else None
            log_inconsistency(
                user=user,
                form_name="ProfessorForm",
                error_type="ValidationError",
                error_message=str(response.data),
                data_sent=request.data
            )
        return response
    queryset = Professor.objects.all().order_by("full_name")
    serializer_class = ProfessorSerializer
    permission_classes = [IsStaff]
    filter_backends = [filters.SearchFilter]
    search_fields = [
        "full_name",
        "phone_number",
        "email",
        "cpf",
        "birthday",
        "address",
        "subject__full_name",
        "subject__short_name",
    ]


class SubjectViewSet(viewsets.ModelViewSet):
    def create(self, request, *args, **kwargs):
        from .test_create_methods import generic_create
        return generic_create(self, request, "SubjectForm")

    def update(self, request, *args, **kwargs):
        try:
            return super().update(request, *args, **kwargs)
        except Exception as e:
            from utils.inconsistency_logger import log_inconsistency
            user = request.user if request.user.is_authenticated else None
            log_inconsistency(
                user=user,
                form_name="SubjectForm",
                error_type=type(e).__name__,
                error_message=str(e),
                data_sent=request.data
            )
            return Response({"detail": "Ocorreu uma inconsistência ao atualizar a disciplina.", "error": str(e)}, status=400)
    queryset = Subject.objects.all().order_by("full_name")
    serializer_class = SubjectSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = [
        "full_name",
        "short_name",
        "created_at",
    ]

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            self.permission_classes = [IsAuthenticated]
        else:
            self.permission_classes = [IsStaff]
        return super().get_permissions()


class ItineraryViewSet(viewsets.ModelViewSet):
    queryset = Itinerary.objects.all().order_by("full_name")
    serializer_class = ItinerarySerializer
    filter_backends = [filters.SearchFilter]
    search_fields = [
        "full_name",
        "short_name",
        "created_at",
    ]

    def create(self, request, *args, **kwargs):
        from .test_create_methods import generic_create
        return generic_create(self, request, "ItineraryForm")

    def update(self, request, *args, **kwargs):
        response = super().update(request, *args, **kwargs)
        if response.status_code == 400:
            from utils.inconsistency_logger import log_inconsistency
            user = request.user if request.user.is_authenticated else None
            log_inconsistency(
                user=user,
                form_name="ItineraryForm",
                error_type="ValidationError",
                error_message=str(response.data),
                data_sent=request.data
            )
        return response


class GroupViewSet(viewsets.ModelViewSet):

    queryset = Group.objects.all().order_by("full_name")
    serializer_class = GroupSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = [
        "full_name",
        "short_name",
        "itinerary__full_name",
        "itinerary__short_name",
        "created_at",
    ]

    def create(self, request, *args, **kwargs):
        from .test_create_methods import generic_create
        return generic_create(self, request, "GroupForm")

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            self.permission_classes = [IsAuthenticated]
        else:
            self.permission_classes = [IsStaff]
        return super().get_permissions()

    @action(detail=True, methods=["get"], url_path="get-lessons")
    def get_lessons(self, request, pk=None):
        group = self.get_object()
        group_lessons = Lesson.objects.filter(group=group)
        week_lessons = []
        for day in range(7):
            day_lessons = []
            for time in range(LESSONS_PER_DAY):
                lesson = group_lessons.filter(day=day, time=time).first()
                if lesson:
                    day_lessons.append(LessonSerializer(lesson).data)
                else:
                    day_lessons.append(None)
            week_lessons.append(
                {
                    "day": get_day_name(day),
                    "lessons": day_lessons,
                }
            )
        return Response(week_lessons)


class SchoolRecordViewSet(viewsets.ModelViewSet):
    queryset = SchoolRecord.objects.all().order_by("-created_at")
    serializer_class = SchoolRecordSerializer
    permission_classes = [IsStaff]
    filter_backends = [filters.SearchFilter]
    search_fields = [
        "student__full_name",
        "student__registration_number",
        "descrition",
        "created_at",
    ]

    def create(self, request, *args, **kwargs):
        from .test_create_methods import generic_create
        return generic_create(self, request, "SchoolRecordForm")

    def update(self, request, *args, **kwargs):
        response = super().update(request, *args, **kwargs)
        if response.status_code == 400:
            from utils.inconsistency_logger import log_inconsistency
            user = request.user if request.user.is_authenticated else None
            log_inconsistency(
                user=user,
                form_name="SchoolRecordForm",
                error_type="ValidationError",
                error_message=str(response.data),
                data_sent=request.data
            )
        return response


class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all().order_by("name")
    serializer_class = BookSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = [
        "name",
        "tenant__full_name",
        "tenant__registration_number",
        "author",
        "summary",
        "created_at",
    ]

    def create(self, request, *args, **kwargs):
        from .test_create_methods import generic_create
        return generic_create(self, request, "BookForm")

    def update(self, request, *args, **kwargs):
        response = super().update(request, *args, **kwargs)
        if response.status_code == 400:
            from utils.inconsistency_logger import log_inconsistency
            user = request.user if request.user.is_authenticated else None
            log_inconsistency(
                user=user,
                form_name="BookForm",
                error_type="ValidationError",
                error_message=str(response.data),
                data_sent=request.data
            )
        return response


class LessonViewSet(viewsets.ModelViewSet):
    queryset = Lesson.objects.all().order_by("day", "time")
    serializer_class = LessonSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = [
        "group__full_name",
        "group__short_name",
        "professor__full_name",
        "professor__email",
        "subject__full_name",
        "subject__short_name",
        "time",
        "day",
        "created_at",
    ]

    def create(self, request, *args, **kwargs):
        from .test_create_methods import generic_create
        return generic_create(self, request, "LessonForm")

    def update(self, request, *args, **kwargs):
        response = super().update(request, *args, **kwargs)
        if response.status_code == 400:
            from utils.inconsistency_logger import log_inconsistency
            user = request.user if request.user.is_authenticated else None
            log_inconsistency(
                user=user,
                form_name="LessonForm",
                error_type="ValidationError",
                error_message=str(response.data),
                data_sent=request.data
            )
        return response


class AgendaItemViewSet(viewsets.ModelViewSet):
    queryset = AgendaItem.objects.all().order_by("-date", "-time")
    serializer_class = AgendaItemSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = [
        "title",
        "description",
        "date",
    ]

    def create(self, request, *args, **kwargs):
        from .test_create_methods import generic_create
        return generic_create(self, request, "AgendaItemForm")

    def update(self, request, *args, **kwargs):
        response = super().update(request, *args, **kwargs)
        if response.status_code == 400:
            from utils.inconsistency_logger import log_inconsistency
            user = request.user if request.user.is_authenticated else None
            log_inconsistency(
                user=user,
                form_name="AgendaItemForm",
                error_type="ValidationError",
                error_message=str(response.data),
                data_sent=request.data
            )
        return response


class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all().order_by("-start_date", "-start_time")
    serializer_class = EventSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = [
        "title",
        "description",
        "location",
        "start_date",
    ]

    def create(self, request, *args, **kwargs):
        from .test_create_methods import generic_create
        return generic_create(self, request, "EventForm")

    def update(self, request, *args, **kwargs):
        response = super().update(request, *args, **kwargs)
        if response.status_code == 400:
            from utils.inconsistency_logger import log_inconsistency
            user = request.user if request.user.is_authenticated else None
            log_inconsistency(
                user=user,
                form_name="EventForm",
                error_type="ValidationError",
                error_message=str(response.data),
                data_sent=request.data
            )
        return response