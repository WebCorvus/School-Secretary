declare namespace Cypress {
  interface Chainable<Subject = any> {
    /**
     * Custom command to log in a user programmatically.
     * @example cy.login('username', 'password')
     */
    login(username: string, password: string): Chainable<any>;
  }
}
