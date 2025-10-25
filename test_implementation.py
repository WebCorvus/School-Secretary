#!/usr/bin/env python3
"""
Test script to validate the backend implementation without running full Docker setup.
This performs static analysis and validates the code structure.
"""

import os
import sys
import re
from pathlib import Path

# Add the project root to path
project_root = Path(__file__).parent
sys.path.insert(0, str(project_root / 'api'))

def test_model_structure():
    """Test that WeeklyLessonPlan model is properly defined"""
    print("🔍 Testing WeeklyLessonPlan model structure...")
    
    models_file = project_root / 'api' / 'school' / 'models.py'
    with open(models_file, 'r') as f:
        content = f.read()
    
    # Check that admin logging functions are removed
    if 'get_admin_username' in content or 'log_admin_create_update' in content:
        print(f"  ❌ Admin logging functions should be removed")
        return False
    else:
        print(f"  ✅ Admin logging functions removed - OK")
    
    checks = [
        ('WeeklyLessonPlan class', 'class WeeklyLessonPlan'),
        ('professor ForeignKey', 'professor = models.ForeignKey'),
        ('lesson ForeignKey', 'lesson = models.ForeignKey'),
        ('week_start_date field', 'week_start_date = models.DateField'),
        ('planning_content field', 'planning_content = models.TextField'),
        ('unique_together constraint', 'unique_together = ["lesson", "week_start_date"]'),
        ('__str__ method', 'def __str__(self)'),
    ]
    
    for check_name, check_pattern in checks:
        if check_pattern in content:
            print(f"  ✅ {check_name} - OK")
        else:
            print(f"  ❌ {check_name} - MISSING")
            return False
    
    # Check that Resource models are removed from school
    if 'class Resource(' in content or 'class ResourceLoan(' in content:
        print(f"  ❌ Resource models should be moved to resources app")
        return False
    else:
        print(f"  ✅ Resource models removed from school - OK")
    
    return True

def test_resources_app():
    """Test that resources app is properly created"""
    print("\n🔍 Testing resources app...")
    
    resources_dir = project_root / 'api' / 'resources'
    if not resources_dir.exists():
        print(f"  ❌ Resources app directory not found")
        return False
    
    print(f"  ✅ Resources app directory exists - OK")
    
    # Check models
    models_file = resources_dir / 'models.py'
    if not models_file.exists():
        print(f"  ❌ Resources models.py not found")
        return False
    
    with open(models_file, 'r') as f:
        content = f.read()
    
    if 'class Resource(' in content and 'class ResourceLoan(' in content:
        print(f"  ✅ Resource models in resources app - OK")
    else:
        print(f"  ❌ Resource models not properly defined")
        return False
    
    # Check serializers
    serializers_file = resources_dir / 'serializers.py'
    if serializers_file.exists():
        print(f"  ✅ Resources serializers exist - OK")
    else:
        print(f"  ❌ Resources serializers missing")
        return False
    
    # Check views
    views_file = resources_dir / 'views.py'
    if views_file.exists():
        print(f"  ✅ Resources views exist - OK")
    else:
        print(f"  ❌ Resources views missing")
        return False
    
    # Check urls
    urls_file = resources_dir / 'urls.py'
    if urls_file.exists():
        print(f"  ✅ Resources urls exist - OK")
    else:
        print(f"  ❌ Resources urls missing")
        return False
    
    # Check admin
    admin_file = resources_dir / 'admin.py'
    if admin_file.exists():
        print(f"  ✅ Resources admin exists - OK")
    else:
        print(f"  ❌ Resources admin missing")
        return False
    
    return True

