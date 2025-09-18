import axios from "axios";
import { getCookie, setCookie } from "cookies-next";
import { REFRESH_ROUTE } from "@/config";
import { toast } from "sonner";

const DJANGO_REFRESH_URL = process.env.INTERNAL_DJANGO_API_URL + REFRESH_ROUTE;

const api = axios.create();

api.interceptors.request.use(
	(config: any) => {
		const token = getCookie("access");
		if (token) {
			if (!config.headers) config.headers = {};
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => Promise.reject(error)
);

api.interceptors.response.use(
	(response) => response,
	async (error: any) => {
		const originalRequest = error.config;

		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;
			const refreshToken = getCookie("refresh");

			if (refreshToken) {
				try {
					const response = await axios.post(DJANGO_REFRESH_URL, {
						refresh: refreshToken,
					});
					const { access } = response.data;

					setCookie("access", access, { path: "/", sameSite: "lax" });

					if (!originalRequest.headers) originalRequest.headers = {};
					originalRequest.headers.Authorization = `Bearer ${access}`;

					toast.success("Token atualizado com sucesso!");
					return api(originalRequest);
				} catch (refreshError) {
					console.error("Refresh token failed", refreshError);
					window.location.href = "/login";
					toast.error("Sessão expirada, faça login novamente.");
					return Promise.reject(refreshError);
				}
			}
		}

		if (error.response?.status === 403) {
			window.location.href = "/login";
			toast.error("Acesso negado.");
		}

		return Promise.reject(error);
	}
);

export default api;
