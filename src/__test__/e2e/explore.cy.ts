describe("Explore and find sets", () => {
  it("can search from /categories -> goes to /search -> open a set detail page", () => {
    const username = "ExplorerTest";

    cy.visitLoggedIn("/", username);

    cy.location("pathname").should("eq", "/categories");

    cy.get('[data-testid="search-input"]').type("falcon{enter}");

    cy.location("pathname").should("include", "/search");

    cy.get('[data-testid="set-card"]').first().click();

    cy.location("pathname").should("not.eq", "/search");
  });
});
