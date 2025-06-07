from rest_framework import viewsets

from .models import Student
from .serializers import StudentDataSerializer


class StudentDataViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentDataSerializer
