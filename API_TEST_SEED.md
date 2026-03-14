# API Test Seed Endpoint

## Overview

The `/api/test/seed` endpoint provides HTTP access to seed test data into your FieldCost database. This is useful for:

- **CI/CD Pipelines** - Seed data via HTTP before running tests
- **Local Development** - Populate database via API instead of CLI
- **Automated Testing** - Tests can trigger seeding before running
- **Performance Testing** - Load seed data repeatedly
- **Integration Testing** - Set up known data state via HTTP

---

## Endpoints

### Seed Test Data
**POST** `/api/test/seed`

Populates test database with realistic test data.

#### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `clear` | boolean | No | Clear all test data before seeding (default: false) |
| `module` | string | No | Seed only specific module: `users`, `companies`, `projects`, `invoices`, `tasks`, `customers`, `inventory`, `all` (default: all) |

#### Response

```json
{
  "success": true,
  "message": "Test data seeding complete",
  "timestamp": "2026-03-12T12:00:00.000Z",
  "environment": "test",
  "details": {
    "users": {
      "success": true,
      "count": 4,
      "users": [
        {
          "email": "qa_admin@fieldcost.com",
          "status": "created",
          "id": "user-uuid"
        }
      ]
    },
    "companies": {
      "success": true,
      "count": 2,
      "companies": []
    },
    "projects": {
      "success": true,
      "count": 4,
      "projects": []
    }
  },
  "testCredentials": {
    "admin": {
      "email": "qa_admin@fieldcost.com",
      "password": "TestPassword123!"
    },
    "pm": {
      "email": "qa_pm@fieldcost.com",
      "password": "TestPassword123!"
    },
    "fieldCrew": {
      "email": "qa_field@fieldcost.com",
      "password": "TestPassword123!"
    },
    "accountant": {
      "email": "qa_accountant@fieldcost.com",
      "password": "TestPassword123!"
    }
  }
}
```

---

## Usage Examples

### curl

```bash
# Seed all test data
curl -X POST http://localhost:3000/api/test/seed

# Clear then seed all test data
curl -X POST "http://localhost:3000/api/test/seed?clear=true"

# Seed only projects
curl -X POST "http://localhost:3000/api/test/seed?module=projects"

# Clear then seed only invoices
curl -X POST "http://localhost:3000/api/test/seed?clear=true&module=invoices"
```

### JavaScript / Fetch

```javascript
// Seed all data
const response = await fetch('http://localhost:3000/api/test/seed', {
  method: 'POST',
});
const data = await response.json();
console.log(data.testCredentials.admin);
```

### Using Test Helper

```typescript
import { seedTestData, clearAndReseedTestData } from '@tests/helpers/seed';

// Seed all test data
await seedTestData();

// Seed only projects
await seedTestData('projects');

// Clear then seed
await clearAndReseedTestData();

// With options
await seedTestData('invoices', {
  baseURL: 'http://localhost:3000',
  timeout: 60000,
});
```

### In Jest Tests

```typescript
// Jest automatically seeds before all tests via setup.ts
// Just use test credentials in your tests:

describe('Authentication', () => {
  it('should login with seeded user', async () => {
    const response = await request
      .post('/api/auth/login')
      .send({
        email: 'qa_admin@fieldcost.com',
        password: 'TestPassword123!',
      });

    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined();
  });
});
```

### In Playwright Tests

```typescript
// Seed before all tests
test.beforeAll(async () => {
  await seedTestData();
});

test('should login with seeded user', async ({ page }) => {
  await page.goto('http://localhost:3000/login');
  await page.fill('input[name="email"]', 'qa_pm@fieldcost.com');
  await page.fill('input[name="password"]', 'TestPassword123!');
  await page.click('button:has-text("Login")');
  await page.waitForNavigation();
  expect(page.url()).toContain('/dashboard');
});
```

### In CI/CD (GitHub Actions)

```yaml
- name: Seed test data
  run: curl -X POST http://localhost:3000/api/test/seed

- name: Run tests
  run: npm test
```

---

## Test Data Created

### Users (4 users)

| Email | Password | Role |
|-------|----------|------|
| qa_admin@fieldcost.com | TestPassword123! | admin |
| qa_pm@fieldcost.com | TestPassword123! | project_manager |
| qa_field@fieldcost.com | TestPassword123! | field_crew |
| qa_accountant@fieldcost.com | TestPassword123! | accountant |

### Companies (2 companies)

- **QA Test Contractor** (Tax: QA123456789)
- **QA Test Mining** (Tax: QA987654321)

### Per Company

- **2 Projects** (active + planning, R50k-R75k budgets)
- **4 Invoices** (draft + sent, with line items)
- **6 Tasks** (various statuses/priorities)
- **2 Customers** (realistic South African details)
- **3 Inventory Items** (materials, safety equipment)

