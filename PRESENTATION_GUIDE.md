# 🎬 FIELDCOST: LIVE PRESENTATION GUIDE (All 3 Tiers)

## Pre-Presentation Checklist

```bash
# 1. Start the development server (Terminal 1)
npm run dev

# 2. Start the production server (Terminal 2)
npm start -- -p 3003

# 3. Verify both are running
# Dev:  http://localhost:3000
# Prod: http://localhost:3003

# 4. Have tests ready (Terminal 3)
npm test                    # Run all tests (TIER 1 + TIER 2)
npm run test:tier3         # Run TIER 3 tests
node smoke-test-tier3.mjs  # Run 25 TIER 3 smoke tests
```

---

## 📱 TIER 1: STARTER (5-7 minutes)

### Goal
*Demonstrate simplicity and ease of use for small contractors*

### Demo Flow

1. **Access Application**
   ```
   Open: http://localhost:3000
   ```

2. **Show Login/Registration**
   - Click "Register" on home page
   - Show simple registration form (name, email, password)
   - Explain: "One click to get started"

3. **Company Setup**
   - Complete registration
   - Navigate to Setup Company (`/dashboard/setup-company`)
   - Fill in basic company info
   - Explain: "5 minutes to operational"

4. **Create First Project**
   - Go to `/dashboard/projects`
   - Click "New Project"
   - Add project name, description, photo
   - Show: "Simple form, no complexity"

5. **Create Tasks**
   - Go to `/dashboard/tasks`
   - Create 2-3 tasks for the project
   - Assign to crew members
   - Show: "Drag-drop Kanban board"

6. **Timer Tracking**
   - Go to `/dashboard/customers`
   - Show crew timer interface
   - Start a timer
   - Explain: "Track hourly work automatically"

7. **Add Photos**
   - In tasks, upload a photo
   - Show photo gallery
   - Explain: "Simple evidence collection"

8. **Create & Export Invoice**
   - Go to `/dashboard/invoices`
   - Create invoice from tasks
   - Click "Export CSV/PDF"
   - Show: "Professional invoice in seconds"

### Key Messaging
> "TIER 1 is just enough to get started. No complexity. No learning curve. Contractors start invoicing within 30 minutes."

### Talking Points
- ✅ Projects, Tasks, Timer
- ✅ Inventory management
- ✅ Photo evidence
- ✅ Invoicing
- ✅ Budget tracking

**Time**: 5-7 minutes
**Next**: "But if you grow, what comes next?"

---

## 📈 TIER 2: GROWTH (8-10 minutes)

### Goal
*Show operational lock-in and why customers become dependent*

### Demo Flow

1. **Show Multi-Project Dashboard**
   - From any page, go to `/dashboard`
   - Show aggregate view of all projects
   - Explain: "See everything at a glance as you grow"

2. **Budget Tracking**
   - Go to `/dashboard/projects`
   - Show project with budget
   - Explain: "Set budget, track actual spend"
   - Click into budget details
   - Show variance alerts

3. **Approval Workflows**
   - Go to `/dashboard/invoices`
   - Show invoice with "Pending Approval" status
   - Explain: "Finance team can approve before payment"

4. **WIP Tracking**
   - Go to `/dashboard/wip-push-demo`
   - Show work-in-progress tracking
   - Explain: "Live view of task completion, earned value, budget variance"
   - Click "Push to ERP" button
   - Show status in dashboard

5. **ERP Sync**
   - Show sync status in invoice row details
   - Explain: "Automatically syncs to Sage X3 or Xero"
   - (Simulated) Show that invoice appears in ERP system
   - Explain: "No manual data entry, no errors"

6. **Geolocation**
   - Show crew member location on map
   - Explain: "Know where your crew is working in real-time"

7. **Offline Mobile**
   - Show offline sync structure in dashboard
   - Explain: "Mobile app works even on remote sites with no connectivity"
   - "Data syncs automatically when connection returns"

8. **Gantt Chart**
   - Navigate to project details
   - Show timeline view
   - Explain: "Visual project schedule, dependencies, critical path"

### Key Messaging
> "TIER 2 makes FieldCost mission-critical. It integrates with your existing tools (Sage X3, Xero). Your team depends on it. That's when they can't leave."

### Talking Points
- ✅ ERP Integration (Sage X3, Xero)
- ✅ Automated Invoicing
- ✅ WIP Tracking
- ✅ Budget vs Actual
- ✅ Approval Workflows
- ✅ Geolocation
- ✅ Offline Mobile Sync
- ✅ Multi-Project Dashboards

