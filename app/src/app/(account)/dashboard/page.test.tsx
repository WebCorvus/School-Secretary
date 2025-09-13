import { render, screen, waitFor } from "@testing-library/react";
import Dashboard from "./page";

describe("Dashboard", () => {
	it("should render the page", async () => {
		render(<Dashboard />);

		await waitFor(() =>
			expect(
				screen.getByText("Bem-vindo ao School Secretary")
			).toBeInTheDocument()
		);

		expect(
			screen.getByText("Nenhuma atualização recente na agenda.")
		).toBeInTheDocument();
		expect(screen.getByText("Nenhum evento recente.")).toBeInTheDocument();
	});
});
