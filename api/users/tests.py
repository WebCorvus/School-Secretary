
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from .logger import UserActionLogger

User = get_user_model()

class UserSimulationTest(APITestCase):
	def setUp(self):
		self.admin = User.objects.create_superuser(
			email="admin@example.com", password="adminpass", name="Admin"
		)
		self.user_data = {
			"email": "testuser@example.com",
			"name": "Test User",
			"password": "testpass123",
			"role": "STUDENT"
		}
		self.login_url = reverse("token_obtain_pair")
		self.user_url = reverse("users-list")
		UserActionLogger.clear()

	def log_and_assert(self, user_id, action, data=None, response=None, error=None):
		UserActionLogger.log_action(user_id, action, data, response, error)
		if error:
			last = UserActionLogger.get_last_actions(user_id)
			print(f"\n[LOG] Últimas ações do usuário {user_id} antes do erro:")
			for i, entry in enumerate(last):
				print(f"{i+1}: {entry}")
			self.fail(f"Erro na ação '{action}': {error}")

	def test_user_register_login_delete(self):
		# 1. Registrar usuário
		resp = self.client.post(self.user_url, self.user_data, format="json")
		self.log_and_assert(
			self.user_data["email"], "register", self.user_data, resp.data, None if resp.status_code == 201 else resp.data
		)
		self.assertEqual(resp.status_code, 201)

		# 2. Login do usuário
		login_data = {"email": self.user_data["email"], "password": self.user_data["password"]}
		resp = self.client.post(self.login_url, login_data, format="json")
		self.log_and_assert(
			self.user_data["email"], "login", login_data, resp.data, None if resp.status_code == 200 else resp.data
		)
		self.assertEqual(resp.status_code, 200)
		access_token = resp.data["access"]

		# 3. Buscar dados do usuário (GET)
		self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {access_token}")
		resp = self.client.get(self.user_url)
		self.log_and_assert(
			self.user_data["email"], "get-list", None, resp.data, None if resp.status_code == 200 else resp.data
		)
		self.assertEqual(resp.status_code, 200)

		# 4. Deletar usuário (feito pelo admin)
		self.client.force_authenticate(user=self.admin)
		user_id = User.objects.get(email=self.user_data["email"]).id
		url = reverse("users-detail", args=[user_id])
		resp = self.client.delete(url)
		self.log_and_assert(
			self.admin.email, "delete", {"user_id": user_id}, resp.data, None if resp.status_code in (204, 200, 202) else resp.data
		)
		self.assertIn(resp.status_code, (204, 200, 202))

	def test_log_on_error(self):
		# Simula erro proposital para testar log
		fake_email = "fakeuser@example.com"
		login_data = {"email": fake_email, "password": "wrongpass"}
		resp = self.client.post(self.login_url, login_data, format="json")
		self.log_and_assert(
			fake_email, "login", login_data, resp.data, None if resp.status_code == 200 else resp.data
		)
		self.assertNotEqual(resp.status_code, 200)
