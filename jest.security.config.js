module.exports = {
  displayName: 'security',
  testEnvironment: 'node',
  preset: 'ts-jest',
  testMatch: ['<rootDir>/tests/security/**/*.test.ts'],
  setupFilesAfterEnv: ['<rootDir>/tests/security/setup.ts'],
  globals: {
    'ts-jest': {
      tsconfig: {
        jsx: 'react',
        esModuleInterop: true,
      },
    },
  },
  moduleNameMapper: {
    '^@tests/(.*)$': '<rootDir>/tests/$1',
  },
  collectCoverageFrom: [
    'app/**/*.{ts,tsx}',
    'lib/**/*.{ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/.next/**',
  ],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/.next/',
    '/build/',
    '/dist/',
  ],
  testTimeout: 45000,
  verbose: true,
  bail: 1, // Stop on first failure
  maxWorkers: 1, // Run security tests sequentially
};
