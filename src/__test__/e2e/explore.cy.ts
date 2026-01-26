describe("Explore and find sets", () => {
  it("goes to categories via nav, searches -> redirects to /search -> open a set detail page", () => {
    const username = "ExplorerTest";

    cy.visitLoggedIn("/", username);

    cy.location("pathname").should("eq", "/");

    // Navigarte to Categories
    cy.get('[data-testid="nav-categories"]').click();
    cy.location("pathname").should("eq", "/categories");

    // Search for "falcon"
    cy.get('[data-testid="search-input"]')
      .should("be.visible")
      .type("falcon{enter}");
    cy.location("pathname").should("include", "/search");

    // Open first set in results
    cy.get('[data-testid^="set-card-"]').first().click();

    cy.location("pathname").should("not.eq", "/search");
  });
});
