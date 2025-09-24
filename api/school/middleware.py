import logging
from django.utils.deprecation import MiddlewareMixin

import threading
import time
from datetime import datetime

class LogUserExceptionMiddleware(MiddlewareMixin):
    _monitoring_started = False

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if not LogUserExceptionMiddleware._monitoring_started:
            LogUserExceptionMiddleware._monitoring_started = True
            threading.Thread(target=self._monitor, daemon=True).start()

    def process_response(self, request, response):
        # Detecta login no endpoint de token
        if request.path.endswith('/api/users/token/') and response.status_code == 200:
            import json
            try:
                data = json.loads(response.content)
                access = data.get('access')
                refresh = data.get('refresh')
            except Exception:
                access = refresh = None
            timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            logging.info(f"[{timestamp}] Login detectado: token_access='{access}', token_refresh='{refresh}'")

        # Detecta criação, edição e deleção de dados
        user = getattr(request, 'user', None)
        username = getattr(user, 'username', None) if user and hasattr(user, 'is_authenticated') and user.is_authenticated else None
        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        # Só loga se for usuário autenticado e tiver username
        if username:
            # Criação
            if request.method == 'POST' and response.status_code in [200, 201]:
                logging.info(f"[{timestamp}] CRIAÇÃO detectada por '{username}' no endpoint '{request.path}'")
            # Edição
            if request.method in ['PUT', 'PATCH'] and response.status_code in [200, 202]:
                logging.info(f"[{timestamp}] EDIÇÃO detectada por '{username}' no endpoint '{request.path}'")
            # Deleção
            if request.method == 'DELETE' and response.status_code in [200, 204]:
                logging.info(f"[{timestamp}] DELETE detectado por '{username}' no endpoint '{request.path}'")
        return response

    def _monitor(self):
        YELLOW = '\033[93m'
        RESET = '\033[0m'
        while True:
            timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            print(f"{YELLOW}[{timestamp}] monitorando...{RESET}")
            logging.info(f"[{timestamp}] monitorando...")
            time.sleep(5)  # Loga a cada 5 segundos

    def process_exception(self, request, exception):
        user = getattr(request, 'user', None)
        username = user.username if user and user.is_authenticated else 'Anonymous'
        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        logging.error(f"[{timestamp}] Exception for user '{username}': {exception}")
        return None
