describe("/faq", () => {
  it("can expand and collapse an FAQ item", () => {
    cy.visitLoggedIn("/faq", "FaqTest");
    cy.location("pathname").should("eq", "/faq");

    const id = "what-is-hamster";
    const toggle = `[data-testid="faq-toggle-${id}"]`;
    const panel = `[data-testid="faq-panel-${id}"]`;

    cy.get(toggle)
      .should("have.attr", "aria-expanded", "false")
      .click()
      .should("have.attr", "aria-expanded", "true");

    cy.get(panel).should("be.visible");

    cy.get(toggle).click().should("have.attr", "aria-expanded", "false");

    cy.get(panel).should("not.exist");
  });
});
