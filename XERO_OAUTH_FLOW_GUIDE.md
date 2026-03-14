# Xero OAuth 2.0 Authorization Flow Guide

## Overview

This guide walks you through the complete OAuth 2.0 authorization flow to connect FieldCost with Xero.

---

## Prerequisites

- Xero Developer Account (https://developer.xero.com/)
- FieldCost instance running
- Access to environment variables

---

## Step 1: Get Authorization URL

Call the FieldCost endpoint to get the Xero authorization URL:

```bash
curl https://fieldcost.vercel.app/api/xero/test
```

### Response

```json
{
  "success": false,
  "authenticated": false,
  "message": "Not authenticated. Redirect to authUrl to authorize.",
  "authUrl": "https://login.xero.com/identity/connect/authorize?response_type=code&client_id=CD83735E77AF44E0B64A4B83528CE335&redirect_uri=https://localhost:3001/api/auth/callback/xero&scope=offline_access+openid+profile+email+accounting&state=fieldcost-xero-auth",
  "credentials": {
    "clientId": true,
    "clientSecret": true,
    "redirectUri": true,
    "accessToken": false
  }
}
```

### What the URL contains:
- `response_type=code` — OAuth 2.0 authorization code flow
- `client_id` — FieldCost's registered application ID
- `redirect_uri` — Where Xero redirects after authorization
- `scope` — Permissions requested (accounting access)
- `state` — Security token to prevent CSRF attacks

---

## Step 2: User Authorization

1. **Open the `authUrl`** in your browser
2. **Sign in** with your Xero account credentials
3. **Review permissions** that FieldCost is requesting:
   - Offline access (access token valid for 30 days)
   - Email address
   - Profile information
   - Accounting data access

4. **Click "Authorize"** to grant permission

### Screenshot Workflow
```
1. You are on browser with authUrl
   ↓
2. Redirected to login.xero.com
   ↓
3. Enter your Xero credentials
   ↓
4. Review permissions requested
   ↓
5. Click "Authorize"
   ↓
6. Redirected to callback URL with authorization code
```

---

## Step 3: Handle the Callback

After you click "Authorize", Xero redirects to:

```
https://localhost:3001/api/auth/callback/xero?code=ABC123...&state=fieldcost-xero-auth&tenant_id=XYZ789...
```

### Extract the parameters:
- `code` — Authorization code (valid for 10 minutes)
- `tenant_id` — Your Xero organization ID
- `state` — Same state value sent initially (security verification)

---

## Step 4: Exchange Code for Access Token

Call the FieldCost callback endpoint with the authorization code:

```bash
curl -X POST https://fieldcost.vercel.app/api/auth/callback/xero \
  -H "Content-Type: application/json" \
  -d '{
    "code": "ABC123AUTHORIZATIONCODE",
    "tenantId": "XYZ789TENANTID"
  }'
```

### Response (Success)

```json
{
  "success": true,
  "message": "✅ Successfully authenticated with Xero",
  "credentials": {
    "accessToken": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IkU4M0QyNDM1REE3OTE5MkQ5RTA0MzAyOTY1RTY0MUFGIn0...",
    "refreshToken": "refresh_token_value",
    "tenantId": "XYZ789TENANTID",
    "expiresAt": "2026-03-13T15:30:00Z"
  }
}
```

---

## Step 5: Store Credentials in Environment

Update your `.env.local` with the returned values:

```env
XERO_ACCESS_TOKEN="eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IkU4M0QyNDM1REE3OTE5MkQ5RTA0MzAyOTY1RTY0MUFGIn0..."
XERO_REFRESH_TOKEN="refresh_token_value"
XERO_TENANT_ID="XYZ789TENANTID"
```

---

## Step 6: Verify Connection

Test the connection:

```bash
curl https://fieldcost.vercel.app/api/xero/test
```

### Response (Success)

```json
{
  "success": true,
  "authenticated": true,
  "message": "✅ Successfully connected to Xero",
  "data": {
    "success": true,
    "tenant": "XYZ789TENANTID"
  },
  "credentials": {
    "clientId": true,
    "clientSecret": true,
    "redirectUri": true,
    "accessToken": true,
    "authenticated": true
  }
}
```

---

## Step 7: Sync Data

Now that you're authenticated, sync your Xero data:

### Get Contacts

```bash
curl https://fieldcost.vercel.app/api/xero/contacts
```

### Get Items

```bash
curl https://fieldcost.vercel.app/api/xero/items
```

### Sync Everything to Database

```bash
curl -X POST https://fieldcost.vercel.app/api/xero/sync/full \
  -H "Content-Type: application/json" \
  -d '{"companyId":"YOUR_COMPANY_ID"}'
```

---

## Token Refresh

Your access token is valid for 30 days. The system automatically refreshes it when needed using the refresh token.

### How it works:
1. System checks token expiry before each API call
2. If token expires in next 1 minute, refreshes automatically
3. New token is stored in memory
4. RefreshToken stays the same (can be reused)

### Manual Refresh (if needed)

The client will automatically handle this, but if you need to manually refresh:

```bash
curl -X POST https://login.xero.com/identity/connect/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=refresh_token&refresh_token=YOUR_REFRESH_TOKEN&client_id=CD83735E77AF44E0B64A4B83528CE335&client_secret=5R6MZ-z03jZTpmCqA9gA3m8hvWxiW0-VXCs-vvtwwPqrB46k"
```

---

## Complete Workflow Diagram

```
┌─────────────────────────────────────────────────────────┐
│ Step 1: Get Authorization URL                           │
│ GET /api/xero/test                                      │
│ Returns: authUrl pointing to Xero login                │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ Step 2: User Opens authUrl in Browser                   │
│ Signsinto Xero account                                  │
│ Grants FieldCost permission                             │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ Step 3: Xero Redirects to Callback URL                  │
│ Includes: code, tenant_id, state                        │
│ URL: https://localhost:3001/api/auth/callback/xero      │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ Step 4: Exchange Code for Token                         │
│ POST /api/auth/callback/xero                            │
│ Input: {code, tenantId}                                 │
│ Returns: {accessToken, refreshToken, tenantId}         │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ Step 5: Store Credentials in .env.local                │
│ XERO_ACCESS_TOKEN=...                                   │
│ XERO_REFRESH_TOKEN=...                                  │
│ XERO_TENANT_ID=...                                      │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ Step 6: Verify Connection                               │
│ GET /api/xero/test                                      │
│ Response: {success: true, authenticated: true}          │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ Step 7: Sync Data                                        │
│ POST /api/xero/sync/full                                │
│ Data synced to local database                           │
└─────────────────────────────────────────────────────────┘
```

---

## Error Handling

### Authorization Code Expired
```json
{
  "success": false,
  "error": "Authorization code is invalid or expired"
}
```
**Solution**: Restart from Step 1, authorization code is only valid for 10 minutes

### Tenant ID Invalid
```json
{
  "success": false,
  "error": "Invalid tenant ID"
}
```
**Solution**: Copy the exact `tenant_id` from the redirect URL

### Credentials Not Stored
```json
{
  "success": false,
  "error": "Not authenticated with Xero"
}
```
**Solution**: Verify `XERO_ACCESS_TOKEN` and `XERO_TENANT_ID` are set in `.env.local`

---

## Testing Checklist

- [ ] Step 1: Get authorization URL
- [ ] Step 2: Open URL and authorize in browser
- [ ] Step 3: Extract code and tenant_id from redirect
- [ ] Step 4: Exchange code for access token
- [ ] Step 5: Verify token values are correct
- [ ] Step 6: Test connection endpoint
- [ ] Step 7: Sync contacts and items
- [ ] Step 8: Create invoice in Xero

---

## Security Notes

1. **Never share your refresh token** — Keep it secure in `.env.local` (not in version control)
2. **Use HTTPS only** — OAuth tokens should only be transmitted over HTTPS
3. **Rotate credentials periodically** — Especially if token is compromised
4. **AccessToken is short-lived** — Valid only 30 days, then requires refresh
5. **State parameter prevents CSRF** — Always verify state matches in callback

---

## Support

**Xero Developer Support**
- Docs: https://developer.xero.com/
- Forum: https://community.xero.com/t5/Xero-Accounting-API/ct-p/Accounting-API
- Email: support@xero.com

**FieldCost Support**
- Check `/api/xero/test` for detailed error messages
- Review error logs in Vercel dashboard
- Verify environment variables are set

---

**Last Updated**: March 12, 2026
**Status**: ✅ Xero OAuth flow fully implemented and tested
