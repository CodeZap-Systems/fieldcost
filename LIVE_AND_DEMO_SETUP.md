# Live Company + Demo Sandbox Setup ✅

**Status**: Fixed - Users now have automatic real company creation + optional demo sandbox

---

## What Changed

### Problem (User Was Seeing)
- ❌ "No workspaces available" after login
- ❌ dingani@codezap.co.za had empty companies list
- ❌ Registration didn't create any company profile

### Solution Implemented ✅

#### 1. **Auto-Create Company on First Login**
When a real user logs in for the first time:
- System checks if they have any companies in database
- If none exist → **automatically creates "My Company"** for them
- User can immediately add data to their real company
- This happens transparently on login

**File**: `/app/api/company/route.ts` (GET endpoint)

#### 2. **Allow Both Live + Demo Companies**
Users can now have:
- **Real Company** (auto-created) - For live data & production use
- **Demo Workspace** (optional) - For testing/sandbox

Both companies can coexist:
- Real data stays in "My Company" (saved permanently)
- Demo data can be used for testing (auto-cleaned every 30 days)
- User can switch between them in workspace selector

#### 3. **30-Day Demo Data Auto-Cleanup**
Demo data is automatically removed if older than 30 days:
- Affects only demo user accounts (DEMO_ADMIN_USER_ID, DEMO_SUBCONTRACTOR_USER_ID)
- Real user data is never touched
- Can be triggered manually or scheduled as cron job

**File**: `/app/api/demo/cleanup/route.ts`

---

## How to Use

### For Real Users (dingani@codezap.co.za)

1. **First Login**: 
   - Auto creates "My Company" workspace
   - Ready to start adding projects, customers, invoices

2. **Add Real Data**:
   ```
   Create projects → Add customers → Create invoices
   All data persists in Supabase permanently
   ```

3. **Optional: Add Demo Sandbox**:
   - Use demo company for testing (if available)
   - Test features without affecting real data
   - Demo data auto-deleted every 30 days

### For Demo Users

1. **Demo Login**:
   - Gets demo company with sample data automatically
   - Can add/modify demo data for testing
   - Data auto-cleaned every 30 days

---

## Technical Details

### Auto-Company Creation

**Location**: `/app/api/company/route.ts` (lines ~95-115)

```typescript
// If user has no companies in database
if (!list.length && !isDemo) {
  const defaultCompany = normalizeProfile({
    id: randomUUID(),
    user_id: userId,
    name: "My Company",
    email: null,
    invoice_template: "standard",
    default_currency: "ZAR",
  }, userId);
  
  // Insert into database
  const created = await supabaseServer
    .from("company_profiles")
    .insert([defaultCompany])
    .select();
  
  // Return to user
  return created;
}
```

**When It Runs**:
- Every GET /api/company request from a user with no companies
- Only for real users (not demo users)
- Happens transparently during app load

### Demo Data Cleanup

**Location**: `/app/api/demo/cleanup/route.ts`

```typescript
GET /api/demo/cleanup  // Triggers cleanup
POST /api/demo/cleanup // Alternative trigger
```

**What It Does**:
```typescript
// Find all demo records older than 30 days
thirtyDaysAgo = now - 30 days

// Delete from all tables
DELETE FROM invoices WHERE user_id IN (demo_ids) AND created_at < thirtyDaysAgo
DELETE FROM items WHERE user_id IN (demo_ids) AND created_at < thirtyDaysAgo
DELETE FROM tasks WHERE user_id IN (demo_ids) AND created_at < thirtyDaysAgo
DELETE FROM projects WHERE user_id IN (demo_ids) AND created_at < thirtyDaysAgo
DELETE FROM customers WHERE user_id IN (demo_ids) AND created_at < thirtyDaysAgo
```

### Company List Behavior

**For Real Users**:
1. Query database company_profiles table
2. If empty → auto-create "My Company"
3. Show "My Company" as primary option
4. Show demo company (if exists) as optional sandbox
5. Default to "My Company"

**For Demo Users**:
1. Query database company_profiles table
2. Show all companies (including demo)
3. Demo data gets cleaned every 30 days

---

## Testing the Fix

### Test 1: New User Registration
```bash
# 1. Go to https://fieldcost.vercel.app
# 2. Register new account: testuser@example.com
# 3. After login:
   ✅ Should see "My Company" (auto-created)
   ✅ Workspace selector should NOT be empty
   ✅ Can add projects/customers/invoices immediately
```

### Test 2: Existing User (dingani@codezap.co.za)
```bash
# 1. Go to https://fieldcost.vercel.app
# 2. Login with existing credentials
# 3. After login:
   ✅ Should see "My Company" (auto-created)
   ✅ Can add real data
   ✅ No "No workspaces available" message
```

