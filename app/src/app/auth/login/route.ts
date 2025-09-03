import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { setCookie } from "cookies-next";
import { LOGIN_BASE_URL } from "@/config";

const DJANGO_LOGIN_URL = process.env.INTERNAL_DJANGO_API_URL + "users/token/";

export async function POST(req: NextRequest) {
  console.log("Requisição POST recebida em /auth/login (antes do req.json)");
  try {
    const { email, password } = await req.json();
    console.log("Corpo da requisição JSON lido com sucesso.");

    const response = await axios.post(
      DJANGO_LOGIN_URL,
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

    const res = new NextResponse(
      JSON.stringify({ message: "Login bem-sucedido" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );

    setCookie("access", access, {
      req,
      res,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60,
    });

    setCookie("access", access, {
      req,
      res,
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60,
    });

    setCookie("refresh", refresh, {
      req,
      res,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
    });

    return res;
  } catch (error: any) {
    console.error("Erro na rota /auth/login:", error);
    const status = error.response?.status || 500;
    const message =
      error.response?.data?.detail || "Erro interno do servidor.";
    return new NextResponse(JSON.stringify({ error: message }), { status });
  }
}