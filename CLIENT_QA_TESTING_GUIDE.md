# 👥 CLIENT QA TESTING GUIDE - TIER 2

**Environment**: Vercel  
**Tier**: 2 (Growth) - Full ERP Integration  
**Test Duration**: ~2 hours  
**Success Criteria**: 79.49% feature pass rate minimum

---

## 🎯 TESTING OBJECTIVES

You're testing FieldCost Tier 2, which adds these features to our MVP:

✅ **ERP Integration** (Sage X3/Xero sync)  
✅ **Work In Progress Tracking** (WIP - earned value analysis)  
✅ **Approval Workflows** (Change orders, approvals)  
✅ **Geolocation Tracking** (GPS recording with legal validation)  
✅ **Offline Sync** (Mobile app data bundling)  

All **Tier 1 features still work** (Projects, Tasks, Invoices, Photos)

---

## 🔑 LOGIN CREDENTIALS

```
Email:    qa-test@fieldcost.demo
Password: [provided in separate email]
Company:  Demo Company (all features enabled)
```

⚠️ Keep these secure. Don't share in public channels.

---

## 📋 TESTING CHECKLIST

### SECTION 1: TIER 1 BASELINE (Should all work)

#### Projects ✓

```
Test: Create a project
1. Click Dashboard → Projects → New Project
2. Fill in:
   - Name: "QA Test Project - [Your Initials]"
   - Description: "Testing Tier 2 features"
   - Budget: R50,000
   - Currency: ZAR
3. Click Create

Expected: Project appears in list
Result: ☐ Pass ☐ Fail ☐ Partial
Notes: ____________________________
```

#### Tasks ✓

```
Test: Create a task in the project
1. Go to Projects → [Your Project]
2. Click "+ New Task"
3. Fill in:
   - Title: "Test Task - QA"
   - Description: "Testing task creation"
   - Assigned to: [Your Name]
   - Status: Active
   - Priority: High
4. Click Create

Expected: Task appears in project
Result: ☐ Pass ☐ Fail ☐ Partial
Notes: ____________________________
```

#### Invoices ✓

```
Test: Create and export an invoice
1. Go to Invoices → New Invoice
2. Fill in:
   - Project: [Your Project]
   - Customer: [Select or create]
   - Amount: R25,000
   - Due Date: [30 days from now]
   - Items: [Add any line items - optional]
3. Click Create
4. Click "Export to PDF" or "Export to CSV"

Expected: Invoice created and exported
Result: ☐ Pass ☐ Fail ☐ Partial
File downloaded: ☐ PDF ☐ CSV ☐ Both
Notes: ____________________________
```

#### Photos ✓

```
Test: Upload a photo to a task
1. Go to [Your Task] → Photos
2. Click "Upload Photo" or drag-drop
3. Select any image from your computer
4. Add caption: "QA Test Photo"
5. Click Upload

Expected: Photo appears with metadata
Result: ☐ Pass ☐ Fail ☐ Partial
Notes: ____________________________
```

---

### SECTION 2: TIER 2 WIP TRACKING ⭐

**What is WIP?** Work In Progress tracking compares earned value vs actual cost.

```
Test: Create WIP Snapshot
1. Go to [Your Project] → WIP Tracking
2. Click "Record WIP Status"
3. Fill in:
   - Physical Progress: 45% (drag slider)
   - Earned Value: R22,500 (45% × R50,000)
   - Actual Cost: R20,000 (what you've actually spent)
   - Forecasted Completion: [Pick a date]
4. Click Save

Expected: Snapshot saved and shows in history
Result: ☐ Pass ☐ Fail ☐ Partial
Notes: ____________________________
```

```
Test: View WIP Analysis
1. Go to [Your Project] → WIP Dashboard
2. Should show:
   - Earned Value: R22,500
   - Actual Cost: R20,000
   - CPI (Cost Performance): 1.125 (good!)
   - SPI (Schedule Performance): 0.9 (slightly behind)
3. Look at the chart showing trends

Expected: Dashboard shows metrics and trends
Result: ☐ Pass ☐ Fail ☐ Partial
Notes: ____________________________
```

---

