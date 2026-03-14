# FieldCost — CI/CD Pipeline & Automated Testing Guide

## Overview

```
Developer pushes code
        ↓
CI pipeline runs (.github/workflows/ci.yml)
        ↓
1. Unit Tests (TIER 1/2/3)
2. API Integration Tests (TIER 1/2/3)
3. UI/E2E Tests (TIER 1/2/3)
4. AI Exploratory Testing (TIER 3)
        ↓
Test Report Generated (JSON + Markdown)
        ↓
Deployment decision
  ├─ All pass → Deploy to staging/prod ✅
  └─ Any fail → Block deployment ❌
```

---

## 📋 **CI/CD Pipeline Configuration**

### File: `.github/workflows/ci.yml`

```yaml
name: FieldCost CI Pipeline

on:
  push:
    branches: [main, develop, staging]
  pull_request:
    branches: [main, develop]

jobs:
  # ============================================================
  # STEP 1: SETUP & BUILD
  # ============================================================
  build:
    name: Build & Lint
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run ESLint
        run: npm run lint 2>&1 | tee lint-report.txt
        continue-on-error: true
      
      - name: Build application
        run: npm run build 2>&1 | tee build-report.txt
      
      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: build-artifacts
          path: .next/

  # ============================================================
  # STEP 2: UNIT TESTS (All Tiers)
  # ============================================================
  unit-tests:
    name: Unit Tests
    runs-on: ubuntu-latest
    needs: build
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run TIER 1 Core Tests
        run: npm run test:tier1 2>&1 | tee tier1-test-report.txt
        continue-on-error: true
      
      - name: Run TIER 2 Growth Tests
        run: npm run test:tier2 2>&1 | tee tier2-test-report.txt
        continue-on-error: true
      
      - name: Run TIER 3 Enterprise Tests
        run: npm run test:tier3 2>&1 | tee tier3-test-report.txt
        continue-on-error: true
      
      - name: Generate test coverage report
        run: |
          npm run test -- --coverage > coverage-report.txt 2>&1
        continue-on-error: true
      
      - name: Upload test reports
        uses: actions/upload-artifact@v3
        with:
          name: test-reports
          path: |
            tier1-test-report.txt
            tier2-test-report.txt
            tier3-test-report.txt
            coverage-report.txt

  # ============================================================
  # STEP 3: API INTEGRATION TESTS (All Tiers)
  # ============================================================
  api-tests:
    name: API Integration Tests
    runs-on: ubuntu-latest
    needs: build
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: fieldcost_test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Setup test database
        run: |
          npm run migrate:test 2>&1
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/fieldcost_test
      
      - name: Start dev server in background
        run: npm run dev &
        env:
          NODE_ENV: test
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/fieldcost_test
      
      - name: Wait for server to start
        run: sleep 5 && curl -f http://localhost:3000/api/health || exit 1
      
      - name: TIER 1 API Tests (Core CRUD)
        run: |
          node scripts/test-tier1-api.mjs > tier1-api-report.json 2>&1
        continue-on-error: true
      
      - name: TIER 2 API Tests (ERP + Features)
        run: |
          node scripts/test-tier2-api.mjs > tier2-api-report.json 2>&1
        continue-on-error: true
      
      - name: TIER 3 API Tests (Enterprise)
        run: |
          node scripts/test-tier3-api.mjs > tier3-api-report.json 2>&1
        continue-on-error: true
      
      - name: Upload API test reports
        uses: actions/upload-artifact@v3
        with:
          name: api-test-reports
          path: |
            tier1-api-report.json
            tier2-api-report.json
            tier3-api-report.json

  # ============================================================
  # STEP 4: UI/E2E TESTS (All Tiers)
  # ============================================================
  ui-tests:
    name: UI/E2E Tests
    runs-on: ubuntu-latest
    needs: build
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Install Playwright browsers
        run: npx playwright install --with-deps
      
      - name: Start dev server
        run: npm run dev &
        env:
          NODE_ENV: test
      
      - name: Wait for server
        run: sleep 5 && curl -f http://localhost:3000 || exit 1
      
      - name: TIER 1 E2E Tests (Core UI)
        run: |
          node scripts/e2e-test-tier1-qa.mjs > tier1-e2e-report.json 2>&1
        continue-on-error: true
      
      - name: TIER 2 E2E Tests (Growth Features)
        run: |
          npm run test:e2e:tier2 > tier2-e2e-report.json 2>&1
        continue-on-error: true
      
      - name: TIER 3 E2E Tests (Enterprise)
        run: |
          npm run test:e2e:tier3 > tier3-e2e-report.json 2>&1
        continue-on-error: true
      
      - name: Upload E2E test reports
        uses: actions/upload-artifact@v3
        with:
          name: e2e-test-reports
          path: |
            tier1-e2e-report.json
            tier2-e2e-report.json
            tier3-e2e-report.json

  # ============================================================
  # STEP 5: AI EXPLORATORY TESTING (TIER 3)
  # ============================================================
  ai-exploratory-tests:
    name: AI Exploratory Testing
    runs-on: ubuntu-latest
    needs: [unit-tests, api-tests, ui-tests]
    if: github.event_name == 'push' && contains(github.ref, 'main')
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Start dev server
        run: npm run dev &
      
      - name: Wait for server
        run: sleep 5 && curl -f http://localhost:3000 || exit 1
      
      - name: AI Exploratory Test - User Journey
        run: |
          node scripts/ai-exploratory-customer-journey.mjs > ai-customer-journey-report.json 2>&1
        continue-on-error: true
        env:
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
      
      - name: AI Exploratory Test - Edge Cases
        run: |
          node scripts/ai-exploratory-edge-cases.mjs > ai-edge-cases-report.json 2>&1
        continue-on-error: true
        env:
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
      
      - name: AI Exploratory Test - Security
        run: |
          node scripts/ai-exploratory-security.mjs > ai-security-report.json 2>&1
        continue-on-error: true
        env:
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
      
      - name: Upload AI test reports
        uses: actions/upload-artifact@v3
        with:
          name: ai-test-reports
          path: |
            ai-customer-journey-report.json
            ai-edge-cases-report.json
            ai-security-report.json

  # ============================================================
  # STEP 6: TEST REPORT AGGREGATION
  # ============================================================
  report:
    name: Generate CI Report
    runs-on: ubuntu-latest
    needs: [build, unit-tests, api-tests, ui-tests, ai-exploratory-tests]
    if: always()
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Download all test artifacts
        uses: actions/download-artifact@v3
        with:
          path: test-results/
      
      - name: Generate CI Report
        run: |
          node scripts/generate-ci-report.mjs \
            --output ci-report.json \
            --results test-results/ \
            --commit ${{ github.sha }} \
            --branch ${{ github.ref_name }}
      
      - name: Post report to GitHub
        uses: actions/github-script@v6
        with:
          script: |
            const fs = require('fs');
            const report = JSON.parse(fs.readFileSync('ci-report.json', 'utf8'));
            
            github.rest.checks.create({
              owner: context.repo.owner,
              repo: context.repo.repo,
              name: 'FieldCost CI Report',
              head_sha: context.sha,
              status: 'completed',
              conclusion: report.summary.passed ? 'success' : 'failure',
              output: {
                title: `Tests: ${report.summary.total} | Passed: ${report.summary.passed} | Failed: ${report.summary.failed}`,
                summary: report.formatted_summary,
              }
            });
      
      - name: Comment on PR
        if: github.event_name == 'pull_request'
        uses: actions/github-script@v6
        with:
          script: |
            const fs = require('fs');
            const report = JSON.parse(fs.readFileSync('ci-report.json', 'utf8'));
            
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: report.markdown_summary
            });
      
      - name: Upload final report
        uses: actions/upload-artifact@v3
        with:
          name: ci-report
          path: ci-report.json

  # ============================================================
  # STEP 7: DEPLOYMENT DECISION
  # ============================================================
  deploy-decision:
    name: Deployment Decision
    runs-on: ubuntu-latest
    needs: [report]
    if: always()
    
    steps:
      - name: Download CI report
        uses: actions/download-artifact@v3
        with:
          name: ci-report
      
      - name: Parse report
        id: parse
        run: |
          node -e "
            const report = require('./ci-report.json');
            console.log('::set-output name=status::' + (report.summary.passed ? 'PASS' : 'FAIL'));
            console.log('::set-output name=tier1::' + (report.tiers.tier1.passed ? 'PASS' : 'FAIL'));
            console.log('::set-output name=tier2::' + (report.tiers.tier2.passed ? 'PASS' : 'FAIL'));
            console.log('::set-output name=tier3::' + (report.tiers.tier3.passed ? 'PASS' : 'FAIL'));
          "
      
      - name: ✅ All tests passed - Ready for deployment
        if: steps.parse.outputs.status == 'PASS'
        run: |
          echo "✅ All tests passed!"
          echo "TIER 1: ${{ steps.parse.outputs.tier1 }}"
          echo "TIER 2: ${{ steps.parse.outputs.tier2 }}"
          echo "TIER 3: ${{ steps.parse.outputs.tier3 }}"
          exit 0
      
      - name: ❌ Tests failed - Deployment blocked
        if: steps.parse.outputs.status == 'FAIL'
        run: |
          echo "❌ Tests failed - deployment blocked"
          echo "Check CI report for details"
          exit 1
```

