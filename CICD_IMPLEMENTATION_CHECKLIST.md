# FieldCost — CI/CD Pipeline Implementation Checklist

## ✅ Pre-Implementation Verification

Your project already has these testing scripts:
- ✅ `scripts/e2e-test-tier1-qa.mjs` — TIER 1 QA testing
- ✅ `scripts/e2e-test-tier2.mjs` — TIER 2 testing
- ✅ `scripts/comprehensive-e2e-test.mjs` — Full E2E suite
- ✅ `scripts/comprehensive-automated-tests.mjs` — Automated test runner
- ✅ `scripts/admin-dashboard-test.mjs` — Admin testing
- ✅ `scripts/kanban-e2e-test.mjs` — Kanban tests
- ✅ `scripts/invoice-e2e-test.mjs` — Invoice tests
- ✅ `scripts/customer-journey-test.mjs` — Customer journey tests
- ✅ `scripts/local-dev-test.mjs` — Local development tests

Your project structure already has:
- ✅ `package.json` with test scripts
- ✅ `schema.sql` for database setup
- ✅ `app/api/health/route.ts` for health checks
- ✅ `tests/` directory structure

---

## 🎯 **Implementation Steps**

### Step 1: Verify GitHub Actions Directory Exists

```bash
# Check if .github/workflows exists
ls -la .github/workflows/

# If not, create it
mkdir -p .github/workflows/
```

**Status**: Ready ✅

### Step 2: Add CI Workflow File

The file `.github/workflows/ci.yml` has been created. Verify it's in place:

```bash
# Verify workflow file exists
cat .github/workflows/ci.yml | head -20

# It should start with:
# name: FieldCost CI Pipeline
# on:
#   push:
#     branches: [main, develop, staging]
```

**Status**: Ready ✅

### Step 3: Update package.json Test Scripts

Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "test": "npm run test:tier1 && npm run test:tier2 && npm run test:tier3",
    "test:tier1": "jest tests/tier1-core.test.ts --testPathPattern=tier1",
    "test:tier2": "jest tests/tier2-growth.test.ts --testPathPattern=tier2",
    "test:tier3": "jest tests/tier3.test.ts --testPathPattern=tier3",
    "test:e2e": "node scripts/comprehensive-e2e-test.mjs",
    "test:e2e:tier1": "node scripts/e2e-test-tier1-qa.mjs",
    "test:e2e:tier2": "node scripts/e2e-test-tier2.mjs",
    "test:e2e:tier3": "node scripts/test-tier3-endpoints.mjs",
    "dev": "next dev",
    "build": "next build",
    "lint": "eslint app lib tests --max-warnings 0"
  }
}
```

**Action Required**: Update `package.json` with above scripts

### Step 4: Create Test Scripts (if missing)

These scripts should exist based on your project structure:

#### A. `scripts/test-tier1-api.mjs`
```javascript
#!/usr/bin/env node

import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3000/api';

const apiTests = [
  { name: 'Health Check', method: 'GET', endpoint: '/health' },
  { name: 'List Projects', method: 'GET', endpoint: '/projects' },
  { name: 'List Tasks', method: 'GET', endpoint: '/tasks' },
  { name: 'List Invoices', method: 'GET', endpoint: '/invoices' },
  { name: 'List Customers', method: 'GET', endpoint: '/customers' },
  { name: 'List Items', method: 'GET', endpoint: '/items' },
];

