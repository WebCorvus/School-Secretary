
import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import HorizontalLine from "./index";

describe("HorizontalLine", () => {
	it("deve renderizar um elemento hr", () => {
		const { container } = render(<HorizontalLine />);
		expect(container.querySelector("hr")).toBeInTheDocument();
	});
});
