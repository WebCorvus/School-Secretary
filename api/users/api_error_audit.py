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
    log_data = {
        "event": "api_exception",
        "path": request.path if request else None,
        "method": request.method if request else None,
        "user": str(user) if user and user.is_authenticated else None,
        "status_code": response.status_code if response else None,
        "error": str(exc),
        "error_detail": error_detail,
        "error_fields": error_fields,
        "data": getattr(request, 'data', None),
        "query_params": getattr(request, 'query_params', None),
        "traceback": traceback.format_exc(limit=3),
    }
    logger.error(log_data)
    return response or Response({"detail": str(exc)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
