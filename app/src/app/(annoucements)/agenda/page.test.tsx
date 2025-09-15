import { render, screen, act } from "@testing-library/react";
import AgendaPage from "./page";

describe("AgendaPage", () => {
    it("should render the page", async () => {
        await act(async () => {
            render(<AgendaPage />);
        });
        // TODO: Mock the api call and test the table
        expect(screen.getByText("Agenda")).toBeInTheDocument();
    });
});
