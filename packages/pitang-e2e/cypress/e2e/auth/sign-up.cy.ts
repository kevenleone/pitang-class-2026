describe("Sign Up", () => {
  beforeEach(() => {
    cy.visit("/register");
  });

  it("should display the signup form", () => {
    cy.get("form").should("be.visible");
    cy.get("input#username").should("be.visible");
    cy.get("input#email").should("be.visible");
    cy.get("input#password").should("be.visible");
    cy.get("input#confirm-password").should("be.visible");
    cy.get("button[type='submit']").should("contain.text", "Create Account");
  });

  it("should show username error for invalid format", () => {
    cy.get("input#username").type("User").blur();

    cy.contains("Username must be at least 6 char longs").should("be.visible");
  });

  it("should show username error for special characters", () => {
    cy.get("input#username").type("test@user").blur();

    cy.contains("Username must not contain special characters or uppercase letters").should("be.visible");
  });

  it("should show email error for invalid email", () => {
    cy.get("input#email").type("invalidemail").blur();

    cy.contains("Invalid email").should("be.visible");
  });

  it("should show email error for gmail addresses", () => {
    cy.get("input#email").type("test@gmail.com").blur();

    cy.contains("Gmail is banned").should("be.visible");
  });

  it("should show password error for short password", () => {
    cy.get("input#password").type("Pass1").blur();

    cy.contains("Password should have minimum length of 8").should("be.visible");
  });

  it("should show password error for missing uppercase", () => {
    cy.get("input#password").type("password1").blur();

    cy.contains("Should Contain at least one uppercase letter").should("be.visible");
  });

  it("should show confirm password error when passwords do not match", () => {
    cy.get("input#password").type("Password1");
    cy.get("input#confirm-password").type("Password2").blur();

    cy.contains("Passwords do not match").should("be.visible");
  });

  it("should enable submit button when form is valid", () => {
    cy.get("input#username").type("testuser");
    cy.get("input#email").type("test@example.com");
    cy.get("input#password").type("Password1");
    cy.get("input#confirm-password").type("Password1");

    cy.get("button[type='submit']").should("not.be.disabled");
  });

  it("should show loading state when submitting", () => {
    cy.get("input#username").type("testuser");
    cy.get("input#email").type("test@example.com");
    cy.get("input#password").type("Password1");
    cy.get("input#confirm-password").type("Password1");
    cy.get("button[type='submit']").click();

    cy.contains("Creating...").should("be.visible");
  });

  it("should navigate to login page", () => {
    cy.get("a[href='/login']").click();

    cy.url().should("include", "/login");
  });

  it("should show GitHub signup button", () => {
    cy.get("button").contains("Sign up with GitHub").should("be.visible");
  });
});