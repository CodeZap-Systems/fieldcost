# Integration Checklist - Billing & Features

## Phase 1: Database Setup ✅ (Complete FIRST)

- [ ] Create `subscriptions` table in Supabase
- [ ] Create `documents` table in Supabase
- [ ] Create `notifications` table in Supabase
- [ ] Create `notification_preferences` table in Supabase
- [ ] Create indexes on all tables
- [ ] Verify all tables are accessible via SQL editor
- [ ] Test INSERT/SELECT on each table

## Phase 2: Environment Configuration ✅

- [ ] Create/update `.env.local` file
- [ ] Add `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` (or leave blank for later)
- [ ] Add `PAYSTACK_SECRET_KEY` (or leave blank for later)
- [ ] Add `PAYFAST_MERCHANT_ID` (or leave blank for later)
- [ ] Add `PAYFAST_MERCHANT_KEY` (or leave blank for later)
- [ ] Add `PAYFAST_PASS_PHRASE` (or leave blank for later)
- [ ] Add `NEXT_PUBLIC_APP_URL=http://localhost:3000`
- [ ] Restart dev server with `npm run dev`

## Phase 3: API Routes Verification ✅

These files were created and should exist:

- [ ] `lib/paymentProviders.ts` exists and exports interfaces
- [ ] `lib/paystackClient.ts` exists with PaystackClient class
- [ ] `lib/payfastClient.ts` exists with PayFastClient class
- [ ] `app/api/subscriptions/route.ts` exists with POST handler
- [ ] `app/api/quotes/convert/route.ts` exists with POST handler
- [ ] `app/api/documents/route.ts` exists with POST/GET handlers
- [ ] `app/api/notifications/route.ts` exists with POST/GET handlers
- [ ] Build succeeds: `npm run build`
- [ ] No TypeScript errors: `npm run type-check`

## Phase 4: Component Integration

### Integrate PlanSelector into Signup

**File:** `app/auth/register/page.tsx`

- [ ] Import PlanSelector component
- [ ] Add state for selectedPlan and planStep
- [ ] Show PlanSelector after email validation
- [ ] Disable form submission until plan selected
- [ ] Call `/api/subscriptions` with `action=start-trial` when user clicks trial
- [ ] Show loading state during API call
- [ ] Handle errors with toast notification
- [ ] Redirect to dashboard after trial activated

**Code snippet to add:**
```typescript
import PlanSelector from '@/app/components/PlanSelector';

// In component:
const [selectedPlan, setSelectedPlan] = useState<string>('professional');
const [showPlanSelector, setShowPlanSelector] = useState(false);
const [isStartingTrial, setIsStartingTrial] = useState(false);

const handleStartTrial = async (planId: string) => {
  setIsStartingTrial(true);
  try {
    const res = await fetch('/api/subscriptions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'start-trial',
        userId: user.id,
        planId,
        companyId: newCompanyId
      })
    });
    if (!res.ok) throw new Error('Failed to start trial');
    // Redirect to dashboard
  } catch (err) {
    alert(err.message);
  } finally {
    setIsStartingTrial(false);
  }
};

// In JSX:
{!showPlanSelector ? (
  // Show form...
) : (
  <PlanSelector 
    onStartTrial={handleStartTrial}
    isLoading={isStartingTrial}
  />
)}
```

## Phase 5: API Testing

### Test Subscriptions

- [ ] Test trial endpoint: `curl -X POST http://localhost:3000/api/subscriptions -d '{"action":"start-trial",...}'`
- [ ] Verify subscription created in database
- [ ] Check `trial_until` is 14 days from now
- [ ] Test get-subscription endpoint returns daysRemaining

### Test Quote Conversion

- [ ] Create a quote via API (or use existing)
- [ ] Change quote status to "accepted"
- [ ] Call `/api/quotes/convert` endpoint
- [ ] Verify invoice created with same line items
- [ ] Check quote status updated to "invoiced"

### Test Documents

- [ ] Upload document via `/api/documents` (action=upload)
- [ ] Link to project (action=link-to-project)
- [ ] Mark as verified (action=verify)
- [ ] Retrieve via GET endpoint
- [ ] Verify all metadata present

