describe("Visit /collection page", () => {
  it("shows empty state when no sets in collection", () => {
    const username = "CollectionEmptyState";

    cy.visitLoggedIn("/collection", username);
    cy.location("pathname").should("eq", "/collection");
    cy.contains("Din samling är tom.").should("be.visible");
  });

  it("shows saved set on /collection", () => {
    const setNum = "1972-1";
    const username = "CollectionPageTest";

    cy.visitLoggedIn("/collection", username, {
      collectionIds: [setNum],
      watchlistIds: [],
    });
    cy.location("pathname").should("eq", "/collection");
    cy.get(`[data-testid="set-card-${setNum}"]`).should("exist");
  });
});
