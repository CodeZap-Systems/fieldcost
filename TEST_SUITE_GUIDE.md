/**
 * TEST SUITE GUIDE
 * 
 * Complete guide to running and understanding the automated test suite
 */

# FieldCost Automated Test Suite Documentation

## Overview

This comprehensive test suite provides full coverage of the FieldCost application including:
- **E2E Tests**: Playwright browser automation for UI workflows
- **API Tests**: Jest + Supertest for REST endpoint validation
- **Tier 2 Features**: Complete coverage of quotations, suppliers, purchase orders, and GRN
- **Multi-tenant Isolation**: All tests verify company_id and RLS enforcement

## Test Structure

```
tests/
├── e2e/                          # Playwright end-to-end tests
│   ├── auth.spec.ts              # Authentication workflows (10 tests)
│   ├── projects.spec.ts          # Project CRUD operations (10 tests)
│   ├── tasks.spec.ts             # Task management (10 tests)
│   ├── customers.spec.ts         # Customer management (6 tests)
│   ├── quotes.spec.ts            # Quotations - TIER 2 (10 tests)
│   ├── suppliers.spec.ts         # Suppliers - TIER 2 (10 tests)
│   ├── purchase-orders.spec.ts   # Purchase orders - TIER 2 (10 tests)
│   ├── invoices.spec.ts          # Invoice management (6 tests)
│   └── inventory.spec.ts         # Inventory items (6 tests)
│
├── api/                          # Jest + Supertest API tests
│   ├── auth.test.ts              # Authentication endpoints (5 tests)
│   ├── quotes.test.ts            # Quote CRUD - TIER 2 (15+ tests)
│   ├── suppliers.test.ts         # Supplier CRUD - TIER 2 (15+ tests)
│   ├── purchase-orders.test.ts   # PO & GRN - TIER 2 (20+ tests)
│   ├── projects.test.ts          # Project endpoints (15 tests)
│   ├── tasks.test.ts             # Task endpoints (10 tests)
│   ├── customers.test.ts         # Customer endpoints (15 tests)
│   ├── items.test.ts             # Inventory endpoints (15 tests)
│   └── invoices.test.ts          # Invoice endpoints (15 tests)
│
├── helpers/                      # Test utilities
│   ├── auth.ts                   # Login/logout functions, auth helpers
│   ├── api.ts                    # HTTP request wrappers, validation helpers
│   └── generators.ts             # Test data generators (160+ lines)
│
└── fixtures/                     # Static test data
    └── test-data.json            # Test users, companies, reference data
```

## Test Count Summary

- **E2E Tests**: 68 tests across 9 test suites
- **API Tests**: 95+ tests across 9 test suites
- **Total Coverage**: 160+ automated tests
- **Modules Tested**: 11 major application modules
- **Tier 2 Emphasis**: 50+ dedicated tests for quotations, suppliers, POs, GRN

## Running Tests

### Prerequisites

```bash
# Install dependencies
npm install

# Start development server
npm run dev          # Server running on localhost:3000

# In another terminal, run tests
npm test
```

### Run All Tests

```bash
# Jest API tests
npm test -- tests/api

# Playwright E2E tests
npx playwright test

# Both
npm test && npx playwright test
```

### Run Specific Test Suite

```bash
# E2E Tests
npx playwright test tests/e2e/auth.spec.ts
npx playwright test tests/e2e/quotes.spec.ts        # Tier 2
npx playwright test tests/e2e/suppliers.spec.ts    # Tier 2
npx playwright test tests/e2e/purchase-orders.spec.ts  # Tier 2

# API Tests
npm test -- tests/api/auth.test.ts
npm test -- tests/api/quotes.test.ts               # Tier 2
npm test -- tests/api/suppliers.test.ts            # Tier 2
npm test -- tests/api/purchase-orders.test.ts      # Tier 2
```

### Debug Mode

```bash
# Playwright with UI
npx playwright test --ui

# Playwright headed (see browser)
npx playwright test --headed

# Single test
npx playwright test tests/e2e/auth.spec.ts -g "should display login page"

# Jest with verbose output
npm test -- --verbose --no-coverage
```

## Test Data

### Test Credentials

```json
{
  "email": "qa_test_user@fieldcost.com",
  "password": "TestPassword123"
}
```

### Test Company

```json
{
  "id": 8,
  "name": "Demo Company",
  "is_demo": true
}
```

### Data Generators

The `tests/helpers/generators.ts` file provides functions to create realistic test data:

```typescript
// Users
generateTestUser()        // email, password, role

// Projects & Tasks
generateTestProject()     // name, budget, location, status
generateTestTask()        // name, project_id, status, description

// Customers & Items
generateTestCustomer()    // name, email, phone, address, city
generateTestInventoryItem() // description, category, quantity, unit_cost

// Invoices
generateTestInvoice()     // invoice_number, customer_id, amount, due_date

// Tier 2 Features
generateTestQuote()       // customer_id, line items, validity date
generateTestSupplier()    // vendor_name, email, rating, payment_terms
generateTestPurchaseOrder()  // supplier_id, line items, required_by_date
generateTestGoodsReceivedNote() // po_id, quality_status, received_location
```

## Test Helpers

### Authentication Helper

```typescript
import { loginUser, logoutUser } from '../helpers/auth';

// In E2E tests
await loginUser(page);  // Navigates to signin, fills credentials, waits for dashboard
await logoutUser(page); // Clicks user menu, signs out, waits for redirect
```

### API Helper

