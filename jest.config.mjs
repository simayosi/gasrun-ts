/** @type {import('ts-jest').JestConfigWithTsJest} **/
export default {
  setupFiles: ["./tests/jest.setup.js"],
  testEnvironment: "node",
  testMatch: ["**/tests/?(*.)+(spec|test).+(cjs|mjs|ts)"],
  transform: {
    "^.+.tsx?$": ["ts-jest", {}],
  },
};
