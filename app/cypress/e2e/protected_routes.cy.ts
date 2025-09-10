describe("Protected Routes", () => {
	it("should redirect to login if not authenticated", () => {
		cy.getCookie("access").should("not.exist");
		cy.getCookie("refresh").should("not.exist");
		cy.visit("/students");
		cy.url().should("include", "/login");
	});

	it("should allow access to protected route if authenticated", () => {
		cy.login();
		cy.getCookie("access").should("exist");
		cy.getCookie("refresh").should("exist");
		cy.visit("/students");
		cy.url().should("include", "/students");
	});
});