### SECTION 3: TIER 2 APPROVAL WORKFLOWS ⭐

**What are Workflows?** Automatic approvals for change orders, budget changes, etc.

```
Test: Create an Approval Workflow
1. Go to Settings → Workflows → New Workflow
2. Fill in:
   - Name: "Budget Change Approval"
   - Triggers: "Budget variance > 10%"
   - Approvers: [Select team member]
   - Auto-escalate after: 7 days
3. Click Create

Expected: Workflow created and active
Result: ☐ Pass ☐ Fail ☐ Partial
Notes: ____________________________
```

```
Test: Trigger a Workflow
1. Go to [Your Project] → Budget
2. Change the budget from R50,000 to R60,000 (20% increase)
3. Click "Save Budget Change"

Expected: Workflow triggers + approval request sent
Result: ☐ Pass ☐ Fail ☐ Partial
Approval request: ☐ Received ☐ Not received
Notes: ____________________________
```

---

### SECTION 4: TIER 2 GEOLOCATION TRACKING ⭐

**What is Geolocation?** Records where work happens with legal-grade GPS accuracy.

**Note**: This works best on mobile. If mobile not available, desktop will still record coordinates.

```
Test: Record a Location
1. Go to [Your Task] → Geolocation
2. Click "Record Location"
3. On mobile: Allow location permission
   On desktop: It will use your current IP location
4. System records:
   - Latitude / Longitude
   - Accuracy (±5-10m on mobile)
   - Altitude
   - Timestamp

Expected: Location recorded with timestamp
Result: ☐ Pass ☐ Fail ☐ Partial
Accuracy shown: _______m
Notes: ____________________________
```

```
Test: Validate Geofence
1. Go to [Your Task] → Geolocation → Boundaries
2. On map, draw a site boundary (polygon)
3. System shows:
   - Current location (blue dot)
   - Site boundary (red polygon)
   - Distance from boundary
4. Move (or simulate movement):
   - Inside boundary: ✅ Green
   - Outside boundary: ❌ Red

Expected: Real-time boundary validation
Result: ☐ Pass ☐ Fail ☐ Partial
Accuracy: ☐ Excellent ☐ Good ☐ Poor
Notes: ____________________________
```

---

### SECTION 5: TIER 2 OFFLINE SYNC ⭐

**What is Offline Sync?** Mobile devices sync data when connection returns.

```
Test: Create Offline Data Bundle
1. Go to Settings → Offline Sync
2. Click "Create Offline Bundle"
3. Select what to sync:
   ☑ All Tasks
   ☑ All Invoices
   ☑ All Projects
   ☑ Photos
4. Size shown: _____ MB
5. Click "Generate Bundle"

Expected: Bundle created, ready for mobile download
Result: ☐ Pass ☐ Fail ☐ Partial
Bundle size: _____ MB
Notes: ____________________________
```

```
Test: Check Sync Status
1. Go to Settings → Offline Sync → Sync Log
2. Should show:
   - Last sync time
   - Items synced
   - Failed items (if any)
   - Next sync scheduled

Expected: Sync log shows history
Result: ☐ Pass ☐ Fail ☐ Partial
Notes: ____________________________
```

---

### SECTION 6: TIER 2 ERP INTEGRATION ⭐

**What is ERP Sync?** Automatically syncs invoices to Sage X3 or Xero.

```
Test: Check ERP Integration Status
1. Go to Settings → ERP Integration
2. Should show:
   - Connected to: [Sage X3 / Xero]
   - Last sync: [timestamp]
   - Status: ✅ Connected
   - Next sync: [time]

Expected: Connection active
Result: ☐ Pass ☐ Fail ☐ Partial
Connected to: _________________
Notes: ____________________________
```

```
Test: Sync Invoice to ERP
1. Go to Invoices → [Your Invoice]
2. Click "Sync to Sage X3"
3. Expected: Confirmation dialog
   "Invoice will be synced to Sage X3"
4. Click Confirm
5. System shows:
   - Sync in progress...
   - ✅ Sync complete

Expected: Invoice synced to ERP
Result: ☐ Pass ☐ Fail ☐ Partial
Notes: ____________________________
```