```typescript
import { GET, POST, PATCH, DELETE } from '../helpers/api';

// Make requests with automatic auth token
const response = await GET('/api/quotes', { company_id: 8 });
const quote = await POST('/api/quotes', { ...quoteData });
await PATCH(`/api/quotes/${id}`, { ...updates });
await DELETE(`/api/quotes/${id}`);
```

### Test Data Generator

```typescript
import { generateTestQuote, generateTestSupplier } from '../helpers/generators';

const quote = generateTestQuote();
// {
//   company_id: 8,
//   customer_id: 1,
//   items: [{description, quantity, rate}, ...],
//   validity_date: "2024-12-31"
// }

const supplier = generateTestSupplier();
// {
//   company_id: 8,
//   vendor_name: "...",
//   email: "...",
//   rating: 4-5,
//   payment_terms: "net 30",
//   tax_number: "..."
// }
```

## Key Features Tested

### Authentication (10 E2E + 5 API tests)
- ✅ Login with valid credentials
- ✅ Invalid credentials rejection
- ✅ Session persistence
- ✅ Logout functionality
- ✅ Protected route access
- ✅ Password reset flow

### Projects (10 E2E + 15 API tests)
- ✅ Create projects with validation
- ✅ List with filtering and search
- ✅ Edit project details
- ✅ Delete with confirmation
- ✅ Budget validation
- ✅ Status transitions

### Quotes - TIER 2 (10 E2E + 15 API tests)
- ✅ Create multi-line quotes
- ✅ Calculate totals automatically
- ✅ Send to customers
- ✅ Filter by status (draft, sent, accepted)
- ✅ Edit draft quotes only
- ✅ Delete with RLS enforcement
- ✅ Validate required fields

### Suppliers - TIER 2 (10 E2E + 15 API tests)
- ✅ Create suppliers with full details
- ✅ Edit contact information
- ✅ Filter by rating (1-5 stars)
- ✅ Search by vendor name
- ✅ Email format validation
- ✅ Delete with associated PO checks
- ✅ Payment terms management

### Purchase Orders - TIER 2 (10 E2E + 20 API tests)
- ✅ Create POs with line items
- ✅ Multi-tenant company_id enforcement
- ✅ Send to suppliers
- ✅ Log goods received notes (GRN)
- ✅ Auto-status updates (draft → confirmed → partial → full)
- ✅ Quantity validation (prevent over-receiving)
- ✅ Total calculation
- ✅ Delivery tracking

### Goods Received Notes (Embedded in PO tests)
- ✅ Log receipt with quality status
- ✅ Quantity validation
- ✅ Auto-transition PO status
- ✅ Prevent over-receiving
- ✅ Damage notes tracking
- ✅ Received location recording

### Other Modules (Tasks, Customers, Invoices, Inventory)
- ✅ 10+ tests each for CRUD operations
- ✅ Filtering and search
- ✅ Validation
- ✅ Status transitions
- ✅ RLS enforcement

## Continuous Integration

### GitHub Actions Example

```yaml
name: Tests
on: [push, pull_request]

jobs:
  api-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm run build
      - run: npm run dev &
      - run: npm test -- tests/api
        env:
          NODE_ENV: test

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npx playwright install
      - run: npm run build
      - run: npm run dev &
      - run: npx playwright test
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

## Test Coverage Goals

- **Statement Coverage**: 70%+
- **Branch Coverage**: 70%+
- **Function Coverage**: 70%+
- **Line Coverage**: 70%+

### View Coverage

```bash
npm test -- --coverage
```

## Common Test Patterns

### E2E - Form Submission

```typescript
test('should create resource', async ({ page }) => {
  await loginUser(page);
  await page.goto('http://localhost:3000/dashboard/resources');
  
  await page.click('button:has-text("Create")');
  await page.fill('input[name="name"]', 'Test Name');
  
  await page.click('button:has-text("Submit")');
  
  await expect(page.locator('[role="alert"]')).toContainText('successfully');
});
```

### API - CRUD Test

```typescript
test('should create and read resource', async () => {
  const response = await POST('/api/resource', {
    company_id: 8,
    name: 'Test',
  });
  
  expect(response.status).toBe(201);
  const id = response.body.id;
  
  const getResponse = await GET(`/api/resource/${id}`, {
    company_id: 8,
  });
  
  expect(getResponse.status).toBe(200);
  expect(getResponse.body.name).toBe('Test');
});
```

## Troubleshooting

### Tests Timeout

```bash
# Increase timeout
npx playwright test --timeout 60000

# Check if server is running
curl http://localhost:3000
```

### E2E Tests Fail to Login

1. Verify server is running: `npm run dev`
2. Check test credentials in `tests/fixtures/test-data.json`
3. Verify database has test user (email: qa_test_user@fieldcost.com)

### API Tests Return 401

- Check authorization header is being sent
- Verify token is valid in helpers/api.ts
- Test without auth: use direct request

### Flaky Tests

- Increase wait times: `page.waitForLoadState('networkidle')`
- Add explicit waits: `await page.waitForSelector('[data-testid="success"]')`
- Retry with: `test.setTimeout(60000)`

## Performance Baseline

Expected test execution times:
- E2E suite: ~5-10 minutes (parallel: 2-3 minutes)
- API tests: ~30-60 seconds
- Total: ~7-15 minutes (sequential)

## Next Steps

1. **Run tests locally**: `npm run dev` then `npx playwright test`
2. **Add to CI/CD**: Integrate into GitHub Actions or other CI system
3. **Expand coverage**: Add tests for edge cases and error scenarios
4. **Monitor**: Track test results and code coverage over time
5. **Regression testing**: Run against staging before production deployments
