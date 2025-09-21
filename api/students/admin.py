from django.contrib import admin
from .models import Student, Guardian, Contract, Grade, Presence


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


admin.site.register(Student, StudentAdmin)
admin.site.register(Guardian, GuardianAdmin)
admin.site.register(Contract, ContractAdmin)
admin.site.register(Grade, GradeAdmin)
admin.site.register(Presence, PresenceAdmin)
