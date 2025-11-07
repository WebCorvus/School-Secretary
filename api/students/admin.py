from django.contrib import admin
from .models import (
    Warning,
    Suspension,
    Tuition,
    Student,
    Guardian,
    Professor,
    Contract,
)
from academics.models import Grade, Presence


class WarningAdmin(admin.ModelAdmin):
    list_per_page = 1000
    list_display = ("id", "student", "reason", "date", "issued_by")
    list_display_links = ("student",)
    search_fields = ("student__full_name", "reason")
    list_filter = ("date",)


class SuspensionAdmin(admin.ModelAdmin):
    list_per_page = 1000
    list_display = (
        "id",
        "student",
        "reason",
        "start_date",
        "end_date",
        "issued_by",
    )
    list_display_links = ("student",)
    search_fields = ("student__full_name", "reason")
    list_filter = ("start_date", "end_date")


class TuitionAdmin(admin.ModelAdmin):
    list_per_page = 1000
    list_display = (
        "id",
        "student",
        "amount",
        "due_date",
        "payment_date",
        "status",
        "reference_month",
    )
    list_display_links = ("student",)
    search_fields = ("student__full_name",)
    list_filter = ("status", "due_date")


class GradeInline(admin.TabularInline):
    model = Grade
    extra = 0
    readonly_fields = ("subject", "year", "bimester", "value", "created_at")
    can_delete = False


class PresenceInline(admin.TabularInline):
    model = Presence
    extra = 0
    readonly_fields = ("date", "presence", "created_at")
    can_delete = False


class StudentAdmin(admin.ModelAdmin):
    list_per_page = 1000
    autocomplete_fields = ("user",)
    list_display = (
        "full_name",
        "cpf",
        "registration_number",
        "user",
        "phone_number",
        "group",
    )
    list_display_links = ("full_name", "registration_number", "cpf")
    search_fields = (
        "full_name",
        "registration_number",
        "user__email",
        "user__name",
        "cpf",
    )
    list_filter = ("group",)
    inlines = [GradeInline, PresenceInline]


class GuardianAdmin(admin.ModelAdmin):
    list_per_page = 1000
    autocomplete_fields = ("user",)
    list_display = (
        "user",
        "full_name",
        "student",
        "phone_number",
        "cpf",
        "birthday",
        "address",
    )
    list_display_links = ("full_name", "cpf")
    search_fields = (
        "full_name",
        "cpf",
        "student__full_name",
        "user__email",
        "user__name",
    )
    list_filter = ("student",)


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


class ContractAdmin(admin.ModelAdmin):
    list_per_page = 1000
    list_display = ("id", "guardian", "student")
    list_display_links = ("guardian", "student")
    search_fields = (
        "guardian__full_name",
        "guardian__user__email",
        "student__full_name",
        "student__user__email",
    )


admin.site.register(Warning, WarningAdmin)
admin.site.register(Suspension, SuspensionAdmin)
admin.site.register(Tuition, TuitionAdmin)
admin.site.register(Student, StudentAdmin)
admin.site.register(Guardian, GuardianAdmin)
admin.site.register(Professor, ProfessorsAdmin)
admin.site.register(Contract, ContractAdmin)
