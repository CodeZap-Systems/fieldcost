# FieldCost — Playwright E2E Testing Guide

## Overview

Playwright automated testing for FieldCost with tier-based test organization:
- **TIER 1**: Authentication & Dashboard (Core MVP)
- **TIER 2**: ERP Integration & Advanced Features
- **TIER 3**: Enterprise Features (Multi-company, RBAC, GPS, Xero)

---

## 📋 **Test Structure**

```
e2e/
├── example.spec.ts                      # Example test (can delete)
├── tier1.auth.spec.ts                   # TIER 1: Auth tests
├── tier1.dashboard.spec.ts              # TIER 1: Dashboard & pages
├── tier2.erp.spec.ts                    # TIER 2: ERP & advanced
└── tier3.enterprise.spec.ts             # TIER 3: Enterprise features
```

---

## 🚀 **Quick Start Commands**

### Run all tests
```bash
npx playwright test
```

### Run specific tier
```bash
# TIER 1 tests only
npx playwright test tier1

# TIER 2 tests only
npx playwright test tier2

# TIER 3 tests only
npx playwright test tier3
```

### Run specific test file
```bash
npx playwright test e2e/tier1.auth.spec.ts
npx playwright test e2e/tier1.dashboard.spec.ts
npx playwright test e2e/tier2.erp.spec.ts
npx playwright test e2e/tier3.enterprise.spec.ts
```

### Run in UI mode (visual)
```bash
npx playwright test --ui
```

### Run in debug mode
```bash
npx playwright test --debug
```

### Run with headed browser (see what's happening)
```bash
npx playwright test --headed
```

### Run a specific test
```bash
npx playwright test -g "should display login page"
```

### View test report
```bash
npx playwright show-report
```

---

## 🧪 **Test Coverage by Tier**

### TIER 1 Tests (2 files)

**`tier1.auth.spec.ts`** (5 tests)
- ✅ Load home page
- ✅ Display login page
- ✅ Display registration page
- ✅ Display reset password page
- ✅ Display demo login page

**`tier1.dashboard.spec.ts`** (11 tests)
- ✅ Display dashboard home
- ✅ Display projects list
- ✅ Display tasks list
- ✅ Display invoices list
- ✅ Display items list
- ✅ Display customers list
- ✅ Display project create page
- ✅ Display task create page
- ✅ Display invoice create page
- ✅ Display setup company page
- ✅ Display WIP demo page
- ✅ API health check endpoint
- ✅ Health endpoint returns JSON

**Total TIER 1: 16 tests**

---

### TIER 2 Tests (1 file)

**`tier2.erp.spec.ts`** (16 tests)

ERP Integration (6 tests):
- ✅ Sage API test endpoint
- ✅ Sage items endpoint
- ✅ Sage customers endpoint
- ✅ Sage invoices endpoint
- ✅ Sage full sync endpoint

Advanced Features (8 tests):
- ✅ Project reports page
- ✅ Task reports page
- ✅ Budgets API endpoint
- ✅ WIP tracking API endpoint
- ✅ Workflows API endpoint
- ✅ Location tracking API endpoint
- ✅ Offline sync status endpoint
- ✅ Invoice export endpoint

Company Management (3 tests):
- ✅ Get company endpoint
- ✅ Switch company endpoint
- ✅ Company logo upload endpoint

**Total TIER 2: 16 tests**

---

### TIER 3 Tests (1 file)

**`tier3.enterprise.spec.ts`** (27 tests)

Multi-Company & RBAC (3 tests):
- ✅ Tier3 companies endpoint
- ✅ Tier3 crew roles endpoint
- ✅ Post crew role assignment

GPS & Geolocation (3 tests):
- ✅ GPS tracking endpoint
- ✅ GPS history endpoint
- ✅ GPS dashboard page

Photo Evidence (3 tests):
- ✅ Photo evidence endpoint
- ✅ Post photo evidence
- ✅ Photos gallery page

Custom Workflows (2 tests):
- ✅ Tier3 workflows endpoint
- ✅ Create custom workflow

Xero Integration (6 tests):
- ✅ Xero test endpoint
- ✅ Xero items endpoint
- ✅ Xero contacts endpoint
- ✅ Xero invoices endpoint
- ✅ Xero auth callback
- ✅ Xero full sync endpoint

Audit & Admin (3 tests):
- ✅ Audit logs endpoint
- ✅ Admin tier3 features endpoint
- ✅ Admin users endpoint
- ✅ Admin API keys endpoint
- ✅ Admin analytics endpoint

Admin UI Pages (11 tests):
- ✅ TIER 3 setup hub page
- ✅ TIER 3 crew management page
- ✅ Admin console
- ✅ Tier3 features admin page
- ✅ Company config page
- ✅ Workflows page
- ✅ Users page
- ✅ Audit page
- ✅ Analytics page
- ✅ API keys page
- ✅ Billing page
- ✅ Subscriptions page
- ✅ Plans page

**Total TIER 3: 27 tests**

---

## 🔧 **Configuration**

### `playwright.config.ts`

```typescript
// Tier-based projects configured
projects: [
  { name: 'tier1', testMatch: '**/tier1*.spec.ts' },
  { name: 'tier2', testMatch: '**/tier2*.spec.ts' },
  { name: 'tier3', testMatch: '**/tier3*.spec.ts' },
  // Browser tests
  { name: 'chromium' },
  { name: 'firefox' },
  { name: 'webkit' },
  // Mobile tests
  { name: 'Mobile Chrome' },
  { name: 'Mobile Safari' },
]
```

