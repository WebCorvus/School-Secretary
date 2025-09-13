import { render, screen, act } from "@testing-library/react";
import SubjectsPage from "./page";

describe("SubjectsPage", () => {
    it("should render the page", async () => {
        await act(async () => {
            render(<SubjectsPage />);
        });
        // TODO: Mock the api call and test the table
        expect(screen.getByText("Matérias")).toBeInTheDocument();
    });
});
