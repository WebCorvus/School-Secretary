import { render, screen, act } from "@testing-library/react";
import ProfessorsPage from "./page";

describe("ProfessorsPage", () => {
    it("should render the page", async () => {
        await act(async () => {
            render(<ProfessorsPage />);
        });
        // TODO: Mock the api call and test the table
        expect(screen.getByText("Dados dos Professores Cadastrados")).toBeInTheDocument();
    });
});
