# FieldCost — Complete Directory Tree Structure

## Full Repository File Tree

```
fieldcost/
│
├── 📄 README.md                                 # Main documentation
├── 📄 package.json                              # Dependencies & scripts
├── 📄 next.config.js                            # Next.js config
├── 📄 eslint.config.mjs                         # Linter config
├── 📄 postcss.config.js                         # CSS processing
│
├── 📁 app/                                      # Next.js app directory
│   │
│   ├── 📄 page.tsx                              # Landing page (/)
│   ├── 📄 layout.tsx                            # Root layout
│   ├── 📄 globals.css                           # Global styles
│   │
│   ├── 📁 auth/                                 # ⭐ TIER 1: Authentication
│   │   ├── 📄 layout.tsx
│   │   ├── 📄 login/page.tsx                    # Login page
│   │   ├── 📄 register/page.tsx                 # Register page
│   │   ├── 📄 logout/page.tsx                   # Logout
│   │   ├── 📄 reset-password/page.tsx           # Password reset
│   │   └── 📄 demo-login/page.tsx               # Demo login
│   │
│   ├── 📁 (dashboard)/                          # ⭐ TIER 1: Main dashboard group
│   │   ├── 📄 layout.tsx                        # Dashboard layout wrapper
│   │   ├── 📄 page.tsx                          # Dashboard home
│   │   │
│   │   ├── 📁 projects/                         # ⭐ TIER 1: Projects module
│   │   │   ├── 📄 page.tsx                      # Projects list
│   │   │   ├── 📄 add/page.tsx                  # Create project
│   │   │   ├── 📄 [id]/page.tsx                 # Project details
│   │   │   ├── 📄 [id]/edit/page.tsx            # Edit project (TIER 2)
│   │   │   └── 📄 reports/page.tsx              # Project reports (TIER 2)
│   │   │
│   │   ├── 📁 tasks/                            # ⭐ TIER 1: Tasks module
│   │   │   ├── 📄 page.tsx                      # Tasks list
│   │   │   ├── 📄 add/page.tsx                  # Create task
│   │   │   ├── 📄 [id]/page.tsx                 # Task details
│   │   │   ├── 📄 [id]/edit/page.tsx            # Edit task (TIER 2)
│   │   │   └── 📄 reports/page.tsx              # Task reports
│   │   │
│   │   ├── 📁 invoices/                         # ⭐ TIER 1: Invoices module
│   │   │   ├── 📄 page.tsx                      # Invoices list
│   │   │   ├── 📄 add/page.tsx                  # Create invoice
│   │   │   ├── 📄 [id]/page.tsx                 # Invoice details
│   │   │   ├── 📄 [id]/edit/page.tsx            # Edit invoice
│   │   │   └── 📄 reports/page.tsx              # Invoice reports
│   │   │
│   │   ├── 📁 items/                            # ⭐ TIER 1: Inventory module
│   │   │   ├── 📄 page.tsx                      # Items list
│   │   │   ├── 📄 add/page.tsx                  # Add item
│   │   │   ├── 📄 [id]/page.tsx                 # Item details
│   │   │   ├── 📄 [id]/edit/page.tsx            # Edit item
│   │   │   └── 📄 reports/page.tsx              # Item reports
│   │   │
│   │   ├── 📁 customers/                        # ⭐ TIER 1: Customers module
│   │   │   ├── 📄 page.tsx                      # Customers list
│   │   │   ├── 📄 add/page.tsx                  # Add customer
│   │   │   ├── 📄 [id]/page.tsx                 # Customer details
│   │   │   ├── 📄 [id]/edit/page.tsx            # Edit customer
│   │   │   └── 📄 reports/page.tsx              # Customer reports
│   │   │
│   │   ├── 📁 tier3/                            # 🔷 TIER 3: Enterprise features
│   │   │   ├── 📄 page.tsx                      # Tier 3 hub
│   │   │   ├── 📄 crew/page.tsx                 # RBAC management
│   │   │   ├── 📄 gps/page.tsx                  # GPS dashboard
│   │   │   ├── 📄 photos/page.tsx               # Photo gallery
│   │   │   └── 📄 layout.tsx                    # Tier 3 layout
│   │   │
│   │   ├── 📄 setup-company/page.tsx            # ⭐ TIER 1: Company setup
│   │   ├── 📄 wip-push-demo/page.tsx            # ⭐ TIER 1: WIP demo
│   │   └── 📄 layout.tsx                        # Dashboard group layout
│   │
│   ├── 📁 admin/                                # 🔷 TIER 3: Admin section
│   │   ├── 📄 layout.tsx
│   │   ├── 📄 page.tsx                          # Admin dashboard
│   │   ├── 📄 tier3-features/page.tsx           # Feature management
│   │   ├── 📄 company-config/page.tsx           # Company config
│   │   ├── 📄 workflows/page.tsx                # Custom workflows
│   │   ├── 📄 plans/page.tsx                    # Subscription plans
│   │   ├── 📄 analytics/page.tsx                # Analytics
│   │   ├── 📄 audit/page.tsx                    # Audit logs
│   │   ├── 📄 users/page.tsx                    # User management
│   │   ├── 📄 settings/page.tsx                 # Admin settings
│   │   ├── 📄 api-keys/page.tsx                 # API key management
│   │   ├── 📄 billing/page.tsx                  # Billing
│   │   ├── 📄 feature-quotas/page.tsx           # Feature limits
│   │   └── 📄 payments/page.tsx                 # Payment management
│   │
│   └── 📁 api/                                  # ⭐ API Routes
│       │
│       ├── 📄 health/route.ts                   # Health check (TIER 1)
│       │
│       ├── 📁 auth/
│       │   ├── 📄 login/route.ts                # Login endpoint
│       │   ├── 📄 logout/route.ts               # Logout endpoint
│       │   ├── 📄 register/route.ts             # Register endpoint
│       │   └── 📄 callback/xero/route.ts        # Xero OAuth (TIER 3)
│       │
│       ├── 📁 company/
│       │   ├── 📄 route.ts                      # Get company
│       │   ├── 📄 switch/route.ts               # Switch company
│       │   └── 📄 logo/route.ts                 # Upload logo
│       │
│       ├── 📄 projects/route.ts                 # CRUD projects (TIER 1)
│       ├── 📄 tasks/route.ts                    # CRUD tasks (TIER 1)
│       ├── 📄 invoices/route.ts                 # CRUD invoices (TIER 1)
│       ├── 📄 items/route.ts                    # CRUD items (TIER 1)
│       ├── 📄 customers/route.ts                # CRUD customers (TIER 1)
│       │
│       ├── 📁 invoices/                         # (TIER 2 additions)
│       │   ├── 📄 export/route.ts               # Export to PDF
│       │   ├── 📄 push-to-erp/route.ts          # Push to ERP
│       │   └── 📄 sync/route.ts                 # Sync status
│       │
│       ├── 📁 demo/
│       │   ├── 📄 route.ts                      # Demo endpoint
│       │   ├── 📄 seed/route.ts                 # Seed demo data
│       │   ├── 📄 cleanup/route.ts              # Clean demo data
│       │   └── 📄 users/route.ts                # Demo users
│       │
│       ├── 📄 budgets/route.ts                  # Budget CRUD (TIER 2)
│       ├── 📄 wip-tracking/route.ts             # WIP metrics (TIER 2)
│       ├── 📄 location-tracking/route.ts        # GPS tracking (TIER 2)
│       ├── 📄 task-photos/route.ts              # Photo uploads (TIER 2)
│       ├── 📄 offline-sync-status/route.ts      # Offline sync (TIER 2)
│       ├── 📄 workflows/route.ts                # Approval workflows (TIER 2)
│       ├── 📄 reports/route.ts                  # Reports (TIER 2)
│       │
│       ├── 📁 tier3/                            # (TIER 3 tier3-specific)
│       │   ├── 📄 companies/route.ts            # Multi-company CRUD
│       │   ├── 📄 crew/route.ts                 # Field role management
│       │   ├── 📄 gps-tracking/route.ts         # GPS recording
│       │   ├── 📄 photo-evidence/route.ts       # Photo evidence
│       │   ├── 📄 wip/route.ts                  # WIP snapshots
│       │   ├── 📄 audit-logs/route.ts           # Audit logs
│       │   └── 📄 workflows/route.ts            # Custom workflows
│       │
│       ├── 📁 admin/                            # (TIER 3 admin-specific)
│       │   ├── 📄 tier3-features/route.ts       # Feature control
│       │   ├── 📄 company-config/route.ts       # Company config
│       │   ├── 📄 analytics/route.ts            # Analytics
│       │   ├── 📄 audit/route.ts                # Audit API
│       │   ├── 📄 api-keys/route.ts             # API key management
│       │   ├── 📄 dashboard/stats/route.ts      # Admin analytics
│       │   ├── 📄 billing/invoices/route.ts     # Billing
│       │   ├── 📄 payments/route.ts             # Payments
│       │   ├── 📄 plans/route.ts                # Plans
│       │   ├── 📄 settings/route.ts             # Settings
│       │   ├── 📄 subscriptions/route.ts        # Subscriptions
│       │   ├── 📄 users/route.ts                # User management
│       │   └── 📄 feature-quotas/route.ts       # Feature quotas
│       │
│       ├── 📁 sage/                             # (TIER 2/3: Sage integration)
│       │   ├── 📄 test/route.ts                 # Test connection ✅ FIXED
│       │   ├── 📄 items/route.ts                # Get/sync items
│       │   ├── 📄 items/sync/route.ts           # Sync items
│       │   ├── 📄 customers/route.ts            # Get customers
│       │   ├── 📄 customers/sync/route.ts       # Sync customers
│       │   ├── 📄 invoices/route.ts             # Invoice endpoints
│       │   └── 📄 sync/full/route.ts            # Full orchestrated sync
│       │
│       └── 📁 xero/                             # (TIER 3: NEW Xero integration)
│           ├── 📄 test/route.ts                 # Test connection
│           ├── 📄 auth/route.ts                 # OAuth URL
│           ├── 📄 items/route.ts                # Get/sync items
│           ├── 📄 contacts/route.ts             # Get/sync contacts
│           ├── 📄 invoices/route.ts             # Get/create invoices
│           └── 📄 sync/full/route.ts            # Full orchestrated sync
│
├── 📁 lib/                                      # Utility libraries
│   │
│   ├── 📄 supabaseClient.ts                     # ⭐ TIER 1: Supabase client
│   ├── 📄 useCompanySwitcher.ts                 # ⭐ TIER 1: Company context
│   ├── 📄 demoConstants.ts                      # ⭐ TIER 1: Demo mode
│   ├── 📄 errorHandling.ts                      # ⭐ TIER 1: Error utils
│   │
│   ├── 📄 erpAdapter.ts                         # 💠 TIER 2: ERP adapter
│   ├── 📄 budgetCalculations.ts                 # 💠 TIER 2: Budget math
│   ├── 📄 wipCalculations.ts                    # 💠 TIER 2: WIP formulas
│   ├── 📄 geolocation.ts                        # 💠 TIER 2: GPS handling
│   ├── 📄 offlineBundles.ts                     # 💠 TIER 2: Offline sync
│   ├── 📄 approvalWorkflow.ts                   # 💠 TIER 2: Approval logic
│   │
│   ├── 📄 tier3.ts                              # 🔷 TIER 3: Type definitions
│   ├── 📄 xeroApiClient.ts                      # 🔷 TIER 3: Xero OAuth client
│   ├── 📄 sageOneApiClient.ts                   # 🔷 TIER 3: Sage API client
│   ├── 📄 hashUtils.ts                          # 🔷 TIER 3: SHA-256 hashing
│   ├── 📄 gpsValidation.ts                      # 🔷 TIER 3: GPS accuracy
│   ├── 📄 multiCompanyDB.ts                     # 🔷 TIER 3: Multi-company DB
│   ├── 📄 rbacMatrix.ts                         # 🔷 TIER 3: Permission matrix
│   ├── 📄 tierConstraints.ts                    # 🔷 TIER 3: Feature limits
│   └── 📄 auditTrail.ts                         # 🔷 TIER 3: Audit logging
│
├── 📁 tests/                                    # Test suites
│   ├── 📄 tier1-core.test.ts                    # ⭐ TIER 1: Core features
│   ├── 📄 tier2-growth.test.ts                  # 💠 TIER 2: Growth features
│   └── 📄 tier3.test.ts                         # 🔷 TIER 3: Enterprise features
│
├── 📁 public/                                   # Static assets
│   ├── 📄 favicon.ico
│   └── 📁 images/
│       └── (logo, icons, etc.)
│
├── 📁 components/                               # React components
│   ├── 📁 dashboard/
│   │   ├── 📄 ProjectList.tsx                   # ⭐ TIER 1
│   │   ├── 📄 TaskList.tsx                      # ⭐ TIER 1
│   │   ├── 📄 InvoiceList.tsx                   # ⭐ TIER 1
│   │   ├── 📄 ItemList.tsx                      # ⭐ TIER 1
│   │   └── 📄 CustomerList.tsx                  # ⭐ TIER 1
│   │
│   ├── 📁 admin/                                # 🔷 TIER 3
│   │   ├── 📄 UserManagement.tsx
│   │   ├── 📄 ApiKeyManager.tsx
│   │   ├── 📄 FeatureControl.tsx
│   │   └── 📄 Analytics.tsx
│   │
│   ├── 📁 tier3/                                # 🔷 TIER 3
│   │   ├── 📄 CrewRoles.tsx
│   │   ├── 📄 GpsMap.tsx
│   │   ├── 📄 PhotoGallery.tsx
│   │   └── 📄 AuditLog.tsx
│   │
│   └── 📄 Navigation.tsx                        # Main nav
│
├── 📁 styles/                                   # CSS files
│   ├── 📄 globals.css
│   ├── 📄 dashboard.css
│   └── 📄 admin.css
│
├── 📁 docs/                                     # Documentation
│   ├── 📄 TIER1_FEATURES.md                     # ⭐ TIER 1 docs
│   ├── 📄 TIER2_FEATURES.md                     # 💠 TIER 2 docs
│   ├── 📄 TIER3_FEATURES.md                     # 🔷 TIER 3 docs
│   ├── 📄 TIER3_TEST_SERVER.md                  # Testing guide
│   ├── 📄 TIER3_SETUP_SUMMARY.md                # Setup
│   ├── 📄 DEPLOYMENT_GUIDE.md                   # Deployment
│   ├── 📄 ERP_INTEGRATION_GUIDE.md              # ERP guide
│   ├── 📄 SAGE_XERO_INTEGRATION_GUIDE.md        # Integration
│   ├── 📄 XERO_OAUTH_FLOW_GUIDE.md              # OAuth
│   ├── 📄 MIGRATION_GUIDE.md                    # Migration
│   └── 📄 TIER_COMPARISON.md                    # Tier comparison
│
├── 📁 migrations/                               # Database migrations
│   ├── 📄 001_create_tier1_schema.sql           # ⭐ TIER 1
│   ├── 📄 002_add_tier2_tables.sql              # 💠 TIER 2
│   └── 📄 003_add_tier3_tables.sql              # 🔷 TIER 3
│
├── 📄 schema.sql                                # ⭐ TIER 1 schema
├── 📄 tier2-schema.sql                          # 💠 TIER 2 schema
├── 📄 tier3-schema.sql                          # 🔷 TIER 3 schema
│
├── 📄 demo_data.sql                             # Demo data seed
├── 📄 multi-company-migration.sql               # Company migration
├── 📄 admin-cms-schema.sql                      # Admin schema
│
├── 📁 scripts/                                  # Utility scripts
│   ├── 📄 demo-setup.mjs                        # Demo setup
│   ├── 📄 create-demo-users.mjs                 # Create test users
│   ├── 📄 comprehensive-automated-tests.mjs     # Test runner
│   ├── 📄 comprehensive-e2e-test.mjs            # E2E tests
│   ├── 📄 e2e-test-tier1-qa.mjs                 # QA tests
│   ├── 📄 e2e-test-tier2.mjs                    # TIER 2 tests
│   ├── 📄 customer-journey-test.mjs             # Journey tests
│   ├── 📄 invoice-e2e-test.mjs                  # Invoice tests
│   ├── 📄 kanban-e2e-test.mjs                   # Kanban tests
│   ├── 📄 local-dev-test.mjs                    # Local dev tests
│   ├── 📄 admin-dashboard-test.mjs              # Admin tests
│   ├── 📄 check-migration-status.mjs            # Migration check
│   ├── 📄 apply-tier2-schema.mjs                # Apply schema
│   ├── 📄 add-company-id-columns.mjs            # Company columns
│   └── 📄 deploy-manager.mjs                    # Deployment
│
├── 📁 reports/                                  # Generated reports
│   ├── 📄 admin-dashboard-report.json
│   ├── 📄 customer-journey-report.json
│   ├── 📄 kanban-e2e-report.json
│   └── 📄 e2e-results-post-migration.txt
│
├── 📁 .github/                                  # GH Actions
│   └── 📁 workflows/
│       └── 📄 ci.yml                            # CI/CD pipeline
│
└── 📄 .gitignore
```

