describe("Agenda page", () => {
	beforeEach(() => {
		cy.login();
		cy.visit("/agenda");
	});

	it("should render the page title", () => {
		cy.get("h1").should("contain.text", "Agenda");
	});

	it("should navigate to add page when add button is clicked", () => {
		cy.get('[data-test="add-button"]').click();
		cy.url().should("include", "/agenda/add");
		cy.get("h1").should("contain.text", "Adicionar Item na Agenda");
	});
});
