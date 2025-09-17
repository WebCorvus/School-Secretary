import logging
import traceback
from django.utils.deprecation import MiddlewareMixin

logger = logging.getLogger("api_error_audit")

class APILogExceptionMiddleware(MiddlewareMixin):
    def process_exception(self, request, exception):
        import json
        user = getattr(request, 'user', None)
        log_data = {
            "event": "api_exception_middleware",
            "path": request.path,
            "method": request.method,
            "user": str(user) if user and hasattr(user, 'is_authenticated') and user.is_authenticated else None,
            "error": str(exception),
            "data": getattr(request, 'data', None),
            "query_params": getattr(request, 'query_params', None),
            "traceback": traceback.format_exc(limit=3),
        }
        # Grava diretamente no arquivo garantido
        with open('/workspaces/School-Secretary/api/api_error_audit.log', 'a') as f:
            f.write(json.dumps(log_data, ensure_ascii=False) + '\n')
        # Não interfere no tratamento padrão do Django/DRF
        return None
