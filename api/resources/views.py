from rest_framework import filters, viewsets
from rest_framework.permissions import IsAuthenticated

from users.permissions import IsStaff

from .models import Resource, ResourceLoan
from .serializers import ResourceLoanSerializer, ResourceSerializer


class ResourceViewSet(viewsets.ModelViewSet):
    queryset = Resource.objects.all().order_by("name")
    serializer_class = ResourceSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ["name", "resource_type", "status"]

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            self.permission_classes = [IsAuthenticated]
        else:
            self.permission_classes = [IsStaff]
        return super().get_permissions()


class ResourceLoanViewSet(viewsets.ModelViewSet):
    queryset = ResourceLoan.objects.all().order_by("-loan_date")
    serializer_class = ResourceLoanSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = [
        "resource__name",
        "student__full_name",
        "student__registration_number",
        "loan_date",
    ]

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            self.permission_classes = [IsAuthenticated]
        else:
            self.permission_classes = [IsStaff]
        return super().get_permissions()
