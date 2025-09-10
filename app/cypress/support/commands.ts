const email = Cypress.env("TEST_EMAIL");
const password = Cypress.env("TEST_PASSWORD");

Cypress.Commands.add("login", () => {
	// TODO implement requests
	// cy.request("POST", `${Cypress.env("LOGIN_URL")}`, {
	// 	email: `${email}`,
	// 	password: `${password}`,
	// }).then((response) => {
	// 	cy.setCookie("access", `${response.body.access}`);
	// 	cy.setCookie("refresh", `${response.body.refresh}`);
	// });

	cy.setCookie("access", `test-acess-token`);
	cy.setCookie("refresh", `test-acess-token`);
});
