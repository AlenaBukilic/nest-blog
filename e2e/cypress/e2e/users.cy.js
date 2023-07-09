describe('Users Page', () => {
  describe('Api call to fetch users', () => {
    beforeEach(() => {
      cy.visit('/');
    });
    it('should load users table successfully', () => {
      cy.get('[routerLink="/users"]').click();
      cy.url().should('include', 'users');
    });
  });

  describe('Check displayed data with filtering and pagination', () => {
    beforeEach(() => {
      cy.visit('/users');
    });
    it('should contain right spelled text', () => {
      cy.contains('Id');
      cy.contains('Name');
      cy.contains('Username');
      cy.contains('Email');
      cy.contains('Role');
    });

    it('should open page size dropdown', () => {
      cy.get('[ng-reflect-appearance="outline"]').click();
    });

    // it('should open next page', () => {
    //   cy.get('[aria-label="Next page"]').click();
    // });
    it('should type user name filter user by username', () => {
      cy.get('mat-label').type('tes');
      cy.get('mat-table').find('mat-row').should('have.length', 1);
    });
  });
});
