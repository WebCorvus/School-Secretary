import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

import { AppSidebar } from "./index";

import { SidebarProvider } from "@/components/ui/sidebar";

import { useRouter } from "next/navigation";
import { logout } from "@/services/auth";

import { ROUTES } from "@/config";

const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
	useRouter: () => ({
		push: mockPush,
	}),
}));

vi.mock("@/services/auth", () => ({
	logout: vi.fn(),
}));

describe("AppSidebar", () => {
	it("deve renderizar o sidebar com todos os itens de navegação e o botão de logout", () => {
		render(
			<SidebarProvider>
				<AppSidebar />
			</SidebarProvider>
		);

		expect(
			screen.getByRole("link", { name: /Início/i })
		).toBeInTheDocument();
		expect(
			screen.getByRole("link", { name: /Notificações/i })
		).toBeInTheDocument();

		expect(screen.getByText("Anúncios")).toBeInTheDocument();
		expect(screen.getByText("Escola")).toBeInTheDocument();

		expect(
			screen.getByRole("link", { name: /Atividades/i })
		).toBeInTheDocument();
		expect(
			screen.getByRole("link", { name: /Eventos/i })
		).toBeInTheDocument();
		expect(
			screen.getByRole("link", { name: /Aulas/i })
		).toBeInTheDocument();
		expect(
			screen.getByRole("link", { name: /Sobre/i })
		).toBeInTheDocument();
		expect(
			screen.getByRole("link", { name: /Painel administrativo/i })
		).toBeInTheDocument();

		expect(
			screen.getByRole("button", { name: /Logout/i })
		).toBeInTheDocument();
	});

	it("deve ter os links de navegação com as URLs corretas", () => {
		render(
			<SidebarProvider>
				<AppSidebar />
			</SidebarProvider>
		);

		expect(screen.getByRole("link", { name: /Início/i })).toHaveAttribute(
			"href",
			"/dashboard"
		);

		expect(
			screen.getByRole("link", { name: /Atividades/i })
		).toHaveAttribute("href", "/agenda");

		const adminLink = screen.getByRole("link", {
			name: /Painel administrativo/i,
		});
		expect(adminLink).toHaveAttribute("href", `${ROUTES.ADMIN}`);
	});

	it('deve chamar a função de logout e redirecionar para a página inicial ao clicar no botão "Logout"', async () => {
		render(
			<SidebarProvider>
				<AppSidebar />
			</SidebarProvider>
		);

		const logoutButton = screen.getByRole("button", { name: /Logout/i });

		fireEvent.click(logoutButton);

		expect(logout).toHaveBeenCalledTimes(1);

		expect(mockPush).toHaveBeenCalledTimes(1);
		expect(mockPush).toHaveBeenCalledWith("/");
	});
});
