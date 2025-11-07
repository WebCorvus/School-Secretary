"""
Signals to automatically trigger notifications for school events
"""

from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import AgendaItem
from students.models import Student
from utils.notifications import (
    notify_student_new_assignment,
    notify_students_upcoming_exam,
)

from .models import AgendaItem


@receiver(post_save, sender=AgendaItem)
def agenda_item_created(sender, instance, created, **kwargs):
    """Send notification when an agenda item is created"""
    if created and instance.subject:
        # Determine which students to notify based on the subject
        # For now, notify all students (can be refined to notify only students in relevant groups)

        # Check if it's an exam (based on title or description containing "prova" or "exame")
        is_exam = any(
            keyword in instance.title.lower()
            for keyword in ["prova", "exame", "teste", "avaliação"]
        )

        if is_exam:
            # Get all groups and notify students in those groups
            from school.models import Group

            groups = Group.objects.all()
            for group in groups:
                notify_students_upcoming_exam(group, instance)
        else:
            # Regular assignment - notify individual students
            students = Student.objects.all()
            for student in students:
                notify_student_new_assignment(student, instance)
