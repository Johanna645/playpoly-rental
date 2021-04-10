describe('Book', () => {
  it('can login, book a game, add it to cart and rent it', () => {
    // Open the browser to the dev server URL
    cy.visit('/');

    // Get the header link to login and click on the element
    cy.get('[data-cy="header-login"]').click();

    // Fill in login form
    // cy.get();

    // Get the game link and click it
    cy.get('[data-cy="header-games"]').click();

    // Get all of the games `li` elements, filter it to be just the first one, find the link inside of it and click
    cy.get('[data-cy="games-page-content-game"]')

      .first()

      .find('a')
      .click();

    // Get the Add to cart button and click it
    cy.get('[data-cy="game-page-content-h1"]').should('be.visible');
  });
});
