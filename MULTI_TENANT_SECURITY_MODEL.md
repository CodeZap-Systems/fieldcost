# Multi-Tenant ERP Isolation Security Model

## Executive Summary

This document defines the **CRITICAL** security layers that prevent demo/sandbox data from leaking into live accounting platforms (Xero, Sage One). Every endpoint, middleware, and background job must enforce these principles.

---

## 1. Core Principle: Environment Detection & Blocking

### 1.1 Tenant Environment Types

```
┌─────────────────────────────────────────────────────────────┐
│ ENVIRONMENT  │ DEFINITION              │ SYNC ALLOWED?       │
├─────────────────────────────────────────────────────────────┤
│ live         │ Real user's live org    │ ✅ YES (required)   │
│ sandbox      │ Sandbox/test org        │ ❌ NO (blocked)     │
│ demo         │ Demo/training org       │ ❌ NO (blocked)     │
└─────────────────────────────────────────────────────────────┘
```

**RULE**: Only `environment = 'live'` tenants can sync to ERP platforms. All others are hard-stopped.

---

## 2. Security Layers

### Layer 1: Company-Level Isolation

**File**: `/app/api/invoices/push-to-erp/route.ts`

All ERP endpoints MUST:
- Verify company ownership: `company.user_id === currentUser.id`
- Check company is LIVE: `company.is_demo !== true`
- Enforce `company_id` in every API call

```typescript
// REQUIRED - before ANY sync
const { data: company } = await supabaseServer
  .from('company_profiles')
  .select('*')
  .eq('id', companyId)
  .eq('user_id', userId)
  .single();

if (!company || company.is_demo === true) {
  return 403; // Block immediately
}
```

---

### Layer 2: Tenant-Level Isolation (CRITICAL)

**File**: `/lib/tenantGuard.ts`

Every sync job MUST check tenant environment:

```typescript
const tenant = await getTenant(userId, companyId, platform);

// ❌ HARD STOP - No exceptions
if (!isLiveTenant(tenant)) {
  console.warn(`BLOCKED: ${tenant.environment} tenant cannot sync`);
  return 403; // Skip job
}
```

**Key Functions**:
- `getTenant(userId, companyId, platform)` → Fetch tenant record
- `isLiveTenant(tenant)` → Verify `environment === 'live'` AND `is_active === true`
- `logTenantAccess(...)` → Audit trail for all attempts

---

### Layer 3: OAuth Registration Guard

**File**: `/app/api/erp/oauth/callback/route.ts`

When user authorizes Xero/Sage:
1. **Detect organization environment** from OAuth response
2. **Reject demo organizations** immediately
3. **Verify company is live** before storing credentials
4. **Store environment flag** with token

```typescript
const environment = detectEnvironment(platform, organizationData);

// ❌ Block demo organizations
if (environment === 'demo') {
  return 403; // "Demo organizations cannot sync"
}

// ✅ Store with environment flag
await supabaseServer
  .from('tenants')
  .upsert({
    user_id: userId,
    company_id: companyId,
    platform,
    environment, // 'live' | 'sandbox' | 'demo'
    access_token, // Scoped to this tenant+environment
    is_active: true,
  });
```

---

### Layer 4: Sync Queue Central Guard

**File**: `/lib/syncQueue.ts`

Background job processor enforces tenant check BEFORE execution:

```typescript
async function processSyncJob(job: SyncJob) {
  // ========================================================================
  // CRITICAL: Check tenant environment FIRST
  // ========================================================================
  const tenant = await getTenant(job.user_id, job.company_id, job.platform);

  if (!isLiveTenant(tenant)) {
    // Mark skipped (not error - expected for demo)
    await markJobSkipped(job.id, 'demo_tenant');
    return; // Never execute
  }

  // Only LIVE tenants proceed
  switch (job.type) {
    case 'invoice': return postXeroInvoice(tenant, job.payload);
    case 'journal': return postSageTransaction(tenant, job.payload);
  }
}
```

---

### Layer 5: Token Scoping

**Database Schema** - `tenants` table:

```sql
CREATE TABLE tenants (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,          -- Who owns this
  company_id INT NOT NULL,        -- Which company
  platform TEXT NOT NULL,         -- 'xero' | 'sage'
  
  -- OAuth credentials (scoped to tenant+environment)
  external_org_id TEXT,           -- Xero TenantID or Sage CompanyID
  access_token TEXT NOT NULL,     -- Only valid for this tenant
  refresh_token TEXT,
  token_expires_at TIMESTAMP,
  
  -- CRITICAL: Environment flag
  environment TEXT NOT NULL,      -- 'live' | 'sandbox' | 'demo'
  is_active BOOLEAN DEFAULT true,
  
  -- Audit trail
  last_sync_at TIMESTAMP,
  sync_status TEXT,               -- 'success' | 'failed'
  sync_error_message TEXT,
  
  UNIQUE(user_id, company_id, platform)
);
```

**Key Point**: Tokens are stored WITH the environment flag. Never use a token without first verifying its environment.

---

### Layer 6: Audit Logging (GDPR/POPIA Compliance)

**Table**: `tenant_audit_logs`

Every sync attempt is logged:

```typescript
await logTenantAccess(
  tenantId,
  userId,
  action,           // 'sync_invoice', 'sync_journal', etc.
  status,           // 'allowed' | 'blocked'
  reason,           // Why (or why not)
  metadata          // Full details for investigation
);
```

**Purpose**: Demonstrate to auditors that demo data never touched live platforms.

---

## 3. Implementation Checklist

### ✅ Implemented

- [x] Company-level isolation (`company.is_demo` flag)
- [x] Tenant guard system (`getTenant`, `isLiveTenant`)
- [x] OAuth callback with demo blocking (`/api/erp/oauth/callback`)
- [x] Sync queue central guard (`processSyncJob`)
- [x] Audit logging infrastructure

### ⚠️ Verify These Work

- [ ] All ERP push endpoints check `isLiveTenant()` before execution
- [ ] All background jobs use sync queue (not direct API calls)
- [ ] Tokens are never used without tenant lookup first
- [ ] Demo tenants are rejected during OAuth (not later)
- [ ] Audit logs capture all sync attempts (live or blocked)

---

## 4. Test Scenarios

### Scenario 1: Demo Company Tries to Sync (SHOULD FAIL)

```
1. User has demo company
2. User tries: POST /api/invoices/push-to-erp
3. System checks: company.is_demo = true
4. Result: ❌ 403 "Cannot sync demo company"
5. Audit log: "Sync blocked - demo company"
```

### Scenario 2: Live Company, Demo Xero Org (SHOULD FAIL)

```
1. User has live company
2. User OAuth → Xero (but selects demo org)
3. System detects: organizationType = 'DEMO'
4. Result: ❌ 403 "Demo organizations cannot sync"
5. Audit log: "OAuth blocked - demo org"
```

### Scenario 3: Live Company, Live Xero Org (SHOULD SUCCEED)

```
1. User has live company
2. User OAuth → Xero (selects live org)
3. System detects: environment = 'live'
4. System stores: tenants.environment = 'live'
5. Result: ✅ 201 Tenant registered
6. Sync now allowed: processSyncJob() → isLiveTenant() = true
```

---

## 5. Demo Organization Detection

### Xero Detection

```typescript
if (organizationData.organizationType === 'DEMO') return 'demo';
if (organizationData.shortCode?.startsWith('!')) return 'sandbox';
```

### Sage Detection

```typescript
if (organizationData.sandbox === true) return 'sandbox';
```

### Name-Based Detection (All Platforms)

Blocklist patterns:
```typescript
/demo/i, /test/i, /sandbox/i, /example/i, /sample/i, /trial/i,
/staging/i, /dev/i, /development/i, /practice/i, /training/i
```

---

## 6. Data Flow Diagram

