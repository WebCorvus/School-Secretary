from django.core.management.base import BaseCommand

class Command(BaseCommand):
    help = "Apaga todos os registros de inconsistências (school_inconsistencylog) do banco de dados."

    def handle(self, *args, **options):
        from django.db import connection
        with connection.cursor() as cursor:
            cursor.execute("DELETE FROM school_inconsistencylog;")
        print("Todos os registros de inconsistências foram apagados com sucesso.")
