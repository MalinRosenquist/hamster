// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import "./commands";

import { LS_USER_NAME, LS_SET_LISTS } from "./storageKeys";

// Visit a path as a logged-in user, optionally setting their lists in localStorage
Cypress.Commands.add(
  "visitLoggedIn",
  (path: string, username = "TestUser", lists?: object) => {
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

declare global {
  namespace Cypress {
    interface Chainable {
      visitLoggedIn(
        path: string,
        username?: string,
        lists?: object
      ): Chainable<void>;
    }
  }
}
export {};
