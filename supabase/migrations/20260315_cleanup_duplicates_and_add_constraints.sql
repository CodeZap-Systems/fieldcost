-- Migration: Clean up duplicate data and add unique constraints
-- Date: 2026-03-15
-- Purpose: Remove duplicate items, customers, projects, invoices and prevent future duplicates

-- 1. CLEANUP DUPLICATES BY KEEPING FIRST OCCURRENCE

-- Items: Remove duplicates (keep earliest created_at)
DELETE FROM items
WHERE id IN (
  SELECT id FROM (
    SELECT id, ROW_NUMBER() OVER (PARTITION BY company_id, LOWER(name) ORDER BY created_at ASC, id ASC) as rn
    FROM items
  ) t
  WHERE rn > 1
);

-- Customers: Remove duplicates (keep earliest created_at)
DELETE FROM customers
WHERE id IN (
  SELECT id FROM (
    SELECT id, ROW_NUMBER() OVER (PARTITION BY company_id, LOWER(name) ORDER BY created_at ASC, id ASC) as rn
    FROM customers
  ) t
  WHERE rn > 1
);

-- Projects: Remove duplicates (keep earliest created_at)
DELETE FROM projects
WHERE id IN (
  SELECT id FROM (
    SELECT id, ROW_NUMBER() OVER (PARTITION BY company_id, LOWER(name) ORDER BY created_at ASC, id ASC) as rn
    FROM projects
  ) t
  WHERE rn > 1
);

-- Invoices: Remove duplicates (keep earliest by invoice_number, or created_at if no number)
DELETE FROM invoices
WHERE id IN (
  SELECT id FROM (
    SELECT id, ROW_NUMBER() OVER (
      PARTITION BY company_id, COALESCE(invoice_number, 'UNNUMBERED_' || customer_id)
      ORDER BY created_at ASC, id ASC
    ) as rn
    FROM invoices
  ) t
  WHERE rn > 1
);

-- 2. ADD UNIQUE CONSTRAINTS TO PREVENT FUTURE DUPLICATES

-- Items: Unique constraint on (company_id, name)
ALTER TABLE items
ADD CONSTRAINT items_company_id_name_unique UNIQUE (company_id, LOWER(name));

-- Customers: Unique constraint on (company_id, name)
ALTER TABLE customers
ADD CONSTRAINT customers_company_id_name_unique UNIQUE (company_id, LOWER(name));

-- Customers: Unique constraint on email per company (when email is not null)
ALTER TABLE customers
ADD CONSTRAINT customers_company_id_email_unique UNIQUE (company_id, LOWER(email));

-- Projects: Unique constraint on (company_id, name)
ALTER TABLE projects
ADD CONSTRAINT projects_company_id_name_unique UNIQUE (company_id, LOWER(name));

-- Invoices: Unique constraint on invoice_number per company (when invoice_number is not null)
ALTER TABLE invoices
ADD CONSTRAINT invoices_company_id_number_unique UNIQUE (company_id, invoice_number);

-- 3. ADD CHECK CONSTRAINTS FOR DATA INTEGRITY

-- Ensure items have non-empty names
ALTER TABLE items
ADD CONSTRAINT items_name_not_empty CHECK (TRIM(name) <> '');

-- Ensure customers have non-empty names
ALTER TABLE customers
ADD CONSTRAINT customers_name_not_empty CHECK (TRIM(name) <> '');

-- Ensure projects have non-empty names
ALTER TABLE projects
ADD CONSTRAINT projects_name_not_empty CHECK (TRIM(name) <> '');

-- 4. LOG MIGRATION COMPLETION
INSERT INTO _prisma_migrations (id, checksum, finished_at, execution_time, migration_name, logs, rolled_back_at, started_at, applied_steps_count)
VALUES (
  'cleanup_duplicates_20260315',
  'checksum_' || NOW()::text,
  NOW(),
  0,
  'cleanup_duplicates_and_add_constraints',
  'Removed duplicate items, customers, projects, and invoices. Added unique constraints.',
  NULL,
  NOW(),
  1
) ON CONFLICT (id) DO NOTHING;
