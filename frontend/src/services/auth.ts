import axios from "axios";
import { LOGIN_BASE_URL } from "@/config";

interface LoginResponse {
	access: string;
	refresh: string;
}

export async function login(
	username: string,
	password: string
): Promise<LoginResponse> {
	try {
		const response = await axios.post(LOGIN_BASE_URL, {
			username,
			password,
		});

		const { access, refresh } = response.data;

		document.cookie = `access=${access}; path=/; SameSite=Lax`;
		document.cookie = `refresh=${refresh}; path=/; SameSite=Lax`;

		return { access, refresh };
	} catch (error) {
		throw new Error("Login falhou. Verifique usuário e senha.");
	}
}

export function logout() {
	document.cookie = "access=; path=/; max-age=0;";
	document.cookie = "refresh=; path=/; max-age=0;";
}
