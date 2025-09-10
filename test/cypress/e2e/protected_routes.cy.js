describe("Protected Routes", () => {
	it("should redirect to login if not authenticated", () => {
		cy.getCookie("access").should("not.exist");
		cy.getCookie("refresh").should("not.exist");
		cy.visit("/students");
		cy.url().should("include", "/login");
	});

	it("should allow access to students route if authenticated", () => {
		cy.login();
		cy.getCookie("access").should("exist");
		cy.getCookie("refresh").should("exist");
		cy.visit("/students");
		cy.url().should("include", "/students");
	});

	it("should allow access to professors route if authenticated", () => {
		cy.login();
		cy.getCookie("access").should("exist");
		cy.getCookie("refresh").should("exist");
		cy.visit("/professors");
		cy.url().should("include", "/professors");
	});

	it("should allow access to subjects route if authenticated", () => {
		cy.login();
		cy.getCookie("access").should("exist");
		cy.getCookie("refresh").should("exist");
		cy.visit("/subjects");
		cy.url().should("include", "/subjects");
	});

	it("should allow access to agenda route if authenticated", () => {
		cy.login();
		cy.getCookie("access").should("exist");
		cy.getCookie("refresh").should("exist");
		cy.visit("/agenda");
		cy.url().should("include", "/agenda");
	});

	it("should allow access to events route if authenticated", () => {
		cy.login();
		cy.getCookie("access").should("exist");
		cy.getCookie("refresh").should("exist");
		cy.visit("/events");
		cy.url().should("include", "/events");
	});

	it("should allow access to groups route if authenticated", () => {
		cy.login();
		cy.getCookie("access").should("exist");
		cy.getCookie("refresh").should("exist");
		cy.visit("/groups");
		cy.url().should("include", "/groups");
	});

	it("should allow access to itineraries route if authenticated", () => {
		cy.login();
		cy.getCookie("access").should("exist");
		cy.getCookie("refresh").should("exist");
		cy.visit("/itineraries");
		cy.url().should("include", "/itineraries");
	});

	it("should allow access to lessons route if authenticated", () => {
		cy.login();
		cy.getCookie("access").should("exist");
		cy.getCookie("refresh").should("exist");
		cy.visit("/lessons");
		cy.url().should("include", "/lessons");
	});

	it("should allow access to agenda route if authenticated", () => {
		cy.login();
		cy.getCookie("access").should("exist");
		cy.getCookie("refresh").should("exist");
		cy.visit("/agenda");
		cy.url().should("include", "/agenda");
	});
});
