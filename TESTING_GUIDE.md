# 🧪 FINAL TESTING GUIDE - Live Company + Demo Sandbox

**Status**: All fixes deployed locally - Ready for testing  
**Dev Server**: Running at http://localhost:3000  
**Time to Test**: 5 minutes

---

## 🎯 What You Should See After Login

### Before (Broken) ❌
```
Login Page
    ↓
Click "Sign In"
    ↓
Dashboard loads
    ↓
Workspace selector dropdown shows: "No workspaces available"
    ↓
Error 🔴 Can't add any data
```

### After (Fixed) ✅
```
Login Page
    ↓
Click "Sign In" with dingani@codezap.co.za / Test1234
    ↓
Dashboard loads
    ↓
Workspace selector shows: "My Company" (auto-created!)
    ↓
Success 🟢 Can add projects/customers/invoices
```

---

## ✅ Step-by-Step Test

### Step 1: Open the Application
```
Browser should already be open at:
http://localhost:3000

If not, open it now in your browser.
```

### Step 2: Login with Real User Credentials
```
Email: dingani@codezap.co.za
Password: Test1234

Click "Sign In" button
```

### Step 3: Check Workspace Selector
After login, look at the top-left of the dashboard:

```
Before Fix:
┌─────────────────┐
│   WORKSPACE    │
│  ┌───────────┐ │
│  │ No        │ │
│  │ workspaces│ │
│  │ available │ │
│  └───────────┘ │
└─────────────────┘

After Fix:
┌─────────────────────┐
│    WORKSPACE        │
│  ┌───────────────┐  │
│  │ Select ...    │  │ ← Click to see dropdown
│  │ ↑             │  │
│  │ My Company    │  │ ← Your auto-created company
│  └───────────────┘  │
└─────────────────────┘
```

**Expected**: See "My Company" or dropdown with company name

### Step 4: Try Adding a Project
```
1. Navigate to: Projects section (left sidebar)
2. Click: "Add Project" button
3. Fill: Project name (e.g., "Test Project")
4. Click: "Create" button

Expected Result: ✅ Project created successfully
```

### Step 5: Try Adding a Customer
```
1. Navigate to: Customers section
2. Click: "Add Customer" button
3. Fill: Customer name (e.g., "Test Client")
4. Click: "Create" button

Expected Result: ✅ Customer created successfully
```

### Step 6: Verify Data Persistence
```
1. Create a project and customer
2. Navigate to Dashboard
3. Then back to Projects
4. Check: Projects are still there

Expected Result: ✅ Data persists (saved to Supabase)
```

---

## 🧪 Additional Tests (Optional)

### Test: Demo Cleanup Endpoint
```
Open DevTools (F12) → Console, then paste:

fetch('/api/demo/cleanup')
  .then(r => r.json())
  .then(d => console.log('Demo cleanup:', d))

Expected Output:
{
  "success": true,
  "cleaned": 0,
  "message": "Successfully cleaned X demo records..."
}
```

### Test: Try Demo Company (If Available)
```
1. If demo company is in workspace dropdown:
   - Try switching to it
   - Should see demo sample data
   - Switch back to "My Company"
   - Real data should still be there

Expected: ✅ Can switch between real and demo
```

### Test: Browser Storage
```
Open DevTools (F12) → Storage → Application → LocalStorage

Check for:
✅ activeCompanyId = (real company UUID)
✅ company-profiles.json = (real company data)

NOT demo-company-id (which was the bug)
```

---

## ✅ Success Criteria

| Criterion | Status | Notes |
|-----------|--------|-------|
| Workspace shows company | ✅ or ❌ | Should see company name, not "No workspaces" |
| Can create projects | ✅ or ❌ | Click add project, should work |
| Can create customers | ✅ or ❌ | Click add customer, should work |
| Can create invoices | ✅ or ❌ | Click add invoice, should work |
| Data persists | ✅ or ❌ | Navigate away and back, data still there |
| No demo data showing | ✅ or ❌ | Should see real company, not demo samples |

**All 6 must be ✅ for fix to be considered successful.**

---

## 🐛 Troubleshooting

