from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from users.models import User


class UserAdmin(BaseUserAdmin):
    list_display = ("email", "name", "role", "is_active", "is_staff", "is_superuser")
    search_fields = ("email", "name")
    ordering = ("email",)
    fieldsets = (
        ("Credentials", {"fields": ("email", "password")}),
        ("Personal info", {"fields": ("name", "role")}),
        ("Permissions", {"fields": ("is_active", "is_staff", "is_superuser")}),
    )
    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": ("email", "name", "role", "password1", "password2"),
            },
        ),
    )


admin.site.register(User, UserAdmin)
