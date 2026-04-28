describe('Sign In', () => {
    beforeEach(() => {
        cy.visit('/login');
    });

    it('should display the login form', () => {
        cy.get('form').should('be.visible');
        cy.get('input#username').should('be.visible');
        cy.get('input#password').should('be.visible');
        cy.get("button[type='submit']").should('contain.text', 'Login');
    });

    it('should login successfully with valid credentials', () => {
        cy.intercept('POST', '**/auth/login').as('loginRequest');

        cy.get('input#username').type('emilys');
        cy.get('input#password').type('emilyspass');
        cy.get("button[type='submit']").click();

        cy.wait('@loginRequest').then((interception) => {
            expect(interception.response?.statusCode).to.eq(200);
            expect(interception.response?.body).to.have.property('accessToken');
        });

        cy.url().should('include', '/dashboard');
    });

    it('should show error with invalid credentials', () => {
        cy.get('input#username').type('invalidUser');
        cy.get('input#password').type('0lelplR');

        cy.contains(
            'Username must not contain special characters or uppercase letters',
        ).should('be.visible');

        cy.get('input#username').clear().type('invaliduser').blur();
        cy.get("button[type='submit']").click();
    });

    it('should validate required fields', () => {
        cy.get('input#username').focus().blur();
        cy.get('input#password').focus().blur();

        cy.contains('Username must be at least 6 char longs').should(
            'be.visible',
        );
    });

    it('should navigate to register page', () => {
        cy.get("a[href='/register']").click();

        cy.url().should('include', '/register');
    });

    it('should show login with GitHub button', () => {
        cy.get('button').contains('Login with GitHub').should('be.visible');
    });
});
