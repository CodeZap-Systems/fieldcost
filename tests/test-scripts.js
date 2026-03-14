/**
 * Test Runner Configuration
 * npm test command configurations for FieldCost
 */

module.exports = {
  scripts: {
    // Primary test commands
    'test': 'jest --runInBand',
    'test:e2e': 'playwright test',
    'test:api': 'jest --testPathPattern=tests/api',
    'test:watch': 'jest --watch',
    'test:debug': 'node --inspect-brk node_modules/.bin/jest',
    'test:coverage': 'jest --coverage',
    'test:report': 'jest --coverage --reporters=default --reporters=jest-junit',
    
    // Specific module tests
    'test:auth': 'jest tests/api/auth.test.ts && playwright test tests/e2e/authentication.spec.ts',
    'test:projects': 'jest tests/api/projects.test.ts && playwright test tests/e2e/projects.spec.ts',
    'test:tasks': 'jest tests/api/tasks.test.ts && playwright test tests/e2e/tasks.spec.ts',
    'test:invoices': 'jest tests/api/invoices.test.ts && playwright test tests/e2e/invoices.spec.ts',
    'test:inventory': 'jest tests/api/inventory.test.ts && playwright test tests/e2e/inventory.spec.ts',
    'test:company': 'jest tests/api/company.test.ts && playwright test tests/e2e/company.spec.ts',
    'test:admin': 'jest tests/api/admin.test.ts',
    'test:erp': 'playwright test tests/e2e/erp.spec.ts',
    'test:customers': 'playwright test tests/e2e/customers.spec.ts',
    
    // Performance tests
    'test:perf': 'jest tests/api --maxWorkers=1',
    'test:load': 'artillery quick --count 100 --num 10 http://localhost:3000/api',
    
    // CI/CD
    'test:ci': 'jest --CI --coverage --maxWorkers=2',
    'test:ci:e2e': 'playwright test --reporter=junit',
    
    // Utility commands
    'test:clean': 'jest --clearCache',
    'test:verbose': 'jest --verbose',
    'test:only': 'jest --testNamePattern',
    'test:skip-slow': 'jest --testNamePattern="^(?!.*slow)"',
  },
  
  devDependencies: {
    '@jest/globals': '^29.0.0',
    '@playwright/test': '^1.58.2',
    '@testing-library/jest-dom': '^6.0.0',
    '@testing-library/react': '^14.0.0',
    '@types/jest': '^29.0.0',
    '@types/supertest': '^7.2.0',
    'artillery': '^2.0.0',
    'jest': '^29.0.0',
    'jest-junit': '^16.0.0',
    'supertest': '^7.2.2',
    'ts-jest': '^29.0.0',
  },
};
