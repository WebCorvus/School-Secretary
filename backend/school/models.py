from django.db import models
from datetime import datetime

from utils.validators import cep_validator, cpf_validator, phone_validator


class Subject(models.Model):
    short_name = models.CharField(
        max_length=200,
        unique=True,
        blank=False,
        null=True,
    )

    full_name = models.CharField(
        max_length=200,
        unique=True,
        blank=False,
        null=True,
    )

    created_at = models.DateTimeField(
        default=datetime.now(),
        editable=False,
    )

    def __str__(self):
        return self.name


class Itinerary(models.Model):
    full_name = models.CharField(
        max_length=200,
        unique=True,
        blank=False,
        null=True,
    )

    short_name = models.CharField(
        max_length=200,
        unique=True,
        blank=False,
        null=True,
    )

    created_at = models.DateTimeField(
        default=datetime.now(),
        editable=False,
    )

    def __str__(self):
        return self.full_name


class Group(models.Model):
    full_name = models.CharField(
        max_length=200,
        unique=True,
        blank=False,
        null=False,
    )

    short_name = models.CharField(
        max_length=200,
        unique=True,
        blank=False,
        null=False,
    )

    itinerary = models.ForeignKey(
        "school.Itinerary",
        on_delete=models.SET_NULL,
        verbose_name="Itinerário da turma",
        related_name="group",
        blank=True,
        null=True,
    )

    created_at = models.DateTimeField(
        default=datetime.now,
        editable=False,
    )

    def __str__(self):
        return self.full_name


class Professor(models.Model):
    full_name = models.CharField(
        max_length=200,
        verbose_name="Professor's full name",
        null=True,
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
        "school.Subject",
        on_delete=models.SET_NULL,
        verbose_name="Professor's Subject",
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
        on_delete=models.SET_NULL,
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
    name = models.CharField(
        max_length=100,
        blank=False,
        null=True,
    )
    tenant = models.ForeignKey(
        "students.Student",
        on_delete=models.SET_NULL,
        verbose_name="Tenant's name",
        related_name="alugated_book",
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
        on_delete=models.SET_NULL,
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
