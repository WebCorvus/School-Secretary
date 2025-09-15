import { render, screen, act } from "@testing-library/react";
import AddAgendaItem from "./page";

describe("AddAgendaItem", () => {
    it("should render the page", async () => {
        await act(async () => {
            render(<AddAgendaItem />);
        });
        // TODO: Mock the api call and test the form
        expect(screen.getByText("Adicionar Item na Agenda")).toBeInTheDocument();
    });
});
