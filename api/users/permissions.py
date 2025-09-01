from rest_framework.permissions import BasePermission


class IsSuperUser(BasePermission):
    """
    Allows access only to superusers.
    """

    def has_permission(self, request, view):
        return bool(request.user and request.user.is_superuser)


class IsStaff(BasePermission):
    """
    Allows access only to staff or superusers.
    """

    def has_permission(self, request, view):
        return bool(
            request.user and (request.user.is_staff or request.user.is_superuser)
        )


class IsProfessor(BasePermission):
    """
    Allows access only to users with the Professor, Staff or Superuser role.
    """

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
    """
    Allows access only to users with the Student role.
    """

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.role == "STUDENT"
        )


class IsOwnerOrStaff(BasePermission):
    """
    Custom permission to only allow owners of an object or staff to view or edit it.
    """

    def has_object_permission(self, request, view, obj):
        return bool(
            obj == request.user or request.user.is_staff or request.user.is_superuser
        )
