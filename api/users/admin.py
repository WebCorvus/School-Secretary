from django.contrib import admin
from users.models import User


class UserAdmin(admin.ModelAdmin):
    list_display = ("email", "name", "role", "is_active", "is_staff", "is_superuser")
    search_fields = ("email", "name")
    fieldsets = (
        (None, {"fields": ("email", "password")}),
        ("Personal info", {"fields": ("name", "role")}),
        ("Permissions", {"fields": ("is_active", "is_staff", "is_superuser")}),
    )


admin.site.register(User, UserAdmin)
