import { render, screen, act } from "@testing-library/react";
import LessonsPage from "./page";

describe("LessonsPage", () => {
	it("should render the page", async () => {
		await act(async () => {
			render(<LessonsPage />);
		});
		// TODO: Mock the api call and test the table
		expect(screen.getByText("Horários da Turma")).toBeInTheDocument();
	});
});
