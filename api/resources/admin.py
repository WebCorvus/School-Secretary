from django.contrib import admin

from .models import Resource, ResourceLoan


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


admin.site.register(Resource, ResourceAdmin)
admin.site.register(ResourceLoan, ResourceLoanAdmin)
