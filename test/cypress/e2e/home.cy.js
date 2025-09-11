describe("Home page", () => {
	it("deve exibir corretamente a página", () => {
		cy.login();
		cy.visit("/");

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
