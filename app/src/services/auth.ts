import axios from "axios";
import { setCookie, deleteCookie } from "cookies-next";
import { EXTERNAL_API_HOST, LOGIN_ROUTE } from "@/config";

interface LoginResponse {
	access: string;
	refresh: string;
}

export async function login(
	email: string,
	password: string
): Promise<LoginResponse> {
	try {
		const response = await axios.post(
			EXTERNAL_API_HOST + LOGIN_ROUTE,
			{
				email,
				password,
			},
			{
				headers: {
					"Content-Type": "application/json",
				},
			}
		);

		const { access, refresh } = response.data;

		setCookie("access", access, {
			path: "/",
			sameSite: "lax",
		});
		setCookie("refresh", refresh, {
			path: "/",
			sameSite: "lax",
		});

		return { access, refresh };
	} catch (error) {
		throw new Error("Login falhou. Verifique email e senha.");
	}
}

export function logout(): void {
	deleteCookie("access", { path: "/" });
	deleteCookie("refresh", { path: "/" });
}
