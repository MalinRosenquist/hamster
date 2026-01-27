/// <reference types="cypress" />

import { LS_USER_NAME, LS_SET_LISTS } from "./storageKeys";

type SetLists = { watchlistIds: string[]; collectionIds: string[] };

Cypress.Commands.add(
  "visitLoggedIn",
  (path: string, username = "TestUser", lists?: SetLists) => {
    cy.visit(path, {
      onBeforeLoad(win) {
        win.localStorage.setItem(LS_USER_NAME, username);
        if (lists === undefined) {
          win.localStorage.removeItem(LS_SET_LISTS);
        } else {
          win.localStorage.setItem(LS_SET_LISTS, JSON.stringify(lists));
        }
      },
    });
  }
);

Cypress.Commands.add("goToCategories", () => {
  cy.get('[data-testid="nav-categories"]').click();
  cy.location("pathname").should("eq", "/categories");
});

Cypress.Commands.add("openFirstTheme", () => {
  cy.get('[data-testid^="theme-card-"]').first().click();
  cy.location("pathname").should("match", /^\/categories\/\d+$/);
});

Cypress.Commands.add("getFirstSetNum", () => {
  return cy
    .get('[data-testid^="set-card-"]')
    .first()
    .invoke("attr", "data-testid")
    .then((id) => {
      const setNum = (id || "").replace("set-card-", "");
      expect(setNum, "setNum").to.not.equal("");
      return setNum;
    });
});

declare global {
  namespace Cypress {
    interface Chainable {
      visitLoggedIn(
        path: string,
        username?: string,
        lists?: SetLists
      ): Chainable<void>;
      goToCategories(): Chainable<void>;
      openFirstTheme(): Chainable<void>;
      getFirstSetNum(): Chainable<string>;
    }
  }
}

export {};
