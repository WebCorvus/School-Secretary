describe("Home page", () => {
	it.skip("deve exibir corretamente o h1", () => {
		cy.login();
		cy.visit("/");
		cy.get("h1")
			.should("have.length", 1)
			.and("be.visible")
			.and("contain.text", "Bem-vindo");
	});

	it.skip("deve exibir corretamente os h2", () => {
		cy.get("h2").should("have.length", 2);
		cy.contains("h2", "Agenda").should("be.visible");
		cy.contains("h2", "Eventos").should("be.visible");
	});

	it.skip("deve exibir corretamento os campos de atualizações", () => {
		cy.get;
	});

	it.skip("deve exibir corretamente os h2", () => {
		cy.get("h2").should("have.length", 2);
		cy.contains("h2", "Agenda").should("be.visible");
		cy.contains("h2", "Eventos").should("be.visible");
	});

	it.skip("deve exibir corretamento os campos de atualizações", () => {
		cy.get;
	});
});
