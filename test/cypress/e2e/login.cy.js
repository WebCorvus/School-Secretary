describe("Login page", () => {
    it("should render the page", () => {
        cy.visit("/login");
        cy.get("h1").should("contain.text", "Login");
    });
});
