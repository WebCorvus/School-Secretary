import { render, screen, act } from "@testing-library/react";
import AddLesson from "./page";

describe("AddLesson", () => {
    it("should render the page", async () => {
        await act(async () => {
            render(<AddLesson />);
        });
        // TODO: Mock the api call and test the form
        expect(screen.getByText("Adicionar Aula")).toBeInTheDocument();
    });
});
