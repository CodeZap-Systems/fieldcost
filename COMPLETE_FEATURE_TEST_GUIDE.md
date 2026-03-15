# Complete Feature Testing Guide - FieldCost Tier 2 + Billing

## Overview
This guide covers testing all new FieldCost features with integrated Paystack & PayFast billing, including demo data, test scenarios, and verification steps.

---

## 1. BILLING & SUBSCRIPTION FEATURES

### 1.1 Trial Button During Signup ✅

**Feature:** 14-day free trial without credit card requirement

**Test Steps:**
1. Navigate to `/auth/register`
2. Fill in signup form
3. See plan selector with 3 options (Starter, Professional, Enterprise)
4. Click "Start 14-Day Trial" on any plan
5. Verify trial starts without payment

**Expected Result:**
- Trial activated for 14 days
- Access granted to all features in selected plan
- No payment charged
- Can upgrade to paid plan anytime

**Test Data:**
```
Email: test@fieldcost.io
Password: SecurePass123!
First Name: John
Last Name: Doe
Company: FieldCost Tests
```

### 1.2 Paystack Payment Integration 🔵

**Feature:** Primary payment processor (Nigeria & international)

**Test Steps:**
1. During signup, click "Subscribe Now" instead of trial
2. Select Paystack as payment method
3. Paystack modal appears
4. Use test card: `4111 1111 1111 1111` | `12/30` | `123`
5. Complete payment

**Expected Result:**
- Payment processed
- Invoice created for subscription
- Subscription activated
- User redirected to dashboard

**Environment:**
- Uses `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY`
- Amount in Kobo (multiply by 100)
- Webhook: `/api/webhooks/paystack`

### 1.3 PayFast Fallback Payment 🟢

**Feature:** South African payment fallback (primary for ZAR)

**Test Steps:**
1. During signup, click "Subscribe Now"
2. Select PayFast as payment method
3. Redirected to PayFast (sandbox or live)
4. Complete test payment

**Expected Result:**
- Fallback works if Paystack unavailable
- ZAR amounts processed correctly
- Webhook verified: `/api/webhooks/payfast`
- Subscription created

**Environment:**
- Uses `PAYFAST_MERCHANT_ID`, `PAYFAST_MERCHANT_KEY`
- Sandbox URL: `https://sandbox.payfast.co.za`
- Production: `https://api.payfast.co.za`

---

## 2. QUOTE LIFECYCLE → INVOICE CONVERSION

### 2.1 Quote Full Lifecycle

**Feature:** Create quote → Send to customer → Get acceptance → Convert to invoice

**Test Steps:**

**Step 1: Create Quote**
```bash
POST /api/quotes
{
  "company_id": 8,
  "customer_id": 1,
  "project_id": 1,
  "description": "Web Development Services",
  "valid_until": "2026-04-15",
  "line_items": [
    {
      "name": "Frontend Development",
      "quantity": 40,
      "unit": "hrs",
      "rate": 150
    },
    {
      "name": "Backend Development",
      "quantity": 30,
      "unit": "hrs",
      "rate": 175
    }
  ]
}
```

**Expected Result:**
- Quote created with status: `draft`
- Line items calculated
- Total amount: R12,250

**Step 2: Send Quote**
```bash
POST /api/quotes/{id}/send
{
  "company_id": 8
}
```

**Expected Result:**
- Status changes to `sent`
- `sent_at` timestamp recorded
- Customer email record updated
- Notification sent to customer

**Step 3: Accept Quote** (Customer action)
```bash
PATCH /api/quotes/{id}
{
  "status": "accepted",
  "company_id": 8
}
```

**Expected Result:**
- Status changes to `accepted`
- `accepted_on` timestamp recorded
- Now eligible for invoice conversion

### 2.2 Convert Quote to Invoice

**Feature:** One-click conversion from accepted quote to invoice

**Test Steps:**
```bash
POST /api/quotes/convert
{
  "quoteId": 1,
  "companyId": 8
}
```

**Expected Result:**
- New invoice created
- All line items copied to invoice
- Invoice date: today
- Due date: 30 days from today
- Quote status: `invoiced`
- Invoice status: `draft`

**Verification:**
```bash
GET /api/invoices?company_id=8
```

Should return the newly created invoice with all quote line items.

---

## 3. DOCUMENT MANAGEMENT & PROJECT LINKING

