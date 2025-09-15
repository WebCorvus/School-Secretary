describe("Events page", () => {
	beforeEach(() => {
		cy.login();
		cy.visit("/events");
	});

	it("should render the page title", () => {
		cy.get("h1").should("contain.text", "Eventos");
	});

	it("should navigate to add page when add button is clicked", () => {
		cy.get('[data-test="add-button"]').click();
		cy.url().should("include", "/events/add");
		cy.get("h1").should("contain.text", "Adicionar Evento");
	});
});
