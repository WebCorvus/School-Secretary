from django.db import models
from django.utils import timezone
from django.conf import settings

from utils.validators import phone_validator, cep_validator, cpf_validator
from utils.date import get_current_year, get_today


class Warning(models.Model):
    student = models.ForeignKey(
        "accounts.Student",
        on_delete=models.CASCADE,
        verbose_name="Estudante",
        related_name="warnings",
    )
    reason = models.TextField(verbose_name="Motivo")
    date = models.DateField(verbose_name="Data", default=get_today)
    issued_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        verbose_name="Emitido por",
        null=True,
        blank=True,
    )
    created_at = models.DateTimeField(
        verbose_name="Criado em",
        default=timezone.now,
        editable=False,
    )

    def __str__(self):
        return f"Advertência - {self.student.full_name} - {self.date}"

    class Meta:
        verbose_name = "Advertência"
        verbose_name_plural = "Advertências"


class Suspension(models.Model):
    student = models.ForeignKey(
        "accounts.Student",
        on_delete=models.CASCADE,
        verbose_name="Estudante",
        related_name="suspensions",
    )
    reason = models.TextField(verbose_name="Motivo")
    start_date = models.DateField(verbose_name="Data de início", default=get_today)
    end_date = models.DateField(verbose_name="Data de término")
    issued_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        verbose_name="Emitido por",
        null=True,
        blank=True,
    )
    created_at = models.DateTimeField(
        verbose_name="Criado em",
        default=timezone.now,
        editable=False,
    )

    def __str__(self):
        return f"Suspensão - {self.student.full_name} - {self.start_date} a {self.end_date}"

    class Meta:
        verbose_name = "Suspensão"
        verbose_name_plural = "Suspensões"


PAYMENT_STATUS_CHOICES = [
    ("PENDING", "Pendente"),
    ("PAID", "Pago"),
    ("OVERDUE", "Atrasado"),
    ("CANCELLED", "Cancelado"),
]


class Tuition(models.Model):
    student = models.ForeignKey(
        "accounts.Student",
        on_delete=models.CASCADE,
        verbose_name="Estudante",
        related_name="tuitions",
    )
    amount = models.DecimalField(
        verbose_name="Valor",
        max_digits=10,
        decimal_places=2,
    )
    due_date = models.DateField(verbose_name="Data de vencimento")
    payment_date = models.DateField(
        verbose_name="Data de pagamento",
        null=True,
        blank=True,
    )
    status = models.CharField(
        verbose_name="Status",
        max_length=20,
        choices=PAYMENT_STATUS_CHOICES,
        default="PENDING",
    )
    reference_month = models.DateField(verbose_name="Mês de referência")
    created_at = models.DateTimeField(
        verbose_name="Criado em",
        default=timezone.now,
        editable=False,
    )

    def __str__(self):
        return f"Mensalidade - {self.student.full_name} - {self.reference_month}"

    class Meta:
        verbose_name = "Mensalidade"
        verbose_name_plural = "Mensalidades"
