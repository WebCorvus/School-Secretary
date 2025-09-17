import logging
from django.contrib.auth.signals import user_logged_in, user_login_failed
from django.dispatch import receiver
from django.utils import timezone

logger = logging.getLogger("login_audit")

@receiver(user_logged_in)
def log_user_logged_in(sender, request, user, **kwargs):
    logger.info({
        "event": "login_success",
        "user_id": user.id,
        "email": user.email,
        "ip": get_client_ip(request),
        "timestamp": timezone.now().isoformat(),
    })

@receiver(user_login_failed)
def log_user_login_failed(sender, credentials, request, **kwargs):
    logger.warning({
        "event": "login_failed",
        "email": credentials.get("email"),
        "ip": get_client_ip(request),
        "timestamp": timezone.now().isoformat(),
    })

def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip
