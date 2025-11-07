"""
Utility functions for automatic notification creation
"""
from school.models import Notification
from students.models import Student
from academics.models import Grade, Presence
from students.models import Warning, Suspension, Tuition
from django.db.models import Avg
from datetime import timedelta

from django.db.models import Avg
from django.utils import timezone

from school.models import Notification
from students.models import Grade, Presence, Student, Suspension, Tuition, Warning


def create_notification(recipient, notification_type, title, message):
    """Create a notification for a user"""
    return Notification.objects.create(
        recipient=recipient,
        notification_type=notification_type,
        title=title,
        message=message,
    )


def notify_guardians_high_absences(student):
    """Notify guardians when student has high absence rate (>25%)"""
    total_days = Presence.objects.filter(student=student).count()
    if total_days == 0:
        return []

    absences = Presence.objects.filter(student=student, presence=False).count()
    absence_rate = (absences / total_days) * 100

    if absence_rate > 25:
        notifications = []
        guardians = student.guardians.all()

        for guardian in guardians:
            notification = create_notification(
                recipient=guardian.user,
                notification_type="ABSENCE",
                title=f"Taxa de Faltas Elevada - {student.full_name}",
                message=f"O aluno(a) {student.full_name} apresenta taxa de faltas de {absence_rate:.2f}%, "
                f"acima do limite de 25%. Total de faltas: {absences} de {total_days} dias letivos. "
                f"É necessário acompanhamento.",
            )
            notifications.append(notification)

        return notifications

    return []


def notify_guardians_low_grades(student):
    """Notify guardians when student has low grades (average < 6.0)"""
    grades = Grade.objects.filter(student=student)

    if not grades.exists():
        return []

    avg_grade = grades.aggregate(Avg("value"))["value__avg"]

    if avg_grade and avg_grade < 6.0:
        notifications = []
        guardians = student.guardians.all()

        for guardian in guardians:
            notification = create_notification(
                recipient=guardian.user,
                notification_type="GRADE",
                title=f"Desempenho Acadêmico - {student.full_name}",
                message=f"O aluno(a) {student.full_name} está com média geral de {avg_grade:.2f}, "
                f"abaixo do esperado. Recomendamos acompanhamento e reforço nos estudos.",
            )
            notifications.append(notification)

        return notifications

    return []


def notify_guardians_new_warning(student, warning):
    """Notify guardians when student receives a warning"""
    notifications = []
    guardians = student.guardians.all()

    for guardian in guardians:
        notification = create_notification(
            recipient=guardian.user,
            notification_type="WARNING",
            title=f"Nova Advertência - {student.full_name}",
            message=f"O aluno(a) {student.full_name} recebeu uma advertência em {warning.date.strftime('%d/%m/%Y')}. "
            f"Motivo: {warning.reason}",
        )
        notifications.append(notification)

    return notifications


def notify_guardians_new_suspension(student, suspension):
    """Notify guardians when student receives a suspension"""
    notifications = []
    guardians = student.guardians.all()

    for guardian in guardians:
        notification = create_notification(
            recipient=guardian.user,
            notification_type="SUSPENSION",
            title=f"Suspensão - {student.full_name}",
            message=f"O aluno(a) {student.full_name} foi suspenso(a) do dia "
            f"{suspension.start_date.strftime('%d/%m/%Y')} até {suspension.end_date.strftime('%d/%m/%Y')}. "
            f"Motivo: {suspension.reason}",
        )
        notifications.append(notification)

    return notifications


def notify_guardians_overdue_payment(student, tuition):
    """Notify guardians about overdue payment"""
    notifications = []
    guardians = student.guardians.all()

    for guardian in guardians:
        notification = create_notification(
            recipient=guardian.user,
            notification_type="PAYMENT",
            title=f"Mensalidade Vencida - {student.full_name}",
            message=f"A mensalidade de {tuition.reference_month.strftime('%m/%Y')} do aluno(a) {student.full_name} "
            f"está vencida desde {tuition.due_date.strftime('%d/%m/%Y')}. "
            f"Valor: R$ {tuition.amount:.2f}. Por favor, regularize o pagamento.",
        )
        notifications.append(notification)

    return notifications


