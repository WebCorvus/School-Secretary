from django.db import models
from datetime import datetime

from utils.validators import cep_validator, cpf_validator, phone_validator

# Choices globais
SUBJECTS_CHOICES = (
    ("CH", "Ciências Humanas"),
    ("CN", "Ciências da Natureza"),
    ("MAT", "Matemática"),
    ("LING", "Linguagens"),
    ("DS", "Desenvolvimento de Sistemas"),
    ("JG", "Desenvolvimento de Jogos"),
)

ITINERARY_CHOICES = (
    ("DS", "Desenvolvimento de Sistemas"),
    ("CN", "Ciencias da Natureza"),
    ("JG", "Desenvolvimento de Jogos"),
)

CLASS_CHOICES = (
    ("1F", "1° Ano do Fundamental"),
    ("2F", "2° Ano do Fundamental"),
    ("3F", "3° Ano do Fundamental"),
    ("4F", "4° Ano do Fundamental"),
    ("5F", "5° Ano do Fundamental"),
    ("6F", "6° Ano do Fundamental"),
    ("7F", "7° Ano do Fundamental"),
    ("8F", "8° Ano do Fundamental"),
    ("9F", "9° Ano do Fundamental"),
    ("1M", "1° Ano do Médio"),
    ("2M", "2° Ano do Médio"),
    ("3M", "3° Ano do Médio"),
)


class Subject(models.Model):
    name = models.CharField(
        max_length=40, choices=SUBJECTS_CHOICES, blank=False, null=True
    )

    created_at = models.DateTimeField(
        default=datetime.now(),
        editable=False,
    )

    def __str__(self):
        return self.name


class Itinerary(models.Model):
    itinerary_name = models.CharField(max_length=40, choices=ITINERARY_CHOICES)

    created_at = models.DateTimeField(
        default=datetime.now(),
        editable=False,
    )

    def __str__(self):
        return self.itinerary_name


class Group(models.Model):
    group_name = models.CharField(max_length=40, choices=CLASS_CHOICES)

    created_at = models.DateTimeField(
        default=datetime.now(),
        editable=False,
    )

    def __str__(self):
        return self.group_name


class Professor(models.Model):
    full_name = models.CharField(
        max_length=200, verbose_name="Professor's full name", null=True
    )
    phone_number = models.CharField(
        max_length=15,
        verbose_name="Professor's phone number (XX) 9XXXX-XXXX",
        validators=[phone_validator],
    )
    email = models.EmailField(max_length=100, verbose_name="Professor's email")
    cpf = models.CharField(
        max_length=11,
        verbose_name="Professor's CPF",
        unique=True,
        validators=[cpf_validator],
    )
    birthday = models.DateField(max_length=10)
    address = models.CharField(max_length=100, validators=[cep_validator])
    subject = models.ForeignKey(
        Subject,
        on_delete=models.CASCADE,
        verbose_name="Professor's Subject",
        related_name="professor",
        blank=False,
        null=True,
    )
    group = models.ForeignKey(
        Group,
        on_delete=models.CASCADE,
        verbose_name="Professor's Group",
        related_name="professor",
        blank=False,
        null=True,
    )

    created_at = models.DateTimeField(
        default=datetime.now(),
        editable=False,
    )

    def __str__(self):
        return self.full_name


class SchoolRecord(models.Model):
    student = models.ForeignKey(
        "students.Student",
        on_delete=models.CASCADE,
        verbose_name="Student's name",
        related_name="school_record",
        blank=False,
        null=True,
    )

    descrition = models.TextField(
        blank=False,
        null=True,
    )

    created_at = models.DateTimeField(
        default=datetime.now(),
        editable=False,
    )


class Book(models.Model):
    tenant = models.ForeignKey(
        "students.Student",
        on_delete=models.CASCADE,
        verbose_name="Tenant's name",
        related_name="alugated_book",
        blank=False,
        null=True,
    )

    name = models.CharField(
        max_length=100,
        blank=False,
        null=True,
    )

    author = models.CharField(
        max_length=100,
        blank=False,
        null=True,
    )

    summary = models.TextField(
        max_length=200,
        blank=False,
        null=True,
    )

    created_at = models.DateTimeField(
        default=datetime.now(),
        editable=False,
    )


class Schedule(models.Model):
    professor = models.ForeignKey(
        Professor,
        on_delete=models.CASCADE,
        verbose_name="Professor's name",
        related_name="schedule",
        blank=False,
        null=True,
    )

    descrition = models.TextField(
        blank=False,
        null=True,
    )

    created_at = models.DateTimeField(
        default=datetime.now(),
        editable=False,
    )
