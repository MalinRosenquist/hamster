describe("Visit /wathlist page", () => {
  it("shows empty state when no sets in watchlist", () => {
    const username = "WatchlistEmptyState";

    cy.visitLoggedIn("/watchlist", username);
    cy.location("pathname").should("eq", "/watchlist");
    cy.contains("Du bevakar inget just nu.").should("be.visible");
  });

  it("shows saved set on /watchlist", () => {
    const setNum = "1972-1";
    const username = "WatchlistPageTest";

    cy.visitLoggedIn("/watchlist", username, {
      watchlistIds: [setNum],
      collectionIds: [],
    });
    cy.location("pathname").should("eq", "/watchlist");
    cy.get(`[data-testid="set-card-${setNum}"]`).should("exist");
  });
});
