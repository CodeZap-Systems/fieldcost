# Test Suite Setup Instructions

## Prerequisites

Before running tests, ensure you have:

1. **Node.js 18+** installed
2. **npm** or **yarn** package manager
3. **Development server** running (`npm run dev`)
4. **Database** initialized with schema
5. **Test user** created in database:
   ```
   Email: qa_test_user@fieldcost.com
   Password: TestPassword123
   Role: admin
   ```

## Initial Setup

### 1. Install Dependencies

```bash
# Install all development and test dependencies
npm install

# Install Playwright browsers (one-time setup)
npx playwright install
```

### 2. Environment Configuration

Create `.env.test` with test-specific configuration:

```env
# Database
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key

# API Testing
NEXT_PUBLIC_API_URL=http://localhost:3000
TEST_API_URL=http://localhost:3000

# Test Configuration
NODE_ENV=test
TEST_USER_EMAIL=qa_test_user@fieldcost.com
TEST_USER_PASSWORD=TestPassword123
TEST_COMPANY_ID=8
```

### 3. Database Preparation

Run SQL to ensure test user and company exist:

```sql
-- Insert test company if not exists
INSERT INTO companies (id, name, is_demo)
VALUES (8, 'Demo Company', true)
ON CONFLICT (id) DO UPDATE SET is_demo = true;

-- Insert test user if not exists
INSERT INTO auth.users (email, encrypted_password, confirmed_at)
VALUES (
  'qa_test_user@fieldcost.com',
  crypt('TestPassword123', gen_salt('bf')),
  NOW()
)
ON CONFLICT (email) DO NOTHING;
```

### 4. Update package.json

Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:api": "jest tests/api",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:headed": "playwright test --headed",
    "test:tier2": "npm run test:api -- tests/api/quotes.test.ts && npm run test:api -- tests/api/suppliers.test.ts && npm run test:e2e -- tests/e2e/quotes.spec.ts",
    "test:all": "npm run test:api && npm run test:e2e"
  }
}
```

## Running Tests

### Start Development Server

In one terminal:
```bash
npm run dev
# Server will run on http://localhost:3000
```

### In Another Terminal, Run Tests

#### All Tests
```bash
npm test:all
```

#### API Tests Only
```bash
npm test:api
npm test -- tests/api           # Specific suite
npm test:watch                 # Watch mode
npm test:coverage              # With coverage
```

#### E2E Tests Only
```bash
npm run test:e2e
npx playwright test --ui       # Interactive UI mode
npx playwright test --headed   # See browser
npx playwright test tests/e2e/auth.spec.ts  # Specific suite
```

#### Tier 2 Features Only
```bash
npm run test:tier2
# Or individually:
npm test -- tests/api/quotes.test.ts
npm test -- tests/api/suppliers.test.ts
npm test -- tests/api/purchase-orders.test.ts
npx playwright test tests/e2e/quotes.spec.ts
```

## Test Organization

### E2E Test Suites (Playwright)

| Suite | Tests | Focus |
|-------|-------|-------|
| `auth.spec.ts` | 10 | Login, logout, session, security |
| `projects.spec.ts` | 10 | Project CRUD, filtering |
| `tasks.spec.ts` | 10 | Task workflows, status |
| `customers.spec.ts` | 6 | Customer data, validation |
| `quotes.spec.ts` | 10 | **[TIER 2]** Multi-line quotes, send |
| `suppliers.spec.ts` | 10 | **[TIER 2]** Vendor management, rating |
| `purchase-orders.spec.ts` | 10 | **[TIER 2]** PO creation, GRN, status |
| `invoices.spec.ts` | 6 | Invoice workflows, PDF |
| `inventory.spec.ts` | 6 | Stock management, filtering |

### API Test Suites (Jest)

| Suite | Tests | Focus |
|-------|-------|-------|
| `auth.test.ts` | 5 | Signin, signout, validation |
| `projects.test.ts` | 15 | Project CRUD, validation |
| `tasks.test.ts` | 10 | Task endpoints |
| `customers.test.ts` | 15 | Customer endpoints |
| `quotes.test.ts` | 15+ | **[TIER 2]** Quote CRUD, send |
| `suppliers.test.ts` | 15+ | **[TIER 2]** Supplier CRUD |
| `purchase-orders.test.ts` | 20+ | **[TIER 2]** PO & GRN endpoints |
| `invoices.test.ts` | 15+ | Invoice CRUD |
| `items.test.ts` | 15 | Inventory endpoints |

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

Use the generator utilities in `tests/helpers/generators.ts`:

```typescript
import {
  generateTestUser,
  generateTestProject,
  generateTestQuote,
  generateTestSupplier,
  generateTestPurchaseOrder,
} from '../helpers/generators';

// Generate realistic test data
const quote = generateTestQuote();
const supplier = generateTestSupplier();
const po = generateTestPurchaseOrder();
```

## Debugging

### Playwright Debugging
```bash
# Interactive UI Mode
npx playwright test --ui

# Headed Mode (see browser)
npx playwright test --headed

# Debug a specific test
npx playwright test tests/e2e/auth.spec.ts -g "should display login page"

# Generate trace for inspection
npx playwright test --trace on
```

### Jest Debugging
```bash
# Watch mode for development
npm test -- --watch

# Debug specific test
npm test -- --testNamePattern="should create quote"

# Verbose output
npm test -- --verbose
```

### Browser DevTools
```bash
# Launch with DevTools open
npx playwright test --headed --debug
```

## Continuous Integration

### GitHub Actions Example

Create `.github/workflows/tests.yml`:

```yaml
name: Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  api-tests:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm run build
      - run: npm run dev > /dev/null 2>&1 &
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
      - run: npx playwright install --with-deps
      - run: npm run build
      - run: npm run dev > /dev/null 2>&1 &
      - run: npx playwright test
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

## Troubleshooting

### Tests Timeout
```bash
# Increase timeout
npx playwright test --timeout 60000
```

### Server Not Responding
```bash
# Verify server is running
curl http://localhost:3000

# Start server
npm run dev
```

### Login Fails in E2E Tests
1. Verify test user exists in database
2. Check credentials in `tests/fixtures/test-data.json`
3. Ensure database migrations are run

### API Tests Return 401
- Check auth token is being set in helpers/api.ts
- Verify test user is authenticated
- Check environment variables

### Playwright Browser Issues
```bash
# Reinstall browsers
npx playwright install

# Clean install
rm -rf ~/.cache/ms-playwright
npx playwright install
```

## Performance Tips

1. **Run API and E2E tests in parallel**
   ```bash
   npm test & npx playwright test
   ```

2. **Use headless mode for CI** (default)
   ```bash
   npx playwright test  # No --headed flag
   ```

3. **Disable video/screenshots in development**
   Edit `playwright.config.ts` to disable `video` and `screenshot`

4. **Use test tags** to run specific test sets
   ```bash
   npx playwright test --grep @tag-name
   ```

## Coverage Reports

### Generate Coverage
```bash
npm test:coverage
```

### View HTML Report
```bash
open coverage/lcov-report/index.html  # macOS
start coverage/lcov-report/index.html # Windows
```

## Next Steps

1. ✅ Setup complete
2. Run initial test suite: `npm run test:all`
3. Fix any failing tests
4. Integrate into CI/CD pipeline
5. Monitor coverage metrics
6. Expand tests as features are added

## Support

For test failures or issues:
1. Check test logs in terminal
2. Review Playwright report: `npx playwright show-report`
3. Check test fixtures in `tests/fixtures/test-data.json`
4. Verify database state and migrations

---

**Status**: ✅ Complete
**Last Updated**: Current Session
