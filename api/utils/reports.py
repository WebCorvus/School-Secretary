"""
Utility functions for generating comprehensive academic reports
"""
from django.db.models import Count, Avg, Q, Sum
from students.models import Student, Grade, Presence, Warning, Suspension, Tuition
from school.models import Subject
from datetime import datetime, timedelta
from django.utils import timezone


def generate_student_academic_report(student):
    """Generate comprehensive academic report for a single student"""
    
    # Get all grades by subject and bimester
    grades_by_subject = {}
    all_subjects = Subject.objects.all()
    
    for subject in all_subjects:
        grades = Grade.objects.filter(student=student, subject=subject).order_by('bimester')
        bimester_grades = {
            '1B': None,
            '2B': None,
            '3B': None,
            '4B': None
        }
        
        for grade in grades:
            bimester_grades[grade.bimester] = grade.value
        
        # Calculate average
        valid_grades = [g for g in bimester_grades.values() if g is not None]
        average = sum(valid_grades) / len(valid_grades) if valid_grades else None
        
        grades_by_subject[subject.full_name] = {
            'grades': bimester_grades,
            'average': round(average, 2) if average else None
        }
    
    # Get attendance statistics
    total_days = Presence.objects.filter(student=student).count()
    absences = Presence.objects.filter(student=student, presence=False).count()
    presences = Presence.objects.filter(student=student, presence=True).count()
    absence_rate = (absences / total_days * 100) if total_days > 0 else 0
    
    # Get disciplinary records
    warnings_count = Warning.objects.filter(student=student).count()
    suspensions_count = Suspension.objects.filter(student=student).count()
    
    # Get recent warnings and suspensions
    recent_warnings = Warning.objects.filter(student=student).order_by('-date')[:5]
    recent_suspensions = Suspension.objects.filter(student=student).order_by('-start_date')[:5]
    
    return {
        'student_id': student.id,
        'student_name': student.full_name,
        'registration_number': student.registration_number,
        'group': student.group.full_name if student.group else None,
        'grades': grades_by_subject,
        'attendance': {
            'total_days': total_days,
            'presences': presences,
            'absences': absences,
            'absence_rate': round(absence_rate, 2),
            'needs_attention': absence_rate > 25
        },
        'discipline': {
            'warnings_count': warnings_count,
            'suspensions_count': suspensions_count,
            'recent_warnings': [
                {
                    'date': w.date.isoformat(),
                    'reason': w.reason,
                    'issued_by': w.issued_by.name if w.issued_by else None
                } for w in recent_warnings
            ],
            'recent_suspensions': [
                {
                    'start_date': s.start_date.isoformat(),
                    'end_date': s.end_date.isoformat(),
                    'reason': s.reason,
                    'issued_by': s.issued_by.name if s.issued_by else None
                } for s in recent_suspensions
            ]
        }
    }


def generate_group_performance_report(group):
    """Generate performance report for an entire group/class"""
    
    students = Student.objects.filter(group=group)
    
    # Overall statistics
    total_students = students.count()
    
    # Get average grade per subject
    subjects_performance = []
    all_subjects = Subject.objects.all()
    
    for subject in all_subjects:
        grades = Grade.objects.filter(
            student__group=group,
            subject=subject
        )
        
        if grades.exists():
            avg_grade = grades.aggregate(Avg('value'))['value__avg']
            subjects_performance.append({
                'subject': subject.full_name,
                'average_grade': round(avg_grade, 2) if avg_grade else None,
                'students_evaluated': grades.values('student').distinct().count()
            })
    
    # Attendance statistics
    total_presences_count = Presence.objects.filter(
        student__group=group
    ).count()
    
    absences_count = Presence.objects.filter(
        student__group=group,
        presence=False
    ).count()
    
    group_absence_rate = (absences_count / total_presences_count * 100) if total_presences_count > 0 else 0
    
    # Students with high absence rate
    high_absence_students = []
    for student in students:
        total_days = Presence.objects.filter(student=student).count()
        if total_days == 0:
            continue
        
        absences = Presence.objects.filter(student=student, presence=False).count()
        absence_rate = (absences / total_days) * 100
        
        if absence_rate > 25:
            high_absence_students.append({
                'student_id': student.id,
                'student_name': student.full_name,
                'absence_rate': round(absence_rate, 2)
            })
    
    # Disciplinary summary
    warnings_count = Warning.objects.filter(student__group=group).count()
    suspensions_count = Suspension.objects.filter(student__group=group).count()
    
    return {
        'group': group.full_name,
        'total_students': total_students,
        'subjects_performance': subjects_performance,
        'attendance': {
            'overall_absence_rate': round(group_absence_rate, 2),
            'students_with_high_absences': high_absence_students,
            'total_absences': absences_count
        },
        'discipline': {
            'total_warnings': warnings_count,
            'total_suspensions': suspensions_count
        }
    }


