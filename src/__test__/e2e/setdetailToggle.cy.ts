import { LS_SET_LISTS } from "../../../cypress/support/storageKeys";

const emptyLists = { watchlistIds: [], collectionIds: [] };

const readLists = (win: Window) => {
  const raw = win.localStorage.getItem(LS_SET_LISTS);
  return raw ? (JSON.parse(raw) as typeof emptyLists) : emptyLists;
};

describe("Set detail page - Toggle", () => {
  const setNum = "1972-1";
  const watchlist = `[data-testid="toggle-watchlist-${setNum}"]`;
  const collection = `[data-testid="toggle-collection-${setNum}"]`;

  it("can add/remove from watchlist and collection from detailpage", () => {
    cy.visitLoggedIn(`/items/${setNum}`, "ToggleDetailAddRemove");
    cy.location("pathname").should("eq", `/items/${setNum}`);

    // Add to watchlist
    cy.get(watchlist).click();
    cy.get(watchlist).should("have.attr", "aria-pressed", "true");
    cy.window().then((win) => {
      const lists = readLists(win);
      expect(lists.watchlistIds).to.include(setNum);
      expect(lists.collectionIds).to.not.include(setNum);
    });

    // Remove from watchlist
    cy.get(watchlist).click();
    cy.get(watchlist).should("have.attr", "aria-pressed", "false");
    cy.window().then((win) => {
      const lists = readLists(win);
      expect(lists.watchlistIds).to.not.include(setNum);
      expect(lists.collectionIds).to.not.include(setNum);
    });

    // Add to collection
    cy.get(collection).click();
    cy.get(collection).should("have.attr", "aria-pressed", "true");
    cy.window().then((win) => {
      const lists = readLists(win);
      expect(lists.collectionIds).to.include(setNum);
      expect(lists.watchlistIds).to.not.include(setNum);
    });

    // Remove from collection
    cy.get(collection).click();
    cy.get(collection).should("have.attr", "aria-pressed", "false");
    cy.window().then((win) => {
      const lists = readLists(win);
      expect(lists.collectionIds).to.not.include(setNum);
      expect(lists.watchlistIds).to.not.include(setNum);
    });
  });

  it("moving sets between watchlist and collection, never allows set to be in both at the same time", () => {
    cy.visitLoggedIn(`/items/${setNum}`, "ToggleDetailMove");
    cy.location("pathname").should("eq", `/items/${setNum}`);

    // Move from watchlist to collection
    cy.get(watchlist).click();
    cy.get(watchlist).should("have.attr", "aria-pressed", "true");
    cy.get(collection).should("have.attr", "aria-pressed", "false");
    cy.window().then((win) => {
      const lists = readLists(win);
      expect(lists.watchlistIds).to.include(setNum);
      expect(lists.collectionIds).to.not.include(setNum);
    });

    // Move from collection to watchlist
    cy.get(collection).click();
    cy.get(collection).should("have.attr", "aria-pressed", "true");
    cy.get(watchlist).should("have.attr", "aria-pressed", "false");
    cy.window().then((win) => {
      const lists = readLists(win);
      expect(lists.collectionIds).to.include(setNum);
      expect(lists.watchlistIds).to.not.include(setNum);
    });

    // Move back to watchlist from collection again
    cy.get(watchlist).click();
    cy.get(watchlist).should("have.attr", "aria-pressed", "true");
    cy.get(collection).should("have.attr", "aria-pressed", "false");
    cy.window().then((win) => {
      const lists = readLists(win);
      expect(lists.watchlistIds).to.include(setNum);
      expect(lists.collectionIds).to.not.include(setNum);
    });
  });
});
