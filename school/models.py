from django.db import models
from django.http import HttpResponse
from django.template.loader import render_to_string
from xhtml2pdf import pisa
from io import BytesIO

from datetime import datetime

from .validators import cep_validator, cpf_validator, phone_validator
from .pdfgen import pdfgen


class Class(models.Model):
    CLASS_CHOICES = (
        ("1A", "1° Ano A"),
        ("1B", "1° Ano B"),
        ("1C", "1° Ano C"),
        ("2A", "2° Ano A"),
        ("2B", "2° Ano B"),
        ("2C", "2° Ano C"),
        ("3A", "3° Ano A"),
        ("3B", "3° Ano B"),
        ("3C", "3° Ano C"),
    )

    ITINERARY_CHOICES = (
        ("DS", "Desenvolvimento de Sistemas"),
        ("CN", "Ciencias da Natureza"),
        ("JG", "Desenvolvimento de Jogos"),
    )

    class_choices = models.CharField(max_length=50, choices=CLASS_CHOICES)
    itinerary_choices = models.CharField(max_length=50, choices=ITINERARY_CHOICES)

    def __str__(self):
        return f"{self.get_class_choices_display()} - {self.get_itinerary_choices_display()}"

    class Meta:
        verbose_name_plural = "Classes"


class Student(models.Model):
    full_name = models.CharField(
        max_length=200, verbose_name="Student's full name", null=True
    )

    registration_number = models.CharField(
        max_length=6, unique=True, verbose_name="Student's registration"
    )
    phone_number = models.CharField(
        max_length=15,
        verbose_name="Student's phone number (XX) 9XXXX-XXXX",
        validators=[phone_validator],
    )
    email = models.EmailField(max_length=100, verbose_name="Student's email")
    cpf = models.CharField(
        max_length=11,
        verbose_name="Student's CPF",
        unique=True,
        validators=[cpf_validator],
    )
    birthday = models.DateField(max_length=10)
    address = models.CharField(max_length=100, validators=[cep_validator])
    class_choice = models.ForeignKey(
        Class,
        on_delete=models.CASCADE,
        verbose_name="Student's class",
        related_name="class_student",
        blank=False,
        null=True,
    )

    def generate_presence_pdf(self):
        presence_records = Presence.objects.filter(student=self)
        return pdfgen(
            "presence_list.html",
            {
                "data": presence_records,
                "student": self,
            },
            f"Presence_{self.full_name}.pdf",
        )

    def __str__(self):
        return self.full_name + "_" + self.registration_number


class Guardian(models.Model):
    full_name = models.CharField(
        max_length=200, verbose_name="Guardian's full name", null=True
    )
    student = models.ForeignKey(
        Student,
        on_delete=models.CASCADE,
        verbose_name="Guardian's student",
        related_name="guardian_student",
        blank=False,
        null=True,
    )
    phone_number = models.CharField(
        max_length=15,
        verbose_name="Guardian's phone number (XX) 9XXXX-XXXX",
        validators=[phone_validator],
    )
    email = models.EmailField(max_length=100, verbose_name="Guardian's email")
    cpf = models.CharField(
        max_length=11,
        verbose_name="Guardian's CPF",
        unique=True,
        validators=[cpf_validator],
    )
    birthday = models.DateField(max_length=10)
    address = models.CharField(max_length=100, validators=[cep_validator])

    def __str__(self):
        return self.full_name


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
    class_choice = models.ForeignKey(
        Class,
        on_delete=models.CASCADE,
        verbose_name="Professor's class",
        related_name="professor_class",
        blank=False,
        null=True,
    )

    def __str__(self):
        return self.full_name


class Contract(models.Model):
    guardian = models.ForeignKey(
        Guardian,
        on_delete=models.CASCADE,
        verbose_name="Guardian's name",
        related_name="contrac",
        blank=False,
        null=True,
    )

    student = models.ForeignKey(
        Student,
        on_delete=models.CASCADE,
        verbose_name="Student's name",
        related_name="contract",
        blank=False,
        null=True,
    )

    def generate_contract_pdf(self):
        return pdfgen(
            "contract.html",
            {
                "data": self,
            },
            f"Contract_{self.id}_{self.guardian.full_name}-{self.student.full_name}.pdf",
        )

    def __str__(self):
        return f"Contract: {self.guardian.full_name.upper()} e {self.student.full_name.upper()}"


class Grades(models.Model):
    student = models.ForeignKey(
        Student,
        on_delete=models.CASCADE,
        verbose_name="Student's name",
        related_name="grades",
        blank=False,
        null=True,
    )

    grades = models.JSONField(
        verbose_name="JSON Values of Grades",
        blank=False,
        null=True,
    )

    year = models.IntegerField(
        blank=False,
        null=True,
    )

    created_at = models.DateTimeField(default=datetime.now())

    def __str__(self):
        return f"{self.student.full_name}'s Bulletin"

    class Meta:
        verbose_name_plural = "Grades"


class Presence(models.Model):
    student = models.ForeignKey(
        Student,
        on_delete=models.CASCADE,
        verbose_name="Student's name",
        related_name="presence_list",
        blank=False,
        null=True,
    )
    date = models.DateField()
    presence = models.BooleanField()


class SchoolRecord(models.Model):
    student = models.ForeignKey(
        Student,
        on_delete=models.CASCADE,
        verbose_name="Student's name",
        related_name="school_record",
        blank=False,
        null=True,
    )


class Book(models.Model):
    tenant = models.ForeignKey(
        Student,
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


class Schedule(models.Model):
    professor = models.ForeignKey(
        Professor,
        on_delete=models.CASCADE,
        verbose_name="Professor's name",
        related_name="schedule",
        blank=False,
        null=True,
    )

    tasks = models.JSONField()
