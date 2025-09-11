describe("Subjects page", () => {
	beforeEach(() => {
		cy.login();
		cy.visit("/subjects");
	});

	it("should render the page title", () => {
		cy.get("h1").should("contain.text", "Matérias");
	});

	it("should navigate to add page when add button is clicked", () => {
		cy.get('[data-test="add-button"]').click();
		cy.url().should("include", "/subjects/add");
		cy.get("h1").should("contain.text", "Adicionar Matérias");
	});
});
