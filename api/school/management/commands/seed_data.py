import random
from decimal import Decimal
from datetime import timedelta
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.db import transaction
from django.utils import timezone
from faker import Faker

from students.models import (
    Student, Guardian, Contract, Grade, Presence, Warning, 
    Suspension, Tuition, Enrollment, BIMESTER_CHOICES
)
from school.models import (
    Professor, Subject, Group, Itinerary, Lesson, SchoolRecord,
    Book, AgendaItem, Event, EventRegistration, Resource, 
    ResourceLoan, Room, RoomReservation, Notification,
    RESOURCE_TYPE_CHOICES, RESOURCE_STATUS_CHOICES,
    ROOM_TYPE_CHOICES, NOTIFICATION_TYPE_CHOICES
)

User = get_user_model()
fake = Faker('pt_BR')


class Command(BaseCommand):
    help = 'Comando de seed com três modos: example, fast-use e factory'

    def add_arguments(self, parser):
        parser.add_argument(
            'mode',
            type=str,
            choices=['example', 'fast-use', 'factory'],
            help='Modo de execução do seed'
        )

    def handle(self, *args, **options):
        mode = options['mode']

        if mode == 'example':
            self.example_mode()
        elif mode == 'fast-use':
            self.fast_use_mode()
        elif mode == 'factory':
            self.factory_mode()

    def random_phone(self):
        """Gera um número de telefone brasileiro aleatório"""
        ddd = random.randint(10, 99)
        prefix = random.randint(90000, 99999)
        suffix = random.randint(1000, 9999)
        return f"({ddd}) {prefix}-{suffix}"

    def random_cpf(self):
        """Gera um CPF aleatório sem formatação"""
        return fake.unique.cpf().replace('.', '').replace('-', '')

    def factory_mode(self):
        """
        Modo factory: Reseta tudo para sem dados nas models.
        Mantém superusers e usuários importantes (staff).
        """
        self.stdout.write(self.style.WARNING('MODO FACTORY: Limpando dados...'))
        
        with transaction.atomic():
            # Delete data but preserve superusers and staff
            self.stdout.write('Removendo dados de estudantes e relacionados...')
            Enrollment.objects.all().delete()
            Tuition.objects.all().delete()
            Suspension.objects.all().delete()
            Warning.objects.all().delete()
            Presence.objects.all().delete()
            Grade.objects.all().delete()
            Contract.objects.all().delete()
            Guardian.objects.all().delete()
            Student.objects.all().delete()
            
            self.stdout.write('Removendo dados da escola...')
            Notification.objects.all().delete()
            RoomReservation.objects.all().delete()
            Room.objects.all().delete()
            ResourceLoan.objects.all().delete()
            Resource.objects.all().delete()
            EventRegistration.objects.all().delete()
            Event.objects.all().delete()
            AgendaItem.objects.all().delete()
            Book.objects.all().delete()
            SchoolRecord.objects.all().delete()
            Lesson.objects.all().delete()
            Professor.objects.all().delete()
            Group.objects.all().delete()
            Subject.objects.all().delete()
            Itinerary.objects.all().delete()
            
            # Remove regular users but keep superusers and staff
            User.objects.filter(is_superuser=False, is_staff=False).delete()
            
            self.stdout.write(self.style.SUCCESS(
                'Dados limpos com sucesso! '
                'Superusuários e staff foram preservados.'
            ))

    def fast_use_mode(self):
        """
        Modo fast-use: Gera todos os dados necessários para iniciar o projeto
        como um sistema escolar operacional, faltando apenas dados de responsáveis
        e alunos (e dados correlacionados).
        """
        self.stdout.write(self.style.SUCCESS('MODO FAST-USE: Gerando dados básicos...'))
        
        with transaction.atomic():
            # Create Itineraries
            itineraries_data = [
                ('Ciências e Matemática', 'CM'),
                ('Linguagens e Humanas', 'LH'),
                ('Tecnologia e Inovação', 'TI'),
            ]
            itineraries = []
            for full_name, short_name in itineraries_data:
                itinerary, created = Itinerary.objects.get_or_create(
                    short_name=short_name,
                    defaults={'full_name': full_name}
                )
                itineraries.append(itinerary)
            self.stdout.write(f'✓ {len(itineraries)} itinerários criados/verificados')

            # Create Subjects
            subjects_data = [
                ('Matemática', 'MAT'),
                ('Português', 'PORT'),
                ('História', 'HIST'),
                ('Geografia', 'GEO'),
                ('Física', 'FIS'),
                ('Química', 'QUI'),
                ('Biologia', 'BIO'),
                ('Inglês', 'ING'),
                ('Educação Física', 'EDF'),
                ('Arte', 'ART'),
            ]
            subjects = []
            for full_name, short_name in subjects_data:
                subject, created = Subject.objects.get_or_create(
                    short_name=short_name,
                    defaults={'full_name': full_name}
                )
                subjects.append(subject)
            self.stdout.write(f'✓ {len(subjects)} disciplinas criadas/verificadas')

            # Create Groups
            groups_data = [
                ('1º Ano A', '1A', itineraries[0]),
                ('1º Ano B', '1B', itineraries[1]),
                ('2º Ano A', '2A', itineraries[0]),
                ('2º Ano B', '2B', itineraries[2]),
                ('3º Ano A', '3A', itineraries[1]),
                ('3º Ano B', '3B', itineraries[2]),
            ]
            groups = []
            for full_name, short_name, itinerary in groups_data:
                group, created = Group.objects.get_or_create(
                    short_name=short_name,
                    defaults={'full_name': full_name, 'itinerary': itinerary}
                )
                groups.append(group)
            self.stdout.write(f'✓ {len(groups)} turmas criadas/verificadas')

            # Create Professors (one per subject minimum)
            self.stdout.write('Criando professores...')
            professors = []
            for subject in subjects:
                # Check if professor already exists for this subject
                existing_prof = Professor.objects.filter(subject=subject).first()
                if not existing_prof:
                    email = fake.unique.email()
                    user = User.objects.create_user(
                        email=email,
                        name=fake.name(),
                        password='professor123',
                        role=User.Role.PROFESSOR
                    )
                    professor = Professor.objects.create(
                        user=user,
                        full_name=user.name,
                        phone_number=self.random_phone(),
                        cpf=self.random_cpf(),
                        birthday=fake.date_of_birth(minimum_age=25, maximum_age=65),
                        address=fake.address(),
                        subject=subject
                    )
                    professors.append(professor)
                else:
                    professors.append(existing_prof)
            self.stdout.write(f'✓ {len(professors)} professores criados/verificados')

            # Create Lessons (schedule for each group)
            self.stdout.write('Criando grade de aulas...')
            lessons_count = 0
            for group in groups:
                # Check if lessons already exist for this group
                if not Lesson.objects.filter(group=group).exists():
                    available_subjects = random.sample(subjects, min(6, len(subjects)))
                    for idx, subject in enumerate(available_subjects):
                        profs = [p for p in professors if p.subject == subject]
                        if profs:
                            Lesson.objects.create(
                                group=group,
                                professor=random.choice(profs),
                                subject=subject,
                                time=random.randint(1, 6),
                                day=idx % 5  # Monday to Friday
                            )
                            lessons_count += 1
            self.stdout.write(f'✓ {lessons_count} aulas criadas')

            # Create Rooms
            rooms_data = [
                ('Sala 101', 'CLASSROOM', 30),
                ('Sala 102', 'CLASSROOM', 30),
                ('Laboratório de Informática', 'LABORATORY', 25),
                ('Laboratório de Química', 'LABORATORY', 20),
                ('Auditório Principal', 'AUDITORIUM', 200),
                ('Ginásio', 'GYM', 500),
            ]
            rooms = []
            for name, room_type, capacity in rooms_data:
                room, created = Room.objects.get_or_create(
                    name=name,
                    defaults={
                        'room_type': room_type,
                        'capacity': capacity,
                        'description': f'{name} - Capacidade: {capacity} pessoas'
                    }
                )
                rooms.append(room)
            self.stdout.write(f'✓ {len(rooms)} salas criadas/verificadas')

            # Create Resources
            resources_data = [
                ('Computador Dell 01', 'COMPUTER', 'Computador para uso geral'),
                ('Computador Dell 02', 'COMPUTER', 'Computador para uso geral'),
                ('Microscópio Biológico', 'EQUIPMENT', 'Microscópio para aulas de biologia'),
                ('Projetor Multimídia', 'EQUIPMENT', 'Projetor para apresentações'),
            ]
            resources = []
            for name, resource_type, description in resources_data:
                resource, created = Resource.objects.get_or_create(
                    name=name,
                    defaults={
                        'resource_type': resource_type,
                        'description': description,
                        'status': 'AVAILABLE'
                    }
                )
                resources.append(resource)
            self.stdout.write(f'✓ {len(resources)} recursos criados/verificados')

            # Create some Events
            today = timezone.now().date()
            events_data = [
                ('Reunião de Pais', 'Primeira reunião do ano', 'Auditório', 30),
                ('Feira de Ciências', 'Exposição de projetos científicos', 'Pátio Principal', 60),
                ('Festa Junina', 'Festa tradicional da escola', 'Quadra Esportiva', 90),
            ]
            events = []
            for idx, (title, description, location, days_ahead) in enumerate(events_data):
                event_date = today + timedelta(days=days_ahead)
                event, created = Event.objects.get_or_create(
                    title=title,
                    defaults={
                        'description': description,
                        'location': location,
                        'start_date': event_date,
                        'end_date': event_date,
                        'start_time': timezone.now().replace(hour=14, minute=0).time(),
                        'end_time': timezone.now().replace(hour=17, minute=0).time(),
                        'allow_registration': True,
                        'max_participants': 100
                    }
                )
                events.append(event)
            self.stdout.write(f'✓ {len(events)} eventos criados/verificados')

            # Create Books
            books_data = [
                ('Dom Casmurro', 'Machado de Assis', 'Romance brasileiro clássico'),
                ('1984', 'George Orwell', 'Distopia futurista'),
                ('O Pequeno Príncipe', 'Antoine de Saint-Exupéry', 'Conto filosófico'),
            ]
            books = []
            for name, author, summary in books_data:
                book, created = Book.objects.get_or_create(
                    name=name,
                    defaults={
                        'author': author,
                        'summary': summary
                    }
                )
                books.append(book)
            self.stdout.write(f'✓ {len(books)} livros criados/verificados')

            self.stdout.write(self.style.SUCCESS(
                '\nMODO FAST-USE concluído! Sistema pronto para receber alunos e responsáveis.'
            ))

    def example_mode(self):
        """
        Modo example: Gera dados em todas as models, cria users em todas as classes,
        mostra um user de cada classe e seu login para teste manual.
        """
        self.stdout.write(self.style.SUCCESS('MODO EXAMPLE: Gerando dados completos...'))
        
        # First, run fast-use to create base data
        self.fast_use_mode()
        
        with transaction.atomic():
            # Get existing data
            itineraries = list(Itinerary.objects.all())
            subjects = list(Subject.objects.all())
            groups = list(Group.objects.all())
            professors = list(Professor.objects.all())
            
            if not groups:
                self.stdout.write(self.style.ERROR('Nenhuma turma encontrada. Execute fast-use primeiro.'))
                return

            # Create Students with Users
            self.stdout.write('\nCriando estudantes...')
            students = []
            student_users = []
            for i in range(15):
                group = random.choice(groups)
                email = fake.unique.email()
                user = User.objects.create_user(
                    email=email,
                    name=fake.name(),
                    password='student123',
                    role=User.Role.STUDENT
                )
                student = Student.objects.create(
                    user=user,
                    full_name=user.name,
                    registration_number=str(random.randint(100000, 999999)),
                    phone_number=self.random_phone(),
                    cpf=self.random_cpf(),
                    birthday=fake.date_of_birth(minimum_age=6, maximum_age=18),
                    address=fake.address(),
                    group=group
                )
                students.append(student)
                if i == 0:  # Save first one for display
                    student_users.append({
                        'role': 'STUDENT',
                        'name': user.name,
                        'email': email,
                        'password': 'student123',
                        'class': group.full_name
                    })
            self.stdout.write(f'✓ {len(students)} estudantes criados')

            # Create Guardians with Users
            self.stdout.write('Criando responsáveis...')
            guardians = []
            guardian_users = []
            for i in range(10):
                student = random.choice(students)
                email = fake.unique.email()
                user = User.objects.create_user(
                    email=email,
                    name=fake.name(),
                    password='guardian123',
                    role=User.Role.GUARDIAN
                )
                guardian = Guardian.objects.create(
                    user=user,
                    full_name=user.name,
                    student=student,
                    phone_number=self.random_phone(),
                    cpf=self.random_cpf(),
                    birthday=fake.date_of_birth(minimum_age=30, maximum_age=60),
                    address=fake.address()
                )
                guardians.append(guardian)
                
                # Create Contract
                Contract.objects.create(
                    guardian=guardian,
                    student=student
                )
                
                if i == 0:  # Save first one for display
                    guardian_users.append({
                        'role': 'GUARDIAN',
                        'name': user.name,
                        'email': email,
                        'password': 'guardian123',
                        'student': student.full_name
                    })
            self.stdout.write(f'✓ {len(guardians)} responsáveis e contratos criados')

            # Create Staff User
            staff_email = 'staff@escola.com'
            if not User.objects.filter(email=staff_email).exists():
                staff_user = User.objects.create_user(
                    email=staff_email,
                    name='Admin Staff',
                    password='staff123',
                    role=User.Role.STAFF
                )
                self.stdout.write(f'✓ Usuário STAFF criado')
                staff_users = [{
                    'role': 'STAFF',
                    'name': staff_user.name,
                    'email': staff_email,
                    'password': 'staff123',
                    'description': 'Administrador da escola'
                }]
            else:
                staff_users = []

            # Create Grades for students
            self.stdout.write('Criando notas...')
            grades_count = 0
            for student in students[:10]:  # Only for first 10 students
                for subject in subjects:
                    for bimester in ['1B', '2B', '3B', '4B']:
                        Grade.objects.create(
                            student=student,
                            subject=subject,
                            year=2025,
                            bimester=bimester,
                            value=round(random.uniform(5.0, 10.0), 1)
                        )
                        grades_count += 1
            self.stdout.write(f'✓ {grades_count} notas criadas')

            # Create Presences
            self.stdout.write('Criando presenças...')
            presences_count = 0
            today = timezone.now().date()
            for student in students[:10]:
                for day in range(-30, 0):  # Last 30 days
                    date = today + timedelta(days=day)
                    Presence.objects.create(
                        student=student,
                        date=date,
                        presence=random.choice([True, True, True, False])  # 75% presence
                    )
                    presences_count += 1
            self.stdout.write(f'✓ {presences_count} presenças registradas')

            # Create Tuitions
            self.stdout.write('Criando mensalidades...')
            tuitions_count = 0
            for student in students:
                for month in range(1, 7):  # First 6 months
                    reference_date = timezone.now().date().replace(month=month, day=1)
                    Tuition.objects.create(
                        student=student,
                        amount=Decimal('500.00'),
                        due_date=reference_date.replace(day=10),
                        reference_month=reference_date,
                        status=random.choice(['PAID', 'PENDING', 'OVERDUE'])
                    )
                    tuitions_count += 1
            self.stdout.write(f'✓ {tuitions_count} mensalidades criadas')

            # Create Enrollments
            self.stdout.write('Criando matrículas...')
            for student in students:
                Enrollment.objects.create(
                    student=student,
                    group=student.group,
                    year=2025,
                    status='APPROVED',
                    is_reenrollment=False
                )
            self.stdout.write(f'✓ {len(students)} matrículas criadas')

            # Create some Warnings and Suspensions
            if students:
                for i in range(3):
                    Warning.objects.create(
                        student=random.choice(students),
                        reason=fake.text(max_nb_chars=100),
                        date=timezone.now().date()
                    )
                self.stdout.write(f'✓ 3 advertências criadas')

            # Create Agenda Items
            agenda_count = 0
            for i in range(10):
                AgendaItem.objects.create(
                    title=fake.sentence(),
                    subject=random.choice(subjects),
                    description=fake.text(),
                    date=timezone.now().date() + timedelta(days=random.randint(1, 30)),
                    time=timezone.now().time()
                )
                agenda_count += 1
            self.stdout.write(f'✓ {agenda_count} itens de agenda criados')

            # Display user credentials
            self.stdout.write(self.style.SUCCESS('\n' + '='*70))
            self.stdout.write(self.style.SUCCESS('USUÁRIOS DE TESTE - CREDENCIAIS PARA LOGIN'))
            self.stdout.write(self.style.SUCCESS('='*70))
            
            all_users = student_users + guardian_users + staff_users
            
            # Get professor user
            if professors:
                prof = professors[0]
                all_users.append({
                    'role': 'PROFESSOR',
                    'name': prof.user.name,
                    'email': prof.user.email,
                    'password': 'professor123',
                    'subject': prof.subject.full_name if prof.subject else 'N/A'
                })
            
            for user_info in all_users:
                self.stdout.write(self.style.SUCCESS(f"\n{user_info['role']}:"))
                self.stdout.write(f"  Nome: {user_info['name']}")
                self.stdout.write(f"  Email: {user_info['email']}")
                self.stdout.write(f"  Senha: {user_info['password']}")
                if 'class' in user_info:
                    self.stdout.write(f"  Turma: {user_info['class']}")
                if 'student' in user_info:
                    self.stdout.write(f"  Aluno: {user_info['student']}")
                if 'subject' in user_info:
                    self.stdout.write(f"  Disciplina: {user_info['subject']}")
                if 'description' in user_info:
                    self.stdout.write(f"  Descrição: {user_info['description']}")
            
            self.stdout.write(self.style.SUCCESS('\n' + '='*70))
            self.stdout.write(self.style.SUCCESS('MODO EXAMPLE concluído com sucesso!'))
            self.stdout.write(self.style.SUCCESS('Use as credenciais acima para testar o sistema.'))
            self.stdout.write(self.style.SUCCESS('='*70 + '\n'))
