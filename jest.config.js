module.exports = {
  preset: "jest-expo",
  moduleNameMapper: {
    "^expo-modules-core/src/Refs$": "<rootDir>/test/mocks/expoRefs.js",
    "^expo-modules-core/src/web/index.web$":
      "<rootDir>/test/mocks/expoModulesWeb.js"
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testPathIgnorePatterns: ["/node_modules/", "/dist/"]
};
