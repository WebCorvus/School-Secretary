from django import forms
from django.contrib.auth.forms import UserChangeForm, UserCreationForm

from .models import User


class CustomUserCreationForm(UserCreationForm):
    class Meta(UserCreationForm.Meta):
        model = User
        fields = ("email", "name", "role", "password", "password2")


class CustomUserChangeForm(UserChangeForm):
    class Meta:
        model = User
        fields = ("email", "name", "role", "is_active", "is_staff", "is_superuser")
