# FieldCost — Quick Testing Reference Guide

## 🎯 Testing Navigation by Use Case

---

## **TIER 1 — Core MVP Testing**

### What to Test
- User authentication (login, register, logout)
- Core CRUD operations (projects, tasks, invoices, items, customers)
- Dashboard display
- Company setup

### Files to Review

| Purpose | File Paths |
|---------|-----------|
| **Login/Auth** | `app/auth/login/page.tsx`<br>`app/auth/register/page.tsx`<br>`app/api/auth/login/route.ts` |
| **Projects** | `app/(dashboard)/projects/page.tsx`<br>`app/api/projects/route.ts` |
| **Tasks** | `app/(dashboard)/tasks/page.tsx`<br>`app/api/tasks/route.ts` |
| **Invoices** | `app/(dashboard)/invoices/page.tsx`<br>`app/api/invoices/route.ts` |
| **Items** | `app/(dashboard)/items/page.tsx`<br>`app/api/items/route.ts` |
| **Customers** | `app/(dashboard)/customers/page.tsx`<br>`app/api/customers/route.ts` |
| **Database** | `schema.sql` |
| **Tests** | `tests/tier1-core.test.ts` |
| **Docs** | `docs/TIER1_FEATURES.md` |

### Test Commands
```bash
# Run TIER 1 core tests
npm test

# Run QA tests
node scripts/e2e-test-tier1-qa.mjs

# Start dev server and visit
npm run dev
# http://localhost:3000/dashboard
```

### Test Endpoints

```bash
# Health check
curl http://localhost:3000/api/health

# List projects
curl http://localhost:3000/api/projects

# Create project
curl -X POST http://localhost:3000/api/projects \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Project","description":"Test"}'

# List tasks
curl http://localhost:3000/api/tasks

# List invoices
curl http://localhost:3000/api/invoices

# List customers
curl http://localhost:3000/api/customers

# List items
curl http://localhost:3000/api/items
```

### Verification Checklist

```
✓ Landing page loads
✓ Can register new user
✓ Can login with credentials
✓ Dashboard displays
✓ Can create project
✓ Can view projects list
✓ Can create task
✓ Can view tasks list
✓ Can create invoice
✓ Can view invoices list
✓ Can add customer
✓ Can view customers list
✓ Can add item
✓ Can view items list
✓ All TIER 1 tests pass (npm test)
```

---

## **TIER 2 — Growth Features Testing**

### What to Test
- Sage integration (sync items, customers, push invoices)
- Budget tracking
- WIP (Work in Progress) calculations
- Approval workflows
- Offline sync status
- Location tracking
- Project reports

### Files to Review

| Purpose | File Paths |
|---------|-----------|
| **ERP/Sage** | `app/api/sage/test/route.ts`<br>`app/api/sage/sync/full/route.ts`<br>`lib/sageOneApiClient.ts` |
| **Budgets** | `app/api/budgets/route.ts`<br>`lib/budgetCalculations.ts` |
| **WIP** | `app/api/wip-tracking/route.ts`<br>`lib/wipCalculations.ts` |
| **Workflows** | `app/api/workflows/route.ts`<br>`lib/approvalWorkflow.ts` |
| **Location** | `app/api/location-tracking/route.ts`<br>`lib/geolocation.ts` |
| **Reports** | `app/(dashboard)/projects/reports/page.tsx` |
| **Offline** | `app/api/offline-sync-status/route.ts`<br>`lib/offlineBundles.ts` |
| **Database** | `tier2-schema.sql` |
| **Tests** | `tests/tier2-growth.test.ts` |
| **Docs** | `docs/TIER2_FEATURES.md`<br>`docs/ERP_INTEGRATION_GUIDE.md` |

### Test Commands
```bash
# Run TIER 1 + TIER 2 tests
npm test

# Run TIER 2 specific tests
node scripts/e2e-test-tier2.mjs

# Test Sage connection
curl http://localhost:3000/api/sage/test

# Test full Sage sync
curl -X POST http://localhost:3000/api/sage/sync/full \
  -H "Content-Type: application/json" \
  -d '{"companyId":"test-company"}'
```

### Test Endpoints

