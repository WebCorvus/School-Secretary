from django.db import models
from django.http import HttpResponse
from reportlab.pdfgen import canvas
from .validators import cep_validator, cpf_validator, phone_validator


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
    adress = models.CharField(max_length=100, validators=[cep_validator])
    class_choice = models.ForeignKey(
        Class,
        on_delete=models.CASCADE,
        verbose_name="Student's class",
        related_name="student_class",
        blank=False,
        null=True,
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
    adress = models.CharField(max_length=100, validators=[cep_validator])

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
    adress = models.CharField(max_length=100, validators=[cep_validator])
    class_choice = models.ForeignKey(
        Class,
        on_delete=models.CASCADE,
        verbose_name="Student's class",
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
        related_name="contract_guardian",
        blank=False,
        null=True,
    )

    student = models.ForeignKey(
        Student,
        on_delete=models.CASCADE,
        verbose_name="Student's name",
        related_name="contract_student",
        blank=False,
        null=True,
    )

    def generate_contract_pdf(self):
        response = HttpResponse(content_type="application/pdf")
        response["Content-Disposition"] = (
            f'attachment; filename="contract_{self.id}.pdf"'
        )

        p = canvas.Canvas(response)
        p.drawString(100, 800, f"Contract ID: {self.id}")
        p.drawString(100, 780, f"Guardian Name: {self.guardian.full_name}")
        p.drawString(100, 760, f"Guardian Phone: {self.guardian.phone_number}")
        p.drawString(100, 740, f"Guardian Email: {self.guardian.email}")
        p.drawString(100, 720, f"Guardian CPF: {self.guardian.cpf}")
        p.drawString(100, 700, f"Guardian Birthday: {self.guardian.birthday}")
        p.drawString(100, 680, f"Guardian Address: {self.guardian.adress}")
        p.drawString(100, 660, f"Student Name: {self.student.full_name}")
        p.drawString(100, 640, f"Student Phone: {self.student.phone_number}")
        p.drawString(100, 620, f"Student Email: {self.student.email}")
        p.drawString(100, 600, f"Student CPF: {self.student.cpf}")
        p.drawString(100, 580, f"Student Birthday: {self.student.birthday}")
        p.drawString(100, 560, f"Student Address: {self.student.adress}")
        p.showPage()
        p.save()

        return response

    def __str__(self):
        return f"Contract for {self.student.full_name} and {self.guardian.full_name}"