---

## 🧪 **Test Scripts Structure**

### File: `scripts/generate-ci-report.mjs`

```javascript
#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function generateReport(options) {
  const { output, results, commit, branch } = options;

  // Read all test reports
  const reportFiles = {
    tier1: {
      unit: 'test-reports/tier1-test-report.txt',
      api: 'api-test-reports/tier1-api-report.json',
      e2e: 'e2e-test-reports/tier1-e2e-report.json',
    },
    tier2: {
      unit: 'test-reports/tier2-test-report.txt',
      api: 'api-test-reports/tier2-api-report.json',
      e2e: 'e2e-test-reports/tier2-e2e-report.json',
    },
    tier3: {
      unit: 'test-reports/tier3-test-report.txt',
      api: 'api-test-reports/tier3-api-report.json',
      e2e: 'e2e-test-reports/tier3-e2e-report.json',
      ai: 'ai-test-reports/ai-customer-journey-report.json',
    },
  };

  const finalReport = {
    timestamp: new Date().toISOString(),
    commit,
    branch,
    summary: {
      total: 0,
      passed: 0,
      failed: 0,
    },
    tiers: {},
    tests: {
      unit: {},
      api: {},
      e2e: {},
      ai: {},
    },
    formatted_summary: '',
    markdown_summary: '',
  };

  // Parse each tier's results
  for (const [tier, files] of Object.entries(reportFiles)) {
    finalReport.tiers[tier] = {
      unit: { passed: true, count: 0 },
      api: { passed: true, count: 0 },
      e2e: { passed: true, count: 0 },
      ai: { passed: true, count: 0 },
    };

    // Parse unit tests
    if (fs.existsSync(files.unit)) {
      const content = fs.readFileSync(files.unit, 'utf8');
      const match = content.match(/(\d+) passed/);
      const failMatch = content.match(/(\d+) failed/);
      finalReport.tiers[tier].unit.count = match ? parseInt(match[1]) : 0;
      finalReport.tiers[tier].unit.passed = !failMatch;
      finalReport.tests.unit[tier] = {
        count: finalReport.tiers[tier].unit.count,
        passed: finalReport.tiers[tier].unit.passed,
      };
    }

    // Parse API tests
    if (fs.existsSync(files.api)) {
      const report = JSON.parse(fs.readFileSync(files.api, 'utf8'));
      finalReport.tiers[tier].api.count = report.total || 0;
      finalReport.tiers[tier].api.passed = (report.failed || 0) === 0;
      finalReport.tests.api[tier] = {
        count: finalReport.tiers[tier].api.count,
        passed: finalReport.tiers[tier].api.passed,
      };
    }

    // Parse E2E tests
    if (fs.existsSync(files.e2e)) {
      const report = JSON.parse(fs.readFileSync(files.e2e, 'utf8'));
      finalReport.tiers[tier].e2e.count = report.total || 0;
      finalReport.tiers[tier].e2e.passed = (report.failed || 0) === 0;
      finalReport.tests.e2e[tier] = {
        count: finalReport.tiers[tier].e2e.count,
        passed: finalReport.tiers[tier].e2e.passed,
      };
    }

    // Parse AI tests (TIER 3 only)
    if (files.ai && fs.existsSync(files.ai)) {
      const report = JSON.parse(fs.readFileSync(files.ai, 'utf8'));
      finalReport.tiers[tier].ai.count = report.total || 0;
      finalReport.tiers[tier].ai.passed = (report.failed || 0) === 0;
      finalReport.tests.ai[tier] = {
        count: finalReport.tiers[tier].ai.count,
        passed: finalReport.tiers[tier].ai.passed,
      };
    }
  }

  // Calculate summary
  for (const tier of Object.values(finalReport.tiers)) {
    finalReport.summary.total += tier.unit.count + tier.api.count + tier.e2e.count + tier.ai.count;
    if (tier.unit.passed) finalReport.summary.passed += tier.unit.count;
    if (tier.api.passed) finalReport.summary.passed += tier.api.count;
    if (tier.e2e.passed) finalReport.summary.passed += tier.e2e.count;
    if (tier.ai.passed) finalReport.summary.passed += tier.ai.count;
  }
  finalReport.summary.failed = finalReport.summary.total - finalReport.summary.passed;

  // Format summaries
  finalReport.formatted_summary = `
