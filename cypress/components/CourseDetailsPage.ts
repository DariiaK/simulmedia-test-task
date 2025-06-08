import BasePage from "./BasePage";

/**
 * Elements and interactions on the course details page
 * for verifying course info, navigating page sections, and starting the course.
*/

class CourseDetailsPage extends BasePage {

    get courseTitle() { return cy.get('h3[class="course-title"]') }
    get courseDuration() { return cy.get('[class="course-avg_duration l-time"]') }
    get courseLevel() { return cy.get('[class="course-level"]') }
    get courseRating() { return cy.get('[class~="l-rating"]') }
    get startLearningBtn() { return cy.get('button:contains("Start Learning")') }

    get courseModulesTab() { return cy.get('[data-tab="course-modules"]') }
    get courseDescriptionTab() { return cy.get('[data-tab="course-desc"]') }
    get certificatesTab() { return cy.get('[data-tab="cert-desc"]') }

    get courseDescription() { return cy.get('[class="l-info"]') }
    get courseDetails() { return cy.get('[id="course-details"]') }
    get courseTags() { return cy.get('[class^="l-tags"]') }
    get courseCareers() { return cy.get('[id="careers"]') }
    get certificatesInfo() { return cy.get('[id="certificates"]') }
    get courseReviews() { return cy.get('[id="reviews-section"]') }
    get publisherInfo() { return cy.get('[id="l-main-pub"]') }
    get learnersEnrolled() { return cy.get('[id="l-carousel--enrolled"]') }

    get courseDetailsSection() { return cy.get('a[href="#course-details"]') }
    get certificatesSection() { return cy.get('a[href="#certificates"]') }
    get courseReviewsSection() { return cy.get('a[href="#reviews-section"]') }
    get exploreCareersSection() { return cy.get('a[href="#careers"]') }
    get aboutPublisherSection() { return cy.get('a[href="#l-main-pub"]') }

    public static setupIntercepts() {
        cy.intercept('GET', '**/courses/*').as('loadCourseData');
        cy.intercept('POST', '**/courseware/courses/*/modules').as('loadModules');
    }

    public waitForCourseToLoad(): this {
        cy.wait('@loadCourseData');
        this.waitForPageToLoad()
        this.waitForElement(this.courseTitle);
        return this;
    }

    public verifyCourseDetailsPresent(): this {
        this.courseTitle.should('be.visible').and('not.be.empty');
        this.courseDuration.should('be.visible');
        this.courseLevel.should('be.visible');
        this.courseRating.should('be.visible');
        return this;
    }

   /**
   * Mapping of navigable sections on the page
   * Each key has an anchor (link) and the section element which it corresponds to
   */
    public navigationMap = {
        courseDetails: { anchor: () => this.courseDetailsSection, section: () => this.courseDetails },
        certificates: { anchor: () => this.certificatesSection, section: () => this.certificatesInfo },
        reviews: { anchor: () => this.courseReviewsSection, section: () => this.courseReviews },
        careers: { anchor: () => this.exploreCareersSection, section: () => this.courseCareers },
        publisher: { anchor: () => this.aboutPublisherSection, section: () => this.publisherInfo }
    } as const;


   /**
   * Validates that clicking a navigation anchor scrolls to and reveals the correct section
   * Checks visibility and scrolling down the page
   */

    public validateSectionNavigation(el: keyof typeof this.navigationMap): this {
        const { anchor, section } = this.navigationMap[el];
        section().should('exist').and('be.visible');
        cy.window().its('scrollY').then((initialScroll) => {
            anchor().should('be.visible').click()
            section().should('be.visible')
            cy.window().its('scrollY').should('be.gt', initialScroll);
        });
        return this;
    }

    public validateAllSectionNavigation(): this {
        const sections: (keyof typeof this.navigationMap)[] = [
          'courseDetails', 'certificates', 'reviews', 'careers', 'publisher'
        ];
        cy.wrap(sections).each((section: keyof typeof this.navigationMap) => {
          this.validateSectionNavigation(section);
        });
      
        return this;
      }

   /**
   * Verifies the presence of all major information blocks on the course details page
   */
    public verifyAllInfoBlocksPresent(): this {
        const blocks = [
            this.courseDescription,
            this.courseDetails,
            this.courseTags,
            this.courseCareers,
            this.certificatesInfo,
            this.courseReviews,
            this.publisherInfo,
            this.learnersEnrolled
        ];
        blocks.forEach((block) => {
            block.should('exist')
        });

        return this;
    }


    public clickStartLearning(): this {
        this.waitForElement(this.startLearningBtn).click();
        this.waitForPageToLoad()
        return this;
    }
}

export default CourseDetailsPage;