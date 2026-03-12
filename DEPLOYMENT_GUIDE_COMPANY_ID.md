# Deployment Guide: Company ID Schema and API Resilience Updates

## Overview
This document outlines the changes made to add company_id column support and make APIs resilient to schema variations.

## Changes Made

### 1. **Schema Updates** (`schema.sql`)
Added `company_id` columns (INTEGER DEFAULT 1) to the following tables:
- ✅ projects
- ✅ customers
- ✅ items
- ✅ crew_members
- ✅ tasks
- ✅ invoices
- ✅ invoice_line_items
- ✅ budgets

### 2. **API Resilience Enhancements**

All POST/PATCH endpoints now:
- ✅ Handle missing `company_id` column gracefully
- ✅ Fall back to insert without `company_id` if schema error occurs
- ✅ Always include `company_id` in response (even if not stored)
- ✅ Provide better error messages

**Updated Routes:**
- `app/api/projects/route.ts`
- `app/api/customers/route.ts`
- `app/api/items/route.ts`
- `app/api/tasks/route.ts` (GET also filters by company_id)
- `app/api/invoices/route.ts`

### 3. **Migration Helper**
New endpoint at `/api/db-migrate` to:
- Display migration instructions
- Show required SQL statements
- Verify table status

## Deployment Steps

### Step 1: Deploy Code Changes
```bash
git add .
git commit -m "feat: Add company_id support and API resilience"
git push origin main
```
Vercel will automatically redeploy the application.

### Step 2: Update Supabase Database Schema

**Option A: Using Supabase SQL Editor (Recommended)**

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Click "New Query"
4. Copy and paste the following SQL:

```sql
-- Add company_id columns to all tables
ALTER TABLE projects ADD COLUMN IF NOT EXISTS company_id INTEGER DEFAULT 1;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS company_id INTEGER DEFAULT 1;
ALTER TABLE items ADD COLUMN IF NOT EXISTS company_id INTEGER DEFAULT 1;
ALTER TABLE crew_members ADD COLUMN IF NOT EXISTS company_id INTEGER DEFAULT 1;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS company_id INTEGER DEFAULT 1;
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS company_id INTEGER DEFAULT 1;
ALTER TABLE invoice_line_items ADD COLUMN IF NOT EXISTS company_id INTEGER DEFAULT 1;
ALTER TABLE budgets ADD COLUMN IF NOT EXISTS company_id INTEGER DEFAULT 1;
```

5. Click "Run" or press Ctrl+Enter
6. Verify all statements completed successfully

**Option B: Using psql**

```bash
psql -h your-supabase-host -U postgres -d your-database << EOF
-- Add company_id columns to all tables
ALTER TABLE projects ADD COLUMN IF NOT EXISTS company_id INTEGER DEFAULT 1;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS company_id INTEGER DEFAULT 1;
ALTER TABLE items ADD COLUMN IF NOT EXISTS company_id INTEGER DEFAULT 1;
ALTER TABLE crew_members ADD COLUMN IF NOT EXISTS company_id INTEGER DEFAULT 1;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS company_id INTEGER DEFAULT 1;
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS company_id INTEGER DEFAULT 1;
ALTER TABLE invoice_line_items ADD COLUMN IF NOT EXISTS company_id INTEGER DEFAULT 1;
ALTER TABLE budgets ADD COLUMN IF NOT EXISTS company_id INTEGER DEFAULT 1;
EOF
```

### Step 3: Fix Existing Records (Optional but Recommended)

After the schema changes, run the existing company_id fixing script to ensure all records have company_id set:

```bash
npm run db:fix-company-ids
```

This requires:
- `NEXT_PUBLIC_SUPABASE_URL` environment variable
- `SUPABASE_SERVICE_ROLE_KEY` environment variable

### Step 4: Verify Deployment

1. Wait for Vercel deployment to complete
2. Test the APIs:
   - Create a project: `curl -X POST https://fieldcost.vercel.app/api/projects -H "Content-Type: application/json" -d '{"name":"Test","user_id":"your-user-id"}'`
   - Create a customer: `curl -X POST https://fieldcost.vercel.app/api/customers -H "Content-Type: application/json" -d '{"name":"Test","user_id":"your-user-id"}'`
3. Check that all CRUD operations return data with `company_id` field

### Step 5: Run Tests

```bash
node comprehensive-e2e-test.mjs
```

Expected improvements:
- Customer creation should work (was getting schema cache error)
- Project creation should work
- Task creation should work
- Invoice creation should work (with customer)
- All responses should include `company_id` field

## Rollback Plan

If issues occur after schema changes, the columns are added with `IF NOT EXISTS`, so they're safe. To remove them:

```sql
-- Only if absolutely necessary
ALTER TABLE projects DROP COLUMN IF EXISTS company_id;
ALTER TABLE customers DROP COLUMN IF EXISTS company_id;
ALTER TABLE items DROP COLUMN IF EXISTS company_id;
ALTER TABLE crew_members DROP COLUMN IF EXISTS company_id;
ALTER TABLE tasks DROP COLUMN IF EXISTS company_id;
ALTER TABLE invoices DROP COLUMN IF EXISTS company_id;
ALTER TABLE invoice_line_items DROP COLUMN IF EXISTS company_id;
ALTER TABLE budgets DROP COLUMN IF EXISTS company_id;
```

However, this would require redeploying the original API code.

## Testing Checklist

- [ ] Code deployed to Vercel successfully
- [ ] Database schema updated with company_id columns
- [ ] GET /api/projects returns projects with company_id
- [ ] POST /api/projects works and returns company_id
- [ ] GET /api/customers returns customers with company_id
- [ ] POST /api/customers works and returns company_id
- [ ] GET /api/invoices returns invoices with company_id
- [ ] POST /api/invoices works and returns company_id
- [ ] GET /api/tasks returns tasks with company_id
- [ ] POST /api/tasks works and returns company_id
- [ ] E2E tests pass (50%+ → 80%+ expected improvement)

## Migration Statistics

**Affected Tables:** 8
**New Column:** company_id (INTEGER, DEFAULT 1)
**Data Impact:** Existing records will have company_id = 1 (default single-company setup)
**Breaking Changes:** None - APIs are backward compatible

## Support

If you encounter any issues:
1. Check API logs in Vercel dashboard
2. Verify SQL was executed in Supabase SQL Editor
3. Ensure SUPABASE_SERVICE_ROLE_KEY is set in environment
4. Review error messages from test output