### Features:
- ✅ Automatic dev server startup (`npm run dev`)
- ✅ Screenshot on failure
- ✅ Video on failure
- ✅ Trace on first retry
- ✅ HTML report generation
- ✅ JSON & JUnit XML reports
- ✅ Base URL: `http://localhost:3000`
- ✅ Global timeout: 30 seconds per test

---

## 📊 **Running Tests in CI/CD**

### GitHub Actions Integration

The workflow from `.github/workflows/playwright.yml` (auto-created) runs:

```bash
# Run all tests
npx playwright test

# Generate report
npx playwright show-report
```

### CI Settings:
- ✅ Runs on: `main`, `develop`, `staging` branches
- ✅ Retries: 2 on CI
- ✅ Workers: 1 (sequential on CI)
- ✅ Browser: Chromium only on CI (for speed)
- ✅ Reports: HTML + JSON + JUnit XML

---

## 📈 **Test Results & Reports**

### View HTML Report
```bash
npx playwright show-report
```

### View Test Results File
```bash
# JSON format
cat test-results/playwright-results.json

# JUnit XML
cat test-results/playwright-results.xml

# HTML report
open playwright-report/index.html
```

### Report Files Generated:
- `playwright-report/` — Interactive HTML report
- `test-results/playwright-results.json` — JSON results
- `test-results/playwright-results.xml` — JUnit XML
- Screenshots & videos (on failure)
- Traces (on first retry)

---

## 🎯 **Testing Workflow**

### Local Development

```bash
# 1. Install Playwright (if not done)
npm install -D @playwright/test

# 2. Start dev server (if not auto-starting)
npm run dev

# 3. Run tests in UI mode
npx playwright test --ui

# 4. Or run all tests
npx playwright test

# 5. View report
npx playwright show-report
```

### Before Pushing

```bash
# Run all tests locally
npx playwright test

# Verify all pass
echo $?  # Should output 0 if all passed

# Commit and push
git add .
git commit -m "tests: Add Playwright E2E tests"
git push
```

### CI Pipeline

- Playwright tests run automatically on push
- Results visible in GitHub Actions
- Can view artifacts in workflow run
- Report linked in workflow summary

---

## 🔍 **Debugging Tests**

### Debug Mode
```bash
npx playwright test --debug
```

Opens browser and Playwright Inspector. Step through tests line by line.

### Headed Mode
```bash
npx playwright test --headed
```

Run tests with visible browser window.

### Single Test
```bash
npx playwright test -g "specific test name"
```

### Verbose Output
```bash
npx playwright test --reporter=list
```

---

## 📚 **Best Practices**

### Wait for Elements
```typescript
// Good
await expect(page.locator('text=Login')).toBeVisible();

// Or wait with function
await page.waitForFunction(() => {
  return document.body.textContent.includes('Login');
});
```

### Use Selectors
```typescript
// By role (preferred)
await page.getByRole('button', { name: 'Submit' }).click();

// By text
await page.locator('text=Login').click();

// By attribute
await page.locator('[data-testid="login-button"]').click();
```

### Timeouts
```typescript
// Global timeout in config: 30000ms
// Override per test
test('custom timeout test', async ({ page }) => {
  // Test code
}, { timeout: 60000 });

// Override per action
await expect(element).toBeVisible({ timeout: 10000 });
```

### Network Waits
```typescript
await page.waitForLoadState('networkidle');
await page.waitForLoadState('domcontentloaded');
```

---

## 🚨 **Common Issues**

### Tests timeout waiting for element
**Solution**: Check if element exists, increase timeout, verify selector

```bash
npx playwright test --debug
# Use Playwright Inspector to find correct selector
```

### Dev server doesn't start
**Solution**: Ensure `npm run dev` works locally, update webServer in config

### Tests pass locally but fail in CI
**Solution**: May be timing issue, increase timeouts in CI

### Port 3000 already in use
**Solution**: Kill process or change port in config

---

## 📦 **Adding More Tests**

### Create new test file
```typescript
// e2e/new-feature.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test('should do something', async ({ page }) => {
    await page.goto('/feature-page');
    await expect(page.locator('text=Feature')).toBeVisible();
  });
});
```

### Run new tests
```bash
npx playwright test e2e/new-feature.spec.ts
```

---

## 🔗 **Resources**

- [Playwright Documentation](https://playwright.dev/)
- [Playwright Test API](https://playwright.dev/docs/api/class-test)
- [Selectors Guide](https://playwright.dev/docs/selectors)
- [Debugging Guide](https://playwright.dev/docs/debug)
- [CI Guide](https://playwright.dev/docs/ci)

---

## ✅ **Verification Checklist**

Before deployment:
- ✅ All TIER 1 tests pass
- ✅ All TIER 2 tests pass
- ✅ All TIER 3 tests pass
- ✅ Report generated without errors
- ✅ No flaky tests (pass consistently)
- ✅ Screenshots/videos captured on failures
- ✅ Tests run in < 5 minutes

---

**Status**: ✅ Playwright testing ready

Last Updated: March 12, 2026