### Test 3: Demo Data Cleanup
```bash
# Manual trigger:
curl -X GET https://fieldcost.vercel.app/api/demo/cleanup

# Response:
{
  "success": true,
  "message": "Successfully cleaned X demo records older than 30 days",
  "cleaned": 15,
  "cutoffDate": "2025-02-10T00:00:00Z",
  "timestamp": "2026-03-11T10:30:00Z"
}
```

### Test 4: Switch Between Companies
```bash
# 1. Login as real user
# 2. Should see workspace selector with options:
   - "My Company" (real company)
   - "Demo Workspace" (if demo account exists)
# 3. Click to switch between them
# 4. Data changes based on selected company
```

---

## Data Flow

```
User Registration
    ↓
Sign-up in Supabase Auth
    ↓
Redirect to Dashboard
    ↓
Dashboard loads /api/company
    ↓
API checks: Does user have companies?
    ├─ YES → Return them
    └─ NO (real user) → Create "My Company" → Return it
         (demo user) → Return empty
    ↓
User can now see workspace selector with their company
    ↓
User can add projects/customers/invoices
    ↓
(Optional) User adds demo company for sandbox
    ↓
Demo data runs cleanup every 30 days
    ↓
Real company data persists indefinitely
```

---

## API Endpoints

### Get Companies
```bash
GET /api/company
# Returns: { company: CompanyProfile, companies: CompanyProfile[] }
# If no companies exist (real user): 
#   - Auto-creates "My Company"
#   - Returns the auto-created company
```

### Create New Company
```bash
PUT /api/company
{
  "name": "Project Dev Client",
  "email": "dev@project.co.za",
  "phone": "+27-11-123-4567",
  ...
}
# Creates additional company (user can have multiple)
```

### Switch Company
```bash
POST /api/company/switch
{ "companyId": "<uuid>" }
# Stores active company in localStorage
```

### Cleanup Demo Data
```bash
GET /api/demo/cleanup
# or
POST /api/demo/cleanup
# Returns count of cleaned records
```

---

## Configuration

### Demo Users (see userIdentity.ts)
```typescript
export const DEMO_ADMIN_USER_ID = "11111111-1111-1111-1111-111111111111"
export const DEMO_SUBCONTRACTOR_USER_ID = "22222222-2222-2222-2222-222222222222"
```

### Demo Company ID (see demoConstants.ts)
```typescript
export const DEMO_COMPANY_ID = "demo-company-id"
```

### Cleanup Schedule
```typescript
// Currently: Manual or on-demand
// To schedule: Add to cron jobs or serverless function
// Recommended: Daily cleanup at 2 AM
```

---

## File Changes Summary

**Modified Files**:
- ✅ `/app/api/company/route.ts` - Auto-create company on first load
- ✅ `/lib/useCompanySwitcher.ts` - Allow both live + demo companies

**New Files**:
- ✅ `/app/api/demo/cleanup/route.ts` - 30-day demo data cleanup

---

## Expected Behavior After Fix

### Real User Login (dingani@codezap.co.za)
```
1. Login → ✅
2. Dashboard loads → ✅
3. Workspace selector shows "My Company" → ✅
4. Can add projects → ✅
5. Can add customers → ✅
6. Can add invoices → ✅
7. All data persists → ✅
8. Optional: Can see demo company if invited → ✅
```

### Demo User Login
```
1. Login → ✅
2. Dashboard loads → ✅
3. See demo sample data → ✅
4. Can add test data → ✅
5. Data deleted after 30 days → ✅
```

---

## Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| Still showing "No workspaces" | Company creation failed | Check Supabase table exists |
| Can't see auto-created company | Cache issue | Refresh page (Ctrl+F5) |
| Demo data not cleaning | Cleanup not running | Manually call `/api/demo/cleanup` |
| Two "My Company" entries | Duplicate creation | Rare - contact support |

---

## Next Steps

1. ✅ Commit these changes
2. ✅ Deploy to production
3. ✅ Test with real user (dingani@codezap.co.za)
4. ⏳ Set up cleanup scheduling (optional, can run manually for now)
5. ⏳ Monitor for any issues

---

## Summary

✅ **Real users now have:**
- Automatic "My Company" workspace on first login
- Ability to add real data immediately
- Optional demo sandbox for testing
- Real data persists permanently

✅ **Demo users have:**
- Demo workspace with sample data
- Ability to test and experiment
- Data auto-cleaned every 30 days
- Fresh data on each 30-day cycle

✅ **Both can coexist:**
- Real data separate from demo
- User can switch between them
- Different retention policies
- No data mixing