Tests: ${finalReport.summary.total} | ✅ Passed: ${finalReport.summary.passed} | ❌ Failed: ${finalReport.summary.failed}

TIER 1: ${finalReport.tiers.tier1.unit.passed && finalReport.tiers.tier1.api.passed && finalReport.tiers.tier1.e2e.passed ? '✅' : '❌'}
  - Unit: ${finalReport.tests.unit.tier1.count} tests
  - API: ${finalReport.tests.api.tier1.count} tests
  - E2E: ${finalReport.tests.e2e.tier1.count} tests

TIER 2: ${finalReport.tiers.tier2.unit.passed && finalReport.tiers.tier2.api.passed && finalReport.tiers.tier2.e2e.passed ? '✅' : '❌'}
  - Unit: ${finalReport.tests.unit.tier2.count} tests
  - API: ${finalReport.tests.api.tier2.count} tests
  - E2E: ${finalReport.tests.e2e.tier2.count} tests

TIER 3: ${finalReport.tiers.tier3.unit.passed && finalReport.tiers.tier3.api.passed && finalReport.tiers.tier3.e2e.passed ? '✅' : '❌'}
  - Unit: ${finalReport.tests.unit.tier3.count} tests
  - API: ${finalReport.tests.api.tier3.count} tests
  - E2E: ${finalReport.tests.e2e.tier3.count} tests
  - AI: ${finalReport.tests.ai.tier3.count} tests
