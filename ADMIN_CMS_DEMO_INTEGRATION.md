/**
 * ADMIN CMS + DEMO MODE INTEGRATION GUIDE
 * 
 * Complete guide for using the admin CMS with demo/live company switching
 */

# Admin CMS with Demo Mode Integration

## Overview

The admin CMS has been fully integrated with the demo/live company switching system. This allows admins to:

- **Switch between demo and live companies** while managing subscriptions
- **See visual indicators** when in demo mode
- **Test features safely** in demo without affecting real data
- **Access all admin features** with company scoping

---

## What Changed

### Admin Dashboard (`app/admin/page.tsx`)
- ✅ Added `DemoModeBanner` at the top
- ✅ Added company switcher in sidebar
- ✅ Added environment badge (DEMO/LIVE)
- ✅ Integrated `useCompanySwitcher` hook
- ✅ Company-scoped stats queries

### Plans Page (`app/admin/plans/page.tsx`)
- ✅ Demo banner with warning message
- ✅ Company switcher integration
- ✅ Safe plan management in demo mode

### Subscriptions Page (`app/admin/subscriptions/page.tsx`)
- ✅ Demo banner with clear messaging
- ✅ Company-scoped subscription queries
- ✅ Safe upgrade/discount operations in demo
- ✅ Warning before destructive actions

### Billing Page (`app/admin/billing/page.tsx`)
- ✅ Demo banner notifications
- ✅ Company-scoped invoice queries
- ✅ Safe invoice management

---

## Key Features

### 1. Demo Mode Banner
Located at the top of every admin page:
- Shows "DEMO WORKSPACE" when in demo mode
- Provides quick access to live workspace
- Displays current company

```
┌─────────────────────────────────────────────────────────┐
│ 🟠 THIS IS DEMO WORKSPACE  [Go to Live Workspace] → │
└─────────────────────────────────────────────────────────┘
```

### 2. Company Switcher
In the sidebar:
- Lists all companies (demo + live)
- Shows active company
- Click to switch instantly
- Integrates with all admin pages

### 3. Demo Mode Warnings
On each admin page:
- Clear notice when in demo mode
- Explains that changes are for testing
- Assures no real data is affected

### 4. Environment Badge
Shows "DEMO" tag next to company name when in demo mode

---

## How It Works

### Workflow: Admin Opens Dashboard

```
1. User navigates to /admin
2. useCompanySwitcher hook loads:
   - Get all companies (demo + live)
   - Get active company from cookie
   - Check if active is demo
3. Dashboard renders with:
   - DemoModeBanner (shows if demo active)
   - Company switcher (all options)
   - Stats scoped to active company
```

### Workflow: Admin Switches Company

```
1. User clicks company in switcher
2. switchCompany() called with company_id:
   - Updates activeCompanyId cookie
   - Calls onSwitchSuccess callback
   - Page reloads with new company scope
3. New company stats load:
   - Subscriptions filtered by company_id
   - Invoices filtered by company_id
   - Plans remain global (admin-only)
4. Demo banner updates to show new context
```

### Workflow: Admin Updates Subscription (Demo)

```
1. Admin clicks upgrade subscription
2. System shows demo warning:
   "Changes to demo subscriptions are for testing only"
3. Admin confirms action
4. API call includes company_id
5. Subscription updated in demo company
6. Audit log created with demo notation
7. Page refreshes to show changes
```

---

## API Changes

All admin APIs now support company scoping:

### Plans Endpoint
```
GET  /api/admin/plans                    → Global (all plans)
POST /api/admin/plans                    → Global (create plan)
PATCH /api/admin/plans?id=xxx            → Global (update plan)
DELETE /api/admin/plans?id=xxx           → Global (delete plan)
```

### Subscriptions Endpoint
```
GET  /api/admin/subscriptions?company_id=XXX  → Company scoped
GET  /api/admin/subscriptions?status=active   → All companies
POST /api/admin/subscriptions                 → Create for company
PATCH /api/admin/subscriptions?company_id=XXX → Update company sub
```

### Invoices Endpoint
```
GET  /api/admin/billing/invoices?company_id=XXX  → Company scoped
POST /api/admin/billing/invoices                 → Create for company
PATCH /api/admin/billing/invoices?id=xxx        → Update invoice
```

---

## Visual Flow

### Admin Dashboard Layout

