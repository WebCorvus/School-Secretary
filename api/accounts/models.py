from django.db import models
from django.utils import timezone
from django.conf import settings
from utils.validators import phone_validator, cep_validator, cpf_validator


class Student(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        verbose_name="Usuário",
        on_delete=models.CASCADE,
        related_name="student_profile",
    )
    full_name = models.CharField(verbose_name="Nome completo", max_length=200)
    registration_number = models.CharField(
        verbose_name="Número de matrícula", max_length=6, unique=True
    )
    phone_number = models.CharField(
        verbose_name="Telefone (XX) XXXXX-XXXX",
        max_length=15,
        validators=[phone_validator],
    )
    cpf = models.CharField(
        verbose_name="CPF", max_length=11, unique=True, validators=[cpf_validator]
    )
    birthday = models.DateField(verbose_name="Data de nascimento")
    address = models.CharField(
        verbose_name="CEP", max_length=100, validators=[cep_validator]
    )
    group = models.ForeignKey(
        "academics.Group",
        verbose_name="Turma",
        on_delete=models.SET_NULL,
        related_name="students",
        null=True,
        blank=True,
    )
    created_at = models.DateTimeField(
        verbose_name="Criado em", default=timezone.now, editable=False
    )

    def __str__(self):
        return self.full_name

    class Meta:
        verbose_name = "Estudante"
        verbose_name_plural = "Estudantes"
        db_table = "students_student"


class Guardian(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        verbose_name="Usuário",
        on_delete=models.CASCADE,
        related_name="guardian_profile",
    )
    full_name = models.CharField(verbose_name="Nome completo", max_length=200)
    student = models.ForeignKey(
        Student,
        verbose_name="Estudante",
        on_delete=models.SET_NULL,
        related_name="guardians",
        null=True,
        blank=True,
    )
    phone_number = models.CharField(
        verbose_name="Telefone (XX) XXXXX-XXXX",
        max_length=15,
        validators=[phone_validator],
    )
    cpf = models.CharField(
        verbose_name="CPF", max_length=11, unique=True, validators=[cpf_validator]
    )
    birthday = models.DateField(verbose_name="Data de nascimento")
    address = models.CharField(
        verbose_name="CEP", max_length=100, validators=[cep_validator]
    )
    created_at = models.DateTimeField(
        verbose_name="Criado em", default=timezone.now, editable=False
    )

    def __str__(self):
        return self.full_name

    class Meta:
        verbose_name = "Responsável"
        verbose_name_plural = "Responsáveis"
        db_table = "students_guardian"


class Professor(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        verbose_name="Usuário",
        on_delete=models.CASCADE,
        related_name="professor_profile",
    )
    full_name = models.CharField(verbose_name="Nome completo", max_length=200)
    phone_number = models.CharField(
        verbose_name="Telefone (XX) XXXXX-XXXX",
        max_length=15,
        validators=[phone_validator],
    )
    cpf = models.CharField(
        verbose_name="CPF", max_length=11, unique=True, validators=[cpf_validator]
    )
    birthday = models.DateField(verbose_name="Data de nascimento")
    address = models.CharField(
        verbose_name="CEP", max_length=100, validators=[cep_validator]
    )
    subject = models.ForeignKey(
        "academics.Subject",
        verbose_name="Matéria",
        on_delete=models.SET_NULL,
        related_name="professors",
        null=True,
        blank=True,
    )
    created_at = models.DateTimeField(
        verbose_name="Criado em", default=timezone.now, editable=False
    )

    def __str__(self):
        return self.full_name

    class Meta:
        verbose_name = "Professor"
        verbose_name_plural = "Professores"
        db_table = "school_professor"


class Contract(models.Model):
    guardian = models.ForeignKey(
        Guardian,
        on_delete=models.SET_NULL,
        verbose_name="Responsável",
        related_name="contract",
        blank=False,
        null=True,
    )

    student = models.ForeignKey(
        Student,
        on_delete=models.SET_NULL,
        verbose_name="Estudante",
        related_name="contract",
        blank=False,
        null=True,
    )

    created_at = models.DateTimeField(
        verbose_name="Criado em",
        default=timezone.now,
        editable=False,
    )

    def __str__(self):
        return f"Contract: {self.guardian.full_name.upper()} e {self.student.full_name.upper()}"

    class Meta:
        verbose_name = "Contrato"
        verbose_name_plural = "Contratos"
        db_table = "students_contract"
