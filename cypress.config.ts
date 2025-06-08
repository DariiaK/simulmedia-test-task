const { defineConfig } = require("cypress");

module.exports = defineConfig({

  env: {
    API_URL: "https://api.alison.com/v0.1/",
    BASE_URL: 'https://alison.com'
  },
  defaultCommandTimeout: 20000,
  responseTimeout: 30000,
  requestTimeout: 10000,
  pageLoadTimeout: 10000,
  watchForFileChanges: false,

  retries: {
    runMode: 2,
    openMode: 0,
  },

  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
      require('cypress-mochawesome-reporter/plugin')(on);
    },
    specPattern: 'cypress/e2e/*.{js,jsx,ts,tsx}',
    baseUrl: "https://alison.com/",
    testIsolation: false,
    screenshotOnRunFailure: true,
    video: true
  },
});