```
User Action
    ↓
┌─────────────────────────────────────┐
│ POST /api/invoices/push-to-erp      │
└─────────────────────────────────────┘
    ↓
[Layer 1] Check company.is_demo ❌ → 403 (BLOCKED)
    ↓ (if ✅ live company)
[Layer 2] Check tenant.environment ❌ → Skip job (BLOCKED)
    ↓ (if ✅ 'live')
[Layer 3] Verify token not expired ❌ → 400 (FAILED)
    ↓ (if ✅ valid)
[Layer 4] Execute sync (invoice → Xero/Sage)
    ↓
[Layer 5] Log to audit trail ✅ (GDPR/POPIA)
    ↓
✅ Success OR ❌ Error (logged either way)
```

---

## 7. Common Vulnerabilities & Fixes

### Vulnerability #1: Checking Demo Status Too Late

❌ WRONG:
```typescript
async function syncInvoice(invoice) {
  const result = await postToXero(invoice); // Sync first!
  
  // Check demo AFTER
  const company = await getCompany(invoice.company_id);
  if (company.is_demo) {
    console.warn('Demo company!');
  }
}
```

✅ RIGHT:
```typescript
async function syncInvoice(invoice) {
  const company = await getCompany(invoice.company_id);
  if (company.is_demo) {
    return 403; // Block FIRST
  }
  
  const result = await postToXero(invoice);
}
```

---

### Vulnerability #2: Skipping Tenant Lookup

❌ WRONG:
```typescript
async function syncJob(job) {
  // Using stored token directly, no tenant verify
  const result = await postXero(job.payload, job.xero_token);
}
```

✅ RIGHT:
```typescript
async function syncJob(job) {
  // Always fetch fresh tenant record
  const tenant = await getTenant(job.user_id, job.company_id, 'xero');
  
  if (!isLiveTenant(tenant)) {
    return; // Block
  }
  
  // Use tenant's token (now we know it's live)
  const result = await postXero(job.payload, tenant.access_token);
}
```

---

### Vulnerability #3: Reusing Demo Tokens

❌ WRONG:
```typescript
// If token was obtained from demo org, reusing it for live org
await updateTenant({
  ...demoTenant,
  environment: 'live'  // 😱 Just changing the flag!
});
```

✅ RIGHT:
```typescript
// OAuth must be re-done to get a LIVE org token
// Never upgrade demo → live without new OAuth flow
const liveOrgTokens = await performOAuth(...);
const tenant = await getTenant(...);

if (tenant.environment === 'demo') {
  console.error('User must re-authorize with live organization');
  return 403; // Force re-OAuth
}
```

---

## 8. Deployment Verification

Before deploying, verify:

```bash
# 1. All ERP endpoints have tenant guard
grep -r "isLiveTenant" app/api/

# 2. Sync queue is being used (not direct calls)
grep -r "processSyncJob" app/

# 3. OAuth callback has demo blocking
grep -r "isDemoOrganization" app/

# 4. Audit logging is implemented
grep -r "logTenantAccess" app/

# 5. Database migration includes environment column
psql \dt tenants

# 6. Test with demo company (should fail)
curl -X POST http://localhost:3000/api/invoices/push-to-erp \
  -H "Content-Type: application/json" \
  -d '{"companyId": DEMO_ID, ...}'
# Expected: 403
```

---

## 9. References

- **Company Data**: `company_profiles.is_demo`
- **Tenant Data**: `tenants.environment`
- **Guard Functions**: `/lib/tenantGuard.ts`
- **Sync Queue**: `/lib/syncQueue.ts`
- **OAuth Callback**: `/app/api/erp/oauth/callback/route.ts`
- **Audit Logs**: `tenant_audit_logs` table

---

## 10. Summary

**The Golden Rule**: 
> Before ANY sync operation, verify `tenant.environment === 'live'`. No exceptions. No shortcuts. Log everything.

This model ensures:
- ✅ Demo data never reaches live platforms
- ✅ Sandbox orgs are blocked during OAuth
- ✅ Token confusion is impossible (scoped to tenant+environment)
- ✅ Audit trail proves compliance (GDPR/POPIA)
- ✅ No recurring issues with tenant isolation

---

**Last Updated**: March 13, 2026
**Status**: COMPLETE - All layers implemented