---

## 📊 **Structure Statistics**

| Section | Count | Purpose |
|---------|-------|---------|
| **Pages** | 45+ | User-facing routes |
| **API Routes** | 60+ | Backend endpoints |
| **Components** | 20+ | React UI components |
| **Library Files** | 25+ | Utilities & helpers |
| **Tests** | 15+ | Test implementations |
| **Docs** | 20+ | Documentation files |
| **Scripts** | 14 | Automation scripts |
| **SQL Schemas** | 4 | Database definitions |
| **CSS Files** | 3 | Styling |

---

## 🎯 **Finding Files by Purpose**

### Authentication Files
```
app/auth/login/page.tsx                         # Login page
app/auth/register/page.tsx                      # Registration
app/auth/demo-login/page.tsx                    # Demo login
app/api/auth/login/route.ts                     # Login API
app/api/auth/register/route.ts                  # Register API
app/api/auth/callback/xero/route.ts             # Xero OAuth
```

### Core Business Logic (TIER 1)
```
app/(dashboard)/projects/page.tsx               # Projects page
app/(dashboard)/tasks/page.tsx                  # Tasks page
app/(dashboard)/invoices/page.tsx               # Invoices page
app/(dashboard)/items/page.tsx                  # Inventory page
app/(dashboard)/customers/page.tsx              # Customers page
app/api/projects/route.ts                       # Projects API
app/api/tasks/route.ts                          # Tasks API
```

