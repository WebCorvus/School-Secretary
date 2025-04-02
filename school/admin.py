from django.contrib import admin
from school.models import Guardian, Student, Professor, Contract, Class


class GuardiansAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "first_name",
        "last_name",
        "registration_number_student",
        "phone_number",
        "email",
        "adress",
        "cpf",
        "birthday",
        "class_choice",
    )
    list_display_links = (
        "first_name",
        "last_name",
        "email",
        "adress",
    )
    search_fields = (
        "first_name",
        "last_name",
        "registration_number_student",
    )
    list_filter = (
        "first_name",
        "last_name",
    )


class StudentsAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "first_name",
        "last_name",
        "registration_number",
        "phone_number",
        "email",
        "adress",
        "cpf",
        "birthday",
        "class_choice",
    )
    list_display_links = (
        "first_name",
        "last_name",
        "email",
        "adress",
    )
    search_fields = (
        "first_name",
        "last_name",
        "registration_number",
    )
    list_filter = (
        "first_name",
        "last_name",
    )


class ProfessorsAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "first_name",
        "last_name",
        "phone_number",
        "email",
        "adress",
        "cpf",
        "birthday",
        "class_choice",
    )
    list_display_links = (
        "first_name",
        "last_name",
        "email",
        "adress",
    )
    search_fields = (
        "first_name",
        "last_name",
    )
    list_filter = (
        "first_name",
        "last_name",
    )


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
