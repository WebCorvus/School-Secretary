from rest_framework import viewsets

from .models import Professor
from .serializers import ProfessorSerializer


class ProfessorViewSet(viewsets.ModelViewSet):
    queryset = Professor.objects.all()
    serializer_class = ProfessorSerializer