### Test Notifications

- [ ] Create notification via endpoint
- [ ] Verify appears in get-all response
- [ ] Mark as read
- [ ] Update preferences
- [ ] Logout and login, verify preferences persist

## Phase 6: Frontend UI Components (Optional for MVP)

These are nice-to-have, main features work without custom UI:

- [ ] Create DocumentUpload component with drag-drop
- [ ] Create NotificationCenter with bell icon
- [ ] Create NotificationPreferences modal
- [ ] Create InvoiceOverdueWarning banner
- [ ] Add to dashboard layout

## Phase 7: Payment Provider Setup (Optional for MVP)

Skip if not ready to accept real payments:

- [ ] Create Paystack account (https://paystack.com)
- [ ] Get Paystack test API keys
- [ ] Update `.env.local` with Paystack keys
- [ ] Test Paystack payment flow with test card
- [ ] Create PayFast account (https://payfast.co.za) - fallback only
- [ ] Get PayFast test credentials
- [ ] Update `.env.local` with PayFast keys
- [ ] Test PayFast as fallback provider

**Paystack Test Card:**
- Card: 4111 1111 1111 1111
- Expiry: 12/25
- CVV: 123

## Phase 8: Webhook Setup (Production Only)

- [ ] Create `/api/webhooks/paystack` endpoint
- [ ] Create `/api/webhooks/payfast` endpoint
- [ ] Add webhook URLs to Paystack dashboard
- [ ] Add webhook URLs to PayFast dashboard
- [ ] Test webhook delivery with ngrok or similar
- [ ] Verify subscription status updates on webhook

## Phase 9: Complete Feature Testing

Follow `COMPLETE_FEATURE_TEST_GUIDE.md`:

- [ ] **Section 1:** Trial Signup (no payment required)
- [ ] **Section 2:** Paystack Payment Flow (optional if env vars set)
- [ ] **Section 3:** PayFast Fallback (optional if env vars set)
- [ ] **Section 4-5:** Quote → Invoice Conversion
- [ ] **Section 6-7:** Document Lifecycle (upload, link, verify)
- [ ] **Section 8:** Task Assignment Notifications
- [ ] **Section 9:** Invoice Past-Due Detection
- [ ] **Section 10-11:** Notification Preferences Persistence
- [ ] Run 30-minute End-to-End Scenario
- [ ] Verify all 15 success checklist items pass

## Phase 10: Client Demo

- [ ] Prepare demo PC with clean data
- [ ] Test all features one more time
- [ ] Create demo account with trial
- [ ] Test Quote → Invoice conversion
- [ ] Test document upload workflow
- [ ] Show notification system
- [ ] Demo preference persistence
- [ ] Record success/issues for feedback

---

## Critical Notes

⚠️ **Database First:** Ensure all tables exist BEFORE running any API tests

⚠️ **Environment Variables:** Leave payment keys blank initially, add them after testing with your test accounts

⚠️ **Supabase Schema Cache:** Some POST operations may fail with schema cache errors - this is Supabase limitation, not code issue. Solution: Migrate tables or adjust RLS permissions.

✅ **Phased Approach:** Complete Phase 1-3 before testing anything else

✅ **Trial First:** Test trial signup first (no payment required), then payment flows

✅ **Documentation:** All endpoints documented in `COMPLETE_FEATURE_TEST_GUIDE.md`

---

## Quick Start (Skip Ahead if Ready)

If you want to test immediately without payment:

1. Create database tables (Phase 1)
2. Update `.env.local` (Phase 2)
3. Run `npm run dev`
4. Test trial endpoint only (Phase 5)
5. Follow COMPLETE_FEATURE_TEST_GUIDE.md Sections 1, 4-11

**Result:** Full feature set working, payments disabled until you add keys.

---

## Completion Estimate

- **Phase 1-2:** 10 minutes
- **Phase 3:** 5 minutes (just verification)
- **Phase 4:** 15 minutes (integration)
- **Phase 5:** 20 minutes (testing)
- **Phases 6-10:** Optional, 1-2 hours total

**Total time to MVP:** ~50 minutes

**Total time to Production:** Add 1-2 hours for payment setup + webhooks + full testing