**Time**: 8-10 minutes
**Next**: "And for enterprises managing multiple companies?"

---

## 🏢 TIER 3: ENTERPRISE (12-15 minutes)

### Goal
*Demonstrate enterprise-grade features for large mining/construction firms*

### Demo Flow

1. **Navigate to TIER 3 Hub**
   ```
   Open: http://localhost:3000/dashboard/tier3
   ```
   - Show 12 feature cards
   - Explain: "Everything TIER 1 + TIER 2 can do, PLUS..."

2. **Multi-Company Setup**
   - Click "Create Company" card
   - Show company form with Tier 3 options
   - Fill in: name, registration number, tier, currency, SLA level
   - Explain: "One company can manage multiple subsidiaries/sites"
   - Show parent-child relationships

3. **Field Role RBAC**
   - Go to `/dashboard/tier3/crew`
   - Show 6 roles: crew_member, supervisor, site_manager, project_manager, finance, admin
   - Click each role to show permissions
   - Explain: "30+ granular permissions per role"
   - Show: crew_member (offline only), supervisor (task creation), project_manager (full ops), admin (unrestricted)

4. **GPS Tracking with Legal Validation**
   - Go to `/dashboard/tier3/gps`
   - Click "Record Location"
   - Enter coordinates (use real mining coordinates: -26.2023, 28.0448)
   - Click "Validate"
   - Show: ✅ "Sub-10m accuracy verified" (green)
   - Try invalid coordinates
   - Show: ❌ "Accuracy > 10m - fails legal threshold" (red)
   - Explain: "Required for mining operations compliance"

5. **Photo Evidence with Legal Chain**
   - Go to `/dashboard/tier3/photos`
   - Click "Upload Photo"
   - Choose photo file
   - Show: SHA-256 hash is generated
   - Show: Geolocation attached
   - Show: "Legal Grade: Verified" badge
   - Explain: "Photo chains are court-admissible. Mining companies need this."

6. **Audit Trail**
   - Show audit logs in tier3 dashboard
   - Click on an entry
   - Show: user, role, IP address, timestamp, change details
   - Explain: "Every action tracked. Complete compliance audit trail."

7. **Custom Workflows**
   - Show Mining Workflow template
   - Explain: "5-stage mining blast cycle"
   - Show: "Pre-Blast, Blast Planning, Blast Execution, Post-Blast Inspection, Closure"
   - Show: Photo requirement on "Post-Blast Inspection"
   - Explain: "Mining-specific workflow with mandatory approvals"

8. **Multi-Currency**
   - Show currency dropdown in company settings
   - Show: ZAR, USD, EUR options
   - Explain: "Mining operations cross borders. Multi-currency built-in."

9. **API Access**
   - Show API documentation
   - Show endpoint examples: `/api/tier3/companies`, `/api/tier3/gps-tracking`, `/api/tier3/photo-evidence`
   - Explain: "3rd-party integration for custom reporting, mobile apps, etc."

10. **Run Tests**
    - Run smoke tests in terminal
    ```bash
    node smoke-test-tier3.mjs
    ```
    - Show: 25/25 tests passing
    - Explain: "All features tested, validated, production-ready"

### Key Messaging
> "TIER 3 is built for mining and large construction. Legal photo chains. GPS compliance. Multi-company governance. Audit trails that satisfy regulators. This is what makes $5M contracts possible."

### Talking Points
- ✅ Multi-Company Setup (parent-child hierarchy)
- ✅ 6-Role Field RBAC (30+ permissions)
- ✅ Legal GPS Tracking (sub-10m)
- ✅ Legal Photo Chains (SHA-256, court-admissible)
- ✅ Comprehensive Audit Trails
- ✅ Mining-Specific Workflows
- ✅ Multi-Currency Support
- ✅ REST API (7 endpoints)
- ✅ Dedicated Support + SLA
- ✅ Advanced Financial Reporting

**Time**: 12-15 minutes

---

## 🧪 RUNNING TESTS (PROOF OF QUALITY)

### Before Presentation
```bash
# In Terminal 3
npm test

# Output should show:
#  ✓ tests/tier3.test.ts (36 tests) 12ms
#  ✓ tests/api/tasks.test.ts (4 tests) 46ms
#  ✓ tests/api/invoices.test.ts (8 tests) 88ms
#
#  Test Files  3 passed (3)
#  Tests  48 passed (48)
```

### During TIER 3 Demo
```bash
# Show TIER 3 tests are passing
npm run test:tier3

# Show smoke tests
node smoke-test-tier3.mjs
```

