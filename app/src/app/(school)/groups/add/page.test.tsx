import { render, screen, act } from "@testing-library/react";
import AddGroup from "./page";

describe("AddGroup", () => {
    it("should render the page", async () => {
        await act(async () => {
            render(<AddGroup />);
        });
        // TODO: Mock the api call and test the form
        expect(screen.getByText("Adicionar Turma")).toBeInTheDocument();
    });
});
