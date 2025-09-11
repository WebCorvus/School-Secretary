import { render, screen, act } from "@testing-library/react";
import AddProfessor from "./page";

describe("AddProfessor", () => {
    it("should render the page", async () => {
        await act(async () => {
            render(<AddProfessor />);
        });
        // TODO: Mock the api call and test the form
        expect(screen.getByText("Adicionar Professor")).toBeInTheDocument();
    });
});