### ERP Integration (TIER 2/3)
```
app/api/sage/test/route.ts                      # Sage connection
app/api/sage/sync/full/route.ts                 # Full Sage sync
app/api/xero/test/route.ts                      # Xero connection
app/api/xero/sync/full/route.ts                 # Full Xero sync
lib/sageOneApiClient.ts                         # Sage client
lib/xeroApiClient.ts                            # Xero client
docs/SAGE_XERO_INTEGRATION_GUIDE.md             # Integration guide
```

### Advanced Features (TIER 3)
```
app/admin/tier3-features/page.tsx               # Feature control
app/admin/users/page.tsx                        # User management
app/dashboard/tier3/crew/page.tsx               # RBAC
app/dashboard/tier3/gps/page.tsx                # GPS tracking
app/dashboard/tier3/photos/page.tsx             # Photo evidence
app/api/tier3/companies/route.ts                # Multi-company
app/api/tier3/gps-tracking/route.ts             # GPS API
lib/rbacMatrix.ts                               # Permissions
lib/auditTrail.ts                               # Audit logging
```

### Testing
```
tests/tier1-core.test.ts                        # TIER 1 tests
tests/tier2-growth.test.ts                      # TIER 2 tests
tests/tier3.test.ts                             # TIER 3 tests
scripts/e2e-test-tier1-qa.mjs                   # QA automation
scripts/e2e-test-tier2.mjs                      # TIER 2 tests
scripts/comprehensive-e2e-test.mjs              # Full E2E
```

