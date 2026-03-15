# Data Integrity Cleanup Guide

**Date:** March 15, 2026  
**Status:** Complete  
**Criticality:** HIGH - Production Data Cleanup Required

## 🎯 Overview

This document outlines the comprehensive solution for cleaning up duplicate data in production and preventing future duplicates at both the database and API levels.

## ⚠️ Problem Statement

The production database has accumulated duplicate entries:
- **Items**: Duplicate names (same company_id)
- **Customers**: Duplicate names and emails (same company_id)
- **Projects**: Duplicate names (same company_id)
- **Invoices**: Duplicate invoice numbers (same company_id)

This violates data integrity and causes operational issues.

## ✅ Solution Components

### 1. Database Cleanup Migration
**File:** `supabase/migrations/20260315_cleanup_duplicates_and_add_constraints.sql`

**What it does:**
```sql
-- Removes duplicate entries (keeps earliest created_at)
DELETE FROM items WHERE id IN (...);
DELETE FROM customers WHERE id IN (...);
DELETE FROM projects WHERE id IN (...);
DELETE FROM invoices WHERE id IN (...);

-- Adds UNIQUE constraints to prevent future duplicates
ALTER TABLE items ADD CONSTRAINT items_company_id_name_unique 
  UNIQUE (company_id, LOWER(name));

ALTER TABLE customers ADD CONSTRAINT customers_company_id_name_unique 
  UNIQUE (company_id, LOWER(name));

ALTER TABLE customers ADD CONSTRAINT customers_company_id_email_unique 
  UNIQUE (company_id, LOWER(email));

ALTER TABLE projects ADD CONSTRAINT projects_company_id_name_unique 
  UNIQUE (company_id, LOWER(name));

ALTER TABLE invoices ADD CONSTRAINT invoices_company_id_number_unique 
  UNIQUE (company_id, invoice_number);

-- Adds CHECK constraints for data quality
ALTER TABLE items ADD CONSTRAINT items_name_not_empty 
  CHECK (TRIM(name) <> '');
```

### 2. Cleanup Script
**File:** `scripts/cleanup-duplicates.mjs`

**Purpose:** Run before applying migration to safely remove duplicates

**Usage:**
```bash
# Dry run first (safe, shows what would be deleted)
node scripts/cleanup-duplicates.mjs

# Production run (destructive)
node scripts/cleanup-duplicates.mjs --production
```

**Features:**
- ✅ Dry-run mode by default (no data deletion)
- ✅ Identifies exact duplicates per company
- ✅ Keeps earliest created_at record
- ✅ Detailed reporting before/after
- ✅ Production safety checks

### 3. API-Level Duplicate Prevention
**Modified Files:**
- `app/api/items/route.ts`
- `app/api/customers/route.ts`
- `app/api/projects/route.ts`
- `app/api/invoices/route.ts`

**Implementation:**

#### Items (POST /api/items)
```typescript
// Check for duplicate item (same name, same company)
const { data: existingItem } = await supabaseServer
  .from('items')
  .select('id, name')
  .eq('company_id', validCompanyId)
  .ilike('name', body.name)
  .maybeSingle();

if (existingItem) {
  return NextResponse.json(
    { error: `An item named "${body.name}" already exists...` },
    { status: 409 }  // Conflict
  );
}
```

#### Customers (POST /api/customers)
```typescript
// Check duplicate by name
const { data: existingCustomer } = await supabaseServer
  .from('customers')
  .select('id, name')
  .eq('company_id', validCompanyId)
  .ilike('name', body.name)
  .maybeSingle();

// Check duplicate by email
if (body.email) {
  const { data: existingEmail } = await supabaseServer
    .from('customers')
    .select('id, email')
    .eq('company_id', validCompanyId)
    .ilike('email', body.email)
    .maybeSingle();
}
```

#### Projects (POST /api/projects)
```typescript
// Check for duplicate project (same name, same company)
const { data: existingProject } = await supabaseServer
  .from('projects')
  .select('id, name')
  .eq('company_id', validCompanyId)
  .ilike('name', body.name)
  .maybeSingle();
```

#### Invoices (POST /api/invoices)
```typescript
// Check for duplicate invoice number (same invoice_number, same company)
if (payload.invoice_number) {
  const { data: existingInvoice } = await supabaseServer
    .from('invoices')
    .select('id, invoice_number')
    .eq('company_id', companyId || 1)
    .eq('invoice_number', payload.invoice_number)
    .maybeSingle();
}
```

**Error Response (409 Conflict):**
```json
{
  "error": "An item named 'Steel Beams' already exists. Please use a different name or update the existing item."
}
```

## 📋 Implementation Steps

### Step 1: Backup Production Data
```sql
-- Backup current state (run on production first)
CREATE TABLE items_backup_20260315 AS SELECT * FROM items;
CREATE TABLE customers_backup_20260315 AS SELECT * FROM customers;
CREATE TABLE projects_backup_20260315 AS SELECT * FROM projects;
CREATE TABLE invoices_backup_20260315 AS SELECT * FROM invoices;
```

