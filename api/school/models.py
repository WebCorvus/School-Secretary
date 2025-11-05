from django.db import models
from django.utils import timezone
from django.conf import settings
from utils.validators import cep_validator, cpf_validator, phone_validator

from utils.date import get_today


class SchoolRecord(models.Model):
    student = models.ForeignKey(
        "accounts.Student",
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
        "accounts.Student",
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


class AgendaItem(models.Model):
    title = models.CharField(verbose_name="Título", max_length=200)
    subject = models.ForeignKey(
        "academics.Subject",
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
    allow_registration = models.BooleanField(
        verbose_name="Permitir inscrição",
        default=False,
    )
    max_participants = models.IntegerField(
        verbose_name="Máximo de participantes",
        null=True,
        blank=True,
    )
    created_at = models.DateTimeField(verbose_name="Criado em", auto_now_add=True)
    updated_at = models.DateTimeField(verbose_name="Atualizado em", auto_now=True)

    class Meta:
        verbose_name = "Evento"
        verbose_name_plural = "Eventos"
        ordering = ["start_date", "start_time"]

    def __str__(self):
        return self.title


class EventRegistration(models.Model):
    event = models.ForeignKey(
        Event,
        on_delete=models.CASCADE,
        verbose_name="Evento",
        related_name="registrations",
    )
    student = models.ForeignKey(
        "accounts.Student",
        on_delete=models.CASCADE,
        verbose_name="Estudante",
        related_name="event_registrations",
    )
    registration_date = models.DateTimeField(
        verbose_name="Data de inscrição",
        auto_now_add=True,
    )

    class Meta:
        verbose_name = "Inscrição em Evento"
        verbose_name_plural = "Inscrições em Eventos"
        unique_together = ["event", "student"]

    def __str__(self):
        return f"{self.student.full_name} - {self.event.title}"


ROOM_TYPE_CHOICES = [
    ("CLASSROOM", "Sala de aula"),
    ("LABORATORY", "Laboratório"),
    ("AUDITORIUM", "Auditório"),
    ("GYM", "Ginásio"),
    ("OTHER", "Outro"),
]


class Room(models.Model):
    name = models.CharField(verbose_name="Nome", max_length=200)
    room_type = models.CharField(
        verbose_name="Tipo",
        max_length=20,
        choices=ROOM_TYPE_CHOICES,
    )
    capacity = models.IntegerField(verbose_name="Capacidade")
    description = models.TextField(
        verbose_name="Descrição",
        blank=True,
        null=True,
    )
    created_at = models.DateTimeField(
        verbose_name="Criado em",
        default=timezone.now,
        editable=False,
    )

    class Meta:
        verbose_name = "Sala"
        verbose_name_plural = "Salas"

    def __str__(self):
        return f"{self.name} ({self.get_room_type_display()})"


class RoomReservation(models.Model):
    room = models.ForeignKey(
        Room,
        on_delete=models.CASCADE,
        verbose_name="Sala",
        related_name="reservations",
    )
    reserved_by = models.ForeignKey(
        "accounts.Professor",
        on_delete=models.CASCADE,
        verbose_name="Reservado por",
        related_name="room_reservations",
    )
    purpose = models.CharField(verbose_name="Finalidade", max_length=200)
    date = models.DateField(verbose_name="Data")
    start_time = models.TimeField(verbose_name="Hora de início")
    end_time = models.TimeField(verbose_name="Hora de término")
    created_at = models.DateTimeField(
        verbose_name="Criado em",
        default=timezone.now,
        editable=False,
    )

    class Meta:
        verbose_name = "Reserva de Sala"
        verbose_name_plural = "Reservas de Salas"

    def __str__(self):
        return f"{self.room.name} - {self.date} - {self.reserved_by.full_name}"


NOTIFICATION_TYPE_CHOICES = [
    ("GRADE", "Nota"),
    ("ABSENCE", "Falta"),
    ("WARNING", "Advertência"),
    ("SUSPENSION", "Suspensão"),
    ("EVENT", "Evento"),
    ("ASSIGNMENT", "Trabalho"),
    ("EXAM", "Prova"),
    ("PAYMENT", "Pagamento"),
    ("GENERAL", "Geral"),
]


class Notification(models.Model):
    recipient = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        verbose_name="Destinatário",
        related_name="notifications",
    )
    notification_type = models.CharField(
        verbose_name="Tipo",
        max_length=20,
        choices=NOTIFICATION_TYPE_CHOICES,
    )
    title = models.CharField(verbose_name="Título", max_length=200)
    message = models.TextField(verbose_name="Mensagem")
    read = models.BooleanField(verbose_name="Lida", default=False)
    created_at = models.DateTimeField(
        verbose_name="Criado em",
        default=timezone.now,
        editable=False,
    )

    class Meta:
        verbose_name = "Notificação"
        verbose_name_plural = "Notificações"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.title} - {self.recipient}"
