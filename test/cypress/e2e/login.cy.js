describe("Login page", () => {
	it("should render the page", () => {
		cy.visit("/");
		cy.get("h1").should("contain.text", "Login");
	});
});
