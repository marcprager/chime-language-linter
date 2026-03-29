module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/*.test.ts'],
  moduleNameMapper: {
    '^@chime-linter/core$': '<rootDir>/../core/src/index.ts',
    '^@chime-linter/core/(.*)$': '<rootDir>/../core/src/$1',
  },
};
