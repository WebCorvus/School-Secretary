from django.contrib import admin
from users.models import User


class UserAdmin(admin.ModelAdmin):
    list_display = ("email", "name", "role", "is_active", "is_staff", "is_superuser")
    search_fields = ("email", "name")


admin.site.register(User, UserAdmin)
