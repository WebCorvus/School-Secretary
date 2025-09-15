describe("Professors page", () => {
	beforeEach(() => {
		cy.login();
		cy.visit("/professors");
	});

	it("should render the page title", () => {
		cy.get("h1").should(
			"contain.text",
			"Dados dos Professores Cadastrados"
		);
	});

	it("should navigate to add page when add button is clicked", () => {
		cy.get('[data-test="add-button"]').click();
		cy.url().should("include", "/professors/add");
		cy.get("h1").should("contain.text", "Adicionar Professor");
	});
});
