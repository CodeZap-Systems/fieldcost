/**
 * Package.json Scripts Addition
 * Add these scripts to your package.json
 */

{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:api": "jest tests/api",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:headed": "playwright test --headed",
    "test:e2e:debug": "playwright test --debug",
    "test:all": "npm run test:api && npm run test:e2e",
    "test:quotes": "npm test -- tests/api/quotes.test.ts && playwright test tests/e2e/quotes.spec.ts",
    "test:suppliers": "npm test -- tests/api/suppliers.test.ts && playwright test tests/e2e/suppliers.spec.ts",
    "test:purchase-orders": "npm test -- tests/api/purchase-orders.test.ts && playwright test tests/e2e/purchase-orders.spec.ts",
    "playwright:install": "playwright install",
    "playwright:report": "playwright show-report"
  }
}
