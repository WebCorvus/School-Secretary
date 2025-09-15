import { render, screen, act } from "@testing-library/react";
import AddStudents from "./page";

describe("AddStudents", () => {
    it("should render the page", async () => {
        await act(async () => {
            render(<AddStudents />);
        });
        // TODO: Mock the api call and test the form
        expect(screen.getByText("Adicionar Aluno")).toBeInTheDocument();
    });
});
