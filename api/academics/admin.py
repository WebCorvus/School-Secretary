from django.contrib import admin
from .models import (
    Subject,
    Itinerary,
    Group,
    Lesson,
    WeeklyLessonPlan,
    Grade,
    Presence,
    Enrollment,
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


class GradeAdmin(admin.ModelAdmin):
    list_per_page = 1000
    list_display = ("id", "student", "subject", "year", "bimester", "value")
    list_display_links = ("student",)
    search_fields = ("student__full_name", "student__user__email", "subject__name")
    list_filter = ("student", "subject", "year", "bimester")


class PresenceAdmin(admin.ModelAdmin):
    list_per_page = 1000
    list_display = ("id", "student", "date", "presence", "created_at")
    list_display_links = ("student", "date")
    search_fields = ("student__full_name", "student__user__email")
    list_filter = ("presence", "date")


class EnrollmentAdmin(admin.ModelAdmin):
    list_per_page = 1000
    list_display = (
        "id",
        "student",
        "group",
        "year",
        "status",
        "enrollment_date",
        "is_reenrollment",
    )
    list_display_links = ("student",)
    search_fields = ("student__full_name", "group__full_name")
    list_filter = ("status", "year", "is_reenrollment")


admin.site.register(Subject, SubjectsAdmin)
admin.site.register(Itinerary, ItinerariesAdmin)
admin.site.register(Group, GroupsAdmin)
admin.site.register(Lesson, LessonsAdmin)
admin.site.register(WeeklyLessonPlan, WeeklyLessonPlanAdmin)
admin.site.register(Grade, GradeAdmin)
admin.site.register(Presence, PresenceAdmin)
admin.site.register(Enrollment, EnrollmentAdmin)
