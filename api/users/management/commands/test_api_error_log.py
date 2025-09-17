import logging
from django.core.management.base import BaseCommand

class Command(BaseCommand):
    help = "Força um erro para testar o logger api_error_audit."

    def handle(self, *args, **options):
        logger = logging.getLogger("api_error_audit")
        import json
        try:
            raise ValueError("Erro de teste forçado pelo comando!")
        except Exception as e:
            logger.error(json.dumps({
                "event": "forced_error_test",
                "error": str(e),
                "msg": "Este erro deve aparecer no /tmp/api_error_audit.log"
            }, ensure_ascii=False))
        self.stdout.write(self.style.SUCCESS("Erro forçado e logado! Verifique o arquivo de log."))
