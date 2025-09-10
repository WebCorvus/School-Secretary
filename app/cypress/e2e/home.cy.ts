describe("Home page", () => {
	beforeEach(() => {
		cy.login();
		cy.visit("/");
	});
});
