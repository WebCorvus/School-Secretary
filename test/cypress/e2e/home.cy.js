describe("Home page", () => {
	beforeEach(() => {
		cy.login();
		cy.visit("/");
	});

	it("should render h1", () => {
		cy.get("h1")
			.should("have.length", 1)
			.and("be.visible")
			.and("contain.text", "Bem-vindo");
	});

	it("should render news", () => {
		cy.get('[data-test="home-agenda"]').should("be.visible");
		cy.get('[data-test="home-events"]').should("be.visible");
	});

	it("should handle correctly news pannel", () => {
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
