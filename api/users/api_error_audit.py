import logging
import traceback
from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status

logger = logging.getLogger("api_error_audit")

def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)
    request = context.get('request')
    user = getattr(request, 'user', None)
    error_detail = None
    error_fields = None
    # Captura detalhes de erros de validação
    if hasattr(exc, 'detail'):
        error_detail = exc.detail
        if isinstance(error_detail, dict):
            error_fields = {k: v for k, v in error_detail.items()}
    try:
        from utils.inconsistency_logger import log_inconsistency
        # Detecta erro de validação (400)
        if response and response.status_code == 400:
            form_name = None
            if request and hasattr(request, 'path'):
                if '/professors/' in request.path:
                    form_name = 'ProfessorForm'
                elif '/students/' in request.path:
                    form_name = 'StudentForm'
                elif '/subjects/' in request.path:
                    form_name = 'SubjectForm'
                else:
                    form_name = request.path
            log_inconsistency(
                user=user if user and getattr(user, 'is_authenticated', False) else None,
                form_name=form_name,
                error_type=type(exc).__name__,
                error_message=str(error_detail) if error_detail else str(exc),
                data_sent=getattr(request, 'data', None)
            )
        # Erros de autenticação (401) e outros (403, 500 etc.)
        elif response and response.status_code == 401:
            log_inconsistency(
                user=None,  # Usuário não autenticado
                form_name=request.path if request else None,
                error_type='AuthenticationFailed',
                error_message=str(exc),
                data_sent=getattr(request, 'data', None)
            )
        elif response and response.status_code >= 400:
            log_inconsistency(
                user=user if user and getattr(user, 'is_authenticated', False) else None,
                form_name=request.path if request else None,
                error_type=type(exc).__name__,
                error_message=str(exc),
                data_sent=getattr(request, 'data', None)
            )
    except Exception as e:
        logger.error(f"Erro ao registrar inconsistencia: {e}")
                data_sent=getattr(request, 'data', None)
            )
        # Erros de autenticação (401) e outros (403, 500 etc.)
        elif response and response.status_code >= 400:
            log_inconsistency(
                user=None,  # Sempre registra, mesmo sem usuário autenticado
                form_name=request.path if request else None,
                error_type=type(exc).__name__,
                error_message=str(exc),
                data_sent=getattr(request, 'data', None)
            )
    except Exception as e:
        logger.error(f"Erro ao registrar inconsistencia: {e}")
    return response or Response({"detail": str(exc)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
