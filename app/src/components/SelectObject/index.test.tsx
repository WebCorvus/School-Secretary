
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

import SelectObject from "./index";
import { createFakeSelectOption } from "@/types/routeObject";

const mockOptions = [createFakeSelectOption(), createFakeSelectOption()];

describe("SelectObject", () => {
	it("deve renderizar o select com as opções", () => {
		render(<SelectObject options={mockOptions} onSelect={() => {}} />);
		expect(screen.getByText("Selecione uma opção")).toBeInTheDocument();
		expect(screen.getByText(mockOptions[0].short_name)).toBeInTheDocument();
		expect(screen.getByText(mockOptions[1].short_name)).toBeInTheDocument();
	});

	it("deve chamar onSelect com o valor correto ao selecionar uma opção", () => {
		const mockOnSelect = vi.fn();
		render(<SelectObject options={mockOptions} onSelect={mockOnSelect} />);

		const select = screen.getByRole("combobox");
		fireEvent.change(select, { target: { value: mockOptions[1].id.toString() } });

		expect(mockOnSelect).toHaveBeenCalledTimes(1);
		expect(mockOnSelect).toHaveBeenCalledWith(mockOptions[1].id);
	});
});