`;

  finalReport.markdown_summary = `
## 🧪 CI Test Results

**Status:** ${finalReport.summary.passed === finalReport.summary.total ? '✅ All Pass' : '❌ Some Failed'}

| Test Type | TIER 1 | TIER 2 | TIER 3 |
|-----------|--------|--------|--------|
| **Unit** | ${finalReport.tests.unit.tier1.passed ? '✅' : '❌'} ${finalReport.tests.unit.tier1.count} | ${finalReport.tests.unit.tier2.passed ? '✅' : '❌'} ${finalReport.tests.unit.tier2.count} | ${finalReport.tests.unit.tier3.passed ? '✅' : '❌'} ${finalReport.tests.unit.tier3.count} |
| **API** | ${finalReport.tests.api.tier1.passed ? '✅' : '❌'} ${finalReport.tests.api.tier1.count} | ${finalReport.tests.api.tier2.passed ? '✅' : '❌'} ${finalReport.tests.api.tier2.count} | ${finalReport.tests.api.tier3.passed ? '✅' : '❌'} ${finalReport.tests.api.tier3.count} |
| **E2E** | ${finalReport.tests.e2e.tier1.passed ? '✅' : '❌'} ${finalReport.tests.e2e.tier1.count} | ${finalReport.tests.e2e.tier2.passed ? '✅' : '❌'} ${finalReport.tests.e2e.tier2.count} | ${finalReport.tests.e2e.tier3.passed ? '✅' : '❌'} ${finalReport.tests.e2e.tier3.count} |
| **AI** | - | - | ${finalReport.tests.ai.tier3.passed ? '✅' : '❌'} ${finalReport.tests.ai.tier3.count} |

