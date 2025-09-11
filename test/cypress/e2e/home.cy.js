describe("Home", () => {
	it("should render home page elements correctly", () => {
		cy.login();
		cy.visit("/");

		cy.contains("h1", "Bem-vindo");

		cy.get("body").then(($body) => {
			if ($body.find('[data-test="agenda-items"]').length) {
				cy.get('[data-test="empty-agenda"]').should("not.exist");
			} else {
				cy.get('[data-test="empty-agenda"]').should("exist");
			}
		});

		cy.get("body").then(($body) => {
			if ($body.find('[data-test="event-items"]').length) {
				cy.get('[data-test="empty-events"]').should("not.exist");
			} else {
				cy.get('[data-test="empty-events"]').should("exist");
			}
		});
	});
});
