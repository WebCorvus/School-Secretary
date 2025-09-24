
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { Header2 } from "./index";

describe("Header2", () => {
	it("deve renderizar o texto do cabeçalho", () => {
		render(<Header2 text="Test Header" />);
		expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
			"Test Header"
		);
	});
});
