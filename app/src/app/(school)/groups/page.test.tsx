import { render, screen, act } from "@testing-library/react";
import GroupsPage from "./page";

describe("GroupsPage", () => {
    it("should render the page", async () => {
        await act(async () => {
            render(<GroupsPage />);
        });
        // TODO: Mock the api call and test the table
        expect(screen.getByText("Turmas")).toBeInTheDocument();
    });
});