### Talking Point
> "We don't just build software, we test it. 48 unit tests. 25 smoke tests. Every feature validated. This is production-ready code."

---

## 📊 COMPARISON WALKTHROUGH (2 minutes)

Pull up the **TIER_COMPARISON.md** document and show the feature matrix:

```
┌─────────────────────────┬──────────┬──────────┬──────────┐
│ Feature                 │ TIER 1   │ TIER 2   │ TIER 3   │
├─────────────────────────┼──────────┼──────────┼──────────┤
│ Basic Job Costing       │ ✅       │ ✅       │ ✅       │
│ ERP Integration         │ ❌       │ ✅       │ ✅       │
│ Offline Mobile Sync     │ ❌       │ ✅       │ ✅       │
│ Multi-Company           │ ❌       │ ❌       │ ✅       │
│ Legal Photo Chains      │ ❌       │ ❌       │ ✅ Legal │
│ Mining Workflows        │ ❌       │ ❌       │ ✅       │
└─────────────────────────┴──────────┴──────────┴──────────┘
```

---

## 💰 PRICING NARRATIVE

### TIER 1 (STARTER)
- **Price**: $99/month
- **Message**: "Contractors start invoicing in 30 minutes"
- **Goal**: Get them hooked, prove value

### TIER 2 (GROWTH)
- **Price**: $299/month
- **Message**: "Add ERP sync, approval workflows, geolocation"
- **Goal**: They become dependent, can't switch

### TIER 3 (ENTERPRISE)
- **Price**: $2,000+/month (custom)
- **Message**: "Multi-company, legal compliance, dedicated support"
- **Goal**: Lock in $1M+ annual contracts

---

## 🎯 KEY TALKING POINTS BY TIER

### TIER 1
- "Simplest job costing tool available"
- "Get contractors paying within 30 days"
- "No learning curve"
- "Cloud-based, always available"

### TIER 2
- "They integrate with their existing ERP (Sage, Xero)"
- "Impossible to leave once connected"
- "Offline-first for remote jobs"
- "Approval workflows reduce overhead"

### TIER 3
- "Mining operations require legal defensibility"
- "Photo evidence must be court-admissible"
- "GPS validation satisfies compliance"
- "Multi-company for large operations"
- "Dedicated support = high-touch"
- "SLA guarantees = mission-critical"

---

## ⏱️ TIMING BREAKDOWN

| Tier | Time | Demo |
|------|------|------|
| TIER 1 | 5-7 min | Projects → Tasks → Invoice |
| TIER 2 | 8-10 min | ERP Sync → WIP → Approval Workflows |
| TIER 3 | 12-15 min | Multi-Company → RBAC → GPS → Photos → Tests |
| **Total** | **25-32 min** | All 3 tiers complete |

---

## 🚀 QUICK REFERENCE: TIER URLS

```
TIER 1 Features:
  http://localhost:3000                      -- Home page
  http://localhost:3000/auth/register        -- Sign up
  http://localhost:3000/dashboard/projects   -- Projects
  http://localhost:3000/dashboard/tasks      -- Tasks  
  http://localhost:3000/dashboard/invoices   -- Invoicing

TIER 2 Features:
  http://localhost:3000/dashboard            -- Multi-project view
  http://localhost:3000/dashboard/invoices   -- ERP Sync status
  http://localhost:3000/dashboard/wip-push-demo -- WIP Tracking

TIER 3 Features:
  http://localhost:3000/dashboard/tier3             -- Setup hub
  http://localhost:3000/dashboard/tier3/crew        -- RBAC
  http://localhost:3000/dashboard/tier3/gps         -- GPS Tracking
  http://localhost:3000/dashboard/tier3/photos      -- Photo Evidence
```

---

## 📋 BACKUP DEMOS (If Live Demo Fails)

### Screenshots
- Have screenshots of each tier ready
- Show: Projects, tasks, invoices, ERP sync, GPS, photos

### Test Results
- Show terminal output of all tests passing
- Show smoke test results
- Show build output: `npm run build`

### Documentation
- Have TIER_COMPARISON.md open
- Have TIER3_BUILD_COMPLETE.md ready
- Have TIER3_SETUP_SUMMARY.md available

---

## ✨ CLOSING

> "FieldCost is three complete products in one:
> 
> **TIER 1** validates the market with small contractors.
> **TIER 2** locks in growth firms with operational dependency.
> **TIER 3** captures high-ACV enterprise contracts with legal defensibility.
> 
> Every feature is tested, documented, and production-ready. You can start selling TIER 1 today and upgrade customers as they grow."

---

**Ready to present? Good luck! 🚀**