### 3.1 Document Upload

**Feature:** Upload documents and link to projects

**Test Steps:**
```bash
POST /api/documents
{
  "action": "upload",
  "fileName": "architectural-plans.pdf",
  "fileUrl": "https://example.com/plans.pdf",
  "fileType": "application/pdf",
  "documentType": "blueprint",
  "projectId": 1,
  "companyId": 8
}
```

**Expected Result:**
- Document created with status: `pending_verification`
- Document stored in database
- Associated with project

### 3.2 Link Document to Project

**Feature:** Link existing documents to projects

**Test Steps:**
```bash
POST /api/documents
{
  "action": "link-to-project",
  "documentId": 1,
  "projectId": 1,
  "companyId": 8
}
```

**Expected Result:**
- Document linked to project
- Visible in project documents tab

### 3.3 Document Verification

**Feature:** Mark documents as verified

**Test Steps:**
```bash
POST /api/documents
{
  "action": "verify",
  "documentId": 1,
  "companyId": 8
}
```

**Expected Result:**
- Document status: `verified`
- `verified_at`: current timestamp
- `verified_by`: current user ID

### 3.4 View Project Documents

**Feature:** Retrieve all documents linked to project

**Test Steps:**
```bash
GET /api/documents?project_id=1&company_id=8
```

**Expected Result:**
- Returns array of all project documents
- Shows verification status
- Shows upload timestamp
- Shows file URLs

---

## 4. TASK ASSIGNMENT & NOTIFICATIONS

### 4.1 Assign Task

**Feature:** Assign task to team member and trigger notification

**Test Steps:**
```bash
PATCH /api/tasks/{id}
{
  "assigned_to": "user-uuid-123",
  "status": "assigned",
  "company_id": 8
}
```

**Expected Result:**
- Task assigned to user
- Notification created for assignee
- Email sent (if preferences enabled)

### 4.2 Task Notification Triggers

**Feature:** Notification appears for assignee

**Test Steps:**
1. Assign task to another user
2. Check `/api/notifications?user_id={assignee_id}`
3. Verify notification type: `task_assigned`

**Notification Details:**
```json
{
  "type": "task_assigned",
  "title": "New Task Assigned",
  "message": "You have been assigned to: Fix water leaks",
  "related_entity_type": "task",
  "related_entity_id": 5
}
```

**Expected Result:**
- Notification appears within 2 seconds
- In-app badge counts increase
- Browser notification (if enabled)
- Email (if preference enabled)

### 4.3 View Notifications

**Feature:** Retrieve all notifications for user

**Test Steps:**
```bash
GET /api/notifications?user_id={user_id}&company_id=8
```

**Expected Result:**
```json
{
  "success": true,
  "notifications": [
    {
      "id": 1,
      "type": "task_assigned",
      "title": "New Task Assigned",
      "is_read": false,
      "created_at": "2026-03-15T10:30:00Z"
    }
  ],
  "unreadCount": 1
}
```

### 4.4 Mark Notification as Read

**Feature:** Mark notification as read

**Test Steps:**
```bash
POST /api/notifications
{
  "action": "mark-read",
  "notificationId": 1
}
```

**Expected Result:**
- `is_read`: true
- Unread count decreases

---

## 5. INVOICE PAST-DUE NOTIFICATIONS

### 5.1 Check Past-Due Invoices

**Feature:** Automatically detect past-due invoices and notify

**Test Steps:**

**Setup:**
1. Create invoice with due date: yesterday
2. Status: `unpaid`
3. Run detection:

```bash
POST /api/notifications
{
  "action": "check-past-due-invoices",
  "companyId": 8
}
```

**Expected Result:**
```json
{
  "success": true,
  "pastDueInvoicesCount": 1,
  "notificationsCreated": 1
}
```

### 5.2 Verify Past-Due Notification Content

**Feature:** Notification shows days overdue

**Test Steps:**
1. Create invoice due 5 days ago
2. Run check
3. Retrieve notifications:

```bash
GET /api/notifications?user_id={user_id}&company_id=8
```

**Expected Result:**
```json
{
  "type": "invoice_overdue",
  "title": "Invoice Past Due",
  "message": "Invoice #INV-001 is now 5 days overdue",
  "metadata": {
    "daysOverdue": 5,
    "amount": 12250
  }
}
```

---

## 6. NOTIFICATION PREFERENCES