```
┌─────────────────────────────────────────────────────────────┐
│ 🟠 DEMO WORKSPACE MODE  [Go to Live Workspace]            │
└─────────────────────────────────────────────────────────────┘

┌──────────────────┬──────────────────────────────────────────┐
│                  │                                          │
│  Sidebar         │  Main Content                            │
│  ┌────────────┐  │  ┌──────────────────────────────────┐   │
│  │ FieldCost  │  │  │ 💡 Demo Mode: Changes are safe  │   │
│  │ Admin CMS  │  │  │ for testing                      │   │
│  │            │  │  └──────────────────────────────────┘   │
│  │ ┌────────┐ │  │                                          │
│  │ │Company │ │  │  [KPI Cards]                            │
│  │ │ Demo   │◄────  [Stats]                              │
│  │ │ (DEMO) │ │  │                                          │
│  │ │────────│ │  │  [Action Cards]                         │
│  │ │ Live-1 │ │  │  [System Health]                        │
│  │ │ Live-2 │ │  │                                          │
│  │ └────────┘ │  │                                          │
│  │            │  │                                          │
│  │ [Nav Items]│  │                                          │
│  │            │  │                                          │
│  └────────────┘  │                                          │
└──────────────────┴──────────────────────────────────────────┘
```

---

## User Permissions in Demo

### What Works in Demo
- ✅ Create/edit subscription plans
- ✅ Manage company subscriptions
- ✅ Create/send/pay invoices
- ✅ Manage payment methods
- ✅ View all analytics
- ✅ Create admin users
- ✅ View audit logs
- ✅ Configure settings

### Demo Data Isolation
- 🔐 Demo company has separate data
- 🔐 Changes don't affect live companies
- 🔐 Real invoices not accessible in demo
- 🔐 Demo users can't access live data

---

## Code Examples

### Using Demo Detection
```typescript
const { activeCompanyId } = useCompanySwitcher();
const isDemo = isDemoCompany(activeCompanyId);

if (isDemo) {
  console.log("In demo workspace - safe to test");
}
```

### Showing Demo Warning
```tsx
{isDemo && (
  <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
    <p className="text-sm text-orange-800">
      💡 <strong>Demo Mode:</strong> Changes are for testing only.
    </p>
  </div>
)}
```

### Switching Companies
```tsx
const { switchCompany, companies } = useCompanySwitcher();

function goToLive() {
  const liveCompany = companies.find((c) => !isDemoCompany(c.id));
  if (liveCompany) {
    switchCompany(liveCompany.id);
  }
}
```

---

## Testing Scenarios

### Scenario 1: Explore Demo
1. Navigate to `/admin`
2. See demo banner at top
3. Demo company selected in switcher
4. Create a test plan
5. Create test subscription
6. Generate test invoice
7. All changes are isolated in demo

### Scenario 2: Switch to Live
1. Click company switcher
2. Select "Live Company"
3. Page reloads with live context
4. See live subscriptions/invoices
5. Demo banner disappears
6. All data is real data

### Scenario 3: Test Upgrade
1. In demo mode
2. Click on subscription
3. Click "Upgrade" button
4. Choose higher tier
5. Confirm (demo message shown)
6. See change reflected immediately
7. Return to demo list - see update
8. Switch to live - live data unchanged

---

## Best Practices

### For Developers
1. **Always check `isDemoCompany()`** before showing warnings
2. **Include company_id in all queries** when filtering
3. **Show clear demo messages** to users
4. **Never hide demo mode** - transparency is key
5. **Log demo actions** for audit purposes

### For Admins
1. **Always check the banner** before making changes
2. **Use demo workspace to test** new plans
3. **Understand company scope** - subscriptions belong to companies
4. **Be careful with upgrades** - they're permanent
5. **Review audit logs** to track all changes

---

## Troubleshooting

### Issue: Demo banner not showing
**Check**: Is `isDemoCompany()` returning true?
**Fix**: Verify company_id matches DEMO_COMPANY_ID in constants

### Issue: Company switcher not appearing
**Check**: Is `useCompanySwitcher()` hook imported?
**Fix**: Import from `@/lib/useCompanySwitcher`

### Issue: Data from wrong company shows
**Check**: Are API queries including company_id filter?
**Fix**: Add `company_id` parameter to fetch URL

### Issue: Stats not updating after switch
**Check**: Is page reloading after switch?
**Fix**: Verify `onSwitchSuccess` calls `window.location.reload()`

---

## FAQ

**Q: Can I accidentally modify live data while in demo?**
A: No. Demo and live companies have completely separate data.

**Q: What if I forget I'm in demo mode?**
A: The banner reminds you at the top of every page.

**Q: Can I test different plans in demo?**
A: Yes! Create test plans in demo, test upgrades/downgrades safely.

**Q: Are demo changes permanent?**
A: Yes, but only for the demo company. Live data is never affected.

**Q: How do I delete demo data?**
A: Use admin APIs to delete subscriptions/invoices from demo company.

---

## Integration Checklist

- [x] Main dashboard has demo banner
- [x] Main dashboard has company switcher
- [x] Plans page shows demo warnings
- [x] Subscriptions page shows demo warnings
- [x] Billing page shows demo warnings
- [x] All pages respect active company scope
- [x] Audit logs track demo vs live
- [x] Analytics filter by company
- [x] Payment methods scoped to company
- [x] Admin users can only see demo notice

---

**Version**: 1.0.0
**Last Updated**: 2026-03-15
**Status**: Production Ready ✅
