# Data Isolation by CompanyID Implementation Guide

**Date**: March 12, 2026  
**Status**: ✅ Navigation & Auth Refactored | ⏳ Data Isolation In Progress

---

## Overview

FieldCost now uses **data isolation by CompanyID** to ensure:
- **Live Companies**: Only show data created by the user or pulled from ERP
- **Demo Companies**: Show pre-populated demo/mock data only
- **Complete Separation**: Each company is fully isolated with its own data scope

---

## Recent Changes Implemented

### 1. ✅ Navigation Redesign (Sage Accounting Style)
**File**: `app/components/SageNav.tsx` (NEW)
- Left-aligned collapsible sidebar (like Sage 50/Sage Intacct)
- Icons for quick navigation
- Active company selector with demo badge
- Responsive icon-only mode when collapsed
- Clear logout and session management
- Conditional menu visibility based on auth state

### 2. ✅ Auth Session Improvements
**Files Modified**:
- `app/auth/login/page.tsx` - Enhanced with session checking and error messages
- `app/auth/register/page.tsx` - Improved validation and session management
- `app/auth/demo-login.tsx` - Redesigned with role selection and info panel

**Key Improvements**:
- Checks existing session on page load
- User-friendly error messages (specific about what went wrong)
- Session error alerts separated from form errors
- Password confirmation validation
- Auto-redirect if already logged in
- Demo/Live account separation in UI

### 3. ✅ Layout Update
**File**: `app/layout.tsx`
- Replaced `AppNav` with new `SageNav`
- Cleaner sidebar-based layout
- Better space utilization

### 4. ✅ Demo Login Experience
**Enhanced Demo Page** (`app/auth/demo-login.tsx`):
- Role-based demo selection (Admin vs Field Crew)
- Clear documentation of what's included
- Demo vs Real account comparison
- Link to real account sign-in
- Manages `demoSession` and `demoUserId` in localStorage

---

## Data Isolation Architecture (Required Implementation)

### Key Principle
**Every API request must be scoped to a CompanyID**

```typescript
// All API routes must:
1. Get user's activeCompanyId from request
2. Verify user owns this company
3. Filter all queries by companyId
4. Return only company-scoped data
```

### CompanyID Scoping Pattern

```typescript
// Example: GET /api/projects
export async function GET(request: NextRequest) {
  // 1. Get user
  const userId = await resolveServerUserId();
  
  // 2. Get active company from query params or user session
  const { searchParams } = new URL(request.url);
  const companyId = searchParams.get('company_id');
  
  // 3. Validate ownership and get company context
  const { companyId: validCompanyId } = await getCompanyContext(userId, companyId);
  
  // 4. Query with company filter
  const { data } = await supabaseServer
    .from('projects')
    .select('*')
    .eq('company_id', validCompanyId); // ← CRITICAL: Filter by company_id
  
  return NextResponse.json(data);
}
```

---

## API Routes Requiring CompanyID Updates

### Priority 1 (Critical)
These routes MUST filter by company_id:

- [ ] `GET /api/projects` - List projects
- [ ] `POST /api/projects` - Create project
- [ ] `GET /api/invoices` - List invoices
- [ ] `POST /api/invoices` - Create invoice
- [ ] `GET /api/tasks` - List tasks
- [ ] `POST /api/tasks` - Create task
- [ ] `GET /api/customers` - List customers
- [ ] `POST /api/customers` - Create customer
- [ ] `GET /api/inventory` - List items
- [ ] `POST /api/inventory` - Create item

### Priority 2 (Important)
These routes should scope data:

- [ ] `GET /api/reports` - Project reports
- [ ] `GET /api/invoices/overdue` - Overdue invoices report
- [ ] `GET /api/crew` - Crew members
- [ ] `GET /api/budgets` - Project budgets
- [ ] `GET /api/company` - Current company details

### Priority 3 (Nice-to-Have)
- [ ] `GET /api/admin/*` - Admin routes
- [ ] `GET /api/integrations` - ERP integrations

---

## Demo vs Live Company Separation

### Demo Company Setup
```typescript
// In /api/company or during signup:
const demoCompany = {
  id: "demo-001", // or similar identifier
  name: "Demo Company",
  is_demo: true,  // ← Flag indicates this is demo
  user_id: demoUserId,
};

// Demo data characteristics:
- is_demo = true flag on company
- Created by seed scripts, not real users
- Populated with realistic sample data
- Changes not preserved between sessions
```

### Live Company Setup
```typescript
const liveCompany = {
  id: generatedUUID,
  name: "User's Real Company",
  is_demo: false,  // ← Real company
  user_id: realUserId,
  erp_integration: "sage50|xero|none",
};

// Live data characteristics:
- is_demo = false
- Created by user registration
- Contains real business data
- All changes persisted
- Can connect to ERP systems
```

