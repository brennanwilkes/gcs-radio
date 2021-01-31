module.exports = {
  roots: ["<rootDir>/src/"],
  clearMocks: true,
  testEnvironment: 'node',
  collectCoverage: true,
  coverageDirectory: 'coverage',
  reporters: [
    "default",
    [ "jest-junit", { outputDirectory: 'coverage'} ]
  ],
};
