
describe('Login page', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('should visit the login page', () => {
    cy.get('h1').contains('Login');
  });

  it('should successfully log in a user and redirect to home', () => {
    cy.intercept('POST', `${Cypress.env('API_URL')}/users/login/`, { fixture: 'login-success.json' }).as('userLogin');

    cy.get('input[placeholder="Email"]').type('testuser');
    cy.get('input[placeholder="Senha"]').type('testpassword');
    cy.get('button[type="submit"]').click();

    cy.wait('@userLogin').its('response.statusCode').should('eq', 200);
    cy.url().should('eq', Cypress.config().baseUrl + '/');
    cy.getCookie('access').should('exist');
  });

  it('should display an error message on failed login', () => {
    cy.intercept('POST', `${Cypress.env('API_URL')}/users/login/`, { statusCode: 400, body: { detail: 'Invalid credentials' } }).as('failedLogin');

    cy.get('input[placeholder="Email"]').type('wronguser');
    cy.get('input[placeholder="Senha"]').type('wrongpassword');
    cy.get('button[type="submit"]').click();

    cy.wait('@failedLogin').its('response.statusCode').should('eq', 400);
    cy.get('.error-message').should('contain', 'Invalid credentials'); // Assuming there's an element with class 'error-message'
  });
});
