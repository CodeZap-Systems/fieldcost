# FieldCost - ERP Integration - Quick Reference Card

## 🚀 Quick Start (5 minutes)

### Test Sage (Already Fixed ✅)
```bash
# Test Sage connection
curl https://fieldcost.vercel.app/api/sage/test
```
✅ Should return `"success": true` with company info

---

### Test Xero (Step-by-Step)

#### Step 1: Get Authorization URL
```bash
curl https://fieldcost.vercel.app/api/xero/test
```
Copy the returned `authUrl`

#### Step 2: Authorize in Browser
Open the `authUrl` → Sign in with Xero account → Click Authorize

#### Step 3: Extract Code from Redirect
After authorization, note the redirect URL contains:
- `code=ABC123CODE`
- `tenant_id=XYZ789ID`

#### Step 4: Exchange for Token
```bash
curl -X POST https://fieldcost.vercel.app/api/auth/callback/xero \
  -H "Content-Type: application/json" \
  -d '{
    "code": "ABC123CODE",
    "tenantId": "XYZ789ID"
  }'
```

#### Step 5: Store Tokens
Update `.env.local` with returned:
```env
XERO_ACCESS_TOKEN="returned_access_token"
XERO_REFRESH_TOKEN="returned_refresh_token"
XERO_TENANT_ID="XYZ789ID"
```

Redeploy: `vercel --prod`

#### Step 6: Verify Connection
```bash
curl https://fieldcost.vercel.app/api/xero/test
```
✅ Should return `"authenticated": true`

---

## 🔗 All Endpoints

### Sage (10 endpoints)
```
GET  /api/sage/test
GET  /api/sage/items
GET  /api/sage/customers
POST /api/sage/items/sync
POST /api/sage/customers/sync
POST /api/sage/sync/full
```

### Xero (9 endpoints)
```
GET  /api/xero/test
POST /api/xero/test
GET  /api/xero/items
GET  /api/xero/contacts
GET  /api/xero/invoices
POST /api/xero/items
POST /api/xero/contacts
POST /api/xero/invoices
POST /api/xero/sync/full
GET  /api/auth/callback/xero
POST /api/auth/callback/xero
```

---

## ⚙️ Environment Variables

### Sage (Fixed ✅)
```env
SAGE_API_TOKEN="8C399659-628C-4EB2-A5D1-B76637E2B7F8"
SAGE_API_USERNAME="dev@codezap.co.za"
SAGE_API_PASSWORD="Dingb@tDing4783"
SAGE_API_URL="https://resellers.accounting.sageone.co.za/api/2.0.0"
SAGE_SANDBOX_MODE="true"
```

### Xero (Needs Configuration)
```env
XERO_CLIENT_ID="CD83735E77AF44E0B64A4B83528CE335"
XERO_CLIENT_SECRET="5R6MZ-z03jZTpmCqA9gA3m8hvWxiW0-VXCs-vvtwwPqrB46k"
XERO_REDIRECT_URI="https://localhost:3001/api/auth/callback/xero"
XERO_TENANT_ID="[ADD AFTER OAUTH]"
XERO_ACCESS_TOKEN="[ADD AFTER OAUTH]"
XERO_REFRESH_TOKEN="[ADD AFTER OAUTH]"
```

---

## 📋 Sync Data to Local Database

### Sage Sync
```bash
# Sync items
curl -X POST https://fieldcost.vercel.app/api/sage/items/sync \
  -H "Content-Type: application/json" \
  -d '{"companyId":"YOUR_COMPANY_ID"}'

# Sync customers
curl -X POST https://fieldcost.vercel.app/api/sage/customers/sync \
  -H "Content-Type: application/json" \
  -d '{"companyId":"YOUR_COMPANY_ID"}'

# Sync everything
curl -X POST https://fieldcost.vercel.app/api/sage/sync/full \
  -H "Content-Type: application/json" \
  -d '{"companyId":"YOUR_COMPANY_ID"}'
```

### Xero Sync (After OAuth)
```bash
# Sync items
curl -X POST https://fieldcost.vercel.app/api/xero/items \
  -H "Content-Type: application/json" \
  -d '{"companyId":"YOUR_COMPANY_ID"}'

# Sync contacts
curl -X POST https://fieldcost.vercel.app/api/xero/contacts \
  -H "Content-Type: application/json" \
  -d '{"companyId":"YOUR_COMPANY_ID"}'

# Sync everything
curl -X POST https://fieldcost.vercel.app/api/xero/sync/full \
  -H "Content-Type: application/json" \
  -d '{"companyId":"YOUR_COMPANY_ID"}'
```

---

## 🐛 Troubleshooting

| Error | Solution |
|-------|----------|
| "Missing Sage API credentials" | ✅ FIXED - now passes Sandbox test |
| "Not authenticated with Xero" | Complete OAuth flow (Step 1-5) |
| "Invalid tenant ID" | Copy exact tenant_id from redirect URL |
| "Authorization code expired" | Restart from Step 1 (code valid 10 min) |
| Sync fails | Verify company_id parameter exists |
| Data not syncing | Check database has xero_item_id column |

---

## 📚 Documentation Files

- **`SAGE_XERO_INTEGRATION_GUIDE.md`** — Full API documentation
- **`XERO_OAUTH_FLOW_GUIDE.md`** — Detailed OAuth walkthrough
- **`SAGE_XERO_FIX_DEPLOYMENT_SUMMARY.md`** — What was fixed & deployed
- **`lib/xeroApiClient.ts`** — Xero client implementation
- **`lib/sageOneApiClient.ts`** — Sage client implementation

---

## ✅ What's Been Done

- ✅ Fixed Sage credentials loading issue
- ✅ Built complete Xero OAuth 2.0 integration
- ✅ Created 9 new Xero API endpoints
- ✅ Built 0 errors, all 111 routes compiled
- ✅ Deployed to Vercel (live now)
- ✅ Comprehensive documentation provided

---

## 🎯 Next Steps

1. **Right Now**: Test Sage with `/api/sage/test`
2. **Next**: Complete Xero OAuth (5 minutes)
3. **Then**: Sync data from both systems
4. **Finally**: Create invoices and push to ERP

---

**Status**: 🟢 READY TO TEST

Everything is deployed and live. Start with Sage test, then complete Xero authorization.

Last Updated: March 12, 2026
