
describe('Login page', () => {
  it('should visit the login page', () => {
    cy.visit('/login')
    cy.get('h1').contains('Login')
  })

  it('should fill the login form and submit', () => {
    cy.visit('/login')
    cy.get('input[placeholder="Email"]').type('testuser')
    cy.get('input[placeholder="Senha"]').type('testpassword')
    cy.get('button[type="submit"]').click()
  })
})
