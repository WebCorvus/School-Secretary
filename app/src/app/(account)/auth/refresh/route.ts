
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { getCookie } from "cookies-next";
import { REFRESH_ROUTE } from "@/config";

const DJANGO_REFRESH_URL = process.env.INTERNAL_DJANGO_API_URL + REFRESH_ROUTE;

export async function POST(req: NextRequest) {
	try {
		const refreshToken = getCookie("refresh", { req });

		if (!refreshToken) {
			return new NextResponse(JSON.stringify({ error: "Refresh token not found." }), { status: 401 });
		}

		const response = await axios.post(DJANGO_REFRESH_URL, {
			refresh: refreshToken,
		});

		const { access } = response.data;

		return new NextResponse(JSON.stringify({ access }), {
			status: 200,
			headers: { "Content-Type": "application/json" },
		});
	} catch (error: any) {
		console.error("Erro na rota /api/auth/refresh:", error);
		const status = error.response?.status || 500;
		const message = error.response?.data?.detail || "Erro interno do servidor.";
		return new NextResponse(JSON.stringify({ error: message }), { status });
	}
}
