/**
 * FieldCost Comprehensive Testing Suite - README
 * 
 * This folder contains complete end-to-end and API tests for FieldCost
 */

# 🧪 FieldCost Testing Suite

Complete automated testing coverage for FieldCost SaaS platform across all modules and tiers.

## 📁 Folder Structure

```
tests/
├── e2e/                          # Playwright end-to-end tests
│   ├── authentication.spec.ts    # Auth flows (login, register, logout, password reset)
│   ├── projects.spec.ts          # Project CRUD operations
│   ├── tasks.spec.ts             # Task management and kanban
│   ├── invoices.spec.ts          # Invoice creation and management
│   ├── customers.spec.ts         # Customer management
│   ├── inventory.spec.ts         # Inventory item management
│   ├── company.spec.ts           # Company profile and switching
│   └── erp.spec.ts               # ERP integrations (Sage, Xero)
│
├── api/                          # Jest + Supertest API tests
│   ├── auth.test.ts              # Authentication endpoints
│   ├── projects.test.ts          # Project API endpoints
│   ├── tasks.test.ts             # Task API endpoints
│   ├── invoices.test.ts          # Invoice API endpoints
│   ├── inventory.test.ts         # Inventory API endpoints
│   ├── company.test.ts           # Company API endpoints
│   ├── admin.test.ts             # Admin/RBAC endpoints
│   └── setup.ts                  # Jest configuration and setup
│
├── helpers/                      # Reusable test utilities
│   ├── login.ts                  # Login/logout helpers
│   ├── test-user.ts              # User generation utilities
│   └── test-company.ts           # Company generation utilities
│
└── fixtures/                     # Test data and fixtures
    └── test-data.ts              # Centralized test data
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- FieldCost dev server running on `http://localhost:3000`
- Jest and Playwright already installed

### Installation

```bash
# Install dependencies (if not already installed)
npm install --save-dev jest @types/jest supertest @types/supertest playwright @playwright/test @babel/preset-typescript

# Navigate to project root
cd fieldcost
```

### Running Tests

#### Run all tests:
```bash
npm test
```

#### Run E2E tests only:
```bash
npm run test:e2e
```

#### Run API tests only:
```bash
npm run test:api
```

#### Run specific test file:
```bash
npm test -- tests/e2e/authentication.spec.ts
npm test -- tests/api/projects.test.ts
```

#### Run tests in watch mode:
```bash
npm test -- --watch
```

#### Run tests with coverage:
```bash
npm test -- --coverage
```

### Environment Setup

Create a `.env.test` file for test-specific configuration:

```env
API_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=test-anon-key
SUPABASE_SERVICE_ROLE_KEY=test-service-key

# Test User Credentials
TEST_USER_EMAIL=qa_test_user@fieldcost.com
TEST_USER_PASSWORD=TestPassword123!
```

## 📊 Test Coverage

### Module Coverage

| Module | E2E Tests | API Tests | Total |
|--------|----------|----------|-------|
| Authentication | 12+ | 8+ | 20+ |
| Projects | 10+ | 7+ | 17+ |
| Tasks | 10+ | 6+ | 16+ |
| Invoices | 13+ | 9+ | 22+ |
| Customers | 6+ | - | 6+ |
| Inventory | 7+ | 6+ | 13+ |
| Company | 8+ | 5+ | 13+ |
| ERP Integration | 8+ | - | 8+ |
| Admin/RBAC | - | 10+ | 10+ |
| **Total** | **74+** | **51+** | **125+** |

## 🧩 Test Modules

### Authentication (20+ tests)
- User registration with validation
- Login with credentials
- Password reset flow
- Session management
- Logout functionality
- Security (password masking, token validation)

**Example Test:**
```typescript
test('should login user with valid credentials', async () => {
  const user = getDefaultTestUser();
  await loginUser(page, user);
  expect(page.url()).toMatch(/dashboard/);
});
```

### Project Management (17+ tests)
- Create, read, update, delete projects
- Filter and search projects
- Project status changes
- Budget tracking
- Report generation
- Pagination and bulk actions

**Example Data:**
```typescript
const projectTestData = {
  name: 'Test Construction Project',
  budget: 50000,
  status: 'active',
};
```

### Task Management (16+ tests)
- Create, assign, complete tasks
- Kanban board interactions
- Task filtering by priority/status
- Drag and drop functionality
- Task reports

### Invoice Management (22+ tests)
- Create invoices with line items
- Automatic calculation (subtotal, tax, total)
- Invoice PDF generation
- Status management (draft, sent, paid)
- Email delivery
- Invoice search and filtering

**Example:**
```typescript
const invoiceData = generateInvoiceWithItems(3);
// Items: [
//   { description: 'Service 1', quantity: 1, rate: 500, total: 500 },
//   { description: 'Service 2', quantity: 2, rate: 1000, total: 2000 },
//   ...
// ]
// Subtotal: 5500, Tax: 825 (15% VAT), Total: 6325
```

### Customer Management (6+ tests)
- Create, edit, delete customers
- Customer list and search
- Phone and email validation

### Inventory Management (13+ tests)
- Create, edit, delete inventory items
- SKU management
- Stock level tracking
- Low stock warnings
- Price management

### Company Management (13+ tests)
- View company profile
- Edit company details
- Upload company logo
- Multi-company support
- Company switching