```bash
# Sage integration
curl http://localhost:3000/api/sage/test                    # Test connection
curl http://localhost:3000/api/sage/items                   # Get items
curl http://localhost:3000/api/sage/customers               # Get customers
curl http://localhost:3000/api/sage/invoices                # Get invoices
curl -X POST http://localhost:3000/api/sage/sync/full       # Full sync

# Budget tracking
curl http://localhost:3000/api/budgets                      # List budgets
curl -X POST http://localhost:3000/api/budgets              # Create budget
curl http://localhost:3000/api/budgets/[budget-id]         # Get budget

# WIP tracking
curl http://localhost:3000/api/wip-tracking                # Get WIP metrics
curl -X POST http://localhost:3000/api/wip-tracking        # Record WIP

# Workflows
curl http://localhost:3000/api/workflows                   # List workflows
curl -X POST http://localhost:3000/api/workflows           # Create workflow

# Location tracking
curl -X POST http://localhost:3000/api/location-tracking \
  -H "Content-Type: application/json" \
  -d '{"latitude":"12.34","longitude":"56.78","taskId":"xxx"}'

# Project reports
curl http://localhost:3000/api/reports/projects/[id]      # Get report

# Offline sync status
curl http://localhost:3000/api/offline-sync-status        # Check sync
```

### Verification Checklist

```
✓ All TIER 1 tests still pass
✓ Sage connection test succeeds
✓ Can sync items from Sage
✓ Can sync customers from Sage
✓ Can push invoice to Sage
✓ Can create budget
✓ Budget calculations correct
✓ WIP tracking records data
✓ WIP calculations accurate
✓ Approval workflow works
✓ Location tracking records GPS
✓ Offline sync status shows correctly
✓ Project reports generate
✓ All TIER 2 tests pass (npm test)
```

---

## **TIER 3 — Enterprise Features Testing**

### What to Test
- Multi-company setup & hierarchy
- Field role RBAC (role-based access control)
- GPS tracking & validation
- Photo evidence with hashing
- Offline sync bundles
- Custom workflows
- Xero integration (OAuth, sync)
- Audit trails
- WIP snapshots
- Admin console (users, api keys, subscriptions)

### Files to Review

| Purpose | File Paths |
|---------|-----------|
| **Multi-Company** | `app/api/tier3/companies/route.ts`<br>`lib/multiCompanyDB.ts` |
| **RBAC/Crew** | `app/api/tier3/crew/route.ts`<br>`app/admin/tier3-features/page.tsx`<br>`lib/rbacMatrix.ts` |
| **GPS** | `app/api/tier3/gps-tracking/route.ts`<br>`app/dashboard/tier3/gps/page.tsx`<br>`lib/gpsValidation.ts` |
| **Photo Evidence** | `app/api/tier3/photo-evidence/route.ts`<br>`app/dashboard/tier3/photos/page.tsx`<br>`lib/hashUtils.ts` |
| **Xero** | `app/api/xero/test/route.ts`<br>`app/api/xero/sync/full/route.ts`<br>`lib/xeroApiClient.ts` |
| **Workflows** | `app/api/tier3/workflows/route.ts`<br>`app/admin/workflows/page.tsx` |
| **Audit** | `app/api/tier3/audit-logs/route.ts`<br>`app/admin/audit/page.tsx`<br>`lib/auditTrail.ts` |
| **WIP** | `app/api/tier3/wip/route.ts`<br>`lib/tier3.ts` |
| **Admin** | `app/admin/` (all pages) |
| **Database** | `tier3-schema.sql` |
| **Tests** | `tests/tier3.test.ts` |
| **Docs** | `docs/TIER3_FEATURES.md`<br>`docs/TIER3_TEST_SERVER.md`<br>`docs/XERO_OAUTH_FLOW_GUIDE.md` |

### Test Commands
```bash
# Run all tiers (TIER 1 + TIER 2 + TIER 3)
npm test

# Run TIER 3 specific tests
npm run test:tier3

# Run TIER 3 smoke tests
node scripts/smoke-test-tier3.mjs

# Test all TIER 3 endpoints
node scripts/test-tier3-endpoints.mjs

# Test Xero connection
curl http://localhost:3000/api/xero/test

# Test full sync (both Sage and Xero)
curl -X POST http://localhost:3000/api/sage/sync/full
curl -X POST http://localhost:3000/api/xero/sync/full
```

### Test Endpoints

