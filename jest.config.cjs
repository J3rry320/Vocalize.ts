/** @type {import('@jest/types').Config.InitialOptions} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  setupFiles: ["./jest.setup.js"],
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageReporters: ["text", "html"],
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.json",
    },
  },
  // transform: {
  //   "^.+\\.tsx?$": "ts-jest",
  // },
};
