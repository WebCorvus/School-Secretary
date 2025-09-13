import { render, screen, act } from "@testing-library/react";
import ItinerariesPage from "./page";

describe("ItinerariesPage", () => {
    it("should render the page", async () => {
        await act(async () => {
            render(<ItinerariesPage />);
        });
        // TODO: Mock the api call and test the table
        expect(screen.getByText("Itinerários")).toBeInTheDocument();
    });
});
