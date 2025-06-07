from django.contrib import admin
from school.models import (
    Subject,
    Itinerary,
    Group,
    Professor,
    SchoolRecord,
    Book,
    Schedule,
)


class SubjectsAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "subject_name",
    )
    list_display_links = ("subject_name",)
    search_fields = ("subject_name",)
    list_filter = ("subject_name",)


class ItinerariesAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "itinerary_name",
    )
    list_display_links = ("itinerary_name",)
    search_fields = ("itinerary_name",)
    list_filter = ("itinerary_name",)


class GroupsAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "group_name",
    )
    list_display_links = ("group_name",)
    search_fields = ("group_name",)
    list_filter = ("group_name",)


class ProfessorsAdmin(admin.ModelAdmin):
    list_display = (
        "full_name",
        "phone_number",
        "email",
        "cpf",
        "birthday",
        "address",
        "subject",
        "group",
    )
    list_display_links = (
        "full_name",
        "email",
        "address",
    )
    search_fields = ("full_name",)
    list_filter = ("full_name",)


class SchoolRecordsAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "student",
        "descrition",
    )
    list_display_links = ("student",)
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


class SchedulesAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "professor",
        "descrition",
    )
    list_display_links = (
        "professor",
        "descrition",
    )
    search_fields = (
        "professor",
        "descrition",
    )
    list_filter = ("professor",)


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
    Schedule,
    SchedulesAdmin,
)