def test_settings():
    """Test that settings.py is updated correctly"""
    print("\n🔍 Testing settings.py...")
    
    settings_file = project_root / 'api' / 'School-Secretary' / 'settings.py'
    with open(settings_file, 'r') as f:
        content = f.read()
    
    # Check resources app is added
    if '"resources.apps.ResourcesConfig"' in content:
        print(f"  ✅ Resources app added to INSTALLED_APPS - OK")
    else:
        print(f"  ❌ Resources app not in INSTALLED_APPS")
        return False
    
    # Check codespace link is removed
    if 'potential-eureka' in content or 'github.dev' in content:
        print(f"  ❌ Codespace link still present in CSRF_TRUSTED_ORIGINS")
        return False
    else:
        print(f"  ✅ Codespace link removed from CSRF_TRUSTED_ORIGINS - OK")
    
    return True

def test_urls():
    """Test that main urls.py includes resources"""
    print("\n🔍 Testing URL configuration...")
    
    urls_file = project_root / 'api' / 'School-Secretary' / 'urls.py'
    with open(urls_file, 'r') as f:
        content = f.read()
    
    if 'path("resources/"' in content and 'include("resources.urls")' in content:
        print(f"  ✅ Resources URLs registered - OK")
    else:
        print(f"  ❌ Resources URLs not registered")
        return False
    
    # Check school urls don't have resources
    school_urls_file = project_root / 'api' / 'school' / 'urls.py'
    with open(school_urls_file, 'r') as f:
        content = f.read()
    
    if 'ResourceViewSet' in content or 'ResourceLoanViewSet' in content:
        print(f"  ❌ Resource viewsets still in school urls")
        return False
    else:
        print(f"  ✅ Resource viewsets removed from school urls - OK")
    
    return True

def test_serializers():
    """Test that WeeklyLessonPlan serializer is properly defined"""
    print("\n🔍 Testing serializers...")
    
    serializers_file = project_root / 'api' / 'school' / 'serializers.py'
    with open(serializers_file, 'r') as f:
        content = f.read()
    
    checks = [
        ('WeeklyLessonPlan import', 'WeeklyLessonPlan'),
        ('WeeklyLessonPlanSerializer class', 'class WeeklyLessonPlanSerializer'),
        ('professor_details field', 'professor_details'),
        ('lesson_details field', 'lesson_details'),
    ]
    
    for check_name, check_pattern in checks:
        if check_pattern in content:
            print(f"  ✅ {check_name} - OK")
        else:
            print(f"  ❌ {check_name} - MISSING")
            return False
    
    # Check Resource serializers are removed from school
    if 'ResourceSerializer' in content or 'ResourceLoanSerializer' in content:
        print(f"  ❌ Resource serializers still in school")
        return False
    else:
        print(f"  ✅ Resource serializers removed from school - OK")
    
    return True

def test_views():
    """Test that WeeklyLessonPlanViewSet is properly defined"""
    print("\n🔍 Testing views...")
    
    views_file = project_root / 'api' / 'school' / 'views.py'
    with open(views_file, 'r') as f:
        content = f.read()
    
    checks = [
        ('WeeklyLessonPlan import', 'WeeklyLessonPlan'),
        ('WeeklyLessonPlanSerializer import', 'WeeklyLessonPlanSerializer'),
        ('WeeklyLessonPlanViewSet class', 'class WeeklyLessonPlanViewSet'),
        ('queryset definition', 'queryset = WeeklyLessonPlan.objects.all()'),
        ('serializer_class', 'serializer_class = WeeklyLessonPlanSerializer'),
        ('get_permissions method', 'def get_permissions(self)'),
        ('get_queryset method', 'def get_queryset(self)'),
    ]
    
    for check_name, check_pattern in checks:
        if check_pattern in content:
            print(f"  ✅ {check_name} - OK")
        else:
            print(f"  ❌ {check_name} - MISSING")
            return False
    
    # Check Resource viewsets are removed from school
    if 'class ResourceViewSet' in content or 'class ResourceLoanViewSet' in content:
        print(f"  ❌ Resource viewsets still in school views")
        return False
    else:
        print(f"  ✅ Resource viewsets removed from school - OK")
    
    return True

