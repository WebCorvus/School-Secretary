import time
import logging
from datetime import datetime
from django.core.management.base import BaseCommand

class Command(BaseCommand):
    help = 'Loga periodicamente a hora atual com a mensagem monitorando...'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Monitoramento iniciado.'))
        while True:
            timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            msg = f"[{timestamp}] monitorando..."
            print(msg)
            logging.info(msg)
            time.sleep(10)
