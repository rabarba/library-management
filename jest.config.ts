import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleFileExtensions: ["ts", "js", "json"],
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
  collectCoverage: false,
  collectCoverageFrom: ["src/**/*.ts"],
  coverageDirectory: "coverage",
  coveragePathIgnorePatterns: ["/node_modules/", "/tests/"],
  testMatch: ["**/*.spec.ts", "**/*.test.ts"],
  verbose: true,
  clearMocks: true,
  resetMocks: true,
  resetModules: true,
};

export default config;
