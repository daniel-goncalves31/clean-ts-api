module.exports = {
  clearMocks: true,
  coverageDirectory: 'coverage',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  preset: '@shelf/jest-mongodb',
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '!<rootDir>/src/**/protocols/*',
    '!<rootDir>/src/**/*protocols.ts'
  ],
  transform: {
    '.+\\.ts$': 'ts-jest'
  }
}
