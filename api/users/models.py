from django.contrib.auth.models import (
    AbstractBaseUser,
    BaseUserManager,
    PermissionsMixin,
)
from django.db import models


class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("The Email field must be set")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        if password:
            user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("role", User.Role.SUPERUSER)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")
        if extra_fields.get("role") is not User.Role.SUPERUSER:
            raise ValueError("Superuser must have role of Superuser.")

        return self.create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    class Role(models.TextChoices):
        STUDENT = "STUDENT", "Estudante"
        GUARDIAN = "GUARDIAN", "Responsável"
        PROFESSOR = "PROFESSOR", "Professor"
        STAFF = "STAFF", "Equipe"
        SUPERUSER = "SUPERUSER", "Superusuário"

    email = models.EmailField(verbose_name="Email", unique=True)
    name = models.CharField(verbose_name="Nome", max_length=255)
    role = models.CharField(
        verbose_name="Cargo", max_length=50, choices=Role.choices, default=Role.STUDENT
    )
    is_staff = models.BooleanField(verbose_name="Membro da equipe", default=False)
    is_active = models.BooleanField(verbose_name="Ativo", default=True)

    objects = UserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["name"]

    @property
    def profile(self):
        if self.role == self.Role.STUDENT:
            return getattr(self, "student_profile", None)
        if self.role == self.Role.GUARDIAN:
            return getattr(self, "guardian_profile", None)
        if self.role == self.Role.PROFESSOR:
            return getattr(self, "professor_profile", None)
        return None

    def save(self, *args, **kwargs):
        if self.role == self.Role.SUPERUSER:
            self.is_staff = True
            self.is_superuser = True
        elif self.role == self.Role.STAFF:
            self.is_staff = True
            self.is_superuser = False
        else:
            self.is_staff = False
            self.is_superuser = False
        super().save(*args, **kwargs)

    def __str__(self):
        return self.email

    class Meta:
        verbose_name = "Usuário"
        verbose_name_plural = "Usuários"
