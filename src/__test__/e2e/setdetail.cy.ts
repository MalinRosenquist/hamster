describe("Set detail page - Tradera", () => {
  it("shows Tradera list when auctions exist (1972-1)", () => {
    cy.visitLoggedIn("/items/1972-1", "TraderaWithAuctions");

    cy.location("pathname").should("eq", "/items/1972-1");

    cy.get('[data-testid="set-card"]').should("be.visible");
    cy.get('[data-testid="set-name"]')
      .should("exist")
      .invoke("text")
      .should("match", /\S+/);
    cy.get('[data-testid="set-num"]').should("contain.text", "1972");

    cy.get('[data-testid="tradera-list"]').should("be.visible");
    cy.get('[data-testid^="tradera-list-item-"]').should("have.length", 3);

    cy.get('[data-testid^="tradera-list-item-"]')
      .first()
      .find("a")
      .should("have.attr", "href")
      .and("include", "tradera");
  });

  it("shows empty state when no auctions exist (5219-1)", () => {
    cy.visitLoggedIn("/items/5219-1", "TraderaNoAuctions");

    cy.location("pathname").should("eq", "/items/5219-1");

    cy.get('[data-testid="set-card"]').should("be.visible");
    cy.get('[data-testid="tradera-list"]').should("not.exist");
    cy.contains("Inga matchande auktioner för 5219-1.").should("be.visible");
  });
});
