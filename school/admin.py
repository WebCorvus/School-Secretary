from django.contrib import admin
from school.models import Guardian, Student, Professor, Contract, Class
from django.http import HttpResponseRedirect
from django.utils.html import format_html
from django.urls import path


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

    def download_contract(self, obj):
        return format_html(
            '<a href="{}">Download Contract</a>',
            f"/admin/school/contract/{obj.id}/generate-pdf/",
        )

    download_contract.short_description = "Download Contract"

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

    def generate_pdf(self, request, contract_id):
        try:
            contract = Contract.objects.get(pk=contract_id)
            return contract.generate_contract_pdf()
        except Contract.DoesNotExist:
            self.message_user(request, "Contract not found.")
            return HttpResponseRedirect(request.META.get("HTTP_REFERER"))


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
