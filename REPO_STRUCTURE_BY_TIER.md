# FieldCost - GitHub/VSCode Repository Structure by Tier

## Complete Directory Map for Testing

---

## 📁 **TIER 1 — STARTER (MVP Core)**

### Pages & Routes

```
app/
├── page.tsx                              # Landing/home page
├── (dashboard)/
│   ├── layout.tsx                        # Dashboard layout
│   ├── page.tsx                          # Dashboard home ⭐ TIER 1
│   ├── tasks/
│   │   ├── page.tsx                      # Task list view ⭐
│   │   ├── add/page.tsx                  # Create task ⭐
│   │   └── reports/page.tsx              # Task reports ⭐
│   ├── projects/
│   │   ├── page.tsx                      # Project list ⭐
│   │   ├── add/page.tsx                  # Create project ⭐
│   │   └── reports/page.tsx              # Project reports ⭐
│   ├── invoices/
│   │   ├── page.tsx                      # Invoice list ⭐
│   │   ├── add/page.tsx                  # Create invoice ⭐
│   │   └── reports/page.tsx              # Invoice reports ⭐
│   ├── items/
│   │   ├── page.tsx                      # Inventory list ⭐
│   │   ├── add/page.tsx                  # Add item ⭐
│   │   └── reports/page.tsx              # Item reports ⭐
│   ├── customers/
│   │   ├── page.tsx                      # Customer list ⭐
│   │   ├── add/page.tsx                  # Add customer ⭐
│   │   └── reports/page.tsx              # Customer reports ⭐
│   ├── setup-company/page.tsx            # Company setup ⭐
│   └── wip-push-demo/page.tsx            # WIP demo ⭐
├── auth/
│   ├── login/page.tsx                    # Login ⭐
│   ├── register/page.tsx                 # Registration ⭐
│   ├── logout/page.tsx                   # Logout ⭐
│   ├── reset-password/page.tsx           # Password reset ⭐
│   └── demo-login/page.tsx               # Demo login ⭐
```

### API Endpoints — TIER 1

```
app/api/
├── health/route.ts                       # Health check ⭐
├── auth/
│   ├── login/route.ts                    # Login endpoint ⭐
│   ├── logout/route.ts                   # Logout endpoint ⭐
│   └── register/route.ts                 # Registration ⭐
├── projects/route.ts                     # CRUD projects ⭐
├── tasks/route.ts                        # CRUD tasks ⭐
├── invoices/route.ts                     # CRUD invoices ⭐
├── items/route.ts                        # CRUD items ⭐
├── customers/route.ts                    # CRUD customers ⭐
├── company/
│   ├── route.ts                          # Get company ⭐
│   ├── switch/route.ts                   # Switch company ⭐
│   └── logo/route.ts                     # Upload logo ⭐
├── demo/
│   ├── route.ts                          # Demo endpoint ⭐
│   ├── seed/route.ts                     # Seed demo data ⭐
│   ├── cleanup/route.ts                  # Clean demo data ⭐
│   └── users/route.ts                    # Demo users ⭐
```

### Library Files — TIER 1

```
lib/
├── supabaseClient.ts                     # Supabase client⭐
├── useCompanySwitcher.ts                 # Company context ⭐
├── demoConstants.ts                      # Demo mode ⭐
├── errorHandling.ts                      # Error utils ⭐
```

### Database Schema — TIER 1

```
schema.sql
├── companies                             # Company data
├── users                                 # User accounts
├── projects                              # Projects/jobs
├── tasks                                 # Individual tasks
├── invoices                              # Sales invoices
├── items                                 # Inventory
├── customers                             # Clients/suppliers
└── budgets                               # Project budgets
```

### Tests — TIER 1

```
tests/
├── tier1-core.test.ts                    # Core features
├── e2e-test-tier1-qa.mjs                 # QA testing script

Documentation/
├── README.md                             # Main README
├── DEPLOYMENT.md                         # Deploy guide
└── TIER1_FEATURES.md                     # Feature list
```

### Test URLs (Localhost)

```
Dashboard:       http://localhost:3000/dashboard
Projects:        http://localhost:3000/dashboard/projects
Tasks:           http://localhost:3000/dashboard/tasks
Invoices:        http://localhost:3000/dashboard/invoices
Items:           http://localhost:3000/dashboard/items
Customers:       http://localhost:3000/dashboard/customers

API Health:      http://localhost:3000/api/health
```

### Test Commands — TIER 1

```bash
# Run TIER 1 tests only
npm test

# Run QA tests
node e2e-test-tier1-qa.mjs

# Build and test
npm run build
npm run dev
```

