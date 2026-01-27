import { LS_SET_LISTS } from "../../../cypress/support/storageKeys";

const emptyLists = { watchlistIds: [], collectionIds: [] };

const readLists = (win: Window) => {
  const raw = win.localStorage.getItem(LS_SET_LISTS);
  return raw ? (JSON.parse(raw) as typeof emptyLists) : emptyLists;
};

describe("Add set to collection or watchlist from card in list", () => {
  it("Goes to categories via nav, chooses a theme, adds first set to collection", () => {
    const username = "AddToCollectionTest";

    cy.visitLoggedIn("/", username);
    cy.goToCategories();
    cy.openFirstTheme();

    cy.getFirstSetNum().then((setNum) => {
      cy.get(`[data-testid="set-card-${setNum}"]`).within(() => {
        cy.get(`[data-testid="toggle-collection-${setNum}"]`).click();
        cy.get(`[data-testid="toggle-collection-${setNum}"]`).should(
          "have.attr",
          "aria-pressed",
          "true"
        );
      });
    });
  });

  it("Goes to watchlist via nav, chooses a theme, adds first set to watchlist", () => {
    const username = "AddToWatchlistTest";

    cy.visitLoggedIn("/", username);
    cy.goToCategories();
    cy.openFirstTheme();

    cy.getFirstSetNum().then((setNum) => {
      cy.get(`[data-testid="set-card-${setNum}"]`).within(() => {
        cy.get(`[data-testid="toggle-watchlist-${setNum}"]`).click();
        cy.get(`[data-testid="toggle-watchlist-${setNum}"]`).should(
          "have.attr",
          "aria-pressed",
          "true"
        );
      });
    });
  });

  it("toggles watchlist/collection and persists in localStorage, never in both at the same time", () => {
    const username = "ToggleListsTest";

    cy.visitLoggedIn("/", username);
    cy.goToCategories();
    cy.openFirstTheme();

    cy.getFirstSetNum().then((setNum) => {
      // Add to watchlist
      cy.get(`[data-testid="set-card-${setNum}"]`).within(() => {
        cy.get(`[data-testid="toggle-watchlist-${setNum}"]`).click();
      });

      cy.window().then((win) => {
        const lists = readLists(win);
        expect(lists.watchlistIds).to.include(setNum);
        expect(lists.collectionIds).not.to.include(setNum);
      });

      // Add the same set to collection (should be removed from watchlist)
      cy.get(`[data-testid="set-card-${setNum}"]`).within(() => {
        cy.get(`[data-testid="toggle-collection-${setNum}"]`).click();
      });

      cy.window().then((win) => {
        const lists = readLists(win);
        expect(lists.watchlistIds).not.to.include(setNum);
        expect(lists.collectionIds).to.include(setNum);
      });

      // Click collection button again should remove from collection
      cy.get(`[data-testid="set-card-${setNum}"]`).within(() => {
        cy.get(`[data-testid="toggle-collection-${setNum}"]`).click();
      });

      cy.window().then((win) => {
        const lists = readLists(win);
        expect(lists.watchlistIds).not.to.include(setNum);
        expect(lists.collectionIds).not.to.include(setNum);
      });
    });
  });

  it("shows saved set on /watchlist and keeps it saved in localstorage", () => {
    const username = "PersistWatchlistTest";

    cy.visitLoggedIn("/", username);
    cy.goToCategories();
    cy.openFirstTheme();

    cy.getFirstSetNum().then((setNum) => {
      cy.get(`[data-testid="set-card-${setNum}"]`).within(() => {
        cy.get(`[data-testid="toggle-watchlist-${setNum}"]`).click();
        cy.get(`[data-testid="toggle-watchlist-${setNum}"]`).should(
          "have.attr",
          "aria-pressed",
          "true"
        );
      });

      cy.window().then((win) => {
        const lists = readLists(win);
        expect(lists.watchlistIds).to.include(setNum);
        expect(lists.collectionIds).not.to.include(setNum);
      });

      cy.get('[data-testid="nav-watchlist"]').click();
      cy.location("pathname").should("eq", "/watchlist");

      cy.get(`[data-testid="set-card-${setNum}"]`).should("exist");
    });
  });

  it("shows saved set on /collection and keeps it saved in localstorage", () => {
    const username = "PersistCollectionTest";

    cy.visitLoggedIn("/", username);
    cy.goToCategories();
    cy.openFirstTheme();

    cy.getFirstSetNum().then((setNum) => {
      cy.get(`[data-testid="set-card-${setNum}"]`).within(() => {
        cy.get(`[data-testid="toggle-collection-${setNum}"]`).click();
        cy.get(`[data-testid="toggle-collection-${setNum}"]`).should(
          "have.attr",
          "aria-pressed",
          "true"
        );
      });

      cy.window().then((win) => {
        const lists = readLists(win);
        expect(lists.collectionIds).to.include(setNum);
        expect(lists.watchlistIds).not.to.include(setNum);
      });

      cy.get('[data-testid="nav-collection"]').click();
      cy.location("pathname").should("eq", "/collection");

      cy.get(`[data-testid="set-card-${setNum}"]`).should("exist");
    });
  });
});
