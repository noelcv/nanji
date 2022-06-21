describe("login", () => {
  it("logins in", () => {
    cy.visit("http://localhost:3000/");
    cy.get(".amplify-button--primary").click();
  });
});

describe("media is rendered in the dashboard", () => {
  it("has pictures", () => {
    cy.get(".post")
      .invoke("attr", "id")
      .should("equal", "e1ee1830-bf73-4cb4-ac5c-0086d556e158");
  });
});