```bash
# ===== Multi-Company =====
curl http://localhost:3000/api/tier3/companies                    # List companies
curl -X POST http://localhost:3000/api/tier3/companies \
  -H "Content-Type: application/json" \
  -d '{"name":"New Co","parentId":"parent-id"}'                   # Create company

# ===== RBAC / Field Roles =====
curl http://localhost:3000/api/tier3/crew                         # List crew
curl -X POST http://localhost:3000/api/tier3/crew \
  -H "Content-Type: application/json" \
  -d '{"userId":"user-id","role":"crew_member"}'                  # Assign role

# ===== GPS Tracking =====
curl http://localhost:3000/api/tier3/gps-tracking                 # Get GPS history
curl -X POST http://localhost:3000/api/tier3/gps-tracking \
  -H "Content-Type: application/json" \
  -d '{"latitude":12.34,"longitude":56.78,"accuracy":5,"taskId":"task-id"}' # Record GPS

# ===== Photo Evidence =====
curl http://localhost:3000/api/tier3/photo-evidence               # List photos
curl -X POST http://localhost:3000/api/tier3/photo-evidence \
  -H "Content-Type: multipart/form-data" \
  -F "file=@photo.jpg" -F "taskId=task-id"                        # Upload photo

# ===== Workflows =====
curl http://localhost:3000/api/tier3/workflows                    # List workflows
curl -X POST http://localhost:3000/api/tier3/workflows \
  -H "Content-Type: application/json" \
  -d '{"name":"Mining Workflow","stages":[...]}'                  # Create workflow

# ===== Xero Integration =====
curl http://localhost:3000/api/xero/test                          # Test connection
curl http://localhost:3000/api/xero/auth                          # Get auth URL
curl http://localhost:3000/api/xero/items                         # Sync items
curl http://localhost:3000/api/xero/contacts                      # Sync contacts
curl -X POST http://localhost:3000/api/xero/sync/full             # Full sync

# ===== WIP Snapshots =====
curl http://localhost:3000/api/tier3/wip                          # List snapshots
curl -X POST http://localhost:3000/api/tier3/wip \
  -H "Content-Type: application/json" \
  -d '{"projectId":"proj-id","certificateCount":5}'               # Create snapshot

# ===== Audit Logs =====
curl http://localhost:3000/api/tier3/audit-logs                   # Get audit logs
curl "http://localhost:3000/api/tier3/audit-logs?userId=user-id" # Filter by user
curl "http://localhost:3000/api/tier3/audit-logs?action=update"   # Filter by action

# ===== Admin API =====
curl http://localhost:3000/api/admin/users                        # List admin users
curl http://localhost:3000/api/admin/api-keys                     # List API keys
curl http://localhost:3000/api/admin/subscriptions                # List subscriptions
curl http://localhost:3000/api/admin/analytics                    # Admin analytics
curl http://localhost:3000/api/admin/tier3-features               # Feature status
curl http://localhost:3000/api/admin/billing/invoices             # Billing invoices
```

### Verification Checklist

```
✓ All TIER 1 & TIER 2 tests still pass
✓ Can create parent company
✓ Can create child company
✓ Can switch between companies
✓ Can assign crew_member role
✓ Can assign supervisor role
✓ Can assign project_manager role
✓ Permissions enforced correctly
✓ GPS recording works
✓ GPS accuracy validation works (< 10m)
✓ Photo upload works
✓ Photo hash calculated correctly (SHA-256)
✓ Photo chain of custody works
✓ Offline bundle creation works
✓ Sync conflict detection works
✓ Manual review workflow works
✓ Xero OAuth flow works
✓ Xero connection test succeeds
✓ Can sync items from Xero
✓ Can sync contacts from Xero
✓ Can create invoice in Xero
✓ Custom workflow creation works
✓ Approval chain works
✓ WIP snapshot creation works
✓ Budget variance calculated
✓ Earned value tracked
✓ Photo certificate count tracked
✓ Audit logs recorded
✓ Can filter audit logs by user
✓ Can filter audit logs by action
✓ Admin user management works
✓ API key generation works
✓ Subscription management works
✓ Feature quotas enforced
✓ All TIER 3 tests pass (npm run test:tier3)
```

---

## **File Navigation by Feature**

### Authentication & User Management
```
Pages:       app/auth/login/page.tsx
             app/auth/register/page.tsx
             app/admin/users/page.tsx (TIER 3)

APIs:        app/api/auth/login/route.ts
             app/api/auth/register/route.ts
             app/api/admin/users/route.ts (TIER 3)

Logic:       lib/useCompanySwitcher.ts
             lib/rbacMatrix.ts (TIER 3)
```

### Projects & Tasks
```
Pages:       app/(dashboard)/projects/page.tsx
             app/(dashboard)/tasks/page.tsx
             app/(dashboard)/projects/reports/page.tsx (TIER 2)

APIs:        app/api/projects/route.ts
             app/api/tasks/route.ts
             app/api/wip-tracking/route.ts (TIER 2)

Logic:       lib/budgetCalculations.ts (TIER 2)
             lib/wipCalculations.ts (TIER 2)
```

