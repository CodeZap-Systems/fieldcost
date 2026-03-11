# 👨‍💼 OWNER'S SUBSCRIPTION MANAGEMENT GUIDE

Quick reference for managing customer subscriptions and billing.

---

## 🎯 Quick Navigation

Access the admin dashboard at: `/admin`

From the dashboard, you can navigate to:

### 1. **Subscriptions** (`/admin/subscriptions`)
Manage active customer subscriptions

### 2. **Plans** (`/admin/plans`)
Create and edit subscription tiers

### 3. **Billing** (`/admin/billing`)
View invoices and payment status

### 4. **Payments** (`/admin/payments`)
Track payments and process refunds

---

## 📋 COMMON TASKS

### Task 1: Upgrade a Customer to Higher Tier

**Scenario**: Customer wants more features/team members

**Steps**:
1. Go to `/admin/subscriptions`
2. Search for customer by name or company
3. Click on the customer row
4. Click "Upgrade Plan" button
5. Select new plan from dropdown
6. Confirm upgrade
7. Customer is immediately moved to new tier ✅

**What Changes**:
- Higher feature limits (more projects, team members, storage)
- New pricing takes effect immediately
- Customer sees features available for new tier
- Billing pro-rates based on cycle (monthly/annual)

---

### Task 2: Downgrade a Customer to Lower Tier

**Scenario**: Customer wants fewer features/lower cost

**Steps**:
1. Go to `/admin/subscriptions`
2. Find customer
3. Click on customer row
4. Click "Downgrade Plan" button
5. Select new plan
6. Confirm downgrade
7. Customer access to "overages" features removed

**Warning**: If customer is using features unavailable in lower tier, they may lose access to that data. Consider applying discount instead.

---

### Task 3: Apply Discount to Customer

**Scenario**: Give special pricing for commitments or negotiations

**Steps**:
1. Go to `/admin/subscriptions`
2. Find customer
3. Click on customer row
4. Click "Apply Discount" button
5. Enter discount percentage (e.g., 10 for 10%)
6. Add reason for discount (e.g., "Annual Commitment", "Special Offer")
7. Click Apply
8. New price reflects immediately ✅

**Tracking**: Discount reason is logged in audit trail for future reference

---

### Task 4: Pause a Customer Subscription (Turn OFF)

**Scenario**: Customer wants to freeze account temporarily

**Steps**:
1. Go to `/admin/subscriptions`
2. Find customer
3. Click on customer row
4. Click "Pause Subscription" button
5. Confirm action
6. Customer **loses access immediately** ❌

**What Happens**:
- Customer cannot log in
- Workspace is frozen
- Data is retained (safe)
- Billing is paused
- Subscription status shows "Paused"

**To Reactivate**: Click "Resume" button when customer wants to continue

---

### Task 5: Resume Paused Subscription (Turn ON)

**Scenario**: Customer wants to reactivate after pause

**Steps**:
1. Go to `/admin/subscriptions`
2. Click filter dropdown, select "Paused"
3. Find customer
4. Click on customer row
5. Click "Resume" button
6. Confirm action
7. Customer access restored immediately ✅

**What Happens**:
- Customer can log in again
- All their data is intact
- Billing resumes
- Subscription status shows "Active"

---

### Task 6: Cancel a Customer Subscription

**Scenario**: Customer is leaving, needs to offboard

**Steps**:
1. Go to `/admin/subscriptions`
2. Find customer
3. Click on customer row
4. Click "Cancel Subscription" button
5. Select cancellation reason (optional)
6. Confirm cancellation
7. Subscription status shows "Cancelled" ❌

**What Happens**:
- Customer **loses access immediately**
- Data is retained for 30 days (configurable)
- After retention period, data is deleted
- Billing is terminated
- Cancellation date is recorded

**Note**: Customer can request data export before deletion

---

### Task 7: Create New Subscription Plan

**Scenario**: Introduce new tier for different market segment

**Steps**:
1. Go to `/admin/plans`
2. Click "+ Create Plan" button
3. Fill in plan details:
   - **Name**: e.g., "Professional Plus"
   - **Tier Level**: e.g., "3"
   - **Description**: Features included
   - **Monthly Price**: $299
   - **Annual Price**: $2,990 (10% discount)
   - **Max Projects**: 50
   - **Max Team Members**: 10
   - **Max Invoices**: 500
   - **Storage**: 100GB
4. Click "Create Plan" ✅

**Tip**: Annual price should typically be 10% cheaper to incentivize yearly commitments

---

### Task 8: Update Existing Plan Pricing

**Scenario**: Need to adjust pricing due to cost changes

**Steps**:
1. Go to `/admin/plans`
2. Find the plan in the grid
3. Click "Edit" button on the plan
4. Update pricing:
   - New monthly price
   - New annual price
   - Feature quotas
5. Click "Save" ✅

**Important Note**: 
- Changes only apply to **NEW subscriptions**
- Existing customers keep old prices (unless you manually upgrade them)
- Use "Upgrade" workflow to move existing customers to new pricing

---

### Task 9: View Dashboard Metrics

**Scenario**: Check business health

**Steps**:
1. Go to `/admin` (main dashboard)
2. View metrics cards:
   - **Total Subscriptions**: Number of active + paused + trial
   - **Active Subscriptions**: Currently paying customers
   - **Trial Subscriptions**: Free trial accounts
   - **MRR**: Monthly Recurring Revenue
   - **ARR**: Annual Recurring Revenue
   - **Churn Rate**: % of customers leaving
   - **Pending Invoices**: Amounts waiting for payment
   - **Overdue Invoices**: Past due payments