**Summary:** ${finalReport.summary.passed}/${finalReport.summary.total} tests passed

${finalReport.summary.failed > 0 ? `❌ ${finalReport.summary.failed} tests failed - See artifacts for details` : '✅ All tests passed - Ready to deploy'}
`;

  // Write report
  fs.writeFileSync(output, JSON.stringify(finalReport, null, 2));
  console.log(`✅ CI Report generated: ${output}`);
  console.log(finalReport.formatted_summary);
}

// Parse command line args
const args = {};
process.argv.slice(2).forEach((arg, index) => {
  if (arg.startsWith('--')) {
    const key = arg.slice(2);
    args[key] = process.argv[index + 3];
  }
});

generateReport(args);
```

---

## 📊 **Test Tier Breakdown**

### TIER 1 Tests (Unit + API + E2E)

```javascript
// TIER 1: Core MVP Features
tests: {
  unit: {
    total: 16,
    suites: ['Authentication', 'Projects', 'Tasks', 'Invoices', 'Items', 'Customers'],
    critical: ['User login', 'Create project', 'Create task', 'Create invoice']
  },
  api: {
    endpoints: 14,
    coverage: ['GET/POST /projects', 'GET/POST /tasks', 'GET/POST /invoices', 'GET/POST /items', 'GET/POST /customers']
  },
  e2e: {
    scenarios: 8,
    coverage: ['Dashboard load', 'Login flow', 'Create project flow', 'Invoice generation']
  }
}
```

### TIER 2 Tests (Unit + API + E2E)

```javascript
// TIER 2: Growth Features
tests: {
  unit: {
    total: 24,
    suites: ['TIER 1 + Budget', 'WIP Tracking', 'ERP Adapter', 'Workflows', 'Location Tracking'],
    critical: ['Budget calculations', 'Sage sync', 'Approval workflow']
  },
  api: {
    endpoints: 23,
    coverage: [
      'All TIER 1 endpoints',
      '/budgets - CRUD',
      '/wip-tracking - metrics',
      '/sage/sync - ERP sync',
      '/workflows - approval'
    ]
  },
  e2e: {
    scenarios: 12,
    coverage: [
      'All TIER 1 scenarios',
      'Budget workflow',
      'WIP dashboard',
      'Sage sync flow',
      'Approval queue'
    ]
  }
}
```

### TIER 3 Tests (Unit + API + E2E + AI)

```javascript
// TIER 3: Enterprise Features
tests: {
  unit: {
    total: 32,
    suites: [
      'TIER 1 + TIER 2',
      'Multi-Company',
      'RBAC',
      'GPS',
      'Photo Evidence',
      'Xero Integration',
      'Audit Trails',
      'Custom Workflows'
    ],
    critical: [
      'Company isolation',
      'Permission enforcement',
      'GPS accuracy validation',
      'Xero OAuth flow',
      'Audit logging'
    ]
  },
  api: {
    endpoints: 50,
    coverage: [
      'All TIER 1/2 endpoints',
      '/tier3/companies - multi-company',
      '/tier3/crew - RBAC',
      '/tier3/gps-tracking - GPS',
      '/tier3/photo-evidence - photos',
      '/xero/* - Xero sync',
      '/admin/* - admin console'
    ]
  },
  e2e: {
    scenarios: 20,
    coverage: [
      'All TIER 1/2 scenarios',
      'Multi-company workflow',
      'RBAC enforcement',
      'GPS tracking flow',
      'Photo upload & chain',
      'Xero OAuth flow',
      'Admin console usage',
      'Audit log generation'
    ]
  },
  ai: {
    scenarios: ['User journey', 'Edge cases', 'Security', 'Performance'],
    critical: ['Unexpected user paths', 'Error handling', 'Data validation']
  }
}
```

---

## 🚀 **Deployment Pipeline**

### Staging Deployment

```bash
# Trigger: All tests pass + develop branch
npm run build
vercel deploy --env staging
# URL: https://staging-fieldcost.vercel.app
```

### Production Deployment

```bash
# Trigger: All tests pass + main branch + manual approval
npm run build
vercel --prod
# URL: https://fieldcost.vercel.app
```

---

