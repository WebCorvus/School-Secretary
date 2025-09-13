import { render, screen, act } from "@testing-library/react";
import Home from "./page";

describe("Home", () => {
    it("should render the page", async () => {
        await act(async () => {
            render(<Home />);
        });
        // TODO: Mock the api call and test the agenda and events
        expect(screen.getByText("Bem-vindo ao School Secretary")).toBeInTheDocument();
    });
});
