import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import ResourcesPage from "./page";
import { useResources } from "@/hooks/useResource";

// Mock dos hooks
vi.mock("@/hooks/useResource", () => ({
	useResources: vi.fn(),
}));

// Mock de componentes
vi.mock("@/components/Header1", () => ({
	Header1: ({ text }: { text: string }) => <h1>{text}</h1>,
}));

vi.mock("@/components/Paragraph", () => ({
	Paragraph: ({ text }: { text: string }) => <p>{text}</p>,
}));

vi.mock("@/components/FullScreenLoading", () => ({
	FullScreenLoading: () => <div>FullScreenLoading</div>,
}));

vi.mock("@/components/FullScreenError", () => ({
	FullScreenError: ({ error }: { error: string }) => <div>Error: {error}</div>,
}));

vi.mock("@/components/ui/card", () => ({
	Card: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
	CardContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
	CardHeader: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
	CardTitle: ({ children }: { children: React.ReactNode }) => <h3>{children}</h3>,
}));

vi.mock("@/components/ui/badge", () => ({
	Badge: ({ children, variant }: { children: React.ReactNode; variant?: string }) => (
		<span className={variant}>{children}</span>
	),
}));

describe("ResourcesPage", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("should render loading state", () => {
		(useResources as vi.Mock).mockReturnValue({
			resources: [],
			loading: true,
			error: null,
		});

		render(<ResourcesPage />);

		expect(screen.getByText("FullScreenLoading")).toBeInTheDocument();
	});

	it("should render error state", () => {
		(useResources as vi.Mock).mockReturnValue({
			resources: [],
			loading: false,
			error: "Erro ao carregar recursos",
		});

		render(<ResourcesPage />);

		expect(screen.getByText("Error: Erro ao carregar recursos")).toBeInTheDocument();
	});

	it("should render resources", async () => {
		const mockResources = [
			{
				id: 1,
				name: "Computador",
				resource_type: "COMPUTER",
				description: "Computador para uso estudantil",
				status: "AVAILABLE",
				created_at: "2023-01-01T00:00:00Z",
			},
		];

		(useResources as vi.Mock).mockReturnValue({
			resources: mockResources,
			loading: false,
			error: null,
		});

		render(<ResourcesPage />);

		await waitFor(() => {
			expect(screen.getByRole('heading', { name: 'Recursos', level: 1 })).toBeInTheDocument();
			expect(screen.getByText("Recursos disponíveis na escola")).toBeInTheDocument();
			const computadorElements = screen.getAllByText('Computador');
			expect(computadorElements).toHaveLength(3);
		});
	});

	it("should display 'No resources found' message when no resources exist", async () => {
		(useResources as vi.Mock).mockReturnValue({
			resources: [],
			loading: false,
			error: null,
		});

		render(<ResourcesPage />);

		await waitFor(() => {
			expect(screen.getByText("Nenhum recurso encontrado.")).toBeInTheDocument();
		});
	});
});