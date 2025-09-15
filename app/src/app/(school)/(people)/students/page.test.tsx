import { render, screen, act } from "@testing-library/react";
import StudentsPage from "./page";

describe("StudentsPage", () => {
    it("should render the page", async () => {
        await act(async () => {
            render(<StudentsPage />);
        });
        // TODO: Mock the api call and test the table
        expect(screen.getByText("Dados dos Alunos Cadastrados")).toBeInTheDocument();
    });
});
