import { USERNAME, PASSWORD } from './constants';

describe('Login', () => {
  // TODO
  // store as env vars or seed data for tests
  // switch to typescript
  //   let USERNAME;
  //   let PASSWORD;
  //   beforeEach(() => {
  //     cy.visit('/');
  //     USERNAME = Cypress.env('USERNAME');
  //     PASSWORD = Cypress.env.PASSWORD.toString();
  //   });
  it('should login user successfully', () => {
    cy.visit('/login');
    cy.get('input[formControlName="email"]').type(USERNAME);
    cy.get('input[formControlName="password"]').type(PASSWORD);
    cy.get('[type="submit"]').click();
    cy.url().should('include', 'admin');
  });
});
