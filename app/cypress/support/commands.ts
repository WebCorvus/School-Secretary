
Cypress.Commands.add('login', (username, password) => {
  cy.request({
    method: 'POST',
    url: `${Cypress.env('API_URL')}/users/login/`,
    body: {
      username,
      password,
    },
  }).then((response) => {
    expect(response.status).to.eq(200);
    // Assuming your API returns a token or sets a cookie that Cypress automatically handles
    // If your API returns a token in the body, you might need to manually set a cookie or localStorage item
    // For example, if it returns { access: 'your_token' }:
    // cy.setCookie('access', response.body.access);
  });
});
