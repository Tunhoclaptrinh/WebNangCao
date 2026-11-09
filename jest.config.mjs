import nextJest from "next/jest.js";

const createJestConfig = nextJest({ dir: "./" });

export default createJestConfig({
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^server-only$": "<rootDir>/tests/server-only.ts",
  },
  testMatch: ["<rootDir>/tests/**/*.test.[jt]s?(x)"],
  collectCoverageFrom: [
    "src/features/**/*.ts",
    "src/lib/site.ts",
    "src/lib/data.ts",
    "src/components/countdown-timer.tsx",
    "src/components/deadline-card.tsx",
    "src/components/icons.tsx",
  ],
  coverageThreshold: {
    global: { statements: 75, branches: 65, functions: 70, lines: 75 },
  },
});