### ERP Integration (8+ tests)
- Sage 50 connection Xero connection
- Customer sync
- Item sync
- Invoice sync to Sage
- Sync history and error handling

### Admin & RBAC (10+ tests)
- User management
- Role assignment
- Permission verification
- Audit logging
- Subscription plan management
- Platform metrics

## 🛠️ Helper Utilities

### Test User Generator

```typescript
import { generateTestUser, getDefaultTestUser } from '@tests/helpers/test-user';

// Generate unique user
const newUser = generateTestUser();
// Returns: { email: 'qa_test_1234567890@fieldcost.com', password: '...', firstName: 'QA', ... }

// Get default test user
const user = getDefaultTestUser();
// Returns: { email: 'qa_test_user@fieldcost.com', password: 'TestPassword123!', ... }
```

### Login Helper

```typescript
import { loginUser, logoutUser } from '@tests/helpers/login';

// Login via UI
await loginUser(page, testUser);

// Logout via UI
await logoutUser(page);

// Check if logged in
const loggedIn = await isLoggedIn(page);
```

### Company Generator

```typescript
import { generateTestCompany, getSampleContractorCompany } from '@tests/helpers/test-company';

// Generate unique company
const company = generateTestCompany();

// Get sample contractor company
const contractor = getSampleContractorCompany();
```

## 📋 Test Data Fixtures

Centralized test data in `tests/fixtures/test-data.ts`:

```typescript
// Project data
projectTestData.valid  // Valid project
projectTestData.invalid // Invalid scenarios

// Task data
taskTestData.valid
taskTestData.invalid

// Invoice data with line items
invoiceTestData.valid
queryInvoiceWithItems(3)  // Generate invoice with 3 line items

// Customer, Inventory, RBAC, etc.
```

## 🔐 Security Testing

Tests verify:
- Password strength requirements
- Credential validation
- SQL injection prevention
- CORS protection
- Rate limiting
- Session management
- RBAC enforcement

## 📈 Running Tests in CI/CD

### GitHub Actions Example

```yaml
name: Test Suite
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run dev &  # Start dev server
      - run: npm test       # Run all tests
```

## 🐛 Debugging Tests

### View detailed test output:
```bash
npm test -- --verbose
```

### Debug single test:
```bash
node --inspect-brk node_modules/.bin/jest tests/api/auth.test.ts
```

### View browser in Playwright (headless=false):
```bash
# Modify playwright.config.ts temporarily:
use: { headless: false }
```

## 📊 Coverage Reports

```bash
npm test -- --coverage

# Open HTML coverage report
open coverage/lcov-report/index.html
```

Expected coverage:
- Statements: >75%
- Branches: >70%
- Functions: >75%
- Lines: >75%

## 🔄 Continuous Testing

### Watch mode (re-run on file changes):
```bash
npm test -- --watch
```

### Run tests on schedule (cron job):
```bash
# Test daily at 2 AM
0 2 * * * npm test
```

## 🎯 Test Best Practices

1. **Use realistic test data** - Mirror production scenarios
2. **Test edge cases** - Empty values, negative numbers, special characters
3. **Clean up after tests** - Proper teardown to avoid test pollution
4. **Use descriptive names** - Clear test descriptions for easy identification
5. **Keep tests independent** - No test should depend on another
6. **Mock external APIs** - When safe to do so
7. **Test error flows** - Verify error handling and display
8. **Test security** - RBAC, permission checks, data isolation

## 📝 Adding New Tests

### E2E Test Template:
```typescript
test('should [action] [expected result]', async () => {
  // Arrange - set up test data
  const testData = generateTestData();
  
  // Act - perform action
  await page.click('button');
  await page.fill('input', 'value');
  
  // Assert - verify result
  await expect(page.locator('text')).toBeVisible();
});
```

### API Test Template:
```typescript
it('should [action] [expected result]', async () => {
  const response = await request(API_URL)
    .post('/api/endpoint')
    .set('Authorization', `Bearer ${authToken}`)
    .send(testData);
  
  expect(response.status).toBe(200);
  expect(response.body).toHaveProperty('expectedField');
});
```

## 🚨 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Tests timeout | Increase timeout: `test.setTimeout(60000)` |
| Element not found | Wait for element: `await page.waitForSelector()` |
| Network errors | Check API is running on localhost:3000 |
| Flaky tests | Add explicit waits: `await page.waitForLoadState()` |
| Auth token expires | Refresh token in beforeAll() hook |

## 📚 Additional Resources

- [Playwright Documentation](https://playwright.dev)
- [Jest Documentation](https://jestjs.io)
- [Supertest Documentation](https://github.com/visionmedia/supertest)
- [FieldCost Architecture](../ARCHITECTURE_OVERVIEW.md)

## 🤝 Contributing

When adding new features:
1. Write tests first (TDD approach)
2. Add E2E tests for user flows
3. Add API tests for endpoints
4. Update this README with new test count
5. Ensure all tests pass before PR

## ✅ Test Checklist

Before committing:
- [ ] All tests pass locally
- [ ] No hardcoded test data
- [ ] Tests clean up after themselves
- [ ] Descriptive test names
- [ ] No skipped tests (unless documented)
- [ ] Coverage maintained or improved

---

**Total Tests**: 125+  
**Pass Rate Target**: 100%  
**Coverage Target**: >75%  
**Last Updated**: March 12, 2026
