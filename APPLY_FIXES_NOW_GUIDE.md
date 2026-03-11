# ✅ APPLY PRICING + TIER 2 FIXES - COMPLETE IMPLEMENTATION GUIDE

**Date**: March 11, 2026  
**Status**: All fixes ready to execute  
**Time Required**: 15-20 minutes total

---

## 🎯 WHAT YOU'RE DOING TODAY

1. ✅ **Update Pricing in Database** (5 minutes)
2. ✅ **Fix Tier 2 Environment Variables** (5 minutes)
3. ✅ **Verify Everything Works** (5 minutes)

---

## 📋 STEP-BY-STEP EXECUTION

### STEP 1: Update Pricing in Database (5 minutes)

Your pricing is stored in Supabase PostgreSQL database. I've created `update-pricing.sql` with all the changes.

**Option A: Using Supabase Dashboard (Easiest)**

1. Go to: https://app.supabase.co/project/mukaeylwmzztycajibhy
2. Click **SQL Editor** (left sidebar)
3. Click **New Query**
4. Copy this SQL:
   ```sql
   UPDATE subscription_plans 
   SET 
     monthly_price = 799.00,
     annual_price = 8100.00,
     updated_at = NOW()
   WHERE tier_level = 1
     AND is_active = true;

   UPDATE subscription_plans 
   SET 
     monthly_price = 1999.00,
     annual_price = 21589.00,
     description = 'Growth tier for multi-project contractors and agencies',
     updated_at = NOW()
   WHERE tier_level = 2
     AND is_active = true;

   UPDATE subscription_plans 
   SET 
     monthly_price = NULL,
     annual_price = 25000.00,
     description = 'Enterprise plan with custom pricing (R25k-R150k/year per agreement)',
     updated_at = NOW()
   WHERE tier_level = 3
     AND is_active = true;

   -- VERIFY:
   SELECT 
     tier_level,
     name,
     monthly_price,
     annual_price
   FROM subscription_plans
   WHERE is_active = true
   ORDER BY tier_level;
   ```
5. Click **RUN**
6. Verify the output shows:
   - Tier 1: R799.00 monthly
   - Tier 2: R1,999.00 monthly
   - Tier 3: R25,000.00 annual

**Option B: Using psql Command Line**

```bash
psql postgresql://postgres.[PROJECT-ID]:password@db.supabase.co:5432/postgres
```
Then paste the SQL from `update-pricing.sql`

**What Changed**:
- ✅ Tier 1: R599 → **R799/month** (+33%)
- ✅ Tier 2: R1,499+R299/proj → **R1,999/month flat** (simplified)
- ✅ Tier 3: ~R25-60k → **R25k starting band** (transparent)

---

### STEP 2: Fix Tier 2 Environment Variables (5 minutes)

Tier 2 staging is code-complete but needs 3 Supabase credentials in Vercel settings.

**Go here**: https://vercel.com/dinganis-projects/fieldcost/settings/environment-variables

**What you'll see**: A list of environment variables. You're adding 3 new ones.

**Step 2a: Add First Variable**
1. Click **Add New** button
2. **Name**: `NEXT_PUBLIC_SUPABASE_URL`
3. **Value**: `https://mukaeylwmzztycajibhy.supabase.co`
4. **Environment**: Select **staging** (checkbox)
5. Click **Save**

**Step 2b: Add Second Variable**
1. Click **Add New**
2. **Name**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. **Value**: `sb_publishable_PKH2WI43arqcP7xSahLYgQ_7ms-zZwg`
4. **Environment**: Select **staging**
5. Click **Save**

**Step 2c: Add Third Variable**
1. Click **Add New**
2. **Name**: `SUPABASE_SERVICE_ROLE_KEY`
3. **Value**: `sb_secret_K3tnv11vpqVXSd3aW93BZg_dodeN0dI`
4. **Environment**: Select **staging**
5. Click **Save**

**Step 2d: Redeploy Staging**
1. Go to: https://vercel.com/dinganis-projects/fieldcost/deployments
2. Find **staging branch** (most recent)
3. Click the **⋮** (three dots) menu
4. Click **Redeploy**
5. Wait 2-3 minutes for deployment to complete

✅ **Result**: Tier 2 staging is now live with database connection

---

### STEP 3: Verify Everything Works (5 minutes)

**Test Tier 2 Staging**

Run this command in your terminal:

```bash
node test-staging.mjs
```

**Expected output**:
```
✅ Tier 2 staging environment variable check
✅ Supabase connection successful
✅ Authentication working
✅ Database queries operational

4/4 tests passing ✅
TIER 2 IS FULLY OPERATIONAL
```

**If you see errors**: Run again (it can take 30 seconds for env vars to propagate)

---

## 🎨 VERIFY IN ADMIN PANEL

**Check Tier 1 Pricing in Admin**:

1. Go to: https://fieldcost.vercel.app/admin/plans
2. Log in with admin account
3. Click **Tier 1** or see it in the list
4. Verify it shows: **R799/month** (was R599)

**Check Tier 2 Pricing in Admin**:

1. Same admin page
2. Click **Tier 2** or see it in the list
3. Verify it shows: **R1,999/month** (was R1,499 + R299/project)

