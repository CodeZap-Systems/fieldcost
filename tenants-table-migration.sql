-- ============================================================================
-- TENANTS TABLE MIGRATION
-- Create a central tenants registry for multi-platform ERP isolation
-- ============================================================================

CREATE TABLE IF NOT EXISTS tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Company reference
  company_id INTEGER REFERENCES company_profiles(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Platform information
  platform VARCHAR(50) NOT NULL, -- 'sage' | 'xero'
  external_org_id VARCHAR(255) NOT NULL, -- Sage company ID or Xero tenantId
  
  -- Environment segregation (CRITICAL for GDPR/POPIA)
  environment VARCHAR(20) NOT NULL DEFAULT 'live', -- 'demo' | 'sandbox' | 'live'
  
  -- OAuth tokens
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  token_expires_at TIMESTAMP WITH TIME ZONE,
  
  -- Sync tracking
  last_sync_at TIMESTAMP WITH TIME ZONE,
  sync_status TEXT DEFAULT 'never', -- 'never' | 'in_progress' | 'success' | 'failed'
  sync_error_message TEXT,
  
  -- Metadata
  organization_name VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Indexes for performance
  UNIQUE(company_id, platform),
  UNIQUE(external_org_id, platform),
  CONSTRAINT valid_platform CHECK (platform IN ('sage', 'xero')),
  CONSTRAINT valid_environment CHECK (environment IN ('demo', 'sandbox', 'live'))
);

-- Create indexes
CREATE INDEX IF NOT EXISTS tenants_user_id_idx ON tenants(user_id);
CREATE INDEX IF NOT EXISTS tenants_company_id_idx ON tenants(company_id);
CREATE INDEX IF NOT EXISTS tenants_environment_idx ON tenants(environment);
CREATE INDEX IF NOT EXISTS tenants_platform_idx ON tenants(platform);

-- Add is_demo field to company_profiles if not exists
ALTER TABLE company_profiles ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT false;

-- Create audit log for tenant operations
CREATE TABLE IF NOT EXISTS tenant_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL, -- 'auth_requested', 'token_refreshed', 'sync_started', 'sync_completed', 'sync_failed', 'environment_checked'
  platform VARCHAR(50),
  environment VARCHAR(20),
  status VARCHAR(20), -- 'allowed' | 'blocked'
  reason TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for audit logs
CREATE INDEX IF NOT EXISTS tenant_audit_logs_tenant_id_idx ON tenant_audit_logs(tenant_id);
CREATE INDEX IF NOT EXISTS tenant_audit_logs_user_id_idx ON tenant_audit_logs(user_id);
CREATE INDEX IF NOT EXISTS tenant_audit_logs_created_at_idx ON tenant_audit_logs(created_at DESC);

-- Enable RLS on tenants table
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can access their own tenants
DROP POLICY IF EXISTS "Users can access their own tenants" ON tenants;
CREATE POLICY "Users can access their own tenants" ON tenants
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policy: Service role can manage tenants
DROP POLICY IF EXISTS "Service role can manage tenants" ON tenants;
CREATE POLICY "Service role can manage tenants" ON tenants
  FOR ALL USING (
    auth.role() = 'service_role' OR auth.uid() = user_id
  );

-- Enable RLS on audit logs
ALTER TABLE tenant_audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can see their own audit logs
DROP POLICY IF EXISTS "Users can view own tenant audit logs" ON tenant_audit_logs;
CREATE POLICY "Users can view own tenant audit logs" ON tenant_audit_logs
  FOR SELECT USING (auth.uid() = user_id);

-- ============================================================================
-- DEPLOYMENT INSTRUCTIONS
-- ============================================================================
-- 
-- 1. Copy this entire file
-- 2. Go to: https://app.supabase.com/project/[YOUR_PROJECT]/sql/new
-- 3. Paste and execute
-- 4. Verify: Check SQL Editor > tenants table exists
-- 5. Update app/lib/tenantGuard.ts (see next file)
-- 6. Update sync endpoints to use tenant guard
--
-- ============================================================================
