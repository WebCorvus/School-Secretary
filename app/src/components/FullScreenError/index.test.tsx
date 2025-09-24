
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

import { FullScreenError } from "./index";

describe("FullScreenError", () => {
	it("não deve renderizar nada se não houver erro", () => {
		const { container } = render(<FullScreenError error="" />);
		expect(container.firstChild).toBeNull();
	});

	it("deve renderizar a mensagem de erro", () => {
		render(<FullScreenError error="Test Error" />);
		expect(screen.getByText("Test Error")).toBeInTheDocument();
	});

	it('deve renderizar o botão "Tentar novamente" se onRetry for fornecido', () => {
		const mockOnRetry = vi.fn();
		render(<FullScreenError error="Test Error" onRetry={mockOnRetry} />);
		expect(screen.getByText("Tentar novamente")).toBeInTheDocument();
	});

	it('não deve renderizar o botão "Tentar novamente" se onRetry não for fornecido', () => {
		render(<FullScreenError error="Test Error" />);
		expect(screen.queryByText("Tentar novamente")).not.toBeInTheDocument();
	});

	it('deve chamar onRetry quando o botão "Tentar novamente" for clicado', () => {
		const mockOnRetry = vi.fn();
		render(<FullScreenError error="Test Error" onRetry={mockOnRetry} />);
		const retryButton = screen.getByText("Tentar novamente");
		fireEvent.click(retryButton);
		expect(mockOnRetry).toHaveBeenCalledTimes(1);
	});
});
