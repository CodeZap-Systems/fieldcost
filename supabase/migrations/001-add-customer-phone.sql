-- ============================================================================
-- FIELDCOST SCHEMA MIGRATIONS
-- ============================================================================
-- 
-- Apply these migrations in Supabase SQL Editor to fix blocking issues
-- URL: https://app.supabase.com/project/mukaeylwmzztycajibhy/sql/new
--
-- ============================================================================

-- MIGRATION 1: Add phone column to customers table
-- Purpose: Allows customer phone numbers to be stored
-- Status:  REQUIRED for invoice creation feature
-- ============================================================================

ALTER TABLE customers ADD COLUMN IF NOT EXISTS phone text;

-- Verify the column was added:
-- SELECT column_name, data_type FROM information_schema.columns 
-- WHERE table_name = 'customers' AND column_name = 'phone';


-- ============================================================================
-- AFTER RUNNING MIGRATIONS
-- ============================================================================
-- 
-- 1. Refresh Supabase schema cache:
--    - Close and reopen SQL editor
--    - Or wait 30 seconds for automatic refresh
--
-- 2. Test the fix:
--    npm run dev
--    node customer-journey-test.mjs
--
-- 3. Expected results after fix:
--    - POST /api/customers should work (201 status)
--    - POST /api/invoices should work (201 status)
--    - Customer Journey test: 8-9/10 passing (was 5/10)
--
-- ============================================================================
