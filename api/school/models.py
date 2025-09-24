from django.db.models.signals import post_save, post_delete
from django.contrib.auth import get_user_model
from django.dispatch import receiver

# Logging for admin actions
import logging
from datetime import datetime

def get_admin_username(instance):
    # Try to get user from instance._state, fallback to None
    user = getattr(instance._state, 'user', None)
    return getattr(user, 'username', None) if user and hasattr(user, 'username') else None

@receiver(post_save)
def log_admin_create_update(sender, instance, created, **kwargs):
    # Only log for models in this app
    if sender.__module__.startswith('school.models'):
        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        username = get_admin_username(instance)
        if username:
            if created:
                logging.info(f"[{timestamp}] [ADMIN] CRIAÇÃO detectada por '{username}' no model '{sender.__name__}' (id={instance.pk})")
            else:
                logging.info(f"[{timestamp}] [ADMIN] EDIÇÃO detectada por '{username}' no model '{sender.__name__}' (id={instance.pk})")

@receiver(post_delete)
def log_admin_delete(sender, instance, **kwargs):
    if sender.__module__.startswith('school.models'):
        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        username = get_admin_username(instance)
        if username:
            logging.info(f"[{timestamp}] [ADMIN] DELETE detectado por '{username}' no model '{sender.__name__}' (id={instance.pk})")
from django.db import models
from django.utils import timezone
from utils.validators import cep_validator, cpf_validator, phone_validator

from utils.date import get_today

DAY_CHOICES = [
    (0, "Domingo"),
    (1, "Segunda"),
    (2, "Terça"),
    (3, "Quarta"),
    (4, "Quinta"),
    (5, "Sexta"),
    (6, "Sábado"),
]

LESSONS_PER_DAY = 6


class Subject(models.Model):
    short_name = models.CharField(
        verbose_name="Nome curto",
        max_length=200,
        unique=True,
        blank=False,
        null=True,
    )

    full_name = models.CharField(
        verbose_name="Nome completo",
        max_length=200,
        unique=True,
        blank=False,
        null=True,
    )

    created_at = models.DateTimeField(
        verbose_name="Criado em",
        default=timezone.now,
        editable=False,
    )

    def __str__(self):
        return self.full_name

    class Meta:
        verbose_name = "Matéria"
        verbose_name_plural = "Matérias"


class Itinerary(models.Model):
    full_name = models.CharField(
        verbose_name="Nome completo",
        max_length=200,
        unique=True,
        blank=False,
        null=True,
    )

    short_name = models.CharField(
        verbose_name="Nome curto",
        max_length=200,
        unique=True,
        blank=False,
        null=True,
    )

    created_at = models.DateTimeField(
        verbose_name="Criado em",
        default=timezone.now,
        editable=False,
    )

    def __str__(self):
        return self.full_name

    class Meta:
        verbose_name = "Itinerário"
        verbose_name_plural = "Itinerários"


class Group(models.Model):
    full_name = models.CharField(
        verbose_name="Nome completo",
        max_length=200,
        unique=True,
        null=True,
    )

    short_name = models.CharField(
        verbose_name="Nome curto",
        max_length=200,
        unique=True,
        null=True,
    )

    itinerary = models.ForeignKey(
        "school.Itinerary",
        on_delete=models.SET_NULL,
        verbose_name="Itinerário",
        related_name="group",
        blank=True,
        null=True,
    )

    created_at = models.DateTimeField(
        verbose_name="Criado em",
        default=timezone.now,
        editable=False,
    )

    def __str__(self):
        return self.full_name

    class Meta:
        verbose_name = "Turma"
        verbose_name_plural = "Turmas"


class Professor(models.Model):
    from django.conf import settings

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
        "Subject",
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


class SchoolRecord(models.Model):
    student = models.ForeignKey(
        "students.Student",
        on_delete=models.SET_NULL,
        verbose_name="Estudante",
        related_name="school_record",
        blank=False,
        null=True,
    )

    description = models.TextField(
        verbose_name="Descrição",
        blank=False,
        null=True,
    )

    created_at = models.DateTimeField(
        verbose_name="Criado em",
        default=timezone.now,
        editable=False,
    )

    class Meta:
        verbose_name = "Registro Escolar"
        verbose_name_plural = "Registros Escolares"


