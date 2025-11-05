from django.db import models
from django.utils import timezone
from utils.date import get_current_year, get_today


DAY_CHOICES = [
    (0, "Domingo"),
    (1, "Segunda"),
    (2, "Terça"),
    (3, "Quarta"),
    (4, "Quinta"),
    (5, "Sexta"),
    (6, "Sábado"),
]

BIMESTER_CHOICES = [
    ("1B", "1º Bimestre"),
    ("2B", "2º Bimestre"),
    ("3B", "3º Bimestre"),
    ("4B", "4º Bimestre"),
]


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
        db_table = "school_subject"


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
        db_table = "school_itinerary"


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
        "academics.Itinerary",
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
        db_table = "school_group"


class Lesson(models.Model):
    group = models.ForeignKey(
        "academics.Group",
        on_delete=models.SET_NULL,
        verbose_name="Turma",
        related_name="lessons",
        null=True,
        blank=False,
    )

    professor = models.ForeignKey(
        "accounts.Professor",
        on_delete=models.SET_NULL,
        verbose_name="Professor",
        related_name="lessons",
        null=True,
        blank=False,
    )
    subject = models.ForeignKey(
        "academics.Subject",
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
        db_table = "school_lesson"


class WeeklyLessonPlan(models.Model):
    """Weekly lesson planning for professors"""
    professor = models.ForeignKey(
        "accounts.Professor",
        on_delete=models.CASCADE,
        verbose_name="Professor",
        related_name="weekly_plans",
    )
    lesson = models.ForeignKey(
        "academics.Lesson",
        on_delete=models.CASCADE,
        verbose_name="Aula",
        related_name="weekly_plans",
    )
    week_start_date = models.DateField(verbose_name="Início da semana")
    planning_content = models.TextField(
        verbose_name="Planejamento",
        help_text="Conteúdo programado para a semana"
    )
    objectives = models.TextField(
        verbose_name="Objetivos",
        blank=True,
        null=True,
        help_text="Objetivos de aprendizagem da semana"
    )
    resources_needed = models.TextField(
        verbose_name="Recursos necessários",
        blank=True,
        null=True,
        help_text="Materiais e recursos necessários"
    )
    notes = models.TextField(
        verbose_name="Observações",
        blank=True,
        null=True,
    )
    created_at = models.DateTimeField(verbose_name="Criado em", auto_now_add=True)
    updated_at = models.DateTimeField(verbose_name="Atualizado em", auto_now=True)

    class Meta:
        verbose_name = "Planejamento Semanal"
        verbose_name_plural = "Planejamentos Semanais"
        ordering = ["-week_start_date"]
        unique_together = ["lesson", "week_start_date"]
        db_table = "school_weeklylessonplan"

    def __str__(self):
        return f"{self.professor.full_name} - {self.lesson} - Semana de {self.week_start_date}"


class Grade(models.Model):
    student = models.ForeignKey(
        "accounts.Student",
        on_delete=models.SET_NULL,
        verbose_name="Estudante",
        related_name="grade",
        blank=False,
        null=True,
    )

    subject = models.ForeignKey(
        "academics.Subject",
        on_delete=models.SET_NULL,
        verbose_name="Matéria",
        related_name="grade",
        blank=False,
        null=True,
    )

    year = models.IntegerField(
        verbose_name="Ano", blank=False, null=True, default=get_current_year
    )

    bimester = models.CharField(
        verbose_name="Bimestre",
        max_length=20,
        choices=BIMESTER_CHOICES,
        blank=False,
        null=True,
    )

    value = models.FloatField(verbose_name="Valor", blank=False, null=True)

    created_at = models.DateTimeField(
        verbose_name="Criado em",
        default=timezone.now,
        editable=False,
    )

    def __str__(self):
        if self.student:
            return f"{self.student.full_name}'s Bulletin"
        return "Grade (sem estudante)"

    class Meta:
        verbose_name = "Nota"
        verbose_name_plural = "Notas"
        db_table = "students_grade"


class Presence(models.Model):
    student = models.ForeignKey(
        "accounts.Student",
        on_delete=models.SET_NULL,
        verbose_name="Estudante",
        related_name="presence",
        blank=False,
        null=True,
    )
    date = models.DateField(verbose_name="Data", default=get_today)
    presence = models.BooleanField(verbose_name="Presença")
    created_at = models.DateTimeField(
        verbose_name="Criado em",
        default=timezone.now,
        editable=False,
    )

    def __str__(self):
        return f"Presence_{self.student}"

    class Meta:
        verbose_name = "Presença"
        verbose_name_plural = "Presenças"
        db_table = "students_presence"


class Enrollment(models.Model):
    ENROLLMENT_STATUS_CHOICES = [
        ("PENDING", "Pendente"),
        ("APPROVED", "Aprovado"),
        ("REJECTED", "Rejeitado"),
    ]

    student = models.ForeignKey(
        "accounts.Student",
        on_delete=models.CASCADE,
        verbose_name="Estudante",
        related_name="enrollments",
    )
    group = models.ForeignKey(
        "academics.Group",
        on_delete=models.CASCADE,
        verbose_name="Turma",
    )
    year = models.IntegerField(
        verbose_name="Ano",
        default=get_current_year,
    )
    status = models.CharField(
        verbose_name="Status",
        max_length=20,
        choices=ENROLLMENT_STATUS_CHOICES,
        default="PENDING",
    )
    enrollment_date = models.DateField(
        verbose_name="Data de matrícula",
        default=get_today,
    )
    is_reenrollment = models.BooleanField(
        verbose_name="É rematrícula",
        default=False,
    )
    created_at = models.DateTimeField(
        verbose_name="Criado em",
        default=timezone.now,
        editable=False,
    )

    def __str__(self):
        return f"Matrícula - {self.student.full_name} - {self.year}"

    class Meta:
        verbose_name = "Matrícula"
        verbose_name_plural = "Matrículas"
        db_table = "students_enrollment"
