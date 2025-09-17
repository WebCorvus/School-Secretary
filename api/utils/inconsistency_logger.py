from school.models import InconsistencyLog
from django.utils import timezone

def log_inconsistency(user=None, form_name=None, error_type=None, error_message=None, data_sent=None):
    InconsistencyLog.objects.create(
        timestamp=timezone.now(),
        user=user,
        form_name=form_name,
        error_type=error_type or "Unknown",
        error_message=error_message or "",
        data_sent=data_sent,
        resolved=False
    )
