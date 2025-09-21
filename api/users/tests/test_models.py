from django.test import TestCase
from django.contrib.auth import get_user_model


class UserModelTest(TestCase):

    def test_create_user(self):
        User = get_user_model()
        user = User.objects.create_user(
            email="test@example.com", password="password123", name="Test User"
        )
        self.assertEqual(user.email, "test@example.com")
        self.assertTrue(user.is_active)
        self.assertFalse(user.is_staff)
        self.assertFalse(user.is_superuser)
        self.assertEqual(user.name, "Test User")
        self.assertEqual(user.role, User.Role.STUDENT)
        self.assertIsNotNone(user.password)

    def test_create_superuser(self):
        User = get_user_model()
        superuser = User.objects.create_superuser(
            email="admin@example.com", password="adminpassword", name="Admin User"
        )
        self.assertEqual(superuser.email, "admin@example.com")
        self.assertTrue(superuser.is_active)
        self.assertTrue(superuser.is_staff)
        self.assertTrue(superuser.is_superuser)
        self.assertEqual(superuser.name, "Admin User")
        self.assertEqual(superuser.role, User.Role.SUPERUSER)
        self.assertIsNotNone(superuser.password)

    def test_user_role_staff(self):
        User = get_user_model()
        staff_user = User.objects.create_user(
            email="staff@example.com",
            password="password123",
            name="Staff User",
            role=User.Role.STAFF,
        )
        self.assertTrue(staff_user.is_staff)
        self.assertFalse(staff_user.is_superuser)
        self.assertEqual(staff_user.role, User.Role.STAFF)

    def test_user_role_professor(self):
        User = get_user_model()
        professor_user = User.objects.create_user(
            email="professor@example.com",
            password="password123",
            name="Professor User",
            role=User.Role.PROFESSOR,
        )
        self.assertFalse(professor_user.is_staff)
        self.assertFalse(professor_user.is_superuser)
        self.assertEqual(professor_user.role, User.Role.PROFESSOR)

    def test_user_role_guardian(self):
        User = get_user_model()
        guardian_user = User.objects.create_user(
            email="guardian@example.com",
            password="password123",
            name="Guardian User",
            role=User.Role.GUARDIAN,
        )
        self.assertFalse(guardian_user.is_staff)
        self.assertFalse(guardian_user.is_superuser)
        self.assertEqual(guardian_user.role, User.Role.GUARDIAN)

    def test_user_email_unique(self):
        User = get_user_model()
        User.objects.create_user(
            email="unique@example.com", password="password123", name="User 1"
        )
        with self.assertRaises(Exception):
            User.objects.create_user(
                email="unique@example.com", password="password456", name="User 2"
            )

    def test_user_profile_property(self):
        User = get_user_model()
        user = User.objects.create_user(
            email="profile@example.com",
            password="password123",
            name="Profile User",
            role=User.Role.STUDENT,
        )
        self.assertIsNone(user.profile)
