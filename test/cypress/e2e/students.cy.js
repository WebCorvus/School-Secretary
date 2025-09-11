describe("Students page", () => {
	beforeEach(() => {
		cy.login();
		cy.visit("/students");
	});

	it("should render the page title", () => {
		cy.get("h1").should("contain.text", "Dados dos Alunos Cadastrados");
	});

	it("should navigate to add page when add button is clicked", () => {
		cy.get('[data-test="add-button"]').click();
		cy.url().should("include", "/students/add");
		cy.get("h1").should("contain.text", "Adicionar Aluno");
	});
});