def test_seed_files_removed():
    """Test that seed files are removed"""
    print("\n🔍 Testing seed files removal...")
    
    seed_school = project_root / 'api' / 'students' / 'management' / 'commands' / 'seed_school.py'
    seed_users = project_root / 'api' / 'users' / 'management' / 'commands' / 'seed_users.py'
    
    if seed_school.exists():
        print(f"  ❌ seed_school.py still exists")
        return False
    else:
        print(f"  ✅ seed_school.py removed - OK")
    
    if seed_users.exists():
        print(f"  ❌ seed_users.py still exists")
        return False
    else:
        print(f"  ✅ seed_users.py removed - OK")
    
    return True

def test_api_documentation():
    """Test that API documentation exists"""
    print("\n🔍 Testing API documentation...")
    
    readme_file = project_root / 'api' / 'README.md'
    if not readme_file.exists():
        print(f"  ❌ API README.md not found")
        return False
    
    with open(readme_file, 'r') as f:
        content = f.read()
    
    checks = [
        ('Resources endpoints documented', '/api/resources/'),
        ('Resource loans documented', '/api/resources/loans/'),
        ('Weekly lesson plans documented', '/api/school/weekly-plans/'),
        ('Efficiency analysis documented', 'efficiency-analysis'),
        ('Authentication section', 'Authentication'),
        ('Example usage', 'Example Usage'),
    ]
    
    for check_name, check_pattern in checks:
        if check_pattern in content:
            print(f"  ✅ {check_name} - OK")
        else:
            print(f"  ❌ {check_name} - MISSING")
            return False
    
    return True

def test_efficiency_analysis():
    """Test that efficiency analysis functions are defined"""
    print("\n🔍 Testing efficiency analysis functions...")
    
    reports_file = project_root / 'api' / 'utils' / 'reports.py'
    with open(reports_file, 'r') as f:
        content = f.read()
    
    checks = [
        ('calculate_approval_rate function', 'def calculate_approval_rate'),
        ('calculate_dropout_rate function', 'def calculate_dropout_rate'),
        ('generate_efficiency_analysis function', 'def generate_efficiency_analysis'),
        ('Approval rate calculation', 'avg_grade >= 6.0'),
        ('Dropout rate calculation', 'absence_rate > 75'),
    ]
    
    for check_name, check_pattern in checks:
        if check_pattern in content:
            print(f"  ✅ {check_name} - OK")
        else:
            print(f"  ❌ {check_name} - MISSING")
            return False
    
    # Check for efficiency_analysis action in student views
    views_file = project_root / 'api' / 'students' / 'views.py'
    with open(views_file, 'r') as f:
        content = f.read()
    
    if 'efficiency_analysis' in content and 'generate_efficiency_analysis' in content:
        print(f"  ✅ StudentViewSet efficiency_analysis action - OK")
    else:
        print(f"  ❌ StudentViewSet efficiency_analysis action - MISSING")
        return False
    
    # Check for efficiency_analysis action in group views
    views_file = project_root / 'api' / 'school' / 'views.py'
    with open(views_file, 'r') as f:
        content = f.read()
    
    if 'efficiency_analysis' in content:
        print(f"  ✅ GroupViewSet efficiency_analysis action - OK")
    else:
        print(f"  ❌ GroupViewSet efficiency_analysis action - MISSING")
        return False
    
    return True

