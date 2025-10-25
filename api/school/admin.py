from django.contrib import admin
from school.models import (
    Subject,
    Itinerary,
    Group,
    Professor,
    SchoolRecord,
    Book,
    Lesson,
    Event,
    AgendaItem,
    WeeklyLessonPlan,
    EventRegistration,
    Resource,
    ResourceLoan,
    Room,
    RoomReservation,
    Notification,
)


class SubjectsAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "full_name",
        "short_name",
    )
    list_display_links = (
        "full_name",
        "short_name",
    )
    search_fields = (
        "full_name",
        "short_name",
    )
    list_filter = (
        "full_name",
        "short_name",
    )


class ItinerariesAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "full_name",
        "short_name",
    )
    list_display_links = (
        "full_name",
        "short_name",
    )
    search_fields = (
        "full_name",
        "short_name",
    )
    list_filter = (
        "full_name",
        "short_name",
    )


class GroupsAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "full_name",
        "short_name",
        "itinerary",
    )
    list_display_links = (
        "full_name",
        "short_name",
    )
    search_fields = (
        "full_name",
        "short_name",
    )
    list_filter = (
        "full_name",
        "short_name",
        "itinerary",
    )


class ProfessorsAdmin(admin.ModelAdmin):
    list_display = (
        "user",
        "full_name",
        "phone_number",
        "cpf",
        "birthday",
        "address",
        "subject",
    )
    list_display_links = (
        "full_name",
        "cpf",
    )
    search_fields = (
        "full_name",
        "user__email",
        "user__name",
        "cpf",
    )
    list_filter = ("full_name",)


class SchoolRecordsAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "student",
        "description",
    )
    list_display_links = ("student", "description")
    search_fields = ("student",)
    list_filter = ("student",)


class BooksAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "tenant",
        "name",
        "author",
        "summary",
    )
    list_display_links = (
        "tenant",
        "name",
        "author",
        "summary",
    )
    search_fields = (
        "tenant",
        "name",
        "author",
        "summary",
    )
    list_filter = ("tenant",)


class LessonsAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "professor",
        "subject",
        "time",
        "day",
    )
    list_display_links = (
        "professor",
        "subject",
    )
    search_fields = (
        "professor",
        "subject",
        "time",
        "day",
    )
    list_filter = ("professor", "subject", "time", "day")


class AgendaItemsAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "title",
        "subject",
        "description",
        "date",
        "time",
    )
    list_display_links = (
        "title",
        "subject",
        "description",
        "date",
        "time",
    )
    search_fields = (
        "title",
        "subject",
        "description",
        "date",
        "time",
    )
    list_filter = ("title", "subject", "description", "date", "time")


class EventsAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "title",
        "location",
        "description",
        "start_date",
        "end_date",
        "start_time",
        "end_time",
        "created_at",
        "updated_at",
    )
    list_display_links = (
        "title",
        "location",
        "description",
        "start_date",
        "end_date",
        "start_time",
        "end_time",
    )
    search_fields = (
        "title",
        "location",
        "description",
        "start_date",
        "end_date",
        "start_time",
        "end_time",
    )
    list_filter = (
        "title",
        "location",
        "description",
        "start_date",
        "end_date",
        "start_time",
        "end_time",
    )


admin.site.register(
    Subject,
    SubjectsAdmin,
)

admin.site.register(
    Itinerary,
    ItinerariesAdmin,
)

admin.site.register(
    Group,
    GroupsAdmin,
)

admin.site.register(
    Professor,
    ProfessorsAdmin,
)

admin.site.register(
    SchoolRecord,
    SchoolRecordsAdmin,
)

admin.site.register(
    Book,
    BooksAdmin,
)

admin.site.register(
    Lesson,
    LessonsAdmin,
)

admin.site.register(
    AgendaItem,
    AgendaItemsAdmin,
)


class WeeklyLessonPlanAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "professor",
        "lesson",
        "week_start_date",
        "created_at",
    )
    list_display_links = (
        "professor",
        "lesson",
    )
    search_fields = (
        "professor__full_name",
        "lesson__subject__full_name",
        "planning_content",
    )
    list_filter = ("week_start_date", "professor")


admin.site.register(
    WeeklyLessonPlan,
    WeeklyLessonPlanAdmin,
)


admin.site.register(
    Event,
    EventsAdmin,
)


class EventRegistrationAdmin(admin.ModelAdmin):
    list_display = ("id", "event", "student", "registration_date")
    list_display_links = ("event", "student")
    search_fields = ("event__title", "student__full_name")
    list_filter = ("event", "registration_date")


class ResourceAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "resource_type", "status")
    list_display_links = ("name",)
    search_fields = ("name", "resource_type")
    list_filter = ("resource_type", "status")


class ResourceLoanAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "resource",
        "student",
        "loan_date",
        "return_date",
        "actual_return_date",
    )
    list_display_links = ("resource", "student")
    search_fields = ("resource__name", "student__full_name")
    list_filter = ("loan_date", "return_date")


class RoomAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "room_type", "capacity")
    list_display_links = ("name",)
    search_fields = ("name", "room_type")
    list_filter = ("room_type",)


class RoomReservationAdmin(admin.ModelAdmin):
    list_display = ("id", "room", "reserved_by", "purpose", "date", "start_time", "end_time")
    list_display_links = ("room", "reserved_by")
    search_fields = ("room__name", "reserved_by__full_name", "purpose")
    list_filter = ("date",)


class NotificationAdmin(admin.ModelAdmin):
    list_display = ("id", "recipient", "notification_type", "title", "read", "created_at")
    list_display_links = ("title",)
    search_fields = ("recipient__name", "title", "message")
    list_filter = ("notification_type", "read", "created_at")


admin.site.register(EventRegistration, EventRegistrationAdmin)
admin.site.register(Resource, ResourceAdmin)
admin.site.register(ResourceLoan, ResourceLoanAdmin)
admin.site.register(Room, RoomAdmin)
admin.site.register(RoomReservation, RoomReservationAdmin)
admin.site.register(Notification, NotificationAdmin)