### Invoices & Items
```
Pages:       app/(dashboard)/invoices/page.tsx
             app/(dashboard)/items/page.tsx

APIs:        app/api/invoices/route.ts
             app/api/items/route.ts
             app/api/invoices/export/route.ts (TIER 2)
             app/api/invoices/push-to-erp/route.ts (TIER 2)
```

### ERP Integration
```
Pages:       (managed via APIs)

APIs:        app/api/sage/test/route.ts
             app/api/sage/items/route.ts
             app/api/sage/customers/route.ts
             app/api/sage/invoices/route.ts
             app/api/sage/sync/full/route.ts
             app/api/xero/test/route.ts (TIER 3)
             app/api/xero/items/route.ts (TIER 3)
             app/api/xero/sync/full/route.ts (TIER 3)

Logic:       lib/sageOneApiClient.ts
             lib/xeroApiClient.ts (TIER 3)
             lib/erpAdapter.ts
```

### GPS & Location
```
Pages:       app/dashboard/tier3/gps/page.tsx (TIER 3)

APIs:        app/api/location-tracking/route.ts (TIER 2)
             app/api/tier3/gps-tracking/route.ts (TIER 3)

Logic:       lib/geolocation.ts (TIER 2)
             lib/gpsValidation.ts (TIER 3)
```

### Photo & Evidence
```
Pages:       app/dashboard/tier3/photos/page.tsx (TIER 3)

APIs:        app/api/task-photos/route.ts (TIER 2)
             app/api/tier3/photo-evidence/route.ts (TIER 3)

Logic:       lib/hashUtils.ts (TIER 3)
```

### Admin & Management
```
Pages:       app/admin/tier3-features/page.tsx (TIER 3)
             app/admin/company-config/page.tsx (TIER 3)
             app/admin/workflows/page.tsx (TIER 3)
             app/admin/users/page.tsx (TIER 3)
             app/admin/audit/page.tsx (TIER 3)
             app/admin/api-keys/page.tsx (TIER 3)
             app/admin/billing/page.tsx (TIER 3)

APIs:        app/api/admin/* (TIER 3)

Logic:       lib/rbacMatrix.ts (TIER 3)
             lib/auditTrail.ts (TIER 3)
             lib/tierConstraints.ts (TIER 3)
```

### Database
```
TIER 1:      schema.sql
TIER 2:      tier2-schema.sql
TIER 3:      tier3-schema.sql

Migrations:  migrations/001_create_tier1_schema.sql
             migrations/002_add_tier2_tables.sql
             migrations/003_add_tier3_tables.sql
```

---

## **Quick File Lookup Reference**

| Scenario | Check File(s) |
|----------|--------------|
| Login not working | `app/auth/login/page.tsx`<br>`app/api/auth/login/route.ts` |
| Projects not showing | `app/(dashboard)/projects/page.tsx`<br>`app/api/projects/route.ts` |
| Sage sync failing | `app/api/sage/test/route.ts`<br>`lib/sageOneApiClient.ts` |
| Budget calculations wrong | `lib/budgetCalculations.ts`<br>`app/api/budgets/route.ts` |
| GPS not recording | `app/api/tier3/gps-tracking/route.ts`<br>`lib/gpsValidation.ts` |
| Photos not uploading | `app/api/tier3/photo-evidence/route.ts`<br>`lib/hashUtils.ts` |
| Xero auth failing | `lib/xeroApiClient.ts`<br>`app/api/xero/test/route.ts` |
| Audit logs not showing | `lib/auditTrail.ts`<br>`app/api/tier3/audit-logs/route.ts` |
| RBAC not working | `lib/rbacMatrix.ts`<br>`app/api/tier3/crew/route.ts` |
| Admin console error | `app/admin/`<br>`app/api/admin/` |

---

## **Test Execution Flow**

```
START
  │
  ├─→ npm test          (Run all tests: TIER 1 + TIER 2 + TIER 3)
  │
  ├─→ Tests Pass?
  │   │
  │   ├─ YES → Continue to manual testing
  │   │
  │   └─ NO  → Check error messages
  │           └─ Check relevant files above
  │
  ├─→ npm run dev       (Start dev server at http://localhost:3000)
  │
  ├─→ Manual Testing
  │   │
  │   ├─ Test TIER 1    (Dashboard, CRUD operations)
  │   │
  │   ├─ Test TIER 2    (ERP, budgets, WIP)
  │   │
  │   └─ Test TIER 3    (Multi-company, RBAC, GPS, Xero, audit)
  │
  ├─→ Run Endpoint Tests
  │   │
  │   ├─ curl various endpoints (see above)
  │   │
  │   └─ Check responses
  │
  └─→ READY FOR DEPLOYMENT
```

---

**Last Updated:** March 12, 2026
