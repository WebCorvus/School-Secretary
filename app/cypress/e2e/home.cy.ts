
describe('Home page', () => {
  it('should redirect to login page', () => {
    cy.visit('/')
    cy.url().should('include', '/login')
  })
})
