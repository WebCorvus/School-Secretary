
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

import { EventCard } from "./index";
import { createFakeEvent } from "@/types/event";

const mockEvent = createFakeEvent();

const mockOnClick = vi.fn();

describe("EventCard", () => {
	it("deve renderizar os detalhes do evento", () => {
		render(<EventCard event={mockEvent} onClick={mockOnClick} />);

		expect(screen.getByText(mockEvent.title)).toBeInTheDocument();
		expect(screen.getByText(mockEvent.description)).toBeInTheDocument();
		expect(
			screen.getByText(`${mockEvent.start_date} - ${mockEvent.end_date}`)
		).toBeInTheDocument();
		expect(
			screen.getByText(`${mockEvent.start_time} - ${mockEvent.end_time}`)
		).toBeInTheDocument();
		expect(screen.getByText(mockEvent.location)).toBeInTheDocument();
	});

	it('deve chamar a função onClick ao clicar em "Ver detalhes"', () => {
		render(<EventCard event={mockEvent} onClick={mockOnClick} />);

		const detailsButton = screen.getByText("Ver detalhes");
		fireEvent.click(detailsButton);

		expect(mockOnClick).toHaveBeenCalledTimes(1);
		expect(mockOnClick).toHaveBeenCalledWith(mockEvent);
	});
});
