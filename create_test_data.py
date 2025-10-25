"""
Django Management Command to create test data for the new features.
This should be run inside the Django environment.

Usage:
    python manage.py shell < create_test_data.py
    
Or create as a management command:
    python manage.py create_test_data
"""

from django.contrib.auth import get_user_model
from school.models import (
    Subject, Itinerary, Group, Professor, Lesson, 
    WeeklyLessonPlan, Event, AgendaItem, Notification
)
from students.models import Student, Grade, Presence, Warning, Suspension, Guardian, Enrollment
from django.utils import timezone
from datetime import timedelta, date
import random

User = get_user_model()

def create_test_data():
    print("🔧 Creating test data for School Secretary...")
    
    # 1. Create users
    print("\n1️⃣ Creating users...")
    
    # Create superuser if not exists
    if not User.objects.filter(email='admin@school.com').exists():
        admin = User.objects.create_superuser(
            email='admin@school.com',
            password='admin123',
            name='Admin User',
            role='SUPERUSER'
        )
        print(f"  ✅ Created superuser: {admin.email}")
    else:
        admin = User.objects.get(email='admin@school.com')
        print(f"  ℹ️  Superuser already exists: {admin.email}")
    
    # Create professor user
    if not User.objects.filter(email='professor@school.com').exists():
        prof_user = User.objects.create_user(
            email='professor@school.com',
            password='prof123',
            name='Maria Silva',
            role='PROFESSOR'
        )
        print(f"  ✅ Created professor user: {prof_user.email}")
    else:
        prof_user = User.objects.get(email='professor@school.com')
        print(f"  ℹ️  Professor user already exists: {prof_user.email}")
    
    # Create student user
    if not User.objects.filter(email='student@school.com').exists():
        student_user = User.objects.create_user(
            email='student@school.com',
            password='student123',
            name='João Santos',
            role='STUDENT'
        )
        print(f"  ✅ Created student user: {student_user.email}")
    else:
        student_user = User.objects.get(email='student@school.com')
        print(f"  ℹ️  Student user already exists: {student_user.email}")
    
    # Create guardian user
    if not User.objects.filter(email='guardian@school.com').exists():
        guardian_user = User.objects.create_user(
            email='guardian@school.com',
            password='guardian123',
            name='Ana Santos',
            role='GUARDIAN'
        )
        print(f"  ✅ Created guardian user: {guardian_user.email}")
    else:
        guardian_user = User.objects.get(email='guardian@school.com')
        print(f"  ℹ️  Guardian user already exists: {guardian_user.email}")
    
    # 2. Create subjects
    print("\n2️⃣ Creating subjects...")
    subject_names = [
        ('MAT', 'Matemática'),
        ('PORT', 'Português'),
        ('HIST', 'História'),
        ('GEO', 'Geografia'),
        ('FIS', 'Física'),
    ]
    
    subjects = []
    for short, full in subject_names:
        subject, created = Subject.objects.get_or_create(
            short_name=short,
            defaults={'full_name': full}
        )
        subjects.append(subject)
        status = "✅ Created" if created else "ℹ️  Already exists"
        print(f"  {status}: {full}")
    
    # 3. Create itinerary and group
    print("\n3️⃣ Creating itinerary and group...")
    itinerary, created = Itinerary.objects.get_or_create(
        short_name='TECH',
        defaults={'full_name': 'Itinerário de Tecnologia'}
    )
    status = "✅ Created" if created else "ℹ️  Already exists"
    print(f"  {status}: {itinerary.full_name}")
    
    group, created = Group.objects.get_or_create(
        short_name='3A',
        defaults={
            'full_name': '3º Ano A',
            'itinerary': itinerary
        }
    )
    status = "✅ Created" if created else "ℹ️  Already exists"
    print(f"  {status}: {group.full_name}")
    
    # 4. Create professor profile
    print("\n4️⃣ Creating professor profile...")
    if not hasattr(prof_user, 'professor_profile'):
        professor = Professor.objects.create(
            user=prof_user,
            full_name='Maria Silva',
            phone_number='(11) 98765-4321',
            cpf='12345678901',
            birthday=date(1985, 5, 15),
            address='01310-100',
            subject=subjects[0]  # Matemática
        )
        print(f"  ✅ Created professor profile: {professor.full_name}")
    else:
        professor = prof_user.professor_profile
        print(f"  ℹ️  Professor profile already exists: {professor.full_name}")
    
    # 5. Create student profile
    print("\n5️⃣ Creating student profile...")
    if not hasattr(student_user, 'student_profile'):
        student = Student.objects.create(
            user=student_user,
            full_name='João Santos',
            registration_number='202501',
            phone_number='(11) 91234-5678',
            cpf='98765432109',
            birthday=date(2007, 8, 20),
            address='01310-200',
            group=group
        )
        print(f"  ✅ Created student profile: {student.full_name}")
    else:
        student = student_user.student_profile
        print(f"  ℹ️  Student profile already exists: {student.full_name}")
    
    # 6. Create guardian profile
    print("\n6️⃣ Creating guardian profile...")
    if not hasattr(guardian_user, 'guardian_profile'):
        guardian = Guardian.objects.create(
            user=guardian_user,
            full_name='Ana Santos',
            phone_number='(11) 99876-5432',
            cpf='11122233344',
            birthday=date(1980, 3, 10),
            address='01310-200',
            student=student
        )
        print(f"  ✅ Created guardian profile: {guardian.full_name}")
    else:
        guardian = guardian_user.guardian_profile
        print(f"  ℹ️  Guardian profile already exists: {guardian.full_name}")
    
    # 7. Create lessons
    print("\n7️⃣ Creating lessons...")
    lesson_data = [
        (subjects[0], 1, 1),  # Math, Monday, 1st period
        (subjects[1], 1, 2),  # Portuguese, Monday, 2nd period
        (subjects[2], 2, 1),  # History, Tuesday, 1st period
        (subjects[3], 2, 2),  # Geography, Tuesday, 2nd period
        (subjects[4], 3, 1),  # Physics, Wednesday, 1st period
    ]
    
    lessons = []
    for subject, day, time in lesson_data:
        lesson, created = Lesson.objects.get_or_create(
            group=group,
            subject=subject,
            day=day,
            time=time,
            defaults={'professor': professor}
        )
        lessons.append(lesson)
        status = "✅ Created" if created else "ℹ️  Already exists"
        print(f"  {status}: {subject.full_name} - Day {day}, Period {time}")
    
    # 8. Create weekly lesson plans
    print("\n8️⃣ Creating weekly lesson plans...")
    today = timezone.now().date()
    week_start = today - timedelta(days=today.weekday())
    
    for i, lesson in enumerate(lessons[:3]):  # Create plans for first 3 lessons
        plan_date = week_start + timedelta(weeks=i)
        plan, created = WeeklyLessonPlan.objects.get_or_create(
            professor=professor,
            lesson=lesson,
            week_start_date=plan_date,
            defaults={
                'planning_content': f'Conteúdo programado para {lesson.subject.full_name} na semana de {plan_date}',
                'objectives': f'Objetivo: Compreender os conceitos fundamentais de {lesson.subject.full_name}',
                'resources_needed': 'Livro didático, slides, exercícios práticos',
                'notes': 'Preparar avaliação para o final da semana'
            }
        )
        status = "✅ Created" if created else "ℹ️  Already exists"
        print(f"  {status}: Plan for {lesson.subject.full_name} - Week of {plan_date}")
    
    # 9. Create grades
    print("\n9️⃣ Creating grades...")
    current_year = timezone.now().year
    bimesters = ['1B', '2B', '3B', '4B']
    
    for subject in subjects:
        for bimester in bimesters:
            # Create varying grades (some good, some needing attention)
            grade_value = random.uniform(5.0, 9.5)
            grade, created = Grade.objects.get_or_create(
                student=student,
                subject=subject,
                year=current_year,
                bimester=bimester,
                defaults={'value': round(grade_value, 2)}
            )
            status = "✅ Created" if created else "ℹ️  Already exists"
            print(f"  {status}: {subject.short_name} - {bimester}: {grade.value}")
    
    # 10. Create presence records
    print("\n🔟 Creating presence records...")
    # Create 30 days of presence records
    for i in range(30):
        presence_date = today - timedelta(days=i)
        # 80% presence, 20% absence
        is_present = random.random() > 0.2
        presence, created = Presence.objects.get_or_create(
            student=student,
            date=presence_date,
            defaults={'presence': is_present}
        )
        if created:
            status = "✅" if is_present else "❌"
            print(f"  {status} {presence_date}: {'Presente' if is_present else 'Ausente'}")
    
    # 11. Create enrollment
    print("\n1️⃣1️⃣ Creating enrollment...")
    enrollment, created = Enrollment.objects.get_or_create(
        student=student,
        group=group,
        year=current_year,
        defaults={
            'status': 'APPROVED',
            'is_reenrollment': False
        }
    )
    status = "✅ Created" if created else "ℹ️  Already exists"
    print(f"  {status}: Enrollment for {student.full_name} in {group.full_name}")
    
    # 12. Create notifications
    print("\n1️⃣2️⃣ Creating notifications...")
    notification_data = [
        ('GRADE', 'Nova nota disponível', f'Sua nota de {subjects[0].full_name} foi lançada.', student_user),
        ('ABSENCE', 'Alerta de faltas', 'Você acumulou 5 faltas este mês.', student_user),
        ('EVENT', 'Novo evento', 'Feira de ciências será realizada na próxima semana.', student_user),
        ('GENERAL', 'Bem-vindo', 'Bem-vindo ao sistema de secretaria escolar!', student_user),
        ('ABSENCE', 'Alerta de faltas do aluno', f'{student.full_name} acumulou 5 faltas este mês.', guardian_user),
    ]
    
    for notif_type, title, message, recipient in notification_data:
        notif, created = Notification.objects.get_or_create(
            recipient=recipient,
            title=title,
            defaults={
                'notification_type': notif_type,
                'message': message,
                'read': False
            }
        )
        status = "✅ Created" if created else "ℹ️  Already exists"
        print(f"  {status}: {title} for {recipient.email}")
    
    # 13. Create events
    print("\n1️⃣3️⃣ Creating events...")
    event_data = [
        ('Feira de Ciências', 'Exposição de projetos científicos dos alunos', 'Auditório Principal', 7, 14),
        ('Reunião de Pais', 'Reunião para discussão do desempenho acadêmico', 'Sala 101', 3, 10),
        ('Palestra sobre Carreiras', 'Profissionais falarão sobre suas áreas', 'Auditório', 15, 22),
    ]
    
    for title, description, location, days_ahead_start, days_ahead_end in event_data:
        start_date = today + timedelta(days=days_ahead_start)
        end_date = today + timedelta(days=days_ahead_end)
        event, created = Event.objects.get_or_create(
            title=title,
            defaults={
                'description': description,
                'location': location,
                'start_date': start_date,
                'end_date': end_date,
                'allow_registration': True,
                'max_participants': 50
            }
        )
        status = "✅ Created" if created else "ℹ️  Already exists"
        print(f"  {status}: {title} - {start_date} to {end_date}")
    
    print("\n" + "="*60)
    print("✅ Test data creation completed!")
    print("="*60)
    print("\n📋 Test User Credentials:")
    print(f"  Admin:     admin@school.com     / admin123")
    print(f"  Professor: professor@school.com / prof123")
    print(f"  Student:   student@school.com   / student123")
    print(f"  Guardian:  guardian@school.com  / guardian123")
    print("\n🌐 Access the application at: http://localhost:8080")
    print("\n📊 To test efficiency analysis:")
    print(f"  GET /api/students/efficiency-analysis/?year={current_year}")
    print(f"  GET /api/school/groups/{group.id}/efficiency-analysis/?year={current_year}")
    print("\n📅 To test weekly lesson plans:")
    print(f"  GET /api/school/weekly-plans/")
    print("\n📬 To test inbox:")
    print(f"  Navigate to: http://localhost:8080/inbox")

if __name__ == '__main__':
    create_test_data()
