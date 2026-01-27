import { LS_USER_NAME, LS_SET_LISTS } from "../../../cypress/support/storageKeys";

type SetList = { watchlistIds: string[]; collectionIds: string[] };

const emptyLists: SetList = { watchlistIds: [], collectionIds: [] };

const readLists = (win: Window) => {
  const raw = win.localStorage.getItem(LS_SET_LISTS);
  return raw ? (JSON.parse(raw) as typeof emptyLists) : emptyLists;
};

describe("Visit /mypage", () => {
  it("shows correct watchlist/collection count", () => {
    const username = "MyPageLists";
    const lists: SetList = {
      watchlistIds: ["1972-1", "5219-1", "6929-1"],
      collectionIds: ["8048-1", "42033-1"],
    };
    cy.visitLoggedIn("/mypage", username, lists);
    cy.location("pathname").should("eq", "/mypage");

    cy.get('[data-testid="watchlist-count"]').should(
      "contain.text",
      lists.watchlistIds.length
    );
    cy.get('[data-testid="watchlist-count"]').should("have.text", 3);
    cy.get('[data-testid="collection-count"]').should(
      "contain.text",
      lists.collectionIds.length
    );
    cy.get('[data-testid="collection-count"]').should("have.text", 2);
  });

  it("can change username and persists in localstorage", () => {
    const username = "MyPageChangeUsername";
    cy.visitLoggedIn("/mypage", username);
    cy.location("pathname").should("eq", "/mypage");

    cy.get('[data-testid="username-input"]').type("NewName");
    cy.get('[data-testid="save-username"]').click();

    cy.window().then((win) => {
      expect(win.localStorage.getItem(LS_USER_NAME)).to.eq("NewName");
    });

    cy.get('[data-testid="save-message"]').should("have.text", "Sparat!");
  });

  it("cancel clear data modal", () => {
    const username = "ClearModalCancel";
    const lists: SetList = {
      watchlistIds: ["1972-1"],
      collectionIds: ["8048-1"],
    };

    cy.visitLoggedIn("/mypage", username, lists);
    cy.location("pathname").should("eq", "/mypage");

    cy.get('[data-testid="clear-data"]').click();
    cy.get('[data-testid="clear-modal"]').should("be.visible");

    cy.get('[data-testid="clear-modal-cancel"]').click();
    cy.get('[data-testid="clear-modal"]').should("not.exist");

    cy.window().then((win) => {
      expect(win.localStorage.getItem(LS_USER_NAME)).to.eq(username);
      expect(win.localStorage.getItem(LS_SET_LISTS)).to.not.eq(null);
    });
  });

  it("confirm clear data modal and redirect to login", () => {
    const username = "ClearModalConfirm";
    const lists: SetList = {
      watchlistIds: ["1972-1"],
      collectionIds: ["8048-1"],
    };

    cy.visitLoggedIn("/mypage", username, lists);
    cy.location("pathname").should("eq", "/mypage");

    cy.get('[data-testid="clear-data"]').click();
    cy.get('[data-testid="clear-modal"]').should("be.visible");

    cy.get('[data-testid="clear-modal-confirm"]').click();
    cy.location("pathname").should("eq", "/login");

    cy.window().then((win) => {
      expect(win.localStorage.getItem(LS_USER_NAME)).to.eq(null);
      const lists = readLists(win);
      expect(lists.watchlistIds).to.have.length(0);
      expect(lists.collectionIds).to.have.length(0);
    });

    cy.location("pathname").should("eq", "/login");
  });
});
