from django.contrib import admin
from school.models import (
    Guardian,
    Student,
    Professor,
    Contract,
    Class,
    Presence,
    Grades,
    SchoolRecord,
    Book,
    Schedule,
)
from django.http import HttpResponseRedirect
from django.utils.html import format_html
from django.urls import path


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


class StudentsAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "full_name",
        "registration_number",
        "phone_number",
        "email",
        "address",
        "cpf",
        "birthday",
        "class_choice",
        "download_presence_list",
    )
    list_display_links = (
        "full_name",
        "email",
        "address",
    )
    search_fields = (
        "full_name",
        "registration_number",
    )
    list_filter = ("full_name",)

    def generate_presence_pdf(self, request, student_id):
        try:
            student = Student.objects.get(pk=student_id)
            return student.generate_presence_pdf()
        except Contract.DoesNotExist:
            self.message_user(request, "Student not found.")
            return HttpResponseRedirect(request.META.get("HTTP_REFERER"))

    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path(
                "<int:student_id>/generate-presence-pdf/",
                self.admin_site.admin_view(self.generate_presence_pdf),
                name="generate-presence-pdf",
            ),
        ]
        return custom_urls + urls

    def download_presence_list(self, obj):
        return format_html(
            f"<a href=/admin/school/student/{obj.id}/generate-presence-pdf/>Download</a>",
        )

    download_presence_list.short_description = "Download Presence List"


class GuardiansAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "full_name",
        "student",
        "phone_number",
        "email",
        "cpf",
        "birthday",
        "address",
    )
    list_display_links = (
        "full_name",
        "email",
        "address",
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
        "address",
        "class_choice",
    )
    list_display_links = (
        "full_name",
        "email",
        "address",
    )
    search_fields = ("full_name",)
    list_filter = ("full_name",)


class ContractsAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "guardian",
        "student",
        "download_contract",
    )
    list_display_links = (
        "guardian",
        "student",
    )
    search_fields = (
        "guardian",
        "student",
    )

    def generate_pdf(self, request, contract_id):
        try:
            contract = Contract.objects.get(pk=contract_id)
            return contract.generate_contract_pdf()
        except Contract.DoesNotExist:
            self.message_user(request, "Contract not found.")
            return HttpResponseRedirect(request.META.get("HTTP_REFERER"))

    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path(
                "<int:contract_id>/generate-pdf/",
                self.admin_site.admin_view(self.generate_pdf),
                name="contract-generate-pdf",
            ),
        ]
        return custom_urls + urls

    def download_contract(self, obj):
        return format_html(
            f"<a href=/admin/school/contract/{obj.id}/generate-pdf/>Download</a>",
        )

    download_contract.short_description = "Download Contract"


class GradesAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "student",
    )
    list_display_links = ("student",)
    search_fields = ("student",)


class PresencesAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "student",
        "date",
        "presence",
    )
    list_display_links = (
        "student",
        "date",
        "presence",
    )
    search_fields = (
        "student",
        "date",
        "presence",
    )
    list_filter = ("student", "date")


class SchoolRecordsAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "student",
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
        "tasks",
    )
    list_display_links = (
        "professor",
        "tasks",
    )
    search_fields = (
        "professor",
        "tasks",
    )
    list_filter = ("professor",)


admin.site.register(
    Class,
    ClassesAdmin,
)

admin.site.register(
    Student,
    StudentsAdmin,
)

admin.site.register(
    Guardian,
    GuardiansAdmin,
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
    Grades,
    GradesAdmin,
)

admin.site.register(
    Presence,
    PresencesAdmin,
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
