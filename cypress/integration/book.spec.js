describe('Book', () => {
  it('can register, login, book a game, add it to cart and rent it', () => {
    // Open the browser to the dev server URL
    cy.visit('/');

    // Get the header link to login and click on the element
    cy.get('[data-cy="header-login"]').click();

    // Fill in login form with test person's values
    cy.get('[data-cy="login-username"]').type('tester');
    cy.get('[data-cy="login-password"]').type('tester');
    cy.get('[data-cy="login-submit-button"]').click();
    cy.wait(1000);

    // Get the games link and click it
    cy.get('[data-cy="header-games"]').click();
    cy.wait(1000);

    // Get all of the games `li` elements, filter it to be just the last one, find the link inside of it and click
    cy.get('[data-cy="games-page-content-game"]').first().find('a').click();
    cy.wait(1000);

    // Get the Add to cart button on single game page and click it
    cy.get('[data-cy="add-to-cart-button"]').click();
    cy.wait(1000);

    // Go to 'Cart' and see if the game appears there
    cy.get('[data-cy="header-cart"]').click();
    cy.wait(1000);

    // Get 'Rent All' and click it
    cy.get('[data-cy="rent-games-button"]').click();
    cy.wait(1000);

    // Go to 'My Games' page and see if the game appears on the page
    cy.get('[data-cy="header-my-games"]').click();
    cy.wait(1000);

    cy.get('[data-cy="rented-game"]').should('have.length.at.least', 2);
  });
});
