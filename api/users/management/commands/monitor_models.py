import psycopg2
from psycopg2 import sql
from .db_utils_pg import ensure_staff_user, DB_TABLES, STAFF_EMAIL, STAFF_PASSWORD
from datetime import datetime


from django.core.management.base import BaseCommand
from django.core.management import call_command
import time
import requests
from django.conf import settings

API_BASE_URL = "http://api:8000/"  # Ajuste para ambiente Docker Compose
CHECK_INTERVAL = 5  # segundos

# Endpoints REST corretos para monitoramento
ENDPOINTS = [
    ("users", "api/users/"),
    ("students", "api/students/"),
    ("professors", "api/school/professors/"),
    ("subjects", "api/school/subjects/"),
    ("itineraries", "api/school/itineraries/"),
    ("groups", "api/school/groups/"),
    ("schoolrecords", "api/school/schoolrecords/"),
    ("books", "api/school/books/"),
    ("lessons", "api/school/lessons/"),
    ("agenda", "api/school/agenda/"),
    ("events", "api/school/events/"),
]




def get_jwt_token():
    ensure_staff_user()
    url = f"{API_BASE_URL}api/users/token/"
    data = {"email": STAFF_EMAIL, "password": STAFF_PASSWORD}
    try:
        response = requests.post(url, json=data)
        if response.status_code == 200:
            return response.json().get("access")
        else:
            print(f"Erro ao autenticar: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"Erro ao obter token JWT: {e}")
    return None


class Command(BaseCommand):
    def print_inconsistencies(self, last_id):
        from django.db import connection
        with connection.cursor() as cursor:
            cursor.execute("SELECT i.id, i.timestamp, i.form_name, i.error_type, i.error_message, i.resolved, u.email FROM school_inconsistencylog i LEFT JOIN users_user u ON i.user_id = u.id WHERE i.id > %s ORDER BY i.id ASC;", [last_id])
            rows = cursor.fetchall()
            print('\033[93m===== INCONSISTÊNCIAS RECENTES =====\033[0m')
            if rows:
                for r in rows:
                    user_email = r[6] if r[6] else 'Desconhecido'
                    print(f"\033[1;36m[INCONSISTÊNCIA]\033[0m")
                    print(f"  \033[1;33mData/Hora:\033[0m {r[1]}")
                    print(f"  \033[1;33mUsuário:\033[0m \033[1;35m{user_email}\033[0m")
                    print(f"  \033[1;33mFormulário:\033[0m {r[2]}")
                    print(f"  \033[1;33mTipo:\033[0m {r[3]}")
                    print(f"  \033[1;33mResolvido:\033[0m {r[5]}")
                    print(f"  \033[1;33mMensagem:\033[0m {r[4]}")
                    print("  " + "-"*60)
                last_id = rows[-1][0]
            else:
                print('(Nenhuma inconsistência nova)')
            print('\033[93m====================================\033[0m')
        return last_id
    help = "Monitora e imprime entradas/remoções de modelos periodicamente usando as APIs."

    def print_api_errors(self):
        log_path = '/tmp/api_error_audit.log'
        import os
        if os.path.exists(log_path):
            try:
                with open(log_path, 'r') as f:
                    lines = f.readlines()[-10:]  # últimos 10 erros
                    print('\033[91m===== ERROS DE API RECENTES =====\033[0m')
                    if lines:
                        for line in lines:
                            print(line.strip())
                    else:
                        print('(Nenhum erro registrado)')
                    print('\033[91m=================================\033[0m')
            except Exception as e:
                print(f"Erro ao ler api_error_audit.log: {e}")


    def handle(self, *args, **options):
        import json
        print("Iniciando monitoramento de entradas/remoções de models via API e Banco de Dados...")
        token = get_jwt_token()
        if not token:
            print("Não foi possível autenticar. Verifique as credenciais STAFF_EMAIL e STAFF_PASSWORD.")
            return
        headers = {"Authorization": f"Bearer {token}"}
        def print_table(headers, rows):
            # Formatação simples de tabela
            col_widths = [max(len(str(x)) for x in col) for col in zip(headers, *rows)]
            fmt = "| " + " | ".join(f"{{:<{w}}}" for w in col_widths) + " |"
            sep = "+" + "+".join("-" * (w + 2) for w in col_widths) + "+"
            print(sep)
            print(fmt.format(*headers))
            print(sep)
            for row in rows:
                print(fmt.format(*row))
            print(sep)

        db_settings = settings.DATABASES['default']
        last_api_counts = {}
        last_api_snapshots = {}
        last_db_counts = {}
        last_db_snapshots = {}

        def log_structured(event_type, context):
            # Logging estruturado em JSON
            print(json.dumps({"event": event_type, **context}, ensure_ascii=False, default=str))

        last_id = 0
        import atexit
        def cleanup():
            print('\nLimpando inconsistências...')
            from django.db import connection
            try:
                with connection.cursor() as cursor:
                    cursor.execute("DELETE FROM school_inconsistencylog;")
                print('Inconsistências apagadas. Saindo.')
            except Exception as e:
                print(f'Erro ao apagar inconsistências: {e}')
        atexit.register(cleanup)

        try:
            while True:
                self.print_api_errors()
                last_id = self.print_inconsistencies(last_id)
                nowstr = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                print(f"[console] [{nowstr}] analizando...")
                # ...existing code...
                time.sleep(CHECK_INTERVAL)
        except KeyboardInterrupt:
            pass

