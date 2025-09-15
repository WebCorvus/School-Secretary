import { render, screen } from "@testing-library/react";
import AddItinerary from "./page";

describe("AddItinerary", () => {
    it("should render the page", () => {
        render(<AddItinerary />);
        // TODO: Mock the api call and test the form
        expect(screen.getByText("Adicionar Itinerário")).toBeInTheDocument();
    });
});
