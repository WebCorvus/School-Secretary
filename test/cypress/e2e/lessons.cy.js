describe("Lessons page", () => {
	beforeEach(() => {
		cy.login();
		cy.visit("/lessons");
	});

	it("should render the page title", () => {
		cy.get("h1").should("contain.text", "Horários da Turma");
	});

	it("should navigate to add page when add button is clicked", () => {
		cy.get('[data-test="add-button"]').click();
		cy.url().should("include", "/lessons/add");
		cy.get("h1").should("contain.text", "Adicionar Aula");
	});
});
