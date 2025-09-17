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

        while True:
            self.print_api_errors()
            nowstr = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            print(f"[console] [{nowstr}] analizando...")

            # Monitoramento das APIs
            for key, endpoint in ENDPOINTS:
                url = f"{API_BASE_URL}{endpoint}"
                try:
                    response = requests.get(url, headers=headers)
                    if response.status_code == 200:
                        data = response.json()
                        # Suporte para pagination padrão DRF
                        if isinstance(data, dict) and "results" in data:
                            results = data["results"]
                            count = data.get("count", len(results))
                        elif isinstance(data, list):
                            results = data
                            count = len(data)
                        else:
                            results = []
                            count = data.get("count", 0)
                        # Detecta updates comparando snapshots
                        id_field = "id" if results and "id" in results[0] else None
                        if id_field:
                            prev_snapshot = {r[id_field]: r for r in last_api_snapshots.get(key, [])}
                            curr_snapshot = {r[id_field]: r for r in results}
                            updated = []
                            for rid, curr_row in curr_snapshot.items():
                                if rid in prev_snapshot and curr_row != prev_snapshot[rid]:
                                    # Detecta campos alterados
                                    changes = {k: (prev_snapshot[rid][k], curr_row[k]) for k in curr_row if k in prev_snapshot[rid] and curr_row[k] != prev_snapshot[rid][k]}
                                    updated.append({"id": rid, "changes": changes})
                            if updated:
                                log_structured("api_update", {
                                    "timestamp": nowstr,
                                    "model": key,
                                    "endpoint": endpoint,
                                    "action": "update",
                                    "count": len(updated),
                                    "user": STAFF_EMAIL,
                                    "updates": updated
                                })
                                print(f"[API][{nowstr}] Modificação(ões) detectadas em {key}: {len(updated)}")
                                for upd in updated:
                                    print(f"  - id={upd['id']} alterações: {upd['changes']}")
                            last_api_snapshots[key] = results
                        # Inserção/remoção
                        if key in last_api_counts:
                            diff = count - last_api_counts[key]
                            if diff > 0:
                                log_structured("api_insert", {
                                    "timestamp": nowstr,
                                    "model": key,
                                    "endpoint": endpoint,
                                    "action": "insert",
                                    "count": diff,
                                    "user": STAFF_EMAIL,
                                    "payload": results[-diff:] if diff <= len(results) else results
                                })
                                print(f"[API][{nowstr}] Novo(s) registro(s) em {key}: {diff}")
                                new_rows = results[-diff:] if diff <= len(results) else results
                                if new_rows:
                                    headers_ = list(new_rows[0].keys())
                                    rows = [[str(row.get(h, '')) for h in headers_] for row in new_rows]
                                    print_table(headers_, rows)
                            elif diff < 0:
                                log_structured("api_delete", {
                                    "timestamp": nowstr,
                                    "model": key,
                                    "endpoint": endpoint,
                                    "action": "delete",
                                    "count": -diff,
                                    "user": STAFF_EMAIL
                                })
                                print(f"[API][{nowstr}] Remoção(ões) em {key}: {-diff}")
                        last_api_counts[key] = count
                    else:
                        # Tenta mostrar o payload enviado se for erro 400 (ex: cadastro)
                        error_context = {
                            "timestamp": nowstr,
                            "model": key,
                            "endpoint": endpoint,
                            "action": "error",
                            "status_code": response.status_code,
                            "error": response.text,
                            "user": STAFF_EMAIL
                        }
                        # Se for POST, tente mostrar o payload (apenas para endpoints de cadastro)
                        if response.status_code == 400 and hasattr(response, 'request') and hasattr(response.request, 'body'):
                            try:
                                import json as _json
                                error_context["payload"] = _json.loads(response.request.body)
                            except Exception:
                                error_context["payload"] = str(response.request.body)
                        log_structured("api_error", error_context)
                        print(f"Erro ao acessar {url}: {response.status_code} - {response.text}")
                except Exception as e:
                    log_structured("api_exception", {
                        "timestamp": nowstr,
                        "model": key,
                        "endpoint": endpoint,
                        "action": "exception",
                        "error": str(e),
                        "user": STAFF_EMAIL
                    })
                    print(f"Erro ao consultar {url}: {e}")

            # Monitoramento direto do banco de dados (mantido igual por ora)
            try:
                conn = psycopg2.connect(
                    dbname=db_settings['NAME'],
                    user=db_settings['USER'],
                    password=db_settings['PASSWORD'],
                    host=db_settings['HOST'],
                    port=db_settings['PORT'],
                )
                cursor = conn.cursor()
                for table, label in DB_TABLES:
                    try:
                        cursor.execute(sql.SQL(f"SELECT * FROM {table} ORDER BY id DESC LIMIT 10;"))
                        rows = cursor.fetchall()
                        colnames = [desc[0] for desc in cursor.description]
                        cursor.execute(sql.SQL(f"SELECT COUNT(*) FROM {table};"))
                        count = cursor.fetchone()[0]
                        # Detecta updates comparando snapshots
                        id_idx = None
                        if rows and 'id' in colnames:
                            id_idx = colnames.index('id')
                            prev_snapshot = {r[id_idx]: r for r in last_db_snapshots.get(table, [])}
                            curr_snapshot = {r[id_idx]: r for r in rows}
                            updated = []
                            for rid, curr_row in curr_snapshot.items():
                                if rid in prev_snapshot and curr_row != prev_snapshot[rid]:
                                    # Detecta campos alterados
                                    changes = {colnames[i]: (prev_snapshot[rid][i], curr_row[i]) for i in range(len(colnames)) if prev_snapshot[rid][i] != curr_row[i]}
                                    updated.append({"id": rid, "changes": changes})
                            if updated:
                                log_structured("db_update", {
                                    "timestamp": nowstr,
                                    "table": table,
                                    "label": label,
                                    "action": "update",
                                    "count": len(updated),
                                    "updates": updated
                                })
                                print(f"[DB][{nowstr}] Modificação(ões) detectadas em {label}: {len(updated)}")
                                for upd in updated:
                                    print(f"  - id={upd['id']} alterações: {upd['changes']}")
                            last_db_snapshots[table] = rows
                        # Inserção/remoção
                        if table in last_db_counts:
                            diff = count - last_db_counts[table]
                            if diff > 0:
                                log_structured("db_insert", {
                                    "timestamp": nowstr,
                                    "table": table,
                                    "label": label,
                                    "action": "insert",
                                    "count": diff,
                                    "rows": rows[:diff] if diff <= len(rows) else rows
                                })
                                print(f"[DB][{nowstr}] Novo(s) registro(s) em {label}: {diff}")
                                new_rows = rows[:diff] if diff <= len(rows) else rows
                                if new_rows:
                                    print_table(colnames, [list(map(str, r)) for r in new_rows])
                            elif diff < 0:
                                log_structured("db_delete", {
                                    "timestamp": nowstr,
                                    "table": table,
                                    "label": label,
                                    "action": "delete",
                                    "count": -diff
                                })
                                print(f"[DB][{nowstr}] Remoção(ões) em {label}: {-diff}")
                        last_db_counts[table] = count
                    except Exception as e:
                        log_structured("db_error", {
                            "timestamp": nowstr,
                            "table": table,
                            "label": label,
                            "action": "error",
                            "error": str(e)
                        })
                        print(f"[DB] Erro ao consultar tabela {table}: {e}")
                conn.close()
            except Exception as e:
                log_structured("db_exception", {
                    "timestamp": nowstr,
                    "action": "exception",
                    "error": str(e)
                })
                print(f"[DB] Erro ao conectar ao banco: {e}")

            time.sleep(CHECK_INTERVAL)

