import { render, screen } from "@testing-library/react";
import AddSubject from "./page";

describe("AddSubject", () => {
    it("should render the page", () => {
        render(<AddSubject />);
        // TODO: Mock the api call and test the form
        expect(screen.getByText("Adicionar Matérias")).toBeInTheDocument();
    });
});
