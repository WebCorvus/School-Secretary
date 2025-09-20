import axios from "axios";

export async function login(email: string, password: string): Promise<void> {
	try {
		await axios.post("/auth/login", { email, password });
		window.location.href = "/dashboard";
	} catch (error) {
		throw new Error("Login falhou. Verifique email e senha.");
	}
}

export async function logout(): Promise<void> {
	try {
		await axios.post("/auth/logout");
		window.location.href = "/dashboard";
	} catch (error) {
		console.error("Falha no logout:", error);
	}
}