def generate_financial_report(student=None):
    """Generate financial report for tuition payments"""
    
    if student:
        tuitions = Tuition.objects.filter(student=student).order_by('-reference_month')
    else:
        tuitions = Tuition.objects.all().order_by('-reference_month')
    
    # Summary statistics
    total_pending = tuitions.filter(status='PENDING').count()
    total_paid = tuitions.filter(status='PAID').count()
    total_overdue = tuitions.filter(status='OVERDUE').count()
    
    total_amount_pending = tuitions.filter(status='PENDING').aggregate(
        Sum('amount')
    )['amount__sum'] or 0
    
    total_amount_paid = tuitions.filter(status='PAID').aggregate(
        Sum('amount')
    )['amount__sum'] or 0
    
    # Payment history
    payment_history = []
    for tuition in tuitions[:20]:  # Last 20 payments
        payment_history.append({
            'student_name': tuition.student.full_name if student is None else None,
            'amount': float(tuition.amount),
            'due_date': tuition.due_date.isoformat(),
            'payment_date': tuition.payment_date.isoformat() if tuition.payment_date else None,
            'status': tuition.status,
            'reference_month': tuition.reference_month.isoformat()
        })
    
    return {
        'summary': {
            'total_pending': total_pending,
            'total_paid': total_paid,
            'total_overdue': total_overdue,
            'amount_pending': float(total_amount_pending),
            'amount_paid': float(total_amount_paid)
        },
        'payment_history': payment_history
    }


def identify_students_needing_notification():
    """Identify students that need notifications based on various criteria"""
    
    notifications_needed = []
    
    # Students with high absence rate (>25%)
    for student in Student.objects.all():
        total_days = Presence.objects.filter(student=student).count()
        if total_days == 0:
            continue
        
        absences = Presence.objects.filter(student=student, presence=False).count()
        absence_rate = (absences / total_days) * 100
        
        if absence_rate > 25:
            notifications_needed.append({
                'student_id': student.id,
                'student_name': student.full_name,
                'guardians': [g.full_name for g in student.guardians.all()],
                'reason': 'HIGH_ABSENCE_RATE',
                'details': f'Taxa de faltas: {round(absence_rate, 2)}%',
                'priority': 'HIGH'
            })
    
    # Students with low grades (average < 6.0)
    for student in Student.objects.all():
        grades = Grade.objects.filter(student=student)
        if grades.exists():
            avg_grade = grades.aggregate(Avg('value'))['value__avg']
            if avg_grade and avg_grade < 6.0:
                notifications_needed.append({
                    'student_id': student.id,
                    'student_name': student.full_name,
                    'guardians': [g.full_name for g in student.guardians.all()],
                    'reason': 'LOW_GRADES',
                    'details': f'Média geral: {round(avg_grade, 2)}',
                    'priority': 'MEDIUM'
                })
    
    # Students with overdue payments
    overdue_tuitions = Tuition.objects.filter(
        status='OVERDUE'
    ).select_related('student')
    
    for tuition in overdue_tuitions:
        notifications_needed.append({
            'student_id': tuition.student.id,
            'student_name': tuition.student.full_name,
            'guardians': [g.full_name for g in tuition.student.guardians.all()],
            'reason': 'OVERDUE_PAYMENT',
            'details': f'Mensalidade de {tuition.reference_month.strftime("%m/%Y")} vencida',
            'priority': 'HIGH'
        })
    
    return notifications_needed
