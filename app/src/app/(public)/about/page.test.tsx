import { render, screen } from "@testing-library/react";
import About from "./page";

describe("About", () => {
	it("should render the page", () => {
		render(<About />);
		expect(
			screen.getByText("Secretaria Escolar - Escola Exemplo")
		).toBeInTheDocument();
	});
});
