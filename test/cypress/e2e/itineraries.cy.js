describe("Itineraries page", () => {
	beforeEach(() => {
		cy.login();
		cy.visit("/itineraries");
	});

	it("should render the page title", () => {
		cy.get("h1").should("contain.text", "Itinerários");
	});

	it("should navigate to add page when add button is clicked", () => {
		cy.get('[data-test="add-button"]').click();
		cy.url().should("include", "/itineraries/add");
		cy.get("h1").should("contain.text", "Adicionar Itinerário");
	});
});
