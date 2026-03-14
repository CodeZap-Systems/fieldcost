# FieldCost Test Suite - Quick Reference Guide

## 🚀 Getting Started

### 1. Start Development Server
```bash
npm run dev
# Runs on http://localhost:3000
```

### 2. Run All Tests
```bash
npm test
```

This executes:
- `npm run test:api` → API tests (via vitest)
- `npm run test:e2e` → E2E tests (via Playwright)

---

## 📊 Test Commands Reference

| Command | Purpose | Duration |
|---------|---------|----------|
| `npm test` | Run all tests (API + E2E) | ~5-10 min |
| `npm run test:api` | API tests only | ~3 min |
| `npm run test:e2e` | E2E tests only | ~5 min |
| `npm run test:watch` | Watch mode (re-run on changes) | Continuous |
| `npm run test:coverage` | Coverage report | ~4 min |
| `npm run test:debug` | Debug mode (step through) | Manual |
| `npm run test:report` | View HTML test report | Instant |
| `npm run test:security` | Security tests | ~2 min |
| `npm run test:all` | All + security tests | ~12 min |

### Module-Specific Tests
```bash
npm run test:auth         # Authentication tests
npm run test:projects     # Project management tests
npm run test:tasks        # Task management tests
npm run test:invoices     # Invoice tests
npm run test:customers    # Customer tests
npm run test:inventory    # Inventory/items tests
npm run test:company      # Company management tests
npm run test:admin        # Admin/RBAC tests
```

---

## 📁 Test File Structure

```
tests/
├── api/                                    ← API tests
│   ├── auth.test.ts                        CRUD, sessions, passwords
│   ├── company.spec.ts / company.test.ts   Profile, logo, settings
│   ├── projects.spec.ts / projects.test.ts CRUD, filtering, reports
│   ├── tasks.spec.ts / tasks.test.ts       CRUD, workflow, assignment
│   ├── customers.spec.ts / customers.test.ts CRUD, search, validation
│   ├── invoices.spec.ts / invoices.test.ts Full lifecycle, export
│   ├── items.spec.ts / inventory.test.ts   Unit types, categories
│   └── admin.test.ts                       Roles, permissions, audit
│
├── e2e/                                    ← Browser tests (Playwright)
│   ├── authentication.spec.ts              Login, register, logout
│   ├── projects.spec.ts                    Project workflows
│   ├── tasks.spec.ts                       Task kanban, assignment
│   ├── customers.spec.ts                   Customer management UI
│   ├── invoices.spec.ts                    Invoice creation UI
│   ├── inventory.spec.ts                   Item management UI
│   ├── company.spec.ts                     Company profile UI
│   └── erp.spec.ts                         Sage/Xero integration
│
├── helpers/
│   ├── auth.ts                             Login/logout helpers
│   ├── api.ts                              HTTP request helpers
│   ├── test-user.ts                        User generation
│   └── test-company.ts                     Company generation
│
├── fixtures/
│   └── test-data.ts                        Test data (projects, tasks, etc)
│
├── security/                               ← Security tests
│   ├── auth-security.test.ts
│   ├── api-security.test.ts
│   ├── rbac-security.test.ts
│   └── upload-security.test.ts
│
└── load/                                   ← Load testing (optional)
    └── load.test.ts
```

---

## 🔐 Test Credentials

```
Test User Email:  qa_test_user@fieldcost.com
Test Password:    TestPassword123
Base URL:         http://localhost:3000
```

**Note**: All tests use this user unless otherwise specified.

---

## 📋 What's Tested

### ✅ Authentication (15+ tests)
- Register with valid/invalid data
- Email validation
- Password requirements
- Login/logout flows
- Session management
- Password reset

### ✅ Company Management (16 tests)
- Update profile
- Change currency
- Upload logo
- Configure ERP integration
- Select invoice templates

### ✅ Project Management (21 tests)
- Create/edit/delete projects
- Filter by status
- Budget validation
- Date range validation
- Generate reports

### ✅ Task Management (21 tests)
- Create/edit/delete tasks
- Assign to team members
- Priority levels (low → critical)
- Status transitions
- Due date management

### ✅ Customer Management (17 tests)
- Create/edit/delete customers
- Search and filter
- Tax ID validation
- Address fields
- Contact information

### ✅ Inventory Management (19 tests)
- Create/edit/delete items
- Set pricing
- Unit types (hour, day, week, month, item, cubic_metre)
- Categories (labour, materials, equipment, services)
- Search and filter

### ✅ Invoice Management (21+ tests)
- Create invoices
- Add line items
- Auto-calculate totals
- Export to PDF/CSV
- Status tracking
- Customer filtering

