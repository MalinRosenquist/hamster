describe("home", () => {
  it("shows the home page", () => {
    cy.visit("/");
    cy.location("pathname").should("eq", "/login");
    cy.get("body").should("be.visible");
  });
});
