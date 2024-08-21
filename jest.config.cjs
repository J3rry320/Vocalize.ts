/** @type {import('@jest/types').Config.InitialOptions} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  setupFiles: ["./jest.setup.cjs"],
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageReporters: ["text", "html"],
  // globals: {
  //   "ts-jest": {
  //     tsconfig: "tsconfig.json",
  //   },
  // },
  // transform: {
  //   "^.+\\.tsx?$": "ts-jest",
  // },
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        tsConfig: "tsconfig.json",
      },
    ],
  },
};
