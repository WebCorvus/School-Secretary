describe("Protected Routes", () => {
	it("should redirect to login if not authenticated", () => {
		cy.visit("/students"); // A protected route
		cy.url().should("eq", Cypress.config().baseUrl + "/login");
		cy.getCookie("access").should("not.exist");
	});

	it("should allow access to protected route if authenticated", () => {
		cy.login("testuser", "testpassword"); // Log in using the custom command
		cy.visit("/students"); // A protected route
		cy.url().should("eq", Cypress.config().baseUrl + "/students");
		cy.getCookie("access").should("exist");
		cy.get("h1").contains("Estudantes"); // Assert some content on the protected page
	});
});
