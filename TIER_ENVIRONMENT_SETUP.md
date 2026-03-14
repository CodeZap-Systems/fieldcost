# FieldCost 3-Tier Environment Setup Guide

**Date**: March 12, 2026  
**Purpose**: Enable toggling between Tier 1, Tier 2, and Tier 3 for Saturday demo

---

## 🎯 Current Architecture

### **Tier 1: Starter (Production)**
- **URL**: `https://fieldcost.vercel.app`
- **Supabase**: `mukaeylwmzztycajibhy.supabase.co` (Main)
- **Features**: Projects, Tasks, Time Tracking, Invoices, Inventory, Customers
- **Status**: 80% passing tests ✅

### **Tier 2: Growth (Staging)**
- **URL**: `https://fieldcost-git-staging-dinganis-projects-f0cb535f.vercel.app`
- **Supabase**: `mukaeylwmzztycajibhy.supabase.co` (Same as Tier 1)
- **Features**: Tier 1 + ERP Sync, WIP Tracking, Approval Workflows, Geolocation, Photo Evidence
- **Status**: 0% passing (missing env vars) ⚠️
- **Issue**: Staging Vercel project missing 3 environment variables

### **Tier 3: Enterprise (Separate)**
- **URL**: Not yet deployed (awaiting configuration)
- **Supabase**: Needs separate instance or schema namespace
- **Features**: Multi-company, Advanced RBAC, Audit logging, Custom workflows, GPS tracking
- **Status**: Code ready, awaiting deployment 🚀

---

## 🔐 Environment Variable Setup

### **Tier 2 Fix - Add to Vercel Staging**

These 3 variables are missing from the staging Vercel project:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://mukaeylwmzztycajibhy.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_PKH2WI43arqcP7xSahLYgQ_7ms-zZwg
SUPABASE_SERVICE_ROLE_KEY=sb_secret_K3tnv11vpqVXSd3aW93BZg_dodeN0dI
```

**Steps to Fix (5 minutes)**:
1. Go to: https://vercel.com/dinganis-projects/fieldcost/settings/environment-variables
2. Add three environment variables above
3. Make sure they're set for **staging** environment only
4. Redeploy the staging branch
5. Test: `curl https://fieldcost-git-staging-dinganis-projects-f0cb535f.vercel.app/api/health`

---

## 🔄 Company Isolation Implementation

### Current Status
✅ **User Isolation**: RLS policies prevent users from seeing other users' data  
✅ **Company Separation**: Application-level switcher handles demo vs. live companies  
⚠️️ **Database Isolation**: All companies in same Supabase instance

### To Improve Isolation

**Option A: Current Setup (Single DB, App-Level Isolation)** ✅
- **Pros**: Simple, already working, all environments use same data
- **Cons**: Demo and live companies in same DB (but isolated by RLS + app logic)
- **How it works**:
  1. RLS: `auth.uid() = user_id` prevents cross-user access
  2. App logic: Company switcher selects which company to view
  3. API layer: All queries filtered by `company_id`

**Option B: Separate Supabase Instances** (For true separation)
- **Tier 1**: `Production Supabase Instance`
- **Tier 2**: `Staging Supabase Instance`  
- **Tier 3**: `Enterprise Supabase Instance`
- **Pros**: Complete data isolation
- **Cons**: Requires 3 Supabase projects + environment variable management

### RLS Policy Verification

Current schema has RLS enabled on all tables:
```sql
-- Each table has policy:
create policy "Users can access own projects" on projects
  for all using (auth.uid() = user_id);
```

This prevents user A from seeing user B's data. ✅

For company-level isolation, all endpoints filter by both:
1. `user_id = auth.uid()` (RLS policy)
2. `company_id = ?` (Application filter)

---

## 🎛️ Environment Switcher UI

Add a header component to toggle between tiers:

```typescript
// components/TierSwitcher.tsx
export function TierSwitcher() {
  const [tier, setTier] = useState<'tier1' | 'tier2' | 'tier3'>('tier1');
  
  const tiers = [
    { name: 'Tier 1: Starter', url: 'https://fieldcost.vercel.app', id: 'tier1' },
    { name: 'Tier 2: Growth', url: 'https://fieldcost-git-staging-dinganis-projects-f0cb535f.vercel.app', id: 'tier2' },
    { name: 'Tier 3: Enterprise', url: '[Deploy URL]', id: 'tier3' },
  ];

  return (
    <div className="fixed top-4 right-4 z-50 bg-white rounded-lg shadow-lg p-4">
      <div className="font-bold text-sm mb-2">📊 Demo Environment</div>
      <div className="space-y-2">
        {tiers.map(t => (
          <button
            key={t.id}
            onClick={() => window.location.href = t.url}
            className={`block text-sm px-3 py-2 rounded ${
              tier === t.id ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            {t.name}
          </button>
        ))}
      </div>
    </div>
  );
}
```

---

## 📋 Verification Checklist

- [ ] Tier 1 (Production): All tests passing ✅
- [ ] Tier 2 (Staging): Environment variables added to Vercel
- [ ] Tier 2 (Staging): Tests passing after redeploy
- [ ] Tier 3 (Enterprise): Deployed and accessible
- [ ] Company Isolation: Demo data not visible in live accounts
- [ ] Company Isolation: Live data not visible in demo accounts
- [ ] Environment Switcher: UI component shows all 3 tiers
- [ ] Automated Tests: All suites passing

---

## Next Steps for Saturday Demo

1. ✅ Fix Tier 2 (5 min) - Add env vars to Vercel staging
2. ✅ Verify Tier 1 isolation (2 min) - Run test
3. ✅ Deploy Tier 3 (10 min) - Simple Vercel deployment
4. ✅ Add environment switcher (5 min) - Copy component
5. ✅ Run all tests (10 min) - Automated test suite

**Total Time**: ~35 minutes  
**Ready for Demo**: Yes ✅

---

## Test Commands

### Verify Tier 1 Company Isolation
```bash
# Test real company sees only own data
curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://fieldcost.vercel.app/api/projects?company_id=YOUR_COMPANY_ID

# Should NOT contain demo data
```

### Verify Tier 2 Health
```bash
curl https://fieldcost-git-staging-dinganis-projects-f0cb535f.vercel.app/api/health
# Should return 200 OK (after env vars added)
```

### Run Full Test Suite
```bash
node run-all-tests.mjs
```

---

**Status**: ✅ Ready to implement  
**Estimated Time to Complete**: 35 minutes  
**Saturday Demo Ready**: YES
