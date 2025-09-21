from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from users.models import User
from students.models import Student, Guardian
from school.models import Professor


class StudentInline(admin.StackedInline):
    model = Student
    can_delete = False
    verbose_name_plural = "Perfil de Aluno"
    fk_name = "user"


class GuardianInline(admin.StackedInline):
    model = Guardian
    can_delete = False
    verbose_name_plural = "Perfil de Responsável"
    fk_name = "user"


class ProfessorInline(admin.StackedInline):
    model = Professor
    can_delete = False
    verbose_name_plural = "Perfil de Professor"
    fk_name = "user"


class UserAdmin(BaseUserAdmin):
    list_display = (
        "email",
        "name",
        "role",
        "get_profile",
        "is_active",
        "is_staff",
        "is_superuser",
    )
    search_fields = ("email", "name")
    ordering = ("email",)
    fieldsets = (
        ("Credenciais", {"fields": ("email", "password")}),
        ("Informações Pessoais", {"fields": ("name", "role")}),
        ("Permissões", {"fields": ("is_active", "is_staff", "is_superuser")}),
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

    def get_inlines(self, request, obj=None):
        if obj:
            if obj.role == User.Role.STUDENT:
                return [StudentInline]
            elif obj.role == User.Role.GUARDIAN:
                return [GuardianInline]
            elif obj.role == User.Role.PROFESSOR:
                return [ProfessorInline]
        return []

    def get_profile(self, obj):
        if obj.role == User.Role.STUDENT:
            return getattr(obj, "student_profile", None)
        if obj.role == User.Role.GUARDIAN:
            return getattr(obj, "guardian_profile", None)
        if obj.role == User.Role.PROFESSOR:
            return getattr(obj, "professor_profile", None)
        return None

    get_profile.short_description = "Perfil"


admin.site.register(User, UserAdmin)
