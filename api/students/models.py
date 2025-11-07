from django.db import models
from django.utils import timezone
from django.conf import settings

from utils.validators import phone_validator, cep_validator, cpf_validator
from utils.date import get_current_year, get_today


class Student(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        verbose_name="Usuário",
    )
    full_name = models.CharField(verbose_name="Nome completo", max_length=255)
    cpf = models.CharField(
        verbose_name="CPF",
        max_length=14,
        unique=True,
        validators=[cpf_validator],
    )
    registration_number = models.CharField(
        verbose_name="Matrícula",
        max_length=255,
        unique=True,
    )
    birthday = models.DateField(verbose_name="Data de nascimento")
    phone_number = models.CharField(
        verbose_name="Telefone",
        max_length=20,
        validators=[phone_validator],
        blank=True,
        null=True,
    )
    cep = models.CharField(
        verbose_name="CEP",
        max_length=9,
        validators=[cep_validator],
        blank=True,
        null=True,
    )
    address = models.CharField(verbose_name="Endereço", max_length=255)
    group = models.ForeignKey(
        "academics.Group",
        on_delete=models.SET_NULL,
        verbose_name="Turma",
        related_name="students",
        blank=True,
        null=True,
    )
    created_at = models.DateTimeField(
        verbose_name="Criado em",
        default=timezone.now,
        editable=False,
    )

    def __str__(self):
        return f"{self.full_name} - {self.registration_number}"

    class Meta:
        verbose_name = "Estudante"
        verbose_name_plural = "Estudantes"


class Guardian(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        verbose_name="Usuário",
    )
    full_name = models.CharField(verbose_name="Nome completo", max_length=255)
    cpf = models.CharField(
        verbose_name="CPF",
        max_length=14,
        unique=True,
        validators=[cpf_validator],
    )
    birthday = models.DateField(verbose_name="Data de nascimento")
    phone_number = models.CharField(
        verbose_name="Telefone",
        max_length=20,
        validators=[phone_validator],
        blank=True,
        null=True,
    )
    cep = models.CharField(
        verbose_name="CEP",
        max_length=9,
        validators=[cep_validator],
        blank=True,
        null=True,
    )
    address = models.CharField(verbose_name="Endereço", max_length=255)
    student = models.ForeignKey(
        "students.Student",
        on_delete=models.CASCADE,
        verbose_name="Estudante",
        related_name="guardians",
    )
    created_at = models.DateTimeField(
        verbose_name="Criado em",
        default=timezone.now,
        editable=False,
    )

    def __str__(self):
        return f"{self.full_name} - Responsável por {self.student.full_name}"

    class Meta:
        verbose_name = "Responsável"
        verbose_name_plural = "Responsáveis"


class Professor(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        verbose_name="Usuário",
    )
    full_name = models.CharField(verbose_name="Nome completo", max_length=255)
    cpf = models.CharField(
        verbose_name="CPF",
        max_length=14,
        unique=True,
        validators=[cpf_validator],
    )
    birthday = models.DateField(verbose_name="Data de nascimento")
    phone_number = models.CharField(
        verbose_name="Telefone",
        max_length=20,
        validators=[phone_validator],
        blank=True,
        null=True,
    )
    cep = models.CharField(
        verbose_name="CEP",
        max_length=9,
        validators=[cep_validator],
        blank=True,
        null=True,
    )
    address = models.CharField(verbose_name="Endereço", max_length=255)
    subject = models.ForeignKey(
        "academics.Subject",
        on_delete=models.SET_NULL,
        verbose_name="Disciplina",
        related_name="professors",
        blank=True,
        null=True,
    )
    created_at = models.DateTimeField(
        verbose_name="Criado em",
        default=timezone.now,
        editable=False,
    )

    def __str__(self):
        return f"{self.full_name} - Professor de {self.subject.full_name}"

    class Meta:
        verbose_name = "Professor"
        verbose_name_plural = "Professores"


class Contract(models.Model):
    guardian = models.ForeignKey(
        "students.Guardian",
        on_delete=models.CASCADE,
        verbose_name="Responsável",
        related_name="contracts",
    )
    student = models.ForeignKey(
        "students.Student",
        on_delete=models.CASCADE,
        verbose_name="Estudante",
        related_name="contracts",
    )
    year = models.IntegerField(verbose_name="Ano", default=get_current_year)
    is_active = models.BooleanField(verbose_name="Ativo", default=True)
    created_at = models.DateTimeField(
        verbose_name="Criado em",
        default=timezone.now,
        editable=False,
    )

    def __str__(self):
        return f"Contrato - {self.guardian.full_name} e {self.student.full_name} - {self.year}"

    class Meta:
        verbose_name = "Contrato"
        verbose_name_plural = "Contratos"


class Warning(models.Model):
    student = models.ForeignKey(
        "students.Student",
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
        "students.Student",
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
        "students.Student",
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
