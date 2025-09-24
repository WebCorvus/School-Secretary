
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

import { LoginForm } from "./index";

describe("LoginForm", () => {
	it("deve renderizar o formulário de login", () => {
		render(<LoginForm />);

		expect(screen.getByText("Faça seu login")).toBeInTheDocument();
		expect(
			screen.getByText("Insira email e senha abaixo para acessar sua conta")
		).toBeInTheDocument();

		expect(screen.getByLabelText("Email")).toBeInTheDocument();
		expect(screen.getByLabelText("Senha")).toBeInTheDocument();

		expect(screen.getByRole("button", { name: "Login" })).toBeInTheDocument();
	});

	it("deve exibir uma mensagem de erro", () => {
		render(<LoginForm error="Invalid credentials" />);
		expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
	});

	it("deve enviar o formulário", () => {
		const handleSubmit = vi.fn((e) => e.preventDefault());
		render(<LoginForm onSubmit={handleSubmit} />);

		const emailInput = screen.getByLabelText("Email");
		const passwordInput = screen.getByLabelText("Senha");
		const loginButton = screen.getByRole("button", { name: "Login" });

		fireEvent.change(emailInput, { target: { value: "test@example.com" } });
		fireEvent.change(passwordInput, { target: { value: "password" } });

		fireEvent.click(loginButton);

		expect(handleSubmit).toHaveBeenCalledTimes(1);
	});
});
