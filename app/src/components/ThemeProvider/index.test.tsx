
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { ThemeProvider } from "./index";

describe("ThemeProvider", () => {
	it("deve renderizar os filhos", () => {
		render(
			<ThemeProvider>
				<div>Child Component</div>
			</ThemeProvider>
		);

		expect(screen.getByText("Child Component")).toBeInTheDocument();
	});
});