def notify_guardians_upcoming_event(student, event):
    """Notify guardians and student about upcoming event"""
    notifications = []
    guardians = student.guardians.all()

    # Notify guardians
    for guardian in guardians:
        notification = create_notification(
            recipient=guardian.user,
            notification_type="EVENT",
            title=f"Evento Próximo - {event.title}",
            message=f'Evento "{event.title}" acontecerá em {event.start_date.strftime("%d/%m/%Y")}. '
            f"Local: {event.location or 'A definir'}. {event.description or ''}",
        )
        notifications.append(notification)

    # Notify student
    if student.user:
        notification = create_notification(
            recipient=student.user,
            notification_type="EVENT",
            title=f"Evento Próximo - {event.title}",
            message=f'Não esqueça! Evento "{event.title}" em {event.start_date.strftime("%d/%m/%Y")}. '
            f"Local: {event.location or 'A definir'}.",
        )
        notifications.append(notification)

    return notifications


def notify_student_new_assignment(student, agenda_item):
    """Notify student about new assignment"""
    notifications = []

    if student.user:
        notification = create_notification(
            recipient=student.user,
            notification_type="ASSIGNMENT",
            title=f"Nova Atividade - {agenda_item.subject.full_name}",
            message=f"Nova atividade em {agenda_item.subject.full_name}: {agenda_item.title}. "
            f"Data de entrega: {agenda_item.date.strftime('%d/%m/%Y')}. "
            f"{agenda_item.description or ''}",
        )
        notifications.append(notification)

    return notifications


def notify_students_upcoming_exam(group, agenda_item):
    """Notify all students in group about upcoming exam"""
    notifications = []
    students = group.students.all()

    for student in students:
        if student.user:
            notification = create_notification(
                recipient=student.user,
                notification_type="EXAM",
                title=f"Prova Agendada - {agenda_item.subject.full_name}",
                message=f"Prova de {agenda_item.subject.full_name}: {agenda_item.title}. "
                f"Data: {agenda_item.date.strftime('%d/%m/%Y')}. "
                f"Horário: {agenda_item.time.strftime('%H:%M') if agenda_item.time else 'A definir'}. "
                f"{agenda_item.description or ''}",
            )
            notifications.append(notification)

    return notifications


def check_and_send_absence_notifications():
    """Check all students and send notifications for high absence rates"""
    notifications_sent = []

    for student in Student.objects.all():
        notifs = notify_guardians_high_absences(student)
        notifications_sent.extend(notifs)

    return notifications_sent


def check_and_send_grade_notifications():
    """Check all students and send notifications for low grades"""
    notifications_sent = []

    for student in Student.objects.all():
        notifs = notify_guardians_low_grades(student)
        notifications_sent.extend(notifs)

    return notifications_sent


def check_and_send_overdue_payment_notifications():
    """Check all overdue tuitions and send notifications"""
    notifications_sent = []

    overdue_tuitions = Tuition.objects.filter(
        status="OVERDUE", due_date__lt=timezone.now().date()
    )

    for tuition in overdue_tuitions:
        notifs = notify_guardians_overdue_payment(tuition.student, tuition)
        notifications_sent.extend(notifs)

    return notifications_sent


def send_upcoming_event_notifications(days_ahead=7):
    """Send notifications for events happening in the next N days"""
    from school.models import Event

    notifications_sent = []
    upcoming_date = timezone.now().date() + timedelta(days=days_ahead)

    upcoming_events = Event.objects.filter(
        start_date__lte=upcoming_date, start_date__gte=timezone.now().date()
    )

    for event in upcoming_events:
        # Send to all students
        for student in Student.objects.all():
            notifs = notify_guardians_upcoming_event(student, event)
            notifications_sent.extend(notifs)

    return notifications_sent
