"""
Signals to automatically trigger notifications
"""
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Warning, Suspension, Tuition
from utils.notifications import (
    notify_guardians_new_warning,
    notify_guardians_new_suspension,
    notify_guardians_overdue_payment,
)


@receiver(post_save, sender=Warning)
def warning_created(sender, instance, created, **kwargs):
    """Send notification when a warning is created"""
    if created:
        notify_guardians_new_warning(instance.student, instance)


@receiver(post_save, sender=Suspension)
def suspension_created(sender, instance, created, **kwargs):
    """Send notification when a suspension is created"""
    if created:
        notify_guardians_new_suspension(instance.student, instance)


@receiver(post_save, sender=Tuition)
def tuition_status_changed(sender, instance, created, **kwargs):
    """Send notification when tuition becomes overdue"""
    if not created and instance.status == 'OVERDUE':
        # Check if status just changed to overdue
        if sender.objects.filter(id=instance.id).exists():
            old_instance = sender.objects.get(id=instance.id)
            if old_instance.status != 'OVERDUE':
                notify_guardians_overdue_payment(instance.student, instance)
