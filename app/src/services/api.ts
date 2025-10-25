import axios from "axios";
import { getCookie, setCookie } from "cookies-next";

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

    // Handle 401 Unauthorized - try to refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const response = await axios.post("/auth/refresh");
        const { access } = response.data;

        setCookie("access", access, { path: "/", sameSite: "lax" });

        if (!originalRequest.headers) originalRequest.headers = {};
        originalRequest.headers.Authorization = `Bearer ${access}`;

        console.log("Token refreshed!");
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Refresh token failed", refreshError);
        // Redirect to login if refresh fails
        if (typeof window !== "undefined") {
          window.location.href = "/auth/login";
        }
        return Promise.reject(refreshError);
      }
    }

    // Handle 403 Forbidden - redirect to login
    if (error.response?.status === 403) {
      console.error("Access forbidden - redirecting to login");
      if (typeof window !== "undefined") {
        window.location.href = "/auth/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
