from django.db import models
from django.utils import timezone

from utils.date import get_today

RESOURCE_TYPE_CHOICES = [
    ("COMPUTER", "Computador"),
    ("BOOK", "Livro"),
    ("EQUIPMENT", "Equipamento"),
    ("OTHER", "Outro"),
]

RESOURCE_STATUS_CHOICES = [
    ("AVAILABLE", "Disponível"),
    ("IN_USE", "Em uso"),
    ("MAINTENANCE", "Manutenção"),
    ("UNAVAILABLE", "Indisponível"),
]


class Resource(models.Model):
    name = models.CharField(verbose_name="Nome", max_length=200)
    resource_type = models.CharField(
        verbose_name="Tipo",
        max_length=20,
        choices=RESOURCE_TYPE_CHOICES,
    )
    description = models.TextField(
        verbose_name="Descrição",
        blank=True,
        null=True,
    )
    status = models.CharField(
        verbose_name="Status",
        max_length=20,
        choices=RESOURCE_STATUS_CHOICES,
        default="AVAILABLE",
    )
    created_at = models.DateTimeField(
        verbose_name="Criado em",
        default=timezone.now,
        editable=False,
    )

    class Meta:
        verbose_name = "Recurso"
        verbose_name_plural = "Recursos"

    def __str__(self):
        return f"{self.name} ({self.get_resource_type_display()})"


class ResourceLoan(models.Model):
    resource = models.ForeignKey(
        Resource,
        on_delete=models.CASCADE,
        verbose_name="Recurso",
        related_name="loans",
    )
    student = models.ForeignKey(
        "students.Student",
        on_delete=models.CASCADE,
        verbose_name="Estudante",
        related_name="resource_loans",
    )
    loan_date = models.DateField(verbose_name="Data de empréstimo", default=get_today)
    return_date = models.DateField(
        verbose_name="Data de devolução prevista",
    )
    actual_return_date = models.DateField(
        verbose_name="Data de devolução efetiva",
        null=True,
        blank=True,
    )
    created_at = models.DateTimeField(
        verbose_name="Criado em",
        default=timezone.now,
        editable=False,
    )

    class Meta:
        verbose_name = "Empréstimo de Recurso"
        verbose_name_plural = "Empréstimos de Recursos"

    def __str__(self):
        return f"{self.resource.name} - {self.student.full_name}"
