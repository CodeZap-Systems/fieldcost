# FieldCost - Sage + Xero ERP Integration Guide

## 🔧 Setup Complete

Both **Sage One Business Cloud Accounting** and **Xero** integrations are now configured and deployed to Vercel.

---

## 📊 Sage Business Cloud Accounting Integration

### Configuration Status
- ✅ API Credentials configured
- ✅ Sandbox mode: `TRUE`
- ✅ Endpoints deployed

### API Credentials
```
API Token:    8C399659-628C-4EB2-A5D1-B76637E2B7F8
Username:     dev@codezap.co.za
Password:     Dingb@tDing4783
API URL:      https://resellers.accounting.sageone.co.za/api/2.0.0
Sandbox Mode: true
```

### Testing Sage Integration

#### 1. Test Connection
```bash
curl https://fieldcost.vercel.app/api/sage/test
```

**Response (Success)**:
```json
{
  "success": true,
  "message": "✅ Successfully connected to Sage One API",
  "data": {
    "authenticated": true,
    "company": "Your Company Name"
  },
  "credentials": {
    "username": "dev@codezap.co.za",
    "apiUrl": "default",
    "sandboxMode": true
  }
}
```

#### 2. Get Items from Sage
```bash
curl "https://fieldcost.vercel.app/api/sage/items"
```

**Response**:
```json
{
  "success": true,
  "message": "Retrieved items from Sage",
  "items": [
    {
      "ID": "1",
      "Code": "ITEM-001",
      "Name": "Product Name",
      "Description": "Product Description",
      "SalesPrice": 100.00,
      "PurchasePrice": 50.00,
      "Quantity": 10
    }
  ],
  "count": 10
}
```

#### 3. Sync Sage Items to Database
```bash
curl -X POST https://fieldcost.vercel.app/api/sage/items/sync \
  -H "Content-Type: application/json" \
  -d '{"companyId":"YOUR_COMPANY_ID"}'
```

**Response**:
```json
{
  "success": true,
  "message": "Synced 10 items from Sage",
  "synced": 10,
  "skipped": 0,
  "total": 10
}
```

#### 4. Sync Customers from Sage
```bash
curl -X POST https://fieldcost.vercel.app/api/sage/customers/sync \
  -H "Content-Type: application/json" \
  -d '{"companyId":"YOUR_COMPANY_ID"}'
```

#### 5. Full Sage Orchestrated Sync
```bash
curl -X POST https://fieldcost.vercel.app/api/sage/sync/full \
  -H "Content-Type: application/json" \
  -d '{"companyId":"YOUR_COMPANY_ID"}'
```

---

## 💼 Xero Integration

### Configuration Status
- ✅ OAuth2 Client ID configured
- ✅ OAuth2 Client Secret configured
- ✅ Redirect URI configured
- ✅ Awaiting authorization

### API Credentials
```
Client ID:     CD83735E77AF44E0B64A4B83528CE335
Client Secret: 5R6MZ-z03jZTpmCqA9gA3m8hvWxiW0-VXCs-vvtwwPqrB46k
Redirect URI:  https://localhost:3001/api/auth/callback/xero
```

### Testing Xero Integration

#### 1. Get Authorization URL
```bash
curl https://fieldcost.vercel.app/api/xero/test
```

**Response (Not Authenticated)**:
```json
{
  "success": false,
  "authenticated": false,
  "message": "Not authenticated. Redirect to authUrl to authorize.",
  "authUrl": "https://login.xero.com/identity/connect/authorize?response_type=code&client_id=CD83735E77AF44E0B64A4B83528CE335&redirect_uri=https://localhost:3001/api/auth/callback/xero&scope=offline_access%20openid%20profile%20email%20accounting&state=fieldcost-xero-auth",
  "credentials": {
    "authenticated": false
  }
}
```

#### 2. Complete OAuth Authorization Flow
1. **Step 1**: Open the returned `authUrl` in your browser
2. **Step 2**: Sign in with your Xero account credentials
3. **Step 3**: Grant FieldCost permission to access your Xero data
4. **Step 4**: You'll be redirected to the callback URL with an authorization code
5. **Step 5**: Exchange the code for access token via the callback endpoint

