describe("Homepage Events", () => {
	beforeEach(() => {
		cy.login("testuser", "testpassword"); // Log in before each test
		cy.visit("/");
	});

	it("should display a list of events", () => {
		cy.intercept("GET", `${Cypress.env("API_URL")}events/`, {
			fixture: "events.json",
		}).as("getEvents");
		cy.wait("@getEvents");
		cy.get(".event-item").should("have.length", 2); // Assuming events are rendered with class 'event-item'
		cy.get(".event-item").first().contains("Reunião de Pais");
	});

	it("should display a message when no events are available", () => {
		cy.intercept("GET", `${Cypress.env("API_URL")}events/`, {
			statusCode: 200,
			body: [],
		}).as("getEmptyEvents");
		cy.wait("@getEmptyEvents");
		cy.get(".no-events-message")
			.should("be.visible")
			.and("contain", "Nenhum evento disponível"); // Assuming a message with class 'no-events-message'
	});

	it("should display an error message when events cannot be loaded", () => {
		cy.intercept("GET", `${Cypress.env("API_URL")}events/`, {
			statusCode: 500,
			body: { detail: "Server Error" },
		}).as("getEventsError");
		cy.wait("@getEventsError");
		cy.get(".error-message")
			.should("be.visible")
			.and("contain", "Erro ao carregar eventos"); // Assuming an error message with class 'error-message'
	});
});