async function runTests() {
  let passed = 0;
  let failed = 0;

  console.log('🧪 TIER 1 API Tests\n');

  for (const test of apiTests) {
    try {
      const response = await fetch(`${BASE_URL}${test.endpoint}`, {
        method: test.method,
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        console.log(`✅ ${test.name}`);
        passed++;
      } else {
        console.log(`❌ ${test.name} (${response.status})`);
        failed++;
      }
    } catch (error) {
      console.log(`❌ ${test.name} (${error.message})`);
      failed++;
    }
  }

  console.log(`\n📊 Results: ${passed} passed, ${failed} failed`);
  process.exit(failed > 0 ? 1 : 0);
}

runTests();
```

#### B. `scripts/test-tier2-api.mjs`
```javascript
#!/usr/bin/env node

const BASE_URL = 'http://localhost:3000/api';

const apiTests = [
  // All TIER 1 endpoints
  { name: 'TIER 1: Health', method: 'GET', endpoint: '/health' },
  { name: 'TIER 1: Projects', method: 'GET', endpoint: '/projects' },
  
  // TIER 2 endpoints
  { name: 'TIER 2: Budgets', method: 'GET', endpoint: '/budgets' },
  { name: 'TIER 2: WIP Tracking', method: 'GET', endpoint: '/wip-tracking' },
  { name: 'TIER 2: Workflows', method: 'GET', endpoint: '/workflows' },
  { name: 'TIER 2: Sage Test', method: 'GET', endpoint: '/sage/test' },
];

async function runTests() {
  console.log('🧪 TIER 2 API Tests\n');
  // Same structure as TIER 1
}

runTests();
```

#### C. `scripts/test-tier3-api.mjs`
```javascript
#!/usr/bin/env node

const BASE_URL = 'http://localhost:3000/api';

const apiTests = [
  // All TIER 1 & 2 endpoints...
  
  // TIER 3 endpoints
  { name: 'TIER 3: Companies', method: 'GET', endpoint: '/tier3/companies' },
  { name: 'TIER 3: Crew', method: 'GET', endpoint: '/tier3/crew' },
  { name: 'TIER 3: GPS Tracking', method: 'GET', endpoint: '/tier3/gps-tracking' },
  { name: 'TIER 3: Photo Evidence', method: 'GET', endpoint: '/tier3/photo-evidence' },
  { name: 'TIER 3: Xero Test', method: 'GET', endpoint: '/xero/test' },
];

async function runTests() {
  console.log('🧪 TIER 3 API Tests\n');
  // Same structure as TIER 1
}

runTests();
```

**Action Required**: Create or verify these scripts exist

### Step 5: Configure GitHub Secrets

Go to GitHub repo → Settings → Secrets and add:

```
OPENAI_API_KEY=sk-... (optional, for AI testing)
```

**Action Required**: Add secrets to GitHub

### Step 6: Enable GitHub Actions

1. Go to your GitHub repository
2. Navigate to **Actions** tab
3. Verify workflows are enabled
4. Click "I understand my workflows, go ahead and enable them"

**Action Required**: Enable in GitHub

### Step 7: Create npm Scripts in package.json

Ensure your `package.json` has these scripts:

```bash
npm run test              # Run all tests
npm run test:tier1        # TIER 1 only
npm run test:tier2        # TIER 2 only
npm run test:tier3        # TIER 3 only
npm run test:e2e          # All E2E tests
npm run build             # Build for production
npm run dev               # Start dev server
npm run lint              # Run linter
```

**Status**: Most exist ✅ — Verify with: `cat package.json | grep -A 20 '"scripts"'`

### Step 8: Test Locally Before Push

```bash
# Run tests locally
npm test

# Run individual tier tests
npm run test:tier1
npm run test:tier2
npm run test:tier3

# Build
npm run build

# Start dev server
npm run dev
```

**Action Required**: Run all tests locally to verify

### Step 9: Create Initial Commit with CI/CD Files

```bash
# Add GitHub Actions workflow
git add .github/workflows/ci.yml

# Add CI/CD documentation
git add CICD_PIPELINE_GUIDE.md

# Commit and push
git commit -m "feat: Add CI/CD pipeline with tier-based testing"
git push origin main
```

**Action Required**: Push changes to GitHub

### Step 10: Verify Pipeline Runs

1. Go to GitHub repo → **Actions** tab
2. Watch for workflow to run on push
3. Check status of each job
4. Review test results in workflow summary

**Action Required**: Monitor first pipeline run

---

## 📋 **Complete CI/CD Files Checklist**

### Files Created:
- ✅ `.github/workflows/ci.yml` — GitHub Actions workflow
- ✅ `CICD_PIPELINE_GUIDE.md` — Full pipeline documentation

### Files to Create (if needed):
- ⚠️ `scripts/test-tier1-api.mjs` — TIER 1 API tests
- ⚠️ `scripts/test-tier2-api.mjs` — TIER 2 API tests
- ⚠️ `scripts/test-tier3-api.mjs` — TIER 3 API tests
- ⚠️ `scripts/generate-ci-report.mjs` — Report generation

### Files to Verify:
- ✅ `package.json` — Has test scripts
- ✅ `tests/tier1-core.test.ts` — TIER 1 tests
- ✅ `tests/tier2-growth.test.ts` — TIER 2 tests
- ✅ `tests/tier3.test.ts` — TIER 3 tests
- ✅ `scripts/e2e-test-tier1-qa.mjs` — E2E tests
- ✅ `app/api/health/route.ts` — Health endpoint

---

## 🚀 **Quick Start Commands**

### To enable the CI/CD pipeline immediately:

```bash
# 1. Commit CI files
git add .github/workflows/ci.yml
git add CICD_PIPELINE_GUIDE.md
git commit -m "Add CI/CD pipeline"

# 2. Push to GitHub
git push origin main

# 3. Watch Actions tab
# https://github.com/YOUR_ORG/fieldcost/actions
```

### To test locally before pushing:

```bash
# Run all tests
npm test

# Run specific tier
npm run test:tier1

# Build
npm run build

# Start dev server
npm run dev
```

---

## 📊 **Pipeline Status Indicators**

After pushing code:

| Status | Meaning | Action |
|--------|---------|--------|
| 🟢 Green | All tests pass | Deploy automatically |
| 🔴 Red | Tests fail | Check logs, fix code |
| 🟡 Yellow | Running | Wait for completion |
| ⚪ Gray | Not run | Check workflow config |

---

## 🔍 **Common Issues & Solutions**

### Issue: Tests timeout
**Solution**: Increase timeout in `.github/workflows/ci.yml` → `timeout-minutes`

### Issue: Database connection fails
**Solution**: Ensure test database URL is set in environment variables

### Issue: Module not found errors
**Solution**: Run `npm ci` instead of `npm install` for consistent deps

### Issue: Port 3000 already in use
**Solution**: Kill process: `lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill -9`

### Issue: GitHub Actions not running
**Solution**: Enable in repo → Settings → Actions → "Allow all actions"

---

## 📈 **Success Criteria**

Pipeline is working when:
- ✅ Workflow runs on every push
- ✅ All jobs complete without errors
- ✅ Tests pass for all tiers
- ✅ Report generated with summary
- ✅ PR comments show test results
- ✅ Deployment gate allows/blocks correctly

---

## 🎯 **Next Steps After Implementation**

1. **Monitor first few runs** — Check logs for issues
2. **Adjust timeouts** — Fine-tune based on actual execution time
3. **Add more tests** — Expand test coverage as needed
4. **Set up notifications** — Slack/email on failures
5. **Track metrics** — Monitor pass rate, duration, frequency

---

## 📞 **Support Resources**

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vercel Deployment](https://vercel.com/docs)
- [Jest Testing Framework](https://jestjs.io/docs/getting-started)
- [Playwright E2E Testing](https://playwright.dev/)

---

**Status**: ✅ Ready to implement

Last Updated: March 12, 2026