---

## 📁 **TIER 2 — GROWTH (ERP + Mobile)**

### Additional Pages & Routes

```
app/
└── (dashboard)/
    ├── tasks/
    │   └── [id]/edit/page.tsx            # Edit task (enhanced)
    └── projects/
        └── reports/page.tsx              # Project reports (enhanced) ⭐ TIER 2
            ├── Gantt chart
            ├── WIP analysis
            ├── Budget variance
            └── Approval queue
```

### Additional API Endpoints — TIER 2

```
app/api/
├── invoices/
│   ├── export/route.ts                   # Export invoice (PDF) ⭐
│   ├── push-to-erp/route.ts              # Push to Sage/Xero ⭐
│   └── sync/route.ts                     # ERP sync status ⭐
├── budgets/route.ts                      # Budget CRUD ⭐
├── wip-tracking/route.ts                 # WIP metrics ⭐
├── location-tracking/route.ts            # GPS tracking ⭐
├── task-photos/route.ts                  # Photo uploads ⭐
├── offline-sync-status/route.ts          # Offline sync status ⭐
├── workflows/route.ts                    # Approval workflows ⭐
└── reports/route.ts                      # Report generation ⭐
```

### Additional Library Files — TIER 2

```
lib/
├── erpAdapter.ts                         # ERP integration ⭐
├── budgetCalculations.ts                 # Budget math ⭐
├── wipCalculations.ts                    # WIP formulas ⭐
├── geolocation.ts                        # GPS handling ⭐
├── offlineBundles.ts                     # Offline sync ⭐
└── approvalWorkflow.ts                   # Approval logic ⭐
```

### Additional Database Tables — TIER 2

```
schema.sql (additions)
├── budgets                               # Budget tracking
├── budget_versions                       # Budget history
├── task_approvals                        # Approval queue
├── task_location_log                     # GPS history
├── offline_sync_log                      # Sync audit trail
└── erp_sync_status                       # ERP integration status
```

### Tests — TIER 2

```
tests/
├── tier1-core.test.ts                    # TIER 1 tests (still pass)
├── tier2-growth.test.ts                  # TIER 2 features ⭐
└── test-tier2-endpoints.mjs              # Endpoint tester ⭐

Documentation/
├── TIER2_FEATURES.md                     # TIER 2 features
├── ERP_INTEGRATION_GUIDE.md              # Integration docs
├── MIGRATION_GUIDE.md                    # TIER 1 → TIER 2
└── OFFLINE_SYNC_GUIDE.md                 # Offline mode
```

### Test URLs (Localhost)

```
Project Reports:           http://localhost:3000/dashboard/projects/reports
Budget Management:         http://localhost:3000/api/budgets
Approval Workflows:        http://localhost:3000/api/workflows
WIP Tracking:              http://localhost:3000/api/wip-tracking
Location Tracking:         http://localhost:3000/api/location-tracking

ERP Sync (Sage):           http://localhost:3000/api/sage/test
Export Invoice (PDF):      http://localhost:3000/api/invoices/export
```

### Test Commands — TIER 2

```bash
# Run TIER 1 + TIER 2 tests
npm test

# Test TIER 2 endpoints specifically
node test-tier2-endpoints.mjs

# Test ERP integration
curl http://localhost:3000/api/sage/test
```

---

## 📁 **TIER 3 — ENTERPRISE (Advanced Features)**

### Additional Pages & Routes

```
app/
├── dashboard/
│   ├── tier3/
│   │   ├── page.tsx                      # Tier 3 setup hub ⭐ TIER 3
│   │   ├── crew/page.tsx                 # RBAC management ⭐
│   │   ├── gps/page.tsx                  # GPS dashboard ⭐
│   │   └── photos/page.tsx               # Photo gallery ⭐
│   └── projects/
│       └── reports/page.tsx              # Enhanced reports ⭐
├── admin/
│   ├── tier3-features/page.tsx           # Feature management ⭐
│   ├── company-config/page.tsx           # Company Tier 3 config ⭐
│   ├── workflows/page.tsx                # Custom workflows ⭐
│   ├── plans/page.tsx                    # Subscription plans ⭐
│   ├── analytics/page.tsx                # Analytics ⭐
│   ├── audit/page.tsx                    # Audit trails ⭐
│   ├── users/page.tsx                    # User management ⭐
│   ├── settings/page.tsx                 # Admin settings ⭐
│   ├── api-keys/page.tsx                 # API key management ⭐
│   ├── billing/page.tsx                  # Billing ⭐
│   ├── feature-quotas/page.tsx           # Feature limits ⭐
│   ├── payments/page.tsx                 # Payment management ⭐
│   ├── subscriptions/page.tsx            # Subscriptions ⭐
│   └── page.tsx                          # Admin dashboard ⭐
```

