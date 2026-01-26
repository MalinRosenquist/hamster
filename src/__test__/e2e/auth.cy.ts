import { LS_USER_NAME } from "../../../cypress/support/storageKeys";

describe("first visit", () => {
  it("first visit directs to /login, enteres a username, redirects to '/' and stores username", () => {
    const username = "FirstTest";

    cy.visit("/", {
      onBeforeLoad(win) {
        win.localStorage.clear();
      },
    });

    cy.location("pathname").should("eq", "/login");
    cy.get("body").should("be.visible");

    cy.get('input[data-testid="login-username"]').type(username);
    cy.get('button[data-testid="login-submit"]').click();

    cy.location("pathname").should("eq", "/");

    cy.window()
      .its("localStorage")
      .invoke("getItem", LS_USER_NAME)
      .should("eq", username);
    cy.window().then((win) =>
      console.log("LS keys:", Object.keys(win.localStorage))
    );
  });

  it("blocks protected routes when not logged in", () => {
    cy.visit("/watchlist", {
      onBeforeLoad(win) {
        win.localStorage.clear();
      },
    });
    cy.location("pathname").should("eq", "/login");
  });
});
