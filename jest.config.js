module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/test'],
  moduleFileExtensions: ['js', 'json'],
  testMatch: ['**/*.test.js'],
  setupFilesAfterEnv: ['<rootDir>/test/setup.js'],
};