## 📋 **Pipeline Execution Flow**

```mermaid
graph TD
    A[Developer Push] --> B{Branch?}
    B -->|main| C[Build & Lint]
    B -->|develop| C
    B -->|feature| C
    
    C --> D{Pass?}
    D -->|No| E[❌ Fail - Block all]
    
    D -->|Yes| F[Unit Tests]
    F --> G[API Tests]
    G --> H[E2E Tests]
    
    H --> I{All Pass?}
    I -->|No| J[❌ Fail - Block deployment]
    
    I -->|Yes| K{Branch?}
    K -->|main| L[Run AI Tests]
    K -->|develop| M[Generate Report]
    K -->|feature| M
    
    L --> M
    M --> N{All Pass?}
    N -->|No| O[❌ Fail - Manual review]
    N -->|Yes| P[✅ Pass - Ready to deploy]
    
    P --> Q{Env?}
    Q -->|staging| R[Auto deploy to staging]
    Q -->|production| S[Wait for manual approval]
    
    S --> T{Approved?}
    T -->|Yes| U[Deploy to production]
    T -->|No| V[❌ Deployment blocked]
```

---

## 📝 **GitHub Secrets Required**

```
OPENAI_API_KEY          # For AI exploratory testing
DATABASE_URL            # Test database URL
VERCEL_TOKEN            # For Vercel deployments
SUPABASE_URL            # Test Supabase
SUPABASE_ANON_KEY       # Test Supabase key
```

---

## 📊 **CI Report Example Output**

```json
{
  "timestamp": "2026-03-12T10:30:00Z",
  "commit": "abc123def456",
  "branch": "main",
  "summary": {
    "total": 108,
    "passed": 105,
    "failed": 3
  },
  "tiers": {
    "tier1": {
      "unit": { "passed": true, "count": 16 },
      "api": { "passed": true, "count": 14 },
      "e2e": { "passed": true, "count": 8 },
      "ai": { "passed": true, "count": 0 }
    },
    "tier2": {
      "unit": { "passed": true, "count": 24 },
      "api": { "passed": false, "count": 23 },
      "e2e": { "passed": true, "count": 12 },
      "ai": { "passed": true, "count": 0 }
    },
    "tier3": {
      "unit": { "passed": true, "count": 32 },
      "api": { "passed": true, "count": 50 },
      "e2e": { "passed": true, "count": 20 },
      "ai": { "passed": true, "count": 4 }
    }
  },
  "tests": {
    "unit": {
      "tier1": { "count": 16, "passed": true },
      "tier2": { "count": 24, "passed": true },
      "tier3": { "count": 32, "passed": true }
    },
    "api": {
      "tier1": { "count": 14, "passed": true },
      "tier2": { "count": 23, "passed": false },
      "tier3": { "count": 50, "passed": true }
    },
    "e2e": {
      "tier1": { "count": 8, "passed": true },
      "tier2": { "count": 12, "passed": true },
      "tier3": { "count": 20, "passed": true }
    },
    "ai": {
      "tier3": { "count": 4, "passed": true }
    }
  },
  "status": "PASSED_WITH_WARNINGS",
  "deployment": {
    "allowed": true,
    "environment": "staging",
    "reason": "TIER 2 API tests had 1 transient failure - rerun to verify"
  }
}
```

---

## 🔍 **Troubleshooting Pipeline Issues**

### Test Fails Locally But Passes in CI
- Check node version: `node --version`
- Check environment variables
- Run: `npm ci` instead of `npm install`

### API Tests Timeout
- Increase timeout in test scripts
- Check database connection
- Verify service dependencies are running

### E2E Tests Flaky
- Increase wait times
- Check for race conditions
- Verify server is fully started

### AI Tests Expensive
- Only run on main branch (expensive API calls)
- Set budget limits on OpenAI API
- Cache results when possible

---

## 📈 **Metrics Dashboard**

Track these metrics over time:
- Test pass rate % (target: 100%)
- Average CI duration (target: < 15 min)
- Deployment frequency (target: daily)
- Time from push to deployment (target: < 20 min)
- Test coverage % (target: > 80%)

---

**Status**: ✅ CI/CD Pipeline ready for implementation

Last Updated: March 12, 2026
