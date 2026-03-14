module.exports = {
  /**
   * Jest Configuration for FieldCost API Testing
   * Covers authentication, projects, tasks, and invoices API endpoints
   */

  displayName: 'API Tests',
  testEnvironment: 'node',
  rootDir: '.',
  testMatch: ['<rootDir>/tests/api/**/*.test.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],

  // TypeScript support via ts-jest
  preset: 'ts-jest',
  globals: {
    'ts-jest': {
      tsconfig: {
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
      },
    },
  },

  // Module resolution
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^@fixtures/(.*)$': '<rootDir>/tests/fixtures/$1',
    '^@helpers/(.*)$': '<rootDir>/tests/helpers/$1',
  },

  // Setup files
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],

  // Test timeout (API calls may take time)
  testTimeout: 30000,

  // Coverage configuration
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
    '/dist/',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },

  // Reporters
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputDirectory: './test-results',
        outputName: 'api-test-results.xml',
        classNameTemplate: '{classname}',
        titleTemplate: '{title}',
        ancestorSeparator: ' › ',
        usePathAsClassName: true,
      },
    ],
    [
      'jest-html-reporters',
      {
        publicPath: './test-results',
        filename: 'api-test-report.html',
        pageTitle: 'FieldCost API Test Report',
        expand: true,
        openReport: false,
      },
    ],
  ],

  // Verbose output
  verbose: true,

  // Test patterns
  testPathIgnorePatterns: [
    '/node_modules/',
    '/.next/',
    '/dist/',
  ],

  // Maximum workers for parallel execution
  maxWorkers: '50%',

  // Bail on first failure for faster feedback
  bail: 0,

  // Notify on completion
  notify: false,

  // Clear mocks between tests
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,

  // Transform files
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },

  // Module paths
  modulePaths: ['<rootDir>'],

  // Test environment variables
  testEnvironmentOptions: {
    NODE_ENV: 'test',
    API_URL: 'http://localhost:3000',
  },

  // Watch mode settings
  watchPathIgnorePatterns: [
    '/node_modules/',
    '/.next/',
    '/dist/',
    '/coverage/',
  ],

  // Before/after all hooks
  globalSetup: undefined,
  globalTeardown: undefined,

  // Timing configuration
  slowTestThreshold: 5,

  // Error on deprecated APIs
  errorOnDeprecated: false,

  // Additional settings
  injectGlobals: true,
  detectOpenHandles: false,
};
