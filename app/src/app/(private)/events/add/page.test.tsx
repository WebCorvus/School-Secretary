import { render, screen } from "@testing-library/react";
import AddEvent from "./page";

describe("AddEvent", () => {
    it("should render the page", () => {
        render(<AddEvent />);
        // TODO: Mock the api call and test the form
        expect(screen.getByText("Adicionar Evento")).toBeInTheDocument();
    });
});
