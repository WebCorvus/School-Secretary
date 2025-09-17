import psycopg2
from psycopg2 import sql
from django.conf import settings
from django.core.management import call_command
import time as _time
from django.contrib.auth.hashers import make_password

STAFF_EMAIL = "jm@gmail.com"
STAFF_PASSWORD = "bigmac13"
DB_TABLES = [
    ("users_user", "Usuários"),
    ("students_student", "Alunos"),
    ("students_guardian", "Responsáveis"),
    ("students_contract", "Contratos"),
    ("students_grade", "Notas"),
    ("students_presence", "Presenças"),
    ("school_professor", "Professores"),
    ("school_subject", "Disciplinas"),
    ("school_itinerary", "Itinerários"),
    ("school_group", "Grupos"),
    ("school_schoolrecord", "Registros Escolares"),
    ("school_book", "Livros"),
    ("school_lesson", "Aulas"),
]

def ensure_staff_user():
    db_settings = settings.DATABASES['default']
    conn = psycopg2.connect(
        dbname=db_settings['NAME'],
        user=db_settings['USER'],
        password=db_settings['PASSWORD'],
        host=db_settings['HOST'],
        port=db_settings['PORT'],
    )
    cursor = conn.cursor()
    # Verifica se a tabela existe
    for _ in range(10):
        cursor.execute("""
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_name = 'users_user'
            )
        """)
        if cursor.fetchone()[0]:
            break
        _time.sleep(0.5)
    else:
        raise Exception("Tabela users_user não foi criada após as migrações!")
    # Verifica se já existe
    cursor.execute("SELECT id FROM users_user WHERE email=%s", (STAFF_EMAIL,))
    if cursor.fetchone() is None:
        hashed = make_password(STAFF_PASSWORD)
        cursor.execute(
            "INSERT INTO users_user (email, name, role, is_staff, is_active, password) VALUES (%s, %s, %s, %s, %s, %s)",
            (STAFF_EMAIL, "Monitor Staff", "STAFF", True, True, hashed)
        )
        conn.commit()
        print(f"[DB] Usuário staff '{STAFF_EMAIL}' criado automaticamente.")
    conn.close()
