Cypress.Commands.add("login", () => {
	cy.setCookie("access", `${response.body.access}`);
	cy.setCookie("refresh", `${response.body.access}`);
});
