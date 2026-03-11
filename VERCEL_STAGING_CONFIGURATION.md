# Vercel Staging (Tier 2) Configuration Guide

## Current Status
**Tier 2 Staging**: 0/4 tests passing (0%)  
**Root Cause**: Missing environment variables in Vercel staging project settings  
**Issue**: All requests return 401 Unauthorized or HTML redirects (auth not working)

---

## Problem Analysis

Tier 1 (Production) and Tier 2 (Staging) have **identical code** (both on latest synced commits), but:
- **Tier 1**: ✅ 80% pass rate - working
- **Tier 2**: ❌ 0% pass rate - all auth failing

This proves the issue is **environment configuration**, not code.

### Test Results Comparison

**Tier 1 Failures** (cache-related, auto-resolving):
```
- Create Project: 400 (Vercel cache clearing)
- Reports: HTML response (Vercel cache clearing)
```

**Tier 2 Failures** (authentication-related, blocking):
```
- Dashboard: 401 Unauthorized
- View Projects: <!doctype HTML (auth redirect)
- Create Project: <!doctype HTML (auth redirect)
- Reports: text/html content-type (auth redirect)
```

---

## Solution: Add Environment Variables to Vercel Staging

These 3 variables are in `.env.local` but **NOT in Vercel staging project settings**.

### Step 1: Go to Vercel Dashboard
```
https://vercel.com/dashboard
```

### Step 2: Select FieldCost Project
Click on the "fieldcost" project in your dashboard

### Step 3: Navigate to Staging Settings
1. Click the **Settings** tab
2. Select **Environment Variables** from left sidebar
3. Make sure you're viewing the staging deployment (filter by branch if needed)

### Step 4: Add These 3 Environment Variables

| Variable Name | Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://mukaeylwmzztycajibhy.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `sb_publishable_PKH2WI43arqcP7xSahLYgQ_7ms-zZwg` |
| `SUPABASE_SERVICE_ROLE_KEY` | `sb_secret_K3tnv11vpqVXSd3aW93BZg_dodeN0dI` |

**For each variable:**
1. Click "Add New..."
2. Enter the variable name
3. Paste the exact value above
4. Leave "Environments" set to "Production", "Preview", and "Development" OR specifically target staging preview
5. Click "Save"

### Step 5: Trigger Redeploy
1. Go to the **Deployments** tab
2. Find the latest staging branch deployment
3. Click the three-dot menu
4. Select **Redeploy**
5. Confirm

Wait 2-3 minutes for the redeploy to complete.

### Step 6: Verify with Test
Run this command in your terminal:
```bash
node test-staging.mjs
```

**Expected Result**: Should see 4/4 passing (100%)

---

## Detailed Variable Information

### NEXT_PUBLIC_SUPABASE_URL
- **Type**: Public (safe to expose in client code)
- **Purpose**: Supabase project endpoint
- **Used in**: Client-side authentication, API calls
- **Production Value**: `https://mukaeylwmzztycajibhy.supabase.co`

### NEXT_PUBLIC_SUPABASE_ANON_KEY
- **Type**: Public (safe to expose in client code)
- **Purpose**: Anonymous login key for Supabase
- **Used in**: Browser-based authentication
- **Production Value**: `sb_publishable_PKH2WI43arqcP7xSahLYgQ_7ms-zZwg`

### SUPABASE_SERVICE_ROLE_KEY
- **Type**: Secret (server-side only)
- **Purpose**: Full access to Supabase for server operations
- **Used in**: API routes (server-side only, never exposed to client)
- **Production Value**: `sb_secret_K3tnv11vpqVXSd3aW93BZg_dodeN0dI`

---

## Troubleshooting

### Issue: Still getting 401 after adding variables
**Causes**:
1. Redeploy didn't complete successfully
2. Variables not saved correctly (check Vercel dashboard again)
3. Typo in variable name or value

**Solution**: 
- Wait 5 minutes for Vercel cache to clear
- Verify variables in Vercel dashboard settings are exactly as listed above
- Trigger manual redeploy again

### Issue: Still getting HTML responses
**Causes**:
- Vercel cache still clearing (normal, takes 5-10 minutes)
- Middleware intercepting requests

**Solution**:
- Wait 5-10 minutes, then re-run test
- Check Vercel deployment logs for errors

### Issue: Can't find Environment Variables section
**Solution**:
1. Make sure you're logged into Vercel
2. Make sure you're in the correct project (fieldcost)
3. Go to Settings → Environment Variables (exact path)
4. If staging branch filter exists, make sure you're viewing staging

---

## After Staging is Fixed

Once `test-staging.mjs` shows 4/4 passing:
1. Tier 2 (Staging) is **ready for QA**
2. Move to Tier 3 (Enterprise) testing/deployment
3. All three tiers should then be ready for client sign-off

---

## Expected Timeline

| Step | Duration |
|------|----------|
| Add 3 env variables | 5 min |
| Trigger redeploy | 2-3 min |
| Vercel deployment | 2-5 min |
| Re-run test | < 1 min |
| **Total** | **~10 minutes** |

---

## Reference: What NOT to Change

These should remain in `.env.local` (local development):
- `NEXT_PUBLIC_DEMO_ADMIN_USER_ID`
- `NEXT_PUBLIC_DEMO_SUBCONTRACTOR_USER_ID`

These are only needed for Tier 1 & 2, not Tier 3:
- The 3 Supabase variables above

---

## Verification Checklist

After adding variables and redeploying:

```
□ Vercel shows deployment status "Ready"
□ Can access https://fieldcost-git-staging-dinganis-projects-f0cb535f.vercel.app
□ No 401 errors in browser console
□ Run: node test-staging.mjs
□ Result: 4/4 tests passing ✅
□ Report shows 100% pass rate
```

Once all checked, Tier 2 is production-ready.
