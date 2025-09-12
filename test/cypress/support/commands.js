// cypress/support/commands.js
Cypress.Commands.add("login", () => {
	const email = Cypress.env("TEST_USER_EMAIL");
	const password = Cypress.env("TEST_USER_PASSWORD");
	const loginUrl = Cypress.env("LOGIN_URL");

	return cy
		.request({
			method: "POST",
			url: `${loginUrl}`,
			body: { email, password },
			failOnStatusCode: false,
		})
		.then((resp) => {
			expect(resp.status).to.be.within(200, 299);

			const { access, refresh } = resp.body;

			cy.setCookie("access", `${access}`);
			cy.setCookie("refresh", `${refresh}`);

			cy.getCookie("access").should("exist");
			cy.getCookie("refresh").should("exist");
		});
});
