/**
 * A parent class which defines general interaction with elements
*/

export default class BasePage {

    public open() {
        cy.visit('/')
        this.waitForPageToLoad();
        return this
    }

    public waitForPageToLoad() {
        cy.get('body').should('be.visible');
        cy.document().should('have.property', 'readyState', 'complete')
        return this;
    }

    public waitForElement(selector: string | Cypress.Chainable, timeout: number = 5000) {
        const element = typeof selector === 'string' ? cy.get(selector, { timeout }) : selector;
        return element.should('be.visible').and('not.be.disabled');
    }


}