```
Test: Verify Invoice in ERP
On desktop/another browser, log into Sage X3:
1. Navigate to Accounts Receivable
2. Find the synced invoice
3. Confirm details match:
   - Amount
   - Customer
   - Date
   - Line items

Expected: Invoice matches in ERP
Result: ☐ Pass ☐ Fail ☐ Partial
Notes: ____________________________
```

---

### SECTION 7: PERFORMANCE & GENERAL

```
Test: Page Load Times
1. Open Dashboard
2. Note load time: _____ seconds
3. Open Projects
4. Note load time: _____ seconds
5. Open Invoices
6. Note load time: _____ seconds

Expected: All pages load < 2 seconds
Result: ☐ Pass (all < 2s) ☐ Partial (some > 2s) ☐ Fail
Notes: ____________________________
```

```
Test: Mobile Responsiveness
1. Open on mobile phone or resize browser to mobile width
2. Check if:
   ☑ Layout adjusts properly
   ☑ Buttons are tappable (not too small)
   ☑ Text is readable
   ☑ No horizontal scrolling
   ☑ Forms are easy to fill

Expected: Full mobile functionality
Result: ☐ Pass ☐ Partial ☐ Fail
Notes: ____________________________
```

```
Test: Error Handling
1. Try to create an invoice with invalid data:
   - Leave required fields blank
   - Enter non-numeric amount
   - Select invalid date
2. System should show:
   - Clear error message
   - Highlight which field is wrong
   - Suggestion to fix

Expected: Helpful error messages
Result: ☐ Pass ☐ Fail ☐ Partial
Notes: ____________________________
```

---

## 📊 RESULTS SUMMARY

### Feature Completion

| Feature | Pass | Fail | Notes |
|---------|------|------|-------|
| **TIER 1** | | | |
| Projects | ☐ | ☐ | |
| Tasks | ☐ | ☐ | |
| Invoices | ☐ | ☐ | |
| Photos | ☐ | ☐ | |
| **TIER 2** | | | |
| WIP Tracking | ☐ | ☐ | |
| Workflows | ☐ | ☐ | |
| Geolocation | ☐ | ☐ | |
| Offline Sync | ☐ | ☐ | |
| ERP Integration | ☐ | ☐ | |
| **GENERAL** | | | |
| Performance | ☐ | ☐ | |
| Mobile | ☐ | ☐ | |
| Errors | ☐ | ☐ | |

### Overall Assessment

**Total tests**: _____ / 18

**Pass rate**: _____% 

**Recommendation**: 
- ☐ Ready for production
- ☐ Ready with minor fixes
- ☐ Needs more work

---

## 🐛 REPORTING ISSUES

When you find a bug, please provide:

```
ISSUE REPORT TEMPLATE
====================

Title: [Short description]

TYPE: ☐ Bug ☐ Missing Feature ☐ Performance ☐ UI/UX

Severity: ☐ Critical ☐ High ☐ Medium ☐ Low

Description:
[What were you trying to do?]

Steps to reproduce:
1. [First step]
2. [Second step]
3. [What happened?]

Expected behavior:
[What should have happened?]

Actual behavior:
[What actually happened?]

Screenshots:
[Attach images if helpful]

Browser/Device:
[Chrome? Safari? Mobile?]

Timestamp:
[When did this happen?]
```

### Submit Issues To:
📧 qa-feedback@fieldcost.demo

---

## ✅ SIGN-OFF

As a QA tester, I confirm:

```
☐ I tested all sections above
☐ I recorded pass/fail for each test
☐ I tested on the specified browser/device
☐ I reported all issues with clear descriptions
☐ I completed testing on [DATE]:  _______
☐ Overall pass rate: ________%

Tested by: ______________________
Title: ______________________
Date: ______________________
```

---

## 🎉 THANK YOU!

Your testing helps us deliver a better product. 

**Expected timeline**: 
- Issues reported: 48 hours for acknowledgment
- Critical fixes: 24 hours
- Non-critical fixes: With next release

**Any questions?** Reply to this email or call [support number]

---

**Happy testing!** 🚀

FieldCost Team  
Tier 2 QA Testing Program  
March 2026
