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
admin.site.register(
    Event,
    EventsAdmin,
)
