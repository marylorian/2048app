import { defineConfig } from "cypress";

export default defineConfig({
  allowCypressEnv: false,
  e2e: {
    baseUrl: "http://127.0.0.1:8080",
    screenshotOnRunFailure: true,
    setupNodeEvents(on) {
      on("task", {
        table(message) {
          console.table(message);

          return null;
        }
      });
    },
    specPattern: "cypress/e2e/**/*.cy.ts",
    supportFile: "cypress/support/e2e.ts",
    video: false,
    viewportHeight: 844,
    viewportWidth: 390
  }
});