class Book(models.Model):
    name = models.CharField(
        verbose_name="Nome",
        max_length=100,
        blank=False,
        null=True,
    )
    tenant = models.ForeignKey(
        "students.Student",
        on_delete=models.SET_NULL,
        verbose_name="Locatário",
        related_name="alugated_book",
        blank=False,
        null=True,
    )

    author = models.CharField(
        verbose_name="Autor",
        max_length=100,
        blank=False,
        null=True,
    )

    summary = models.TextField(
        verbose_name="Resumo",
        max_length=200,
        blank=False,
        null=True,
    )

    created_at = models.DateTimeField(
        verbose_name="Criado em",
        default=timezone.now,
        editable=False,
    )

    class Meta:
        verbose_name = "Livro"
        verbose_name_plural = "Livros"


class Lesson(models.Model):
    group = models.ForeignKey(
        "school.Group",
        on_delete=models.SET_NULL,
        verbose_name="Turma",
        related_name="lessons",
        null=True,
        blank=False,
    )

    professor = models.ForeignKey(
        "school.Professor",
        on_delete=models.SET_NULL,
        verbose_name="Professor",
        related_name="lessons",
        null=True,
        blank=False,
    )
    subject = models.ForeignKey(
        "school.Subject",
        on_delete=models.SET_NULL,
        verbose_name="Disciplina",
        related_name="lessons",
        null=True,
        blank=False,
    )
    time = models.IntegerField(
        verbose_name="Horário (1 a 6)",
        null=True,
    )
    day = models.IntegerField(
        verbose_name="Dia",
        choices=DAY_CHOICES,
        null=True,
    )
    created_at = models.DateTimeField(
        verbose_name="Criado em",
        default=timezone.now,
        editable=False,
    )

    def __str__(self):
        return f"{self.professor} - {self.subject} - {self.get_day_display()} - {self.time}"

    class Meta:
        verbose_name = "Aula"
        verbose_name_plural = "Aulas"


class AgendaItem(models.Model):
    title = models.CharField(verbose_name="Título", max_length=200)
    subject = models.ForeignKey(
        "school.Subject",
        on_delete=models.SET_NULL,
        verbose_name="Matéria",
        related_name="agenda_item",
        null=True,
        blank=False,
    )
    description = models.TextField(verbose_name="Descrição", blank=True, null=True)
    date = models.DateField(verbose_name="Data")
    time = models.TimeField(verbose_name="Hora", blank=True, null=True)
    created_at = models.DateTimeField(verbose_name="Criado em", auto_now_add=True)
    updated_at = models.DateTimeField(verbose_name="Atualizado em", auto_now=True)

    class Meta:
        verbose_name = "Item da Agenda"
        verbose_name_plural = "Itens da Agenda"
        ordering = ["date", "time"]

    def __str__(self):
        return self.title


class Event(models.Model):
    title = models.CharField(verbose_name="Título", max_length=200)
    description = models.TextField(verbose_name="Descrição", blank=True, null=True)
    location = models.CharField(
        verbose_name="Local", max_length=200, blank=True, null=True
    )
    start_date = models.DateField(verbose_name="Data de início", default=get_today)
    end_date = models.DateField(
        verbose_name="Data de término",
        default=get_today,
        blank=True,
        null=True,
    )
    start_time = models.TimeField(verbose_name="Hora de início", blank=True, null=True)
    end_time = models.TimeField(verbose_name="Hora de término", blank=True, null=True)
    created_at = models.DateTimeField(verbose_name="Criado em", auto_now_add=True)
    updated_at = models.DateTimeField(verbose_name="Atualizado em", auto_now=True)

    class Meta:
        verbose_name = "Evento"
        verbose_name_plural = "Eventos"
        ordering = ["start_date", "start_time"]

    def __str__(self):
        return self.title
