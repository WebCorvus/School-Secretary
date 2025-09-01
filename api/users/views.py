from django.contrib.auth import get_user_model
from rest_framework import viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated
from .serializers import UserSerializer
from .permissions import IsStaff, IsOwnerOrStaff


class UserViewSet(viewsets.ModelViewSet):
    queryset = get_user_model().objects.all()
    serializer_class = UserSerializer

    def get_permissions(self):
        if self.action == "create":
            self.permission_classes = [AllowAny]
        elif self.action == "list":
            self.permission_classes = [IsStaff]
        elif self.action in ["update", "partial_update", "retrieve"]:
            self.permission_classes = [IsOwnerOrStaff]
        elif self.action == "destroy":
            self.permission_classes = [IsStaff]
        else:
            self.permission_classes = [IsAuthenticated]
        return super().get_permissions()
