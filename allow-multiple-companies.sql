-- ============================================================================
-- FIX: Allow multiple companies per user (drop UNIQUE constraint)
-- ============================================================================

-- Drop the unique constraint that prevents multiple companies per user
ALTER TABLE company_profiles DROP CONSTRAINT IF EXISTS company_profiles_user_id_key;

-- Add is_demo column if it doesn't exist
ALTER TABLE company_profiles ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT false;

-- Create an index for is_demo queries
CREATE INDEX IF NOT EXISTS company_profiles_is_demo_idx ON company_profiles(is_demo);

-- Ensure all companies have is_demo set
UPDATE company_profiles SET is_demo = false WHERE is_demo IS NULL;

-- ============================================================================
-- EXPLANATION
-- ============================================================================
-- 
-- BEFORE: company_profiles table had UNIQUE(user_id) constraint
-- PROBLEM: Prevented users from creating multiple companies
-- 
-- AFTER:
-- - Users can have multiple companies (one demo, many live)
-- - Demo company: is_demo = true, shows sample data
-- - Live companies: is_demo = false, start blank
-- 
-- DEMO COMPANY RULES:
-- - Each user gets ONE demo company (seed when they first login)
-- - is_demo = true
-- - Contains sample inventory, customers, projects
-- - Cannot sync to Xero/Sage (blocked by tenant guard)
-- 
-- LIVE COMPANY RULES:
-- - Users can create unlimited live companies
-- - is_demo = false
-- - Start completely blank (no sample data)
-- - Can sync to Xero/Sage (requires tenant registration)
-- 
-- ============================================================================