### 6.1 Update Preferences

**Feature:** Persist notification preferences across sessions

**Test Steps:**
```bash
POST /api/notifications
{
  "action": "update-preferences",
  "companyId": 8,
  "preferences": {
    "email_on_task_assignment": true,
    "email_on_invoice_due": true,
    "email_on_quote_accepted": true,
    "in_app_notifications": true,
    "browser_notifications": false
  }
}
```

**Expected Result:**
- Preferences saved to database
- User-specific, company-scoped
- Retained on logout/login

### 6.2 Retrieve Preferences

**Feature:** Get user notification preferences

**Test Steps:**
```bash
POST /api/notifications
{
  "action": "get-preferences",
  "companyId": 8
}
```

**Expected Result:**
```json
{
  "success": true,
  "preferences": {
    "email_on_task_assignment": true,
    "email_on_invoice_due": true,
    "email_on_quote_accepted": true,
    "in_app_notifications": true,
    "browser_notifications": false
  }
}
```

### 6.3 Preference Persistence

**Feature:** Preferences persist across sessions

**Test Steps:**
1. Set preferences (as above)
2. Logout
3. Login with same user
4. Retrieve preferences
5. Verify they're identical

**Expected Result:**
- Preferences remain unchanged
- Stored in `notification_preferences` table
- Keyed by user_id + company_id

---

## 7. END-TO-END TEST SCENARIO

### Complete Workflow

**Timeline:** ~30 minutes

**Step 1: Signup with Trial (2 min)**
- Register with Starter plan
- Start 14-day trial
- Verify access granted

**Step 2: Create Company & Project (3 min)**
- Create test company
- Create test project
- Add customers

**Step 3: Create Quote Workflow (5 min)**
- Create quote with 3 line items
- Send to customer
- Accept quote
- Convert to invoice
- Verify invoice created

**Step 4: Upload & Link Documents (3 min)**
- Upload architectural plans PDF
- Upload project photos
- Verify on project tab
- Verify documents

**Step 5: Task Assignment (3 min)**
- Create task
- Assign to team member
- Verify notification received
- Mark as read

**Step 6: Check Notifications (3 min)**
- View all notifications
- Check past-due invoice notification
- Update preferences
- Verify persistence

**Step 7: Upgrade to Paid (3 min)**
- Initiate upgrade to Professional
- Select Paystack
- Complete test payment
- Verify subscription updated

---

## 8. ENVIRONMENT VARIABLES NEEDED

```bash
# Paystack
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_xxxxx
PAYSTACK_SECRET_KEY=sk_test_xxxxx

# PayFast
PAYFAST_MERCHANT_ID=xxxxx
PAYFAST_MERCHANT_KEY=xxxxx
PAYFAST_PASS_PHRASE=xxxxx

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

---

## 9. TEST DATA SUMMARY

**Demo Company:** FieldCost Tests (ID: 8)
**Demo Customers:**
- Acme Construction (ID: 1)
- BuildMaster (ID: 2)
- Urban Development (ID: 3)

**Demo Projects:**
- Sandton Mall (ID: 1)
- Waterfront Office (ID: 2)
- Residential Estate (ID: 3)

**Demo Users:**
- Admin: admin@fieldcost.test
- User: user@fieldcost.test

---

## 10. SUCCESS CHECKLIST

- [ ] Trial signup works without payment
- [ ] Paystack payment processes successfully
- [ ] PayFast payment fallback works
- [ ] Quote → Invoice conversion complete
- [ ] Documents upload & link to projects
- [ ] Documents appear on project tab
- [ ] Task assignment sends notification
- [ ] Notifications persist across sessions
- [ ] Invoice past-due notifications trigger
- [ ] Notification preferences save & persist
- [ ] All API responses have correct status codes
- [ ] All timestamps recorded correctly
- [ ] Multi-tenant isolation maintained
- [ ] UI displays all new features clearly
- [ ] Performance is acceptable

---

## 11. PERFORMANCE TARGETS

| Operation | Target Time |
|-----------|------------|
| Create Quote | <500ms |
| Convert to Invoice | <300ms |
| Upload Document | <1s |
| Link Document | <200ms |
| Send Notification | <100ms |
| Check Past-Due | <2s |
| Get Notifications | <300ms |
| Update Preferences | <200ms |

---

## Contact

For questions or issues during testing, contact the development team.

Happy testing! 🚀
