describe("Explore and find sets", () => {
  it("can navigate via main nav", () => {
    const username = "NavTest";

    cy.visitLoggedIn("/", username);

    cy.get('[data-testid="nav-categories"]').click();
    cy.location("pathname").should("eq", "/categories");

    cy.get('[data-testid="nav-faq"]').click();
    cy.location("pathname").should("eq", "/faq");

    cy.get('[data-testid="nav-mypage"]').click();
    cy.location("pathname").should("eq", "/mypage");
  });

  it("goes to categories via nav, searches -> redirects to /search -> open a set detail page", () => {
    const username = "ExplorerTest";

    cy.visitLoggedIn("/", username);

    cy.location("pathname").should("eq", "/");

    cy.get('[data-testid="nav-categories"]').click();
    cy.location("pathname").should("eq", "/categories");

    cy.get('[data-testid="search-input"]').should("be.visible").type("buggy{enter}");
    cy.location("pathname").should("include", "/search");

    cy.get('[data-testid^="set-card-"]').first().click();

    cy.location("pathname").should("not.eq", "/search");
  });
});
