from rest_framework.permissions import BasePermission


class IsSuperUser(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_superuser)


class IsStaff(BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user and (request.user.is_staff or request.user.is_superuser)
        )


class IsProfessor(BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and (
                request.user.role == "PROFESSOR"
                or request.user.is_staff
                or request.user.is_superuser
            )
        )


class IsStudent(BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user
            and (
                request.user.role == "STUDENT"
                or request.user.is_staff
                or request.user.is_superuser
            )
        )


class IsOwnerOrStaff(BasePermission):
    def has_object_permission(self, request, view, obj):
        return bool(
            obj == request.user or request.user.is_staff or request.user.is_superuser
        )
