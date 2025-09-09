describe("Logout", () => {
	it("should successfully log out a user", () => {
		cy.login("testuser", "testpassword"); // Use the custom login command

		// After login, verify we are on a protected page (e.g., home)
		cy.visit("/");
		cy.url().should("eq", Cypress.config().baseUrl + "/");
		cy.getCookie("access").should("exist");

		// Intercept the logout API call
		cy.intercept("POST", `${Cypress.env("API_URL")}auth/logout/`, {
			statusCode: 200,
			body: { message: "Logged out successfully" },
		}).as("userLogout");

		// Simulate clicking a logout button or directly calling the logout API
		// For now, we'll simulate a direct request to the logout endpoint
		cy.request({
			method: "POST",
			url: `${Cypress.env("API_URL")}auth/logout/`,
		});

		cy.wait("@userLogout").its("response.statusCode").should("eq", 200);

		// Assert that the access cookie is removed
		cy.getCookie("access").should("not.exist");

		// Assert that the user is redirected to the login page
		cy.url().should("eq", Cypress.config().baseUrl + "/login");
	});
});