### Data Filtering by Demo Status

```typescript
// Show demo data only if user viewing demo company
export async function getDemoData(companyId: string) {
  const { data } = await supabaseServer
    .from('companies')
    .select('is_demo')
    .eq('id', companyId)
    .single();
  
  return data?.is_demo === true;
}

// In API routes:
const usesDemoData = await getDemoData(companyId);
// If usesDemoData, show mock data
// If !usesDemoData, show only user-created/ERP data
```

---

## Client-Side Implementation

### Company Switching
```typescript
// In navigation / company switcher:
const handleCompanySelect = (companyId: string) => {
  persistActiveCompanyId(companyId); // Save selection
  
  // Next.js automatic revalidation
  router.refresh(); // Revalidates server components
};

// All API calls include company in params:
fetch(`/api/projects?company_id=${activeCompanyId}`)
```

### Demo Session Detection
```typescript
// In layout or root component:
const isDemoSession = localStorage.getItem('demoSession') === 'true';
const demoUserId = localStorage.getItem('demoUserId');

// Use this to:
1. Show demo badge in navigation
2. Set default demo company on page load
3. Prevent navigation to real company features
4. Clear demo data before real login
```

---

## Environment Variables Check

Ensure these are set on Vercel:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://...supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
NEXT_PUBLIC_API_URL=https://fieldcost.vercel.app
NODE_ENV=production
```

---

## Testing Checklist

### Session & Auth
- [ ] Login with real account → sees real company data
- [ ] Logout → clears demo flags
- [ ] Invalid credentials → specific error message
- [ ] Expired session → relogin prompt

### Demo Data
- [ ] Click "Try Demo" → loads demo company
- [ ] Demo account shows demo badge in nav
- [ ] Switch to real company → different data appears
- [ ] Demo data is mock (clearly labeled)

### Company Isolation
- [ ] User A's projects ≠ User B's projects
- [ ] Company A's invoices visible ≠ Company B's
- [ ] Switching companies changes all data
- [ ] Each company has own "Active Company" selection

### Navigation
- [ ] Sidebar collapses on icon click
- [ ] Settings reflect current company
- [ ] Logout button works
- [ ] Demo links visible only when not logged in

---

## Deployment Checklist

Before redeploying to Vercel:

### Code Changes
- [ ] All API routes have company_id filtering
- [ ] Demo company is properly flagged in DB
- [ ] Company switching updates client state
- [ ] Session checks happen on auth pages

### Database
- [ ] All tables have `company_id` column
- [ ] Add indexes on `(company_id, user_id)` for performance
- [ ] Demo company exists with is_demo=true

### Testing
- [ ] Full test suite passes (18/18 E2E tests)
- [ ] Demo login works
- [ ] Real login works
- [ ] Company switching works
- [ ] Data isolation verified

---

## Next Steps

### Immediate (Next 2 hours)
1. ✅ Create SageNav component
2. ✅ Update auth pages
3. ⏳ Add company_id filtering to all API routes
4. ⏳ Test demo vs real company separation

### Short-term (Thursday)
1. Demo rehearsal with new nav
2. Full Vercel deployment test
3. Client feedback on Sage-style interface

### Pre-Sign-Off (Friday)
1. Print materials with updated feature list
2. Final systems check
3. Production database backup

---

## Key Files Summary

| File | Purpose | Status |
|------|---------|--------|
| `app/components/SageNav.tsx` | Left sidebar navigation | ✅ Done |
| `app/auth/login/page.tsx` | Login with session checks | ✅ Done |
| `app/auth/register/page.tsx` | Registration with validation | ✅ Done |
| `app/auth/demo-login.tsx` | Demo user selection | ✅ Done |
| `app/layout.tsx` | Use new SageNav | ✅ Done |
| `lib/companyContext.ts` | Company scoping helper | ✅ Exists |
| `api/*/route.ts` | All API routes | ⏳ Need filtering |
| `lib/demoConstants.ts` | Demo company detection | ✅ Exists |

---

## Success Criteria

**After implementation, verify:**
1. ✅ All tests pass (E2E: 18/18)
2. ✅ Sage-style navigation shows
3. ✅ Demo login works with sample data
4. ✅ Real login shows real company data only
5. ✅ Company switching changes all visible data
6. ✅ No cross-company data leakage
7. ✅ Vercel deployment runs without errors
8. ✅ Client sees professional Sage Accounting UI

---

**Ready for Saturday Sign-Off? 🎯 YES - Navigation ✅, Auth ✅ | Pending - Data filters ⏳**
