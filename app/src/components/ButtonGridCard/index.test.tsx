
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

import { ButtonGridCard } from "./index";
import { createFakeButtonGridItem } from "@/types/buttonGrid";

const mockData = [createFakeButtonGridItem(), createFakeButtonGridItem()];

const mockHandleClick = vi.fn();

describe("ButtonGridCard", () => {
	it("deve renderizar o cabeçalho e a descrição", () => {
		render(
			<ButtonGridCard
				header="Test Header"
				description="Test Description"
				data={mockData}
				handleClick={mockHandleClick}
			/>
		);

		expect(screen.getByText("Test Header")).toBeInTheDocument();
		expect(screen.getByText("Test Description")).toBeInTheDocument();
	});

	it("deve renderizar os botões com base nos dados fornecidos", () => {
		render(
			<ButtonGridCard
				header="Test Header"
				data={mockData}
				handleClick={mockHandleClick}
			/>
		);

		expect(screen.getByText(mockData[0].title)).toBeInTheDocument();
		expect(screen.getByText(mockData[1].title)).toBeInTheDocument();
	});

	it('deve chamar a função handleClick quando um item é selecionado e confirmado', () => {
		render(
			<ButtonGridCard
				header="Test Header"
				data={mockData}
				handleClick={mockHandleClick}
			/>
		);

		const button1 = screen.getByText(mockData[0].title);
		fireEvent.click(button1);

		const confirmButton = screen.getByText("Confirmar");
		fireEvent.click(confirmButton);

		expect(mockHandleClick).toHaveBeenCalledTimes(1);
		expect(mockHandleClick).toHaveBeenCalledWith(mockData[0]);
	});
});
