from rest_framework import permissions

class IsColocador(permissions.BasePermission):
    """
    Permite acceso solo si el usuario autenticado tiene role='colocador'.
    """
    def has_permission(self, request, view):
        return (
            request.user and
            request.user.is_authenticated and
            hasattr(request.user, "profile") and
            request.user.profile.role == "colocador"
        )

class IsAprobador(permissions.BasePermission):
    """
    Permite acceso solo si el usuario autenticado tiene role='aprobador'.
    """
    def has_permission(self, request, view):
        return (
            request.user and
            request.user.is_authenticated and
            hasattr(request.user, "profile") and
            request.user.profile.role == "aprobador"
        )