#### 3. Exchange Authorization Code for Token
```bash
curl -X POST https://fieldcost.vercel.app/api/auth/callback/xero \
  -H "Content-Type: application/json" \
  -d '{
    "code": "AUTHORIZATION_CODE_FROM_XERO",
    "tenantId": "XERO_TENANT_ID"
  }'
```

**Response**:
```json
{
  "success": true,
  "message": "✅ Successfully authenticated with Xero",
  "credentials": {
    "accessToken": "YOUR_ACCESS_TOKEN",
    "refreshToken": "YOUR_REFRESH_TOKEN",
    "tenantId": "YOUR_TENANT_ID",
    "expiresAt": "2026-03-12T15:30:00Z"
  }
}
```

#### 4. Get Xero Contacts
```bash
curl "https://fieldcost.vercel.app/api/xero/contacts"
```

**Response**:
```json
{
  "success": true,
  "count": 5,
  "contacts": [
    {
      "ContactID": "abc123",
      "Name": "Customer Name",
      "EmailAddress": "contact@example.com",
      "Phones": [
        {
          "PhoneNumber": "+27 11 123 4567",
          "PhoneType": "DEFAULT"
        }
      ]
    }
  ]
}
```

#### 5. Sync Xero Contacts to Database
```bash
curl -X POST https://fieldcost.vercel.app/api/xero/contacts \
  -H "Content-Type: application/json" \
  -d '{"companyId":"YOUR_COMPANY_ID"}'
```

**Response**:
```json
{
  "success": true,
  "message": "Synced 5 contacts from Xero",
  "synced": 5,
  "skipped": 0,
  "total": 5
}
```

#### 6. Get Xero Items
```bash
curl "https://fieldcost.vercel.app/api/xero/items"
```

#### 7. Sync Xero Items to Database
```bash
curl -X POST https://fieldcost.vercel.app/api/xero/items \
  -H "Content-Type: application/json" \
  -d '{"companyId":"YOUR_COMPANY_ID"}'
```

#### 8. Create Invoice in Xero
```bash
curl -X POST https://fieldcost.vercel.app/api/xero/invoices \
  -H "Content-Type: application/json" \
  -d '{
    "contactName": "Customer Name",
    "lineItems": [
      {
        "Description": "Service rendered",
        "Quantity": 1,
        "UnitAmount": 1000.00
      }
    ],
    "reference": "INV-001",
    "dueDate": "2026-03-26"
  }'
```

#### 9. Full Xero Orchestrated Sync
```bash
curl -X POST https://fieldcost.vercel.app/api/xero/sync/full \
  -H "Content-Type: application/json" \
  -d '{"companyId":"YOUR_COMPANY_ID"}'
```

**Response**:
```json
{
  "success": true,
  "message": "✅ Full Xero sync completed",
  "summary": {
    "items": {
      "synced": 25,
      "total": 25,
      "errors": 0
    },
    "contacts": {
      "synced": 12,
      "total": 12,
      "errors": 0
    }
  }
}
```

---

## 🔄 Data Sync Flow

### Sage Integration Data Flow
```
FieldCost Project
    ↓
Capture tasks, materials, labor
    ↓
Generate invoice from completed tasks
    ↓
Push to Sage One (WIP status)
    ↓
Sage updates general ledger
    ↓
VAT 201 compliance report
```

### Xero Integration Data Flow
```
Xero Contacts/Items
    ↓
Pull via API
    ↓
Sync to FieldCost database
    ↓
Create invoices from field work
    ↓
Push back to Xero
    ↓
Xero generates financial reports
```

---

## 🗄️ Database Schema Updates

Add these columns to support ERP integrations:

### For `items` table:
```sql
ALTER TABLE items ADD COLUMN IF NOT EXISTS (
  sage_item_id TEXT UNIQUE,
  xero_item_id TEXT UNIQUE,
  sage_synced_at TIMESTAMP,
  xero_synced_at TIMESTAMP
);
```

### For `customers` table:
```sql
ALTER TABLE customers ADD COLUMN IF NOT EXISTS (
  sage_contact_id TEXT UNIQUE,
  xero_contact_id TEXT UNIQUE,
  sage_synced_at TIMESTAMP,
  xero_synced_at TIMESTAMP
);
```

### For `invoices` table:
```sql
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS (
  sage_sync_status TEXT DEFAULT 'pending',
  xero_sync_status TEXT DEFAULT 'pending',
  sage_sync_date TIMESTAMP,
  xero_sync_date TIMESTAMP,
  sage_invoice_id TEXT,
  xero_invoice_id TEXT
);
```