### Total Seeded Data

- 4 users
- 2 companies
- 4 projects
- 4 invoices
- ~8 invoice items
- 6 tasks
- 4 customers
- 6 inventory items

---

## Module-Specific Seeding

Seed only specific modules without clearing others:

```bash
# Seed only projects (keeps existing users, companies)
curl -X POST "http://localhost:3000/api/test/seed?module=projects"

# Available modules:
# - users         (4 test users)
# - companies     (2 test companies)
# - projects      (4 projects)
# - invoices      (4 invoices with items)
# - tasks         (6 tasks)
# - customers     (4 customers)
# - inventory     (6 items)
# - all          (everything)
```

---

## Clear and Reseed

Remove all test data and create fresh:

```bash
# Clear then seed everything
curl -X POST "http://localhost:3000/api/test/seed?clear=true"

# Clear then seed specific module
curl -X POST "http://localhost:3000/api/test/seed?clear=true&module=projects"
```

---

## Environment Requirements

The endpoint is **only available** in test/development environments:

```javascript
// In app/api/test/seed/route.ts
const isTestEnvironment = process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'development';
```

To enable:

```bash
# .env.test or .env.development
NODE_ENV=test
NEXT_PUBLIC_SUPABASE_URL=your_url
SUPABASE_SERVICE_ROLE_KEY=your_key
```

---

## Error Handling

### Missing Credentials

```json
{
  "error": "Failed to seed test data",
  "message": "Missing Supabase credentials"
}
```

**Solution**: Set `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`

### Endpoint Not Found

```
404: Not Found
```

**Solution**: Verify `NODE_ENV=test` or `development`

### Timeout

```
Seed request timed out after 60000ms
```

**Solution**: Increase timeout, check database connection

---

## Troubleshooting

### "User already exists" warnings

Normal if you've seeded before. Script ignores duplicates and continues.

### Partial data seeded

Check error messages in response. Some modules may have failed while others succeeded.

### Database connection error

Verify Supabase is running:
```bash
psql $DATABASE_URL -c "SELECT 1"
```

### Cleanup / Reset

If data gets corrupted:
```bash
# Full reset
curl -X POST "http://localhost:3000/api/test/seed?clear=true"
```

---

## Integration with Testing

### Automatic Seeding (Jest)

```typescript
// tests/api/setup.ts - runs before all tests
beforeAll(async () => {
  await seedTestData(); // Automatic
});
```

### Manual Seeding (Playwright)

```typescript
// tests/e2e/auth.spec.ts
import { seedTestData } from '@tests/helpers/seed';

test.beforeAll(async () => {
  await seedTestData();
});
```

### CI/CD Pipeline

```yaml
jobs:
  test:
    steps:
      - name: Start dev server
        run: npm run dev &

      - name: Seed test data
        run: npm run test:seed # Uses CLI
        # Or: curl -X POST http://localhost:3000/api/test/seed

      - name: Run tests
        run: npm test
```

---

## Performance

- **Seed Time**: ~5-10 seconds for all data
- **Data Size**: ~100KB in database
- **Safe**: Idempotent - no duplicates created
- **Parallel**: Can run multiple seeds (deduped automatically)

---

## API Documentation

### GET `/api/test/seed`

Returns endpoint documentation and examples:

```bash
curl http://localhost:3000/api/test/seed
```

```json
{
  "endpoint": "/api/test/seed",
  "method": "POST",
  "description": "Seeds test database with realistic test data",
  "environment": "test|development only",
  "parameters": { ... },
  "examples": { ... },
  "testCredentials": { ... }
}
```

---

## Example Workflow

```bash
# 1. Start dev server
npm run dev

# 2. In another terminal, seed data
curl -X POST http://localhost:3000/api/test/seed

# 3. Login and use the app
# Email: qa_admin@fieldcost.com
# Password: TestPassword123!

# 4. Run tests (auto-seeds if needed)
npm test

# 5. Clear and reseed for fresh state
curl -X POST "http://localhost:3000/api/test/seed?clear=true"
```

---

## FAQ

**Q: Can I use this in production?**
A: No, endpoint only works with `NODE_ENV=test` or `development`

**Q: Does seeding clear existing data?**
A: Only if you use `?clear=true` parameter

**Q: Can I seed to a production database?**
A: No, endpoint refuses if not in test/dev environment

**Q: How often can I seed?**
A: As often as needed - script is idempotent and handles duplicates

**Q: What about test isolation?**
A: Seed different modules before each test if needed, or use `?clear=true` between test runs

---

## Related Documentation

- [Test Seeding Guide](../../TEST_SEEDING_GUIDE.md)
- [Testing Suite README](../../tests/README.md)
- [Test Execution Guide](../../tests/TEST_EXECUTION_GUIDE.txt)
- [Seed Helper Utilities](../../tests/helpers/seed.ts)
