import BasePage from "./BasePage";

/**
 * Elements and interactions related to searching courses,
 * filtering results, and verifying search results
*/

class SearchPage extends BasePage {

  get searchField() { return cy.get('[id="header-search-form"] input') }
  get searchIcon() { return cy.get('[id="header-search-form"] [type="submit"]') }
  get searchResults() { return cy.get('[class^="search-results-wrapper"]') }
  get querySearchHeader() { return cy.get('[class="query-search"]') }
  get noResults() { return cy.get('[class="no-search-results"]') }
  get resultCount() { return cy.get('[id="num-results"] span') }
  get courseCardsImg() { return cy.get('[class="card__img"]') }
  get courseCardsInfo() { return cy.get('[class="card__info"]') }
  get certificateTypeFilter() { return cy.get('[class="filter course-type-filter"]') }
  get subjectsFilter() { return cy.get('[class="filter categories-filter"]') }
  get courseLevelFilter() { return cy.get('[class="filter course-level-filter"]') }
  get courseDurationFilter() { return cy.get('[class="filter course-duration-filter"]') }
  get learningStageFilter() { return cy.get('[class="filter course-learning-stage-filter"]') }
  get checkboxes() { return cy.get('[class="form-checkbox"]') }

  public static setupIntercepts() {
    cy.intercept('GET', '**/search?**').as('applyFilter')
  }

  public open() {
    cy.visit('/courses');
    this.waitForPageToLoad();
    return this;
  }

  /**
    * Selects a random checkbox option from dropdown filters.
    * Stores the selected option's text in alias 'selectedOptionText' for later verification.
  */
  public selectRandomDropdownOption() {
    return this.waitForElement(this.checkboxes).then(($options) => {
      const dropdownItems = $options.toArray()
      const selectedOption = Cypress._.sample(dropdownItems)!
      cy.wrap(selectedOption).click()
      return cy.wrap(selectedOption).invoke('text').as('selectedOptionText')
    })
  }

  /**
     * Performs a search for courses by typing query and clicking search
     * Validates results based on whether the query is expected to be valid or invalid.
  */

  public searchForCourses(query: string, validQuery: boolean): this {
    query = query.toLowerCase().trim()
    this.waitForElement(this.searchField).clear().type(query)
    this.waitForElement(this.searchIcon).click()
    validQuery === true ? this.waitForSearchResultsValid(query) : this.waitForSearchResultsInvalid(query)
    return this;
  }

  public waitForSearchResultsValid(query: string) {
    cy.wait('@applyFilter')
    cy.url().should('contain', `query=${query}`)
    this.resultCount.should('be.visible')
    this.searchResults.should('be.visible')
    this.querySearchHeader.should('be.visible')
  }

  public waitForSearchResultsInvalid(query: string) {
    cy.wait('@applyFilter')
    cy.url().should('contain', `query=${query}`)
    this.noResults.should('be.visible')
    this.searchResults.should('not.exist')
  }

  public verifyCoursesCount() {
    this.resultCount.invoke('text').then((text1) => {
      const initialCount = parseFloat(text1);
      this.resultCount.invoke('text').should((text2) => {
        expect(parseFloat(text2)).to.not.eq(initialCount);
      });
    });
  }

  /**
   * Verifies that search results contain the query term in course titles
   */

  public verifySearchResults(query: string) {
    this.waitForPageToLoad()
    cy.wait('@applyFilter')
    this.verifyCoursesCount()
    if (this.searchResults)
      this.waitForElement(this.courseCardsInfo)
        .should('have.length.greaterThan', 0)
        .each((card) => {
          cy.wrap(card).find('h3').invoke('text').should((courseName) => {
            const normalizedText: string = courseName.toLowerCase().trim()
            expect(normalizedText).to.include(query.toLowerCase())
          })
        })
  }

  public applyCertificateTypeFilter() {
    this.certificateTypeFilter.click()
    this.certificateTypeFilter.within(() => {
      this.selectRandomDropdownOption()
    })
    return this;
  }

    /**
   * Verifies that filtered results contain the selected filter 
   */
  public verifyFilteredResults() {
    cy.wait('@applyFilter')
    this.verifyCoursesCount()
    this.waitForElement(this.courseCardsImg).should('have.length.greaterThan', 0).each((card) => {
      cy.get('@selectedOptionText').then((option) => {
        const normalizedText: string = option.toString().trim()
        cy.wrap(card).find('[class^="course-type-"]').invoke('text')
          .then((actualText) => {
            expect(actualText.trim()).to.eq(normalizedText);
          });
      })
    })
  }

  public clickFirstCourse() {
    this.waitForElement(this.courseCardsInfo.first())
      .within(() => {
        cy.get('[class="card__more card__more--mobile"]').click();
      });
    return this;
  }

}
export default SearchPage;