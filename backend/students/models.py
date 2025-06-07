from django.db import models
from datetime import datetime

from utils.pdfgen import pdfgen
from utils.validators import phone_validator, cep_validator, cpf_validator


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
        "school.Group",
        on_delete=models.CASCADE,
        verbose_name="Student's group",
        related_name="student",
        blank=False,
        null=True,
    )

    itinerary = models.ForeignKey(
        "school.Itinerary",
        on_delete=models.CASCADE,
        verbose_name="Student's itinerary",
        related_name="student",
        blank=False,
        null=True,
    )

    def generate_presence_pdf(self):
        presence_records = Presence.objects.filter(student=self)
        return pdfgen(
            "presence.html",
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

    created_at = models.DateTimeField(
        default=datetime.now(),
        editable=False,
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

    created_at = models.DateTimeField(
        default=datetime.now(),
        editable=False,
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

    created_at = models.DateTimeField(
        default=datetime.now(),
        editable=False,
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
        "school.Subject",
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

    value = models.JSONField(
        blank=False,
        null=True,
    )

    created_at = models.DateTimeField(
        default=datetime.now(),
        editable=False,
    )

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
    created_at = models.DateTimeField(
        default=datetime.now(),
        editable=False,
    )
