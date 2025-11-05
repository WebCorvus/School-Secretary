from django.contrib import admin
from .models import (
    Warning,
    Suspension,
    Tuition,
)


class WarningAdmin(admin.ModelAdmin):
    list_per_page = 1000
    list_display = ("id", "student", "reason", "date", "issued_by")
    list_display_links = ("student",)
    search_fields = ("student__full_name", "reason")
    list_filter = ("date",)


class SuspensionAdmin(admin.ModelAdmin):
    list_per_page = 1000
    list_display = ("id", "student", "reason", "start_date", "end_date", "issued_by")
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


admin.site.register(Warning, WarningAdmin)
admin.site.register(Suspension, SuspensionAdmin)
admin.site.register(Tuition, TuitionAdmin)
