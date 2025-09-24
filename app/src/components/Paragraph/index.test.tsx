
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { Paragraph } from "./index";

describe("Paragraph", () => {
	it("deve renderizar o texto do parágrafo", () => {
		render(<Paragraph text="Test Paragraph" />);
		expect(screen.getByText("Test Paragraph")).toBeInTheDocument();
	});
});
