"""
Django management command to send periodic notifications
Run this command daily via cron or scheduler to check and send notifications
"""

from django.core.management.base import BaseCommand
from utils.notifications import (
    check_and_send_absence_notifications,
    check_and_send_grade_notifications,
    check_and_send_overdue_payment_notifications,
    send_upcoming_event_notifications,
)


class Command(BaseCommand):
    help = "Check students and send notifications for absences, grades, payments, and events"

    def add_arguments(self, parser):
        parser.add_argument(
            "--absences",
            action="store_true",
            help="Check and send absence notifications",
        )
        parser.add_argument(
            "--grades",
            action="store_true",
            help="Check and send low grade notifications",
        )
        parser.add_argument(
            "--payments",
            action="store_true",
            help="Check and send overdue payment notifications",
        )
        parser.add_argument(
            "--events",
            action="store_true",
            help="Send upcoming event notifications",
        )
        parser.add_argument(
            "--all",
            action="store_true",
            help="Send all types of notifications",
        )

    def handle(self, *args, **options):
        notifications_sent = 0

        if options["all"] or options["absences"]:
            self.stdout.write("Checking absence rates...")
            notifs = check_and_send_absence_notifications()
            notifications_sent += len(notifs)
            self.stdout.write(
                self.style.SUCCESS(f"  Sent {len(notifs)} absence notifications")
            )

        if options["all"] or options["grades"]:
            self.stdout.write("Checking grades...")
            notifs = check_and_send_grade_notifications()
            notifications_sent += len(notifs)
            self.stdout.write(
                self.style.SUCCESS(f"  Sent {len(notifs)} grade notifications")
            )

        if options["all"] or options["payments"]:
            self.stdout.write("Checking overdue payments...")
            notifs = check_and_send_overdue_payment_notifications()
            notifications_sent += len(notifs)
            self.stdout.write(
                self.style.SUCCESS(f"  Sent {len(notifs)} payment notifications")
            )

        if options["all"] or options["events"]:
            self.stdout.write("Checking upcoming events...")
            notifs = send_upcoming_event_notifications(days_ahead=7)
            notifications_sent += len(notifs)
            self.stdout.write(
                self.style.SUCCESS(f"  Sent {len(notifs)} event notifications")
            )

        self.stdout.write(
            self.style.SUCCESS(f"\nTotal notifications sent: {notifications_sent}")
        )
