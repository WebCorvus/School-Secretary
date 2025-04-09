from django.contrib import admin
from school.models import Guardian, Student, Professor, Contract, Class


class StudentsAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "full_name",
        "registration_number",
        "phone_number",
        "email",
        "adress",
        "cpf",
        "birthday",
        "class_choice",
    )
    list_display_links = (
        "full_name",
        "email",
        "adress",
    )
    search_fields = (
        "full_name",
        "registration_number",
    )
    list_filter = ("full_name",)


class GuardiansAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "full_name",
        "student",
        "phone_number",
        "email",
        "cpf",
        "birthday",
        "adress",
    )
    list_display_links = (
        "full_name",
        "email",
        "adress",
    )
    search_fields = ("full_name",)
    list_filter = ("full_name",)


class ProfessorsAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "full_name",
        "phone_number",
        "email",
        "cpf",
        "birthday",
        "adress",
        "class_choice",
    )
    list_display_links = (
        "full_name",
        "email",
        "adress",
    )
    search_fields = ("full_name",)
    list_filter = ("full_name",)


class ContractsAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "guardian",
        "student",
    )
    list_display_links = (
        "guardian",
        "student",
    )
    search_fields = (
        "guardian",
        "student",
    )


class ClassesAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "class_choices",
        "itinerary_choices",
    )
    list_display_links = (
        "class_choices",
        "itinerary_choices",
    )
    search_fields = (
        "class_choices",
        "itinerary_choices",
    )
    list_filter = ("itinerary_choices",)


admin.site.register(
    Guardian,
    GuardiansAdmin,
)

admin.site.register(
    Student,
    StudentsAdmin,
)

admin.site.register(
    Professor,
    ProfessorsAdmin,
)

admin.site.register(
    Contract,
    ContractsAdmin,
)

admin.site.register(
    Class,
    ClassesAdmin,
)