**Tips**:
- Track MRR weekly for business health
- Monitor churn rate to identify at-risk customers
- Watch overdue invoices for collection

---

### Task 10: View Subscription Activity History

**Scenario**: Audit trail - see what changed and who changed it

**Steps**:
1. Go to `/admin/audit`
2. Filter by:
   - Date range
   - User (which admin made change)
   - Action type (upgrade, downgrade, cancel, etc.)
3. View complete history of all subscription changes ✅

**Info Logged**:
- Who made the change
- When it was made
- What changed (from/to)
- Reason (if provided)

---

## 📊 DASHBOARD METRICS EXPLAINED

### MRR (Monthly Recurring Revenue)
Total monthly revenue from all active subscriptions

**Formula**: Sum of (customer.monthly_subscription_price) for all active subscriptions

**Example**: 
- 10 customers on Tier 1 ($99/mo) = $990
- 5 customers on Tier 2 ($299/mo) = $1,495
- **MRR = $2,485**

---

### ARR (Annual Recurring Revenue)
Total annual revenue assuming subscription continues

**Formula**: MRR × 12

**Example**: $2,485 × 12 = **$29,820 ARR**

---

### Churn Rate
Percentage of customers who cancelled in a period

**Formula**: (Cancelled customers / Total customers last month) × 100

**Healthy Rate**: < 5% per month

**Action**: If > 5%, investigate why customers are leaving

---

## 🎯 PERMISSION LEVELS

To perform admin actions, user must have:

- `can_manage_subscriptions` - Upgrade/downgrade/pause/cancel
- `can_manage_plans` - Create/edit/delete plans
- `can_view_billing` - View invoices and payment history

**Note**: Only grant these permissions to trusted admin team members

---

## ⚠️ IMPORTANT RULES

### Rule 1: Always Communicate Changes to Customer
When upgrading/downgrading, send customer an email notification with:
- Old plan details
- New plan details
- Effective date
- New pricing (if changed)

### Rule 2: Pro-Rate Billing
When changing plans mid-cycle, billing automatically adjusts:
- Customer pays only for remaining days in new plan
- Excess payment carries forward as credit
- Transparent to customer in next invoice

### Rule 3: Feature Downgrade Warning
If downgrading customer to a tier with fewer features:
- Warn them about losing features
- Offer migration period (e.g., 7 days) to export data
- Auto-disable overages after migration period

### Rule 4: Audit Trail
All subscription changes are logged with:
- Who made the change
- When it was made
- What changed
- Why (if reason provided)

Review audit logs monthly for compliance

### Rule 5: Data Retention
Cancelled subscriptions are retained for:
- **30 days**: Active data retention (customer can recover)
- **90 days**: Soft delete (admin can restore)
- **After 90 days**: Permanently deleted

---

## 🆘 TROUBLESHOOTING

### Q: Customer says they can't log in after pausing
**A**: Paused subscriptions block login by design. Resume the subscription to restore access.

### Q: I upgraded a customer but they don't see new features
**A**: Features are cached. Ask customer to:
1. Log out completely
2. Clear browser cache
3. Log back in

### Q: Can I undo a cancellation?
**A**: Yes, for up to 30 days:
1. Go to `/admin/subscriptions`
2. Filter "Cancelled" status
3. Find customer
4. Click "Reactivate"
5. Subscription restored ✅

### Q: How do pro-rated charges work?
**A**: Example - Customer monthly plan is $300, renews on the 15th:
- Customer upgrades on the 2nd to $500 plan
- They owe: $500 - $300 = $200 for remaining 13 days
- $200 applied Immediately as charge
- Their subscription now renews at $500 on the 15th

### Q: Can I change pricing retroactively?
**A**: No. Pricing changes only apply to:
- New subscriptions created after change
- Existing customers if you manually upgrade them

To move customers to new price: Upgrade them to new tier with new pricing

---

## 📞 SUPPORT SCENARIOS

### Scenario 1: VIP Customer Negotiation
Customer wants special pricing for multi-year commitment

**Solution**:
1. Create new plan "VIP Enterprise" with custom pricing
2. Upgrade customer to VIP plan
3. Apply 20% discount for 2-year commitment
4. Document in notes for renewal reminder

### Scenario 2: Freemium Churn
High churn in trial tier

**Action Items**:
1. Review trial signups (30 day history)
2. Identify most common cancellation reasons
3. Contact users before they cancel
4. Offer discount to keep them
5. Use `/admin` audit logs to track effectiveness

### Scenario 3: Enterprise Deal
Large customer wants custom feature set

**Solution**:
1. Create custom plan (e.g., "Enterprise Custom")
2. Set quotas to their needs (1000 projects, 50 users)
3. Set custom price
4. Assign customer to plan
5. Monitor usage regularly

---

## ✅ CHECKLIST: Monthly Admin Review

Every 1st of month:
- [ ] Check dashboard MRR and ARR
- [ ] Review churn rate - any troubling trends?
- [ ] Check overdue invoices - need to follow up?
- [ ] Review audit logs - any unauthorized changes?
- [ ] Contact top-risk customers (those using 90%+ of limits)
- [ ] Plan for upcoming renewals
- [ ] Update forecasts based on current MRR

---

## 📚 RELATED DOCUMENTATION

- `AIRTIGHT_DEMO_REPORT.md` - Kanban board testing results
- `CUSTOMER_JOURNEY_AND_ADMIN_REPORT.md` - Full technical audit
- `ADMIN_CMS_COMPLETE.md` - Complete admin features documentation

---

**Last Updated**: 2024-01-09  
**Version**: 1.0  
**Status**: Production Ready
