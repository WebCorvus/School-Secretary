describe("Groups page", () => {
	beforeEach(() => {
		cy.login();
		cy.visit("/groups");
	});

	it("should render the page title", () => {
		cy.get("h1").should("contain.text", "Turmas");
	});

	it("should navigate to add page when add button is clicked", () => {
		cy.get('[data-test="add-button"]').click();
		cy.url().should("include", "/groups/add");
		cy.get("h1").should("contain.text", "Adicionar Turma");
	});
});