### ✅ Admin & RBAC (12 tests)
- Create subscription plans
- Assign user roles
- Verify permissions
- View audit logs

### ✅ ERP Integration (10+ tests)
- Sage connection
- Xero connection
- QuickBooks integration
- Invoice sync
- Customer sync
- Item sync

### ✅ Security (30+ tests)
- SQL injection prevention
- XSS protection
- CSRF tokens
- GDPR data isolation
- File upload security
- API rate limiting

---

## 🎯 Test Execution Steps

### 1. Pre-Test Setup
```bash
# Start development server
npm run dev

# (In another terminal) Seed test data
npm run test:seed
```

### 2. Run Tests
```bash
# Option A: Run everything
npm test

# Option B: Run specific suite
npm run test:e2e

# Option C: Run single module
npm run test:projects
```

### 3. View Results
```bash
# HTML report
npm run test:report

# Coverage report
npm run test:coverage

# Watch mode (re-run on changes)
npm run test:watch
```

---

## 🔍 Common Scenarios

### I want to test just Projects
```bash
npm run test:projects
```

### I want to run tests in watch mode
```bash
npm run test:watch
# Tests re-run whenever you save changes
```

### I want to debug a failing test
```bash
npm run test:debug
# Opens Node debugger - step through the test
```

### I want to check test coverage
```bash
npm run test:coverage
# Shows which code is tested
```

### I want to run E2E tests visually
```bash
npx playwright test --headed
# Opens browser window showing test execution
```

### I want to record a new test
```bash
npx playwright codegen http://localhost:3000
# Records your actions into test code
```

---

## ⚠️ Troubleshooting

### **Tests fail with "Port already in use"**
```bash
# Kill existing Node process
Get-Process node | Stop-Process -Force

# Or free specific port
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### **Authentication tests fail**
1. Verify test user exists: `qa_test_user@fieldcost.com`
2. Check password: `TestPassword123`
3. Ensure Supabase is running and configured

### **Tests timeout**
- Increase timeout in playwright.config.ts
- Check if development server is running
- Verify database connectivity

### **E2E tests fail with selector errors**
- Use `--debug` mode to see what's happening
- Check if page layout changed
- Verify test data exists in database

### **API tests return 404**
- Ensure API routes are implemented
- Check route parameter names match
- Verify company_id is passed correctly

---

## 📈 Performance Tips

1. **Run specific modules** instead of all tests
   ```bash
   npm run test:projects  # Faster than npm test
   ```

2. **Use watch mode** during development
   ```bash
   npm run test:watch
   ```

3. **Parallel execution** (if supported)
   - Edit vitest config to increase workers
   - Note: Some tests must run sequentially

4. **Skip slow tests**
   ```bash
   npm test -- --exclude=tests/load
   ```

---

## 📊 Test Statistics

**Total Test Count**: 180+

Breakdown:
- API Tests: ~100 tests
- E2E Tests: ~60 tests
- Security Tests: ~30 tests

**Estimated Run Time**:
- API tests only: ~3 minutes
- E2E tests only: ~5 minutes
- Full suite: ~8 minutes
- With security: ~12 minutes

**Coverage**:
- 40+ API endpoints
- 25+ UI workflows
- 30+ security scenarios

---

## 🚦 Test Status Indicators

- ✅ **PASS** - Test successful
- ❌ **FAIL** - Test failed (check error message)
- ⏭️ **SKIP** - Test skipped (intentional)
- ⏱️ **TIMEOUT** - Test exceeded time limit

---

## 💡 Best Practices

1. **Always start dev server first**
   ```bash
   npm run dev    # Terminal 1
   npm test       # Terminal 2
   ```

2. **Run full suite periodically**
   ```bash
   npm run test:all
   ```

3. **Check coverage regularly**
   ```bash
   npm run test:coverage
   ```

4. **Review test reports**
   ```bash
   npm run test:report
   ```

5. **Use test:watch during development**
   ```bash
   npm run test:watch
   ```

---

## 📞 Support

For test issues:
1. Check terminal output for error details
2. View HTML report: `npm run test:report`
3. Run in debug mode: `npm run test:debug`
4. Check test-data.ts for realistic test values
5. Verify API endpoints are implemented

---

## ✨ Features

- ✅ 180+ test cases
- ✅ API + E2E coverage
- ✅ Security testing
- ✅ Data isolation verification
- ✅ Realistic test data
- ✅ HTML reports
- ✅ Coverage metrics
- ✅ Debug modes
- ✅ Watch mode support
- ✅ CI/CD ready

---

**Ready to test?** Run: `npm test`

For detailed test coverage, see: [TEST_SUITE_SUMMARY.md](./TEST_SUITE_SUMMARY.md)