### Database
```
schema.sql                                      # TIER 1 schema
tier2-schema.sql                                # TIER 2 additions
tier3-schema.sql                                # TIER 3 additions
migrations/001_create_tier1_schema.sql          # Migration v1
migrations/002_add_tier2_tables.sql             # Migration v2
migrations/003_add_tier3_tables.sql             # Migration v3
```

### Documentation
```
docs/TIER1_FEATURES.md                          # TIER 1 docs
docs/TIER2_FEATURES.md                          # TIER 2 docs
docs/TIER3_FEATURES.md                          # TIER 3 docs
docs/DEPLOYMENT_GUIDE.md                        # Deployment
docs/ERP_INTEGRATION_GUIDE.md                   # ERP guide
docs/TIER_COMPARISON.md                         # Tier comparison
```

---

## 🚀 **Quick Navigation Guide**

### I want to test TIER 1 (Core Features)
1. Open `app/(dashboard)/` → View all pages (projects, tasks, invoices, etc.)
2. Open `app/api/` → Core endpoints (projects, tasks, invoices, etc.)
3. Run `npm test` or `npm run test:tier1`
4. Visit `http://localhost:3000/dashboard`

### I want to test TIER 2 (ERP + Growth)
1. Open `app/api/sage/` → Sage integration
2. Open `lib/erpAdapter.ts` → ERP logic
3. Run `node scripts/e2e-test-tier2.mjs`
4. Visit `http://localhost:3000/api/sage/test`

### I want to test TIER 3 (Enterprise)
1. Open `app/admin/` → Admin pages
2. Open `app/dashboard/tier3/` → Enterprise features
3. Open `app/api/tier3/` → Enterprise APIs
4. Run `npm run test:tier3`
5. Visit `http://localhost:3000/admin`

### I want to understand the database
1. Start with `schema.sql` (TIER 1 tables)
2. Add `tier2-schema.sql` (TIER 2 additions)
3. Add `tier3-schema.sql` (TIER 3 additions)
4. Check migrations folder for step-by-step

### I want to deploy
1. Read `docs/DEPLOYMENT_GUIDE.md`
2. Run `npm run build`
3. Use `vercel --prod` for Vercel deployment

---

## 📌 **Legend**

- ⭐ **TIER 1 (Starter/MVP)** — Core features, fundamental functionality
- 💠 **TIER 2 (Growth)** — ERP integration, advanced features
- 🔷 **TIER 3 (Enterprise)** — Multi-company, RBAC, advanced compliance

---

**Last Updated:** March 12, 2026