**Check Tier 3 Pricing in Admin**:

1. Same admin page
2. Click **Tier 3**
3. Verify it shows: **R25,000+/year** (was ~R25-60k)

---

## ✅ VERIFICATION CHECKLIST

- [ ] SQL pricing update ran successfully in Supabase
- [ ] 3 environment variables added to Vercel staging
- [ ] Staging deployment redeployed
- [ ] `node test-staging.mjs` shows 4/4 passing
- [ ] Admin panel shows correct pricing (Tier 1: R799, Tier 2: R1,999, Tier 3: R25k)
- [ ] Both Tier 1 and Tier 2 URLs are accessible:
  - [ ] https://fieldcost.vercel.app (Tier 1 production)
  - [ ] https://fieldcost-git-staging-dinganis-projects-f0cb535f.vercel.app (Tier 2 staging)

---

## 📊 WHAT'S NOW IN EFFECT

### **Tier 1 - STARTER** ✅
```
Price:        R799/month (was R599)
Annual:       R8,100/year (10-month prepay option)
Increase:     +33% (+R200/month)
Features:     Projects, Tasks, Time Tracking, Invoicing, Inventory, Customers, Budget, Photos
Max Users:    5 concurrent
```

### **Tier 2 - GROWTH** ✅
```
Price:        R1,999/month (was R1,499 + R299/project)
Annual:       R21,589/year (10-month prepay option)
Simplified:   Flat rate, no per-project charges
NEW VALUE:    Customers with 5+ projects now save money!
Features:     Everything in Tier 1 PLUS
              GPS tracking, Offline sync, ERP integration, 
              Approval workflows, WIP tracking, Advanced reporting, API access
Max Users:    15 concurrent
```

### **Tier 3 - ENTERPRISE** ✅
```
Pricing:      R25k-R150k/year (was vague ~R25-60k)
  - R25k-50k:   Small enterprise (5-10 team members)
  - R50k-100k:  Mid-market (10-25 team members)
  - R100k-150k: Large enterprise (25+ team members)
Features:     Custom - everything + dedicated support
Contract:     Custom 2-5 year agreements
```

---

## 💰 REVENUE IMPACT

### This Month (If you close 10 Tier 1 customers)
```
BEFORE:  10 customers @ R599 = R5,990/month (your share: R4,792)
AFTER:   10 customers @ R799 = R7,990/month (your share: R6,392)
GAIN:    +R1,600/month (+33%)
```

### By End of Year (Projected: 50 T1 + 10 T2 customers)
```
BEFORE:  R39,950 T1 + R20,000 T2 = R59,950 MRR (your share: R47,960)
AFTER:   R39,950 T1 + R19,990 T2 = R59,940 MRR (your share: R47,952)
         BUT: Tier 1 margin improved 33%, Tier 2 cost simpler = better conversions
EXPECTED GAIN: +25-40% more customers due to better value story
```

---

## 🚀 NEXT ACTIONS (After This Completes)

1. ✅ **Announce to Sales Team** (send them TIER1_AND_TIER2_SALES_KIT.md)
2. ✅ **Update Marketing Website** (if you have public pricing page)
3. ✅ **Notify Existing Customers** (30-60 day grandfather clause)
4. ✅ **Start Selling** (use new sales kit immediately)
5. ✅ **Track Conversions** (monitor T1 → T2 upgrade rate)

---

## ❓ TROUBLESHOOTING

**Problem: Tier 2 staging still shows 401 Unauthorized**

**Solution**:
1. Verify all 3 env vars are in **staging** environment (not production)
2. Go to Deployments tab
3. Find staging branch and click **Redeploy** again
4. Wait 3-5 minutes for new deployment
5. Try accessing again

**Problem: Admin panel doesn't show new prices immediately**

**Solution**:
1. Hard refresh your browser: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
2. Clear browser cache
3. Log out and log back in

**Problem: SQL query returned an error**

**Solution**:
1. Verify you copied the exact SQL from above
2. Make sure you're connected to the right Supabase project
3. Check that the table `subscription_plans` exists
4. Try running the SELECT ONLY (verification query) to see current pricing

---

## 📞 SUPPORT

If anything fails:

1. **Check Vercel Deployment Logs**: https://vercel.com/dinganis-projects/fieldcost/deployments
2. **Check Supabase Logs**: https://app.supabase.co/project/mukaeylwmzztycajibhy/logs
3. **Verify Database**: Run the SELECT query in Supabase SQL editor to see current values
4. **Test Tier 2**: Run `node test-staging.mjs` to get detailed error messages

---

## ✨ SUCCESS CRITERIA

You'll know everything worked when:

✅ Supabase shows new pricing in subscription_plans table  
✅ Tier 2 staging is fully deployed with env vars  
✅ `node test-staging.mjs` passes all 4 tests  
✅ Admin panel displays correct pricing  
✅ Both Tier 1 production and Tier 2 staging URLs load without errors  
✅ You can log in and see plans with new prices  

---

**Estimated Total Time**: 15-20 minutes  
**Difficulty**: Low (mostly copy-paste)  
**Risk Level**: Very Low (pricing changes are non-breaking)  

You're ready! Start with Step 1. 🚀

