import { render, screen } from "@testing-library/react";
import Header from ".";
import { expect, it, describe } from "vitest";

describe("Header", () => {
	it("renders all header buttons", () => {
		render(<Header />);

		expect(screen.getByText("Início")).toBeInTheDocument();
		expect(screen.getByText("Estudantes")).toBeInTheDocument();
		expect(screen.getByText("Professores")).toBeInTheDocument();
		expect(screen.getByText("Matérias")).toBeInTheDocument();
		expect(screen.getByText("Itinerários")).toBeInTheDocument();
		expect(screen.getByText("Turmas")).toBeInTheDocument();
		expect(screen.getByText("Horários")).toBeInTheDocument();
		expect(screen.getByText("Eventos")).toBeInTheDocument();
		expect(screen.getByText("Agenda")).toBeInTheDocument();
	});

	it("has the correct number of links", () => {
		render(<Header />);
		expect(screen.getAllByRole("link")).toHaveLength(9);
	});
});
