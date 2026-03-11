# CRITICAL BUG FIX: Demo Data Appearing for Real Users

**Issue**: User `dingani@codezap.co.za` (real live credentials) logs in but sees demo data instead of their company "Test Company Co"

**Root Cause**: The demo-company-id is being returned in the companies list for real users, or the active company is incorrectly being set to demo.

**User Report**:
- Username: `dingani@codezap.co.za`
- Password: `Test1234`
- Expected: Company "Test Company Co" (real live data)
- Actual: Seeing demo data (demo-company-id)

---

## Quick Diagnosis

The issue is likely in ONE of these flows:

### Flow 1: API returning demo company for all users
- `/api/company` route is somehow including demo-company-id in the response for ALL users
- FIX: Check company_profiles table - should NOT have "demo-company-id" for real users

### Flow 2: localStorage persisting demo company
- Previous demo session stored "demo-company-id" in localStorage
- New real-user login doesn't clear this
- FIX: Clear localStorage when logging out, or prefer Supabase company_profiles over localStorage

### Flow 3: Company switcher defaulting to demo
- When companies list is loaded, activeCompanyId defaults to demo-company-id
- Instead of picking the real company first
- FIX: Ensure real companies are prioritized over demo in the switcher logic

---

## What Needs to Happen

### Immediate Fix Priority:

1. **Verify Supabase data** - Check if company_profiles table has "demo-company-id" for this user
   ```sql
   SELECT * FROM company_profiles WHERE user_id = (SELECT id FROM auth.users WHERE email = 'dingani@codezap.co.za');
   ```
   - If this returns demo-company-id, DELETE those rows
   - The table should only have the real company "Test Company Co"

2. **Clear localStorage** - Browser developer tools:
   ```javascript
   localStorage.clear()
   // Or specifically:
   localStorage.removeItem('activeCompanyId');
   localStorage.removeItem('company-profiles.json');
   ```

3. **Close and re-login** - Force a complete re-authentication:
   - Close all tabs with fieldcost open
   - Clear ALL browser cache and cookies
   - Log back in to fieldcost
   - Should now see "Test Company Co" not demo data

### Code Fixes (if after above, still seeing demo):

**Fix 1: Prevent demo company in real user list**

In `/lib/useCompanySwitcher.ts`, when loading companies:
```typescript
const filtered = normalized.filter(c => !isDemoCompany(c.id));
if (!filtered.length) {
  // No real companies, fallback to demo if allowed
  setCompanies(normalized);
} else {
  // Real companies exist, don't show demo
  setCompanies(filtered);
}
```

**Fix 2: Prioritize non-demo companies**

In `/app/api/company/route.ts`:
```typescript
const realCompanies = normalized.filter(p => p.id !== DEMO_COMPANY_ID);
const active = realCompanies.length > 0 
  ? realCompanies[0] 
  : normalized[0] ?? null;
```

**Fix 3: Clear demo from stored profiles when real profiles exist**

```typescript
if (normalized.length > 0 && normalized.some(p => p.id !== DEMO_COMPANY_ID)) {
  // Real companies exist, remove demo from storage
  const noDemo = stored.filter(p => p.id !== DEMO_COMPANY_ID);
  await replaceStoredCompanyProfiles(userId, noDemo, noDemo[0]?.id || null);
}
```

---

## Prevention Rules Going Forward

1. **Never seed demo-company-id to company_profiles table** for real users
2. **Always check isDemoCompany before including in companies list** for real users
3. **localStorage should only persist user-selected companies**, not auto-include demo
4. **On logout, clear all stored demo references**
5. **Test both flows**: Demo users = should see demo, Real users = should NEVER see demo

---

## Testing After Fix

```bash
# 1. Login with real credentials
Username: dingani@codezap.co.za
Password: Test1234

# 2. Should see:
✅ "Test Company Co" (real company)  
✅ No demo data
✅ No "Demo Workspace" banner

# 3. Login with demo credentials
Username: demo@fieldcost.local
Password: (demo password)

# 4. Should see:
✅ "Demo Company" or "Demo Workspace"
✅ Sample/demo data
✅ "Demo Workspace" banner
✅ Orange badge

# 5. When switching back to real:
✅ Demo data gone
✅ Real data restored
✅ Banner removed
```

---

## Related Build Error Also Fixed

While investigating, found TypeScript error in `/app/api/invoices/push-to-erp/route.ts`:
- **Error**: `contactId` doesn't exist in `XeroInvoicePayload`
- **Fix**: Changed to `customerId` (the correct property name)
- **Status**: ✅ Fixed and committed

---

## Files to Check

- `/app/api/company/route.ts` - How companies are loaded
- `/lib/useCompanySwitcher.ts` - How companies are displayed
- `/lib/companySwitcher.ts` - How active company is stored
- `/data/company-profiles.json` - What's stored locally
- Supabase `company_profiles` table - What's in production database

---

## Next Steps

1. Execute the quick fix (clear localStorage, re-login)
2. If still seeing demo, run the SQL diagnostic above
3. If demo-company-id is in database, delete those rows
4. If still persisting, apply the code fixes
5. Test both login flows to confirm separation

---

**Status**: Build error fixed ✓, Demo data issue identified ⏳  
**Priority**: HIGH - affects real user login experience
**Deadline**: Before client sign-off