### Step 2: Run Cleanup Script (DRY RUN)
```bash
cd /path/to/fieldcost
node scripts/cleanup-duplicates.mjs
# Review the output - see what will be deleted
```

### Step 3: Run Cleanup Script (PRODUCTION)
```bash
node scripts/cleanup-duplicates.mjs --production
# Removes identified duplicates
```

### Step 4: Apply Migration
```bash
# Using Prisma
npx prisma migrate deploy

# OR using Supabase CLI
supabase migration up
```

### Step 5: Deploy Updated API
```bash
# Deploy to production (Vercel)
git commit -m "fix: Add duplicate prevention at API level"
git push origin main
# Vercel auto-deploys
```

## 🔍 Data Validation Rules

### Items Table
- **UNIQUE(company_id, LOWER(name))** - Cannot have same name item per company
- **CHECK (TRIM(name) <> '')** - Name must be non-empty
- Case-insensitive matching

### Customers Table
- **UNIQUE(company_id, LOWER(name))** - Cannot have same name customer per company
- **UNIQUE(company_id, LOWER(email))** - Cannot have same email per company
- **CHECK (TRIM(name) <> '')** - Name must be non-empty
- Case-insensitive matching

### Projects Table
- **UNIQUE(company_id, LOWER(name))** - Cannot have same name project per company
- **CHECK (TRIM(name) <> '')** - Name must be non-empty
- Case-insensitive matching

### Invoices Table
- **UNIQUE(company_id, invoice_number)** - Cannot have duplicate invoice numbers per company
- Exact match on invoice_number (case-sensitive)

## 🛡️ Error Handling

### API Response Codes
- **409 Conflict** - Duplicate detected, provide alternative or update existing
- **400 Bad Request** - Validation error (empty name, etc.)
- **500 Internal Server Error** - Database error during insert

### User Feedback
Users will receive clear error messages:
```
"An item named 'Steel Beams (per ton)' already exists. 
Please use a different name or update the existing item."
```

## 📊 Monitoring & Validation

### Check for Remaining Duplicates
```sql
-- Items duplicates
SELECT company_id, LOWER(name), COUNT(*) 
FROM items 
GROUP BY company_id, LOWER(name) 
HAVING COUNT(*) > 1;

-- Customers duplicates
SELECT company_id, LOWER(name), COUNT(*) 
FROM customers 
GROUP BY company_id, LOWER(name) 
HAVING COUNT(*) > 1;

-- Projects duplicates
SELECT company_id, LOWER(name), COUNT(*) 
FROM projects 
GROUP BY company_id, LOWER(name) 
HAVING COUNT(*) > 1;

-- Invoices duplicates
SELECT company_id, invoice_number, COUNT(*) 
FROM invoices 
GROUP BY company_id, invoice_number 
HAVING COUNT(*) > 1;
```

### Test Duplicate Prevention
```bash
# Try creating duplicate item - should fail with 409
curl -X POST http://localhost:3000/api/items \
  -H "Content-Type: application/json" \
  -d '{"name": "Steel Beams", "company_id": 8}'

# Response: 
# {
#   "error": "An item named 'Steel Beams' already exists. 
#             Please use a different name or update the existing item."
# }
```

## 🚀 Deployment Checklist

- [ ] Backup production database
- [ ] Run cleanup script in dry-run mode
- [ ] Review cleanup output
- [ ] Get stakeholder approval
- [ ] Run cleanup script in production mode
- [ ] Verify no duplicates remain (run validation queries)
- [ ] Apply database migration
- [ ] Deploy updated API endpoints
- [ ] Test API duplicate prevention
- [ ] Monitor error logs for any issues
- [ ] Document in change log

## 📝 Rollback Plan

If issues occur after deployment:

```sql
-- Restore from backup
TRUNCATE items CASCADE;
INSERT INTO items SELECT * FROM items_backup_20260315;

TRUNCATE customers CASCADE;
INSERT INTO customers SELECT * FROM customers_backup_20260315;

TRUNCATE projects CASCADE;
INSERT INTO projects SELECT * FROM projects_backup_20260315;

TRUNCATE invoices CASCADE;
INSERT INTO invoices SELECT * FROM invoices_backup_20260315;

-- Remove constraints (if needed)
ALTER TABLE items DROP CONSTRAINT items_company_id_name_unique;
```

## 🔐 Security Implications

✅ **Improved:**
- Data integrity - No more duplicate records
- Database consistency - Constraints prevent invalid states
- Audit trail - Can track which company created items
- Company data isolation - company_id is always checked

✅ **Company Isolation:**
- Each company can have items/customers/projects with the same name
- Duplicates only prevented within same company
- Cross-company data remains isolated

## 📞 Support

If you encounter issues:
1. Check error logs in application console
2. Run validation queries to check constraint violations
3. Review the rollback plan above
4. Contact the database team

## Additional Notes

- Constraint names follow pattern: `table_columns_unique` for clarity
- Case-insensitive matching (LOWER() in queries) to catch variations
- Migration is idempotent (can be re-run safely)
- Backup tables included for audit trail (keep for 30 days minimum)