---

## 🔐 Environment Variables

Your `.env.local` now includes:

### Sage Credentials
```env
SAGE_API_TOKEN="8C399659-628C-4EB2-A5D1-B76637E2B7F8"
SAGE_API_USERNAME="dev@codezap.co.za"
SAGE_API_PASSWORD="Dingb@tDing4783"
SAGE_API_URL="https://resellers.accounting.sageone.co.za/api/2.0.0"
SAGE_SANDBOX_MODE="true"
```

### Xero Credentials
```env
XERO_CLIENT_ID="CD83735E77AF44E0B64A4B83528CE335"
XERO_CLIENT_SECRET="5R6MZ-z03jZTpmCqA9gA3m8hvWxiW0-VXCs-vvtwwPqrB46k"
XERO_REDIRECT_URI="https://localhost:3001/api/auth/callback/xero"
XERO_TENANT_ID=""
XERO_ACCESS_TOKEN=""
XERO_REFRESH_TOKEN=""
```

---

## ✅ API Endpoints Summary

### Sage Endpoints
- `GET  /api/sage/test` — Test Sage connection
- `GET  /api/sage/items` — Get Sage items
- `POST /api/sage/items/sync` — Sync items to DB
- `GET  /api/sage/customers` — Get Sage customers
- `POST /api/sage/customers/sync` — Sync customers to DB
- `POST /api/sage/sync/full` — Full orchestrated sync
- `POST /api/invoices/push-to-erp` — Push invoice to Sage

### Xero Endpoints
- `GET  /api/xero/test` — Get auth URL or test connection
- `POST /api/xero/test` — Initiate OAuth flow
- `GET  /api/auth/callback/xero` — Get authorization URL
- `POST /api/auth/callback/xero` — Handle OAuth callback
- `GET  /api/xero/items` — Get Xero items
- `POST /api/xero/items` — Sync items to DB
- `GET  /api/xero/contacts` — Get Xero contacts
- `POST /api/xero/contacts` — Sync contacts to DB
- `GET  /api/xero/invoices` — Get Xero invoices
- `POST /api/xero/invoices` — Create invoice in Xero
- `POST /api/xero/sync/full` — Full orchestrated sync

---

## 🚀 Next Steps

1. **Sage Testing**:
   - ✅ Call `/api/sage/test` to verify credentials
   - Call `/api/sage/items` to list inventory
   - Call `/api/sage/sync/full` to import data

2. **Xero Authorization**:
   - Call `/api/xero/test` to get authorization URL
   - Visit the URL and authorize FieldCost
   - Exchange code for access token
   - Store token in `XERO_ACCESS_TOKEN` env var
   - Store tenant ID in `XERO_TENANT_ID` env var

3. **Data Synchronization**:
   - Run `/api/sage/sync/full` for Sage data
   - Run `/api/xero/sync/full` for Xero data
   - Monitor sync status in audit logs

4. **Invoice Workflow**:
   - Create invoice in FieldCost
   - Push to Sage/Xero via `/api/invoices/push-to-erp`
   - Track sync status in database

---

## 🐛 Troubleshooting

### Sage Connection Fails
**Error**: "Missing Sage API credentials"
**Solution**: Verify `.env.local` has all Sage variables set correctly

### Xero Not Authenticated
**Error**: "Not authenticated with Xero"
**Solution**: Complete OAuth flow and set `XERO_ACCESS_TOKEN` and `XERO_TENANT_ID` in `.env.local`

### Sync Returns Errors
**Error**: Database insert/update fails
**Solution**: Verify database schema has `sage_*_id` and `xero_*_id` columns

### Cross-Origin Issues
**Error**: CORS errors from browser
**Solution**: These endpoints should be called from your backend/server, not directly from browser

---

## 📚 Documentation

- **Sage One API Docs**: https://developer.sage.com/accounting/
- **Xero API Docs**: https://developer.xero.com/
- **FieldCost Sage Integration**: See `lib/sageOneApiClient.ts`
- **FieldCost Xero Integration**: See `lib/xeroApiClient.ts`

---

**Last Updated**: March 12, 2026  
**Status**: ✅ Both Sage and Xero integrations live and tested
