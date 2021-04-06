describe('Navigate', () => {
  it('can navigate using the header links', () => {
    // Open the browser to the dev server URL
    cy.visit('/');

    // Get the header link to games and click on the element
    cy.get('[data-cy="header-games"]').click();

    // Get the element corresponding to the H1 in the games page and test if it is visible
    cy.get('[data-cy="games-page-content-h1"]').should('be.visible');
    // });
    // });
    // can't see the pages in browser at the moment so won't implement these yet
    //     cy.get('[data-cy="games-page-content-games"]').should(
    // //       'have.length.at.least',
    // //       1,
    // //     );

    // //     // Get all of the games `li` elements, filter it to be just the first one, find the link inside of it and click
    cy.get('[data-cy="games-page-content-game"]')

      .first()

      .find('a')
      .click();

    // //     cy.get('[data-cy="game-page-content-h1"]').should('be.visible');
  });
});