### Additional API Endpoints — TIER 3

```
app/api/
├── tier3/
│   ├── companies/route.ts                # Multi-company CRUD ⭐
│   ├── crew/route.ts                     # Field role mgmt ⭐
│   ├── gps-tracking/route.ts             # GPS recording ⭐
│   ├── photo-evidence/route.ts           # Photo chain mgmt ⭐
│   ├── wip/route.ts                      # WIP snapshots ⭐
│   ├── audit-logs/route.ts               # Audit trail API ⭐
│   └── workflows/route.ts                # Custom workflows ⭐
├── admin/
│   ├── tier3-features/route.ts           # Feature control ⭐
│   ├── company-config/route.ts           # Company config API ⭐
│   ├── analytics/route.ts                # Analytics API ⭐
│   ├── audit/route.ts                    # Audit API ⭐
│   ├── api-keys/route.ts                 # API key management ⭐
│   ├── dashboard/stats/route.ts          # Admin analytics ⭐
│   ├── billing/invoices/route.ts         # Billing API ⭐
│   ├── payments/route.ts                 # Payment API ⭐
│   ├── plans/route.ts                    # Plans API ⭐
│   ├── settings/route.ts                 # Settings API ⭐
│   ├── subscriptions/route.ts            # Subscriptions API ⭐
│   ├── users/route.ts                    # User management API ⭐
│   └── feature-quotas/route.ts           # Quota management ⭐

└── xero/                                 # NEW: Xero integration ⭐
    ├── test/route.ts                     # Xero connection test
    ├── items/route.ts                    # Get/sync items
    ├── contacts/route.ts                 # Get/sync contacts
    ├── invoices/route.ts                 # Get/create invoices
    └── sync/full/route.ts                # Full orchestrated sync

├── sage/                                 # EXISTING: Sage integration ⭐
    ├── test/route.ts                     # Test connection (FIXED)
    ├── items/route.ts                    # Get/sync items
    ├── items/sync/route.ts               # Sync items
    ├── customers/route.ts                # Get customers
    ├── customers/sync/route.ts           # Sync customers
    ├── invoices/route.ts                 # Invoice endpoints
    └── sync/full/route.ts                # Full sync

├── auth/
│   └── callback/xero/route.ts            # OAuth callback ⭐
```

### Additional Library Files — TIER 3

```
lib/
├── tier3.ts                              # Tier 3 types & logic ⭐
├── xeroApiClient.ts                      # Xero OAuth client ⭐
├── sageOneApiClient.ts                   # Sage API client ⭐
├── hashUtils.ts                          # SHA-256 hashing ⭐
├── gpsValidation.ts                      # GPS accuracy ⭐
├── multiCompanyDB.ts                     # Multi-company queries ⭐
├── rbacMatrix.ts                         # Permission matrix ⭐
├── tierConstraints.ts                    # Feature limits ⭐
└── auditTrail.ts                         # Audit logging ⭐
```

### Additional Database Tables — TIER 3

```
schema.sql (new: tier3-schema.sql)
├── tier3_companies                       # Company hierarchy
├── tier3_field_roles                     # User ↔ role assignments
├── tier3_role_permissions                # Permission matrix
├── task_location_snapshots               # GPS history
├── photo_evidence                        # Legal photos
├── photo_evidence_chain                  # Custody chain
├── offline_bundles                       # Device sync bundles
├── offline_sync_log                      # Sync audit trail
├── tier3_audit_logs                      # Entity changes
├── custom_workflows                      # Workflow definitions
├── workflow_stages                       # Stage config
├── tier3_wip_snapshots                   # WIP tracking
├── mining_site_workflows                 # Mining templates
├── currency_exchange_rates               # Multi-currency
├── admin_users                           # Admin accounts
├── subscription_plans                    # Plan definitions
├── company_subscriptions                 # Active subscriptions
├── api_keys                              # API key storage
└── billing_invoices                      # Billing records
```

### Tests — TIER 3

