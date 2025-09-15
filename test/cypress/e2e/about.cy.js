describe("About page", () => {
    it("should render the page", () => {
        cy.visit("/about");
        cy.get("h1").should("contain.text", "Secretaria Escolar - Escola Exemplo");
    });
});
