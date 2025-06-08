import SearchPage from "../components/SearchPage";
import CoursePage from "../components/CourseDetailsPage";
const searchPage = new SearchPage();
const coursePage = new CoursePage();

describe('Course Details Page', () => {
  beforeEach(() => {
    cy.viewport(1200, 1200)
    SearchPage.setupIntercepts();
    CoursePage.setupIntercepts();
  });

  it('Navigate to a specific course page, verify key elements and navigation', () => {
    searchPage
      .open()
      .clickFirstCourse()

    coursePage
      .waitForCourseToLoad()
      .verifyCourseDetailsPresent()

    coursePage
      .verifyAllInfoBlocksPresent()
      .validateAllSectionNavigation()
  })
})
