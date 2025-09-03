import axios from "axios";

export async function login(email: string, password: string): Promise<void> {
	try {
		await axios.post("/auth/login", {
			email,
			password,
		});
	} catch (error) {
		throw new Error("Login falhou. Verifique email e senha.");
	}
}

export async function logout(): Promise<void> {
	try {
		await axios.post("/auth/logout");
	} catch (error) {
		console.error("Falha no logout:", error);
	}
}