def test_frontend_inbox():
    """Test that inbox page and notification hook are defined"""
    print("\n🔍 Testing frontend inbox implementation...")
    
    # Check inbox page
    inbox_file = project_root / 'app' / 'src' / 'app' / '(annoucements)' / 'inbox' / 'page.tsx'
    if inbox_file.exists():
        print(f"  ✅ Inbox page - OK")
        with open(inbox_file, 'r') as f:
            content = f.read()
        
        if 'useNotification' in content and 'markAsRead' in content:
            print(f"  ✅ Inbox page uses notification hook - OK")
        else:
            print(f"  ❌ Inbox page notification integration - ISSUE")
            return False
    else:
        print(f"  ❌ Inbox page - MISSING")
        return False
    
    # Check notification hook
    hook_file = project_root / 'app' / 'src' / 'hooks' / 'useNotification.ts'
    if hook_file.exists():
        print(f"  ✅ useNotification hook - OK")
        with open(hook_file, 'r') as f:
            content = f.read()
        
        checks = [
            ('markAsRead function', 'markAsRead'),
            ('markAllAsRead function', 'markAllAsRead'),
            ('NOTIFICATIONS route', 'ROUTES.NOTIFICATIONS'),
        ]
        
        for check_name, check_pattern in checks:
            if check_pattern in content:
                print(f"  ✅ {check_name} - OK")
            else:
                print(f"  ❌ {check_name} - MISSING")
                return False
    else:
        print(f"  ❌ useNotification hook - MISSING")
        return False
    
    # Check notification types
    types_file = project_root / 'app' / 'src' / 'types' / 'notification.ts'
    if types_file.exists():
        print(f"  ✅ Notification types - OK")
    else:
        print(f"  ❌ Notification types - MISSING")
        return False
    
    return True

def test_authentication_fix():
    """Test that authentication interceptor is properly fixed"""
    print("\n🔍 Testing authentication fix...")
    
    api_file = project_root / 'app' / 'src' / 'services' / 'api.ts'
    with open(api_file, 'r') as f:
        content = f.read()
    
    checks = [
        ('async response interceptor', 'async (error: any)'),
        ('401 handling', 'error.response?.status === 401'),
        ('403 handling', 'error.response?.status === 403'),
        ('login redirect on 403', 'window.location.href = "/auth/login"'),
        ('token refresh', 'await axios.post("/auth/refresh")'),
    ]
    
    for check_name, check_pattern in checks:
        if check_pattern in content:
            print(f"  ✅ {check_name} - OK")
        else:
            print(f"  ❌ {check_name} - MISSING")
            return False
    
    return True

def test_config_updates():
    """Test that config.ts has notification routes"""
    print("\n🔍 Testing config updates...")
    
    config_file = project_root / 'app' / 'src' / 'config.ts'
    with open(config_file, 'r') as f:
        content = f.read()
    
    checks = [
        ('NOTIFICATIONS route', 'NOTIFICATIONS:'),
        ('NOTIFICATIONS_MARK_READ route', 'NOTIFICATIONS_MARK_READ:'),
        ('NOTIFICATIONS_MARK_ALL_READ route', 'NOTIFICATIONS_MARK_ALL_READ:'),
    ]
    
    for check_name, check_pattern in checks:
        if check_pattern in content:
            print(f"  ✅ {check_name} - OK")
        else:
            print(f"  ❌ {check_name} - MISSING")
            return False
    
    return True

def main():
    print("=" * 60)
    print("Backend & Frontend Code Validation Test Suite")
    print("=" * 60)
    
    tests = [
        ("WeeklyLessonPlan Model", test_model_structure),
        ("Resources App", test_resources_app),
        ("Settings Configuration", test_settings),
        ("URL Configuration", test_urls),
        ("Serializers", test_serializers),
        ("Views", test_views),
        ("Seed Files Removed", test_seed_files_removed),
        ("API Documentation", test_api_documentation),
        ("Efficiency Analysis", test_efficiency_analysis),
        ("Frontend Inbox", test_frontend_inbox),
        ("Authentication Fix", test_authentication_fix),
        ("Config Updates", test_config_updates),
    ]
    
    results = []
    for test_name, test_func in tests:
        try:
            result = test_func()
            results.append((test_name, result))
        except Exception as e:
            print(f"\n❌ Error running {test_name}: {e}")
            results.append((test_name, False))
    
    print("\n" + "=" * 60)
    print("Test Summary")
    print("=" * 60)
    
    for test_name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status} - {test_name}")
    
    all_passed = all(result for _, result in results)
    
    if all_passed:
        print("\n🎉 All tests passed! Code structure is correct.")
        return 0
    else:
        print("\n⚠️  Some tests failed. Please review the output above.")
        return 1

if __name__ == '__main__':
    sys.exit(main())

