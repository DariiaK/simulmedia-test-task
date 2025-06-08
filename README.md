Testing suite  for Alison.com built with Cypress+TypeScript using POM
---

## Setup

1. Clone repo and install dependencies:

   ```bash
   git clone <repo-url>
   cd <repo-folder>
   npm install
   ```

2. Open Cypress Test Runner:

   ```bash
   npx cypress open
   ```

---

## Usage

- Run tests in headed mode:

  ```bash
  mpn run cy:open
  ```

- Run headless tests (CI):

  ```bash
  npm run cy:run
  ```

---

## Architecture & Approach

- **Page Object Model** for clean separation of selectors and test logic
- Use **TypeScript** for type safety and maintainability  
- Network **intercepts** for syncing async operations
- Chainable methods for readability

---

## Tests

- Search and filter courses.  
- Verify course detail page content and navigation.
