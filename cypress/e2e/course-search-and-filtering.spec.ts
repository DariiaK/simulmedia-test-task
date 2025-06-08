import SearchPage from "../components/SearchPage";
const searchPage = new SearchPage();
const keyword: string = 'Javascript';

describe('Course Search & Filtering', () => {
  beforeEach(() => {
    SearchPage.setupIntercepts();
  });

  it('Search for courses on a specific topic', () => {
    searchPage
      .open()
      .searchForCourses(keyword, true)
    searchPage.verifySearchResults(keyword);

    searchPage
      .searchForCourses(keyword + 'invalidQuery', false);

  })

  it.only('Apply filters for course type, verify the results match the applied filters', () => {
    searchPage.open()
      .applyCertificateTypeFilter()
      .verifyFilteredResults();

  })
})
