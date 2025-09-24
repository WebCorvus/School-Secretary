
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { Header1 } from "./index";

describe("Header1", () => {
	it("deve renderizar o texto do cabeçalho", () => {
		render(<Header1 text="Test Header" />);
		expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
			"Test Header"
		);
	});
});