```
tests/
├── tier1-core.test.ts                    # TIER 1 (still pass)
├── tier2-growth.test.ts                  # TIER 2 (still pass)
├── tier3.test.ts                         # TIER 3 features ⭐
├── smoke-test-tier3.mjs                  # Feature smoke tests ⭐
└── test-tier3-endpoints.mjs              # Endpoint tests ⭐

Documentation/
├── TIER3_FEATURES.md                     # All TIER 3 features
├── TIER3_TEST_SERVER.md                  # Test guide ⭐
├── TIER3_SETUP_SUMMARY.md                # Setup checklist ⭐
├── TIER3_VERIFICATION_REPORT.md          # Validation ⭐
├── TIER3_BUILD_COMPLETE.md               # Build summary ⭐
├── TIER_COMPARISON.md                    # Tier comparison ⭐
├── SAGE_XERO_INTEGRATION_GUIDE.md        # ERP guide ⭐
├── XERO_OAUTH_FLOW_GUIDE.md              # OAuth walkthrough ⭐
├── SAGE_XERO_FIX_DEPLOYMENT_SUMMARY.md   # Deployment notes ⭐
└── ERP_INTEGRATION_QUICK_REFERENCE.md    # Quick ref ⭐
```

### Test URLs (Localhost)

```
TIER 3 Setup Hub:          http://localhost:3000/dashboard/tier3
RBAC Management:           http://localhost:3000/dashboard/tier3/crew
GPS Dashboard:             http://localhost:3000/dashboard/tier3/gps
Photo Gallery:             http://localhost:3000/dashboard/tier3/photos

Admin Console:             http://localhost:3000/admin
Tier 3 Features:           http://localhost:3000/admin/tier3-features
Company Config:            http://localhost:3000/admin/company-config
Workflows:                 http://localhost:3000/admin/workflows
Plans:                     http://localhost:3000/admin/plans
Audit Logs:                http://localhost:3000/admin/audit
Users:                     http://localhost:3000/admin/users
Analytics:                 http://localhost:3000/admin/analytics
API Keys:                  http://localhost:3000/admin/api-keys
Billing:                   http://localhost:3000/admin/billing
Subscriptions:             http://localhost:3000/admin/subscriptions

ERP Integration:           http://localhost:3000/api/sage/test
Xero Auth:                 http://localhost:3000/api/xero/test
Full Sync:                 http://localhost:3000/api/sage/sync/full
```

### Test Commands — TIER 3

```bash
# Run ALL tiers (TIER 1 + TIER 2 + TIER 3)
npm test

# Run TIER 3 tests only
npm run test:tier3

# Run TIER 3 smoke tests
node smoke-test-tier3.mjs

# Test all TIER 3 endpoints
node test-tier3-endpoints.mjs

# Test ERP integration
curl http://localhost:3000/api/sage/test
curl http://localhost:3000/api/xero/test

# Full TIER 3 sync
curl -X POST http://localhost:3000/api/sage/sync/full \
  -H "Content-Type: application/json" \
  -d '{"companyId":"test-company-id"}'
```

---

## 📊 **File Structure Summary**

### By Tier Level

| Component | TIER 1 | TIER 2 | TIER 3 |
|-----------|--------|--------|--------|
| Pages | 6 | 7 | 20+ |
| API Routes | 14 | 23 | 50+ |
| Library Files | 4 | 10 | 18 |
| Database Tables | 8 | 13 | 30+ |
| Tests | 2 suites | 3 suites | 5+ suites |
| Documentation | 3 files | 6 files | 15+ files |

### By File Count

```
Total Pages:          ~45
Total API Routes:     ~60
Total Library Files:  ~25
Total Tests:          ~15
Total Docs:           ~25
Total Schema Tables:  ~35
```

---

## 🧪 **Testing Checklist by Tier**

### TIER 1 Testing Checklist

```
□ User Authentication
  □ Register new user
  □ Login with credentials
  □ Logout
  □ Switch company

□ Core Features
  □ Create project
  □ Create task
  □ Add item to inventory
  □ Add customer
  □ Generate invoice

□ Dashboard
  □ View projects list
  □ View tasks list
  □ View invoices
  □ View inventory
  □ View customers

□ API Endpoints
  □ GET /api/projects
  □ POST /api/tasks
  □ GET /api/invoices
  □ POST /api/items
  □ GET /api/customers

□ Build & Deploy
  □ npm run build → 0 errors
  □ npm run dev → localhost:3000
  □ Deploy to Vercel
```

### TIER 2 Testing Checklist

