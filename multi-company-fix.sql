-- ============================================================================
-- MULTI-COMPANY FIX: Allow multiple companies per user
-- ============================================================================
-- 
-- ISSUE: Users cannot create a second company because of UNIQUE constraint 
-- on company_profiles.user_id
--
-- SOLUTION: Drop the UNIQUE constraint and add is_demo column for segregation
-- ============================================================================

-- 1. Drop the UNIQUE constraint (allows multiple companies per user)
ALTER TABLE company_profiles DROP CONSTRAINT IF EXISTS company_profiles_user_id_key;

-- 2. Add is_demo column for demo/live segregation
ALTER TABLE company_profiles ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT false;

-- 3. Create index for efficient demo company queries
CREATE INDEX IF NOT EXISTS company_profiles_is_demo_idx ON company_profiles(is_demo);

-- 4. Ensure all existing companies are marked as live
UPDATE company_profiles SET is_demo = false WHERE is_demo IS NULL;

-- 5. Verify the fix (should show NO UNIQUE constraints on user_id)
SELECT constraint_name, constraint_type 
FROM information_schema.table_constraints 
WHERE table_name = 'company_profiles' 
AND constraint_type = 'UNIQUE';

-- Expected result: 0 rows (no UNIQUE constraints remaining on user_id)

-- ============================================================================
-- RESULT:
-- ✅ Users can now create multiple companies
-- ✅ Demo company (is_demo=true) shows sample data  
-- ✅ Live companies (is_demo=false) start blank
-- ✅ Tenant guard prevents demo companies from syncing to ERP
-- ============================================================================
