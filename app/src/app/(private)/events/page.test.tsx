import { render, screen, act } from "@testing-library/react";
import EventsPage from "./page";

describe("EventsPage", () => {
    it("should render the page", async () => {
        await act(async () => {
            render(<EventsPage />);
        });
        // TODO: Mock the api call and test the table
        expect(screen.getByText("Eventos")).toBeInTheDocument();
    });
});
