import { render, screen } from "@testing-library/react";
import LoginPage from "./page";

describe("LoginPage", () => {
	it("should render the page", () => {
		render(<LoginPage />);
		// TODO: Mock the login function and test the form
		expect(screen.getByText("Login")).toBeInTheDocument();
	});
});