### Problem: Still See "No workspaces available"
```
Solution:
1. Hard refresh page: Ctrl+F5 (or Cmd+Shift+R on Mac)
2. Check browser console (F12) for errors
3. Check if auto-create endpoint is returning company

If still broken:
- Check /app/api/company/route.ts was deployed
- Check Supabase connection
- Check company_profiles table exists
```

### Problem: Can't Add Projects
```
Solution:
1. Make sure company is selected in dropdown
2. Try refreshing page
3. Check browser console (F12) for errors

If still broken:
- The company might not be saved to Supabase
- Check /api/company endpoint returns company
```

### Problem: See Demo Data
```
Solution:
1. Check which company is selected
2. If demo selected, switch to "My Company"
3. Demo should only show if you switch to it

If real company shows demo data:
- This would indicate a new bug
- Take screenshot and report
```

---

## 📊 What Gets Created

When a real user logs in for the first time:

**Auto-Created in Supabase `company_profiles` table**:
```
{
  id: "<random-uuid>",
  user_id: "dingani-user-uuid",
  name: "My Company",
  email: null,
  phone: null,
  address_line1: null,
  address_line2: null,
  city: null,
  province: null,
  postal_code: null,
  country: null,
  logo_url: null,
  logo_external_url: null,
  invoice_template: "standard",
  default_currency: "ZAR",
  erp_targets: [],
  updated_at: "2026-03-11T14:30:00Z"
}
```

**Auto-Stored in Browser localStorage**:
```
{
  "activeCompanyId": "<uuid>",
  "company-profiles.json": {
    "activeCompanyId": "<uuid>",
    "profiles": [{ ...company data... }]
  }
}
```

---

## 📱 Expected User Journey

```
┌─────────────────────────────────┐
│  New Real User Registration     │
└────────────────┬────────────────┘
                 │
                 ↓
        ┌─────────────────┐
        │ Sign up account │
        │ via email       │
        └────────┬────────┘
                 │
                 ↓
        ┌──────────────────┐
        │ Login for first  │
        │ time             │
        └────────┬─────────┘
                 │
        (NEW) Auto-create
        "My Company"
                 │
                 ↓
        ┌──────────────────┐
        │ Dashboard loads  │
        │ Shows company    │
        │ selector         │
        └────────┬─────────┘
                 │
                 ↓
        ┌──────────────────┐
        │ Can add projects │
        │ customers        │
        │ invoices         │
        └────────┬─────────┘
                 │
                 ↓
        ┌──────────────────┐
        │ All data saves   │
        │ to Supabase      │
        │ Persists         │
        └──────────────────┘
```

---

## 🎬 Live Testing Checklist

Before Testing:
- [ ] Dev server running at http://localhost:3000
- [ ] Browser open (check page is loading)
- [ ] Ready to login

During Testing (5 min):
- [ ] Login with dingani@codezap.co.za / Test1234
- [ ] Check workspace selector shows company (not empty)
- [ ] Create test project
- [ ] Create test customer
- [ ] Navigate away and come back (check persistence)
- [ ] Verify data is real (not demo sample data)

After Testing:
- [ ] All tests pass: ✅ FIX IS WORKING!
- [ ] Any tests fail: ⚠️ Document the issue
- [ ] Take screenshots of success
- [ ] Ready to deploy to production

---

## ✨ Summary

**What You're Testing**:
1. Auto-company creation works
2. Real users see their workspace
3. Can add data to live company
4. Data persists in Supabase
5. Demo sandbox available (optional)
6. Demo data cleanup endpoint works

**Expected Time**: 5 minutes

**Success Indicator**: After login, workspace selector shows "My Company" (not empty) and you can add projects/customers/invoices.

---

## 📞 If Something Goes Wrong

1. **Check logs**:
   - Open DevTools (F12)
   - Check Console tab for errors
   - Check Network tab to see API responses

2. **Verify server is running**:
   - Open http://localhost:3000
   - Should load the app
   - Check terminal for "Ready on" message

3. **Clear cache**:
   - Hard refresh: Ctrl+F5
   - Clear localStorage: F12 → Storage → LocalStorage → Clear All

4. **Check this file** for your specific error scenario

---

**Ready? Open http://localhost:3000 and test it now! 🚀**

(You should see "My Company" in the workspace selector after login, not "No workspaces available")
