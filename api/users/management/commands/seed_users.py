import random
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

from django.contrib.auth import authenticate
from faker import Faker

User = get_user_model()

class Command(BaseCommand):
    help = 'Gera usuários simulados para testes automatizados.'

    def add_arguments(self, parser):
        parser.add_argument('--total', type=int, default=5, help='Quantidade de usuários a criar')
        parser.add_argument('--role', type=str, default=None, help='Role fixa para todos os usuários')

    def handle(self, *args, **options):
        fake = Faker('pt_BR')
        total = options['total']
        role = options['role']
        roles = [r[0] for r in User.Role.choices if r[0] != 'SUPERUSER']
        created = []
        for _ in range(total):
            email = fake.unique.email()
            name = fake.name()
            password = fake.password(length=10)
            user_role = role if role else random.choice(roles)
            user = User.objects.create_user(email=email, name=name, password=password, role=user_role)
            created.append({'email': email, 'name': name, 'password': password, 'role': user_role})
            self.stdout.write(self.style.SUCCESS(f'Usuário criado: {email} | {user_role}'))
            # Tenta autenticar o usuário recém-criado
            user_auth = authenticate(username=email, password=password)
            if user_auth is not None and user_auth.is_active:
                self.stdout.write(self.style.SUCCESS(f'Login bem-sucedido para: {email}'))
            else:
                self.stdout.write(self.style.ERROR(f'Falha no login para: {email}'))
        self.stdout.write(self.style.SUCCESS(f'Total de usuários criados: {len(created)}'))
        self.stdout.write(str(created))
