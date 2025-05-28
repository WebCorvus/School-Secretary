from django.db import models
from django.http import HttpResponse
from django.template.loader import render_to_string
from xhtml2pdf import pisa
from io import BytesIO

from datetime import datetime

from .validators import cep_validator, cpf_validator, phone_validator
from .pdfgen import pdfgen


class Subject(models.Model):
    SUBJECTS_CHOICE = (
        ("CH", "Ciências Humanas"),
        ("CN", "Ciências da Natureza"),
        ("MAT", "Matemática"),
        ("LING", "Linguagens"),
    )

    subject_name = models.CharField(max_length=40, choices=SUBJECTS_CHOICE)

    def __str__(self):
        return self.subject_name


class Itinerary(models.Model):
    ITINERARY_CHOICES = (
        ("DS", "Desenvolvimento de Sistemas"),
        ("CN", "Ciencias da Natureza"),
        ("JG", "Desenvolvimento de Jogos"),
    )

    itinerary_name = models.CharField(max_length=40, choices=ITINERARY_CHOICES)

    def __str__(self):
        return self.itinerary_name


class Group(models.Model):
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

    group_name = models.CharField(max_length=40, choices=CLASS_CHOICES)

    def __str__(self):
        return self.group_name


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
    group = models.ForeignKey(
        Group,
        on_delete=models.CASCADE,
        verbose_name="Student's group",
        related_name="student",
        blank=False,
        null=True,
    )

    itinerary = models.ForeignKey(
        Itinerary,
        on_delete=models.CASCADE,
        verbose_name="Student's itinerary",
        related_name="student",
        blank=False,
        null=True,
    )

    def generate_presence_pdf(self):
        presence_records = Presence.objects.filter(student=self)
        return pdfgen(
            "presence_list.html",
            {
                "student": self,
                "data": presence_records,
            },
            f"Presence_{self.full_name}.pdf",
        )

    def generate_grades_pdf(self):
        grades = Grades.objects.filter(student=self)
        return pdfgen(
            "grades.html",
            {
                "student": self,
                "data": grades,
            },
            f"Grades_{self.full_name}.pdf",
        )

    def __str__(self):
        return self.full_name


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

    created_at = models.DateTimeField(default=datetime.now())

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

    subject = models.ForeignKey(
        Subject,
        on_delete=models.CASCADE,
        verbose_name="Grade's Subject",
        related_name="grades",
        blank=False,
        null=True,
    )

    year = models.IntegerField(
        blank=False,
        null=True,
    )

    values = models.JSONField(
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
    created_at = models.DateTimeField(default=datetime.now())


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

    created_at = models.DateTimeField(default=datetime.now())


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

    created_at = models.DateTimeField(default=datetime.now())
