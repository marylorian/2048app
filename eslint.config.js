const expoConfig = require("eslint-config-expo/flat");
const { defineConfig } = require("eslint/config");

module.exports = defineConfig([
  ...expoConfig,
  {
    ignores: [
      "dist/**",
      "node_modules/**",
      ".expo/**",
      "coverage/**",
      "storybook-static/**",
      "android/**",
      "ios/**"
    ]
  },
  {
    files: ["jest.setup.ts"],
    rules: {
      "@typescript-eslint/no-require-imports": "off"
    }
  },
  {
    files: ["cypress/**/*.ts"],
    languageOptions: {
      globals: {
        cy: "readonly",
        Cypress: "readonly",
        describe: "readonly",
        expect: "readonly",
        it: "readonly"
      }
    }
  }
]);