```
□ All TIER 1 Tests (should still pass)

□ ERP Integration
  □ Sage connection test
  □ Sync items from Sage
  □ Sync customers from Sage
  □ Push invoice to Sage

□ Advanced Features
  □ Budget creation
  □ WIP tracking
  □ Approval workflow
  □ Offline sync
  □ GPS tracking

□ Additional Endpoints
  □ GET /api/budgets
  □ POST /api/wip-tracking
  □ GET /api/workflows
  □ POST /api/location-tracking
  □ POST /api/invoices/export

□ Project Reports
  □ View WIP analysis
  □ View budget variance
  □ View approval queue
  □ Gantt chart display
```

### TIER 3 Testing Checklist

```
□ All TIER 1 & TIER 2 Tests (should still pass)

□ Multi-Company Setup
  □ Create company
  □ Parent-child hierarchy
  □ Switch between companies
  □ Multi-currency support

□ Field Role RBAC
  □ Assign crew_member role
  □ Assign supervisor role
  □ Assign project_manager role
  □ Verify permissions work

□ GPS & Geolocation
  □ Record crew location
  □ Validate sub-10m accuracy
  □ View GPS dashboard
  □ Export GPS history

□ Photo Evidence
  □ Upload photo with GPS
  □ Verify SHA-256 hash
  □ View photo chain
  □ Legal defensibility

□ Offline Sync
  □ Create device bundle
  □ Sync offline tasks
  □ Conflict detection
  □ Manual review workflow

□ Custom Workflows
  □ Create mining workflow
  □ Set approval chain
  □ Require photo evidence
  □ GPS verification

□ Audit Trails
  □ View entity changes
  □ Filter by user
  □ Export audit report
  □ IP address tracking

□ WIP Snapshots
  □ Create WIP snapshot
  □ Track budget variance
  □ View earned value
  □ Photo certification count

□ Xero Integration
  □ Authorize with OAuth
  □ Get auth URL
  □ Exchange code for token
  □ Test connection
  □ Sync items
  □ Sync contacts
  □ Create invoice

□ Admin Console
  □ Manage features
  □ View analytics
  □ Manage users
  □ API key management
  □ Subscription plans

□ API Endpoints (Full Suite)
  □ GET /api/tier3/companies
  □ POST /api/tier3/crew
  □ POST /api/tier3/gps-tracking
  □ POST /api/tier3/photo-evidence
  □ POST /api/xero/sync/full
  □ POST /api/sage/sync/full
```

---

## 🚀 **Quick Start Testing**

### Local Development

```bash
# Clone and setup
git clone <repo>
cd fieldcost
npm install

# Start dev server
npm run dev
# Opens: http://localhost:3000

# Run tests
npm test                    # All tiers
npm run test:tier3         # TIER 3 only

# Build for production
npm run build

# Deploy to Vercel
vercel --prod
```

### GitHub Repository Structure

```
fieldcost/
├── .github/
│   └── workflows/
│       └── ci.yml              # CI/CD pipeline
├── app/
│   ├── (dashboard)/            # TIER 1 pages
│   ├── auth/                    # Auth pages
│   ├── admin/                   # TIER 3 admin
│   ├── dashboard/tier3/         # TIER 3 pages
│   └── api/                     # All API routes
├── lib/
│   ├── tier3.ts                 # TIER 3 definitions
│   ├── xeroApiClient.ts         # TIER 3 Xero
│   ├── sageOneApiClient.ts      # TIER 2/3 Sage
│   └── ...                      # Other utilities
├── tests/
│   ├── tier1-core.test.ts       # TIER 1 tests
│   ├── tier2-growth.test.ts     # TIER 2 tests
│   └── tier3.test.ts            # TIER 3 tests
├── docs/
│   ├── TIER1_FEATURES.md
│   ├── TIER2_FEATURES.md
│   ├── TIER3_FEATURES.md
│   └── ...
├── schema.sql                   # TIER 1 schema
├── tier3-schema.sql             # TIER 3 schema
├── package.json
└── README.md
```

---

## 📋 **Recommended Testing Order**

```
1. TIER 1 (Foundation)
   └─ Run: npm test
   └─ Test: http://localhost:3000/dashboard
   └─ Expected: 16 tests pass, core features work

2. TIER 2 (ERP + Mobile)
   └─ Run: node test-tier2-endpoints.mjs
   └─ Test: Sage integration + workflows
   └─ Expected: All TIER 1 still pass + TIER 2 features work

3. TIER 3 (Enterprise)
   └─ Run: npm run test:tier3
   └─ Test: Multi-company, RBAC, GPS, photo evidence
   └─ Test: Xero OAuth, custom workflows, audit trails
   └─ Expected: All TIER 1 + TIER 2 still pass + TIER 3 features work
```

---

**Status**: ✅ All tiers structured, documented, and ready for testing

Last Updated: March 12, 2026
