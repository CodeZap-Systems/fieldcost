/**
 * FIELDCOST ADMIN CMS - Database Schema
 * 
 * Comprehensive schema for managing:
 * - Subscription plans and pricing
 * - Billing and payments
 * - Feature access by tier
 * - User/Company subscriptions
 * - Admin settings and configurations
 */

-- ============================================================================
-- SUBSCRIPTION & BILLING MANAGEMENT
-- ============================================================================

CREATE TABLE subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Plan basics
  name TEXT NOT NULL,              -- "Starter", "Growth", "Enterprise"
  tier_level INT NOT NULL,         -- 1, 2, 3
  description TEXT,
  display_order INT DEFAULT 1,
  
  -- Pricing
  monthly_price DECIMAL(10, 2) NOT NULL,
  annual_price DECIMAL(10, 2),
  setup_fee DECIMAL(10, 2) DEFAULT 0,
  currency TEXT DEFAULT 'ZAR',
  
  -- Features included
  max_projects INT DEFAULT -1,     -- -1 = unlimited
  max_tasks INT DEFAULT -1,
  max_team_members INT DEFAULT -1,
  max_invoices INT DEFAULT -1,
  max_storage_gb INT DEFAULT 5,
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  CONSTRAINT unique_plan_name UNIQUE(name)
);

CREATE TABLE plan_features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id UUID NOT NULL REFERENCES subscription_plans(id) ON DELETE CASCADE,
  
  -- Feature
  feature_key TEXT NOT NULL,        -- "wip-tracking", "geolocation", "erp-sync"
  feature_name TEXT NOT NULL,       -- Display name
  feature_category TEXT DEFAULT 'core',  -- 'core', 'integration', 'advanced'
  is_enabled BOOLEAN DEFAULT true,
  
  -- Quota limits (null = unlimited)
  max_usage INT,
  reset_period TEXT DEFAULT 'monthly',  -- 'monthly', 'yearly', 'never'
  
  created_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT unique_plan_feature UNIQUE(plan_id, feature_key)
);

CREATE TABLE company_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Company reference
  company_id UUID NOT NULL UNIQUE REFERENCES company_profiles(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES subscription_plans(id),
  
  -- Subscription status
  status TEXT DEFAULT 'active',     -- 'trial', 'active', 'paused', 'cancelled', 'expired'
  subscription_date TIMESTAMP DEFAULT NOW(),
  start_date TIMESTAMP DEFAULT NOW(),
  end_date TIMESTAMP,
  renewal_date TIMESTAMP,
  cancelled_at TIMESTAMP,
  
  -- Custom overrides
  custom_max_projects INT,
  custom_max_team_members INT,
  override_features TEXT[],         -- JSON array of additional features granted
  
  -- Billing
  billing_cycle TEXT DEFAULT 'monthly',  -- 'monthly', 'annual'
  auto_renew BOOLEAN DEFAULT true,
  
  -- Discount
  discount_percent DECIMAL(5, 2) DEFAULT 0,
  discount_reason TEXT,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE billing_invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- References
  company_id UUID NOT NULL REFERENCES company_profiles(id) ON DELETE CASCADE,
  subscription_id UUID NOT NULL REFERENCES company_subscriptions(id) ON DELETE CASCADE,
  
  -- Invoice details
  invoice_number TEXT NOT NULL UNIQUE,  -- INV-2026-001
  status TEXT DEFAULT 'draft',      -- 'draft', 'sent', 'paid', 'overdue', 'cancelled'
  
  -- Amount
  subtotal DECIMAL(12, 2) NOT NULL,
  tax_amount DECIMAL(12, 2) DEFAULT 0,
  discount_amount DECIMAL(12, 2) DEFAULT 0,
  total_amount DECIMAL(12, 2) NOT NULL,
  paid_amount DECIMAL(12, 2) DEFAULT 0,
  
  -- Dates
  issue_date DATE NOT NULL,
  due_date DATE NOT NULL,
  paid_date DATE,
  
  -- Description
  invoice_items TEXT,               -- JSON array of line items
  notes TEXT,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE payment_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Company reference
  company_id UUID NOT NULL REFERENCES company_profiles(id) ON DELETE CASCADE,
  
  -- Payment method
  payment_type TEXT NOT NULL,       -- 'credit_card', 'bank_transfer', 'check'
  is_primary BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  
  -- Card (encrypted in production)
  card_last_four TEXT,
  card_brand TEXT,
  card_expiry TEXT,
  
  -- Bank transfer
  bank_name TEXT,
  account_number TEXT,
  account_holder TEXT,
  
  -- Reference
  external_payment_id TEXT,         -- Payment gateway reference
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE payment_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- References
  company_id UUID NOT NULL REFERENCES company_profiles(id) ON DELETE CASCADE,
  invoice_id UUID REFERENCES billing_invoices(id) ON DELETE SET NULL,
  payment_method_id UUID REFERENCES payment_methods(id),
  
  -- Transaction details
  transaction_type TEXT NOT NULL,   -- 'charge', 'refund', 'adjustment'
  amount DECIMAL(12, 2) NOT NULL,
  currency TEXT DEFAULT 'ZAR',
  
  -- Status
  status TEXT DEFAULT 'pending',    -- 'pending', 'success', 'failed', 'reversed'
  status_message TEXT,
  
  -- Payment gateway
  payment_gateway TEXT DEFAULT 'stripe',  -- 'stripe', 'payfast', 'manual'
  gateway_transaction_id TEXT,
  gateway_response TEXT,            -- JSON
  
  -- Retry info
  retry_count INT DEFAULT 0,
  next_retry_at TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- FEATURE ACCESS & QUOTAS
-- ============================================================================

CREATE TABLE feature_quotas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Reference
  company_id UUID NOT NULL REFERENCES company_profiles(id) ON DELETE CASCADE,
  feature_key TEXT NOT NULL,
  
  -- Usage tracking
  current_usage INT DEFAULT 0,
  max_quota INT,                    -- null = unlimited
  reset_period TEXT DEFAULT 'monthly',
  reset_date TIMESTAMP,
  
  -- Status
  is_exceeded BOOLEAN DEFAULT false,
  last_reset_at TIMESTAMP DEFAULT NOW(),
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  CONSTRAINT unique_company_feature UNIQUE(company_id, feature_key)
);

CREATE TABLE feature_usage_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Reference
  company_id UUID NOT NULL REFERENCES company_profiles(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  feature_key TEXT NOT NULL,
  
  -- Usage
  usage_amount INT DEFAULT 1,
  action TEXT,                      -- 'create', 'update', 'export', 'sync'
  resource_type TEXT,               -- 'invoice', 'project', 'task'
  resource_id TEXT,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- TRIAL MANAGEMENT
-- ============================================================================

CREATE TABLE trial_periods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Reference
  company_id UUID NOT NULL UNIQUE REFERENCES company_profiles(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Trial details
  plan_id UUID NOT NULL REFERENCES subscription_plans(id),
  trial_tier INT,                   -- Which tier to trial
  days_duration INT DEFAULT 14,
  
  -- Status
  status TEXT DEFAULT 'active',     -- 'active', 'converted', 'expired', 'cancelled'
  
  start_date TIMESTAMP DEFAULT NOW(),
  end_date TIMESTAMP,
  converted_at TIMESTAMP,           -- When they upgraded from trial
  
  -- Tracking
  has_payment_method BOOLEAN DEFAULT false,
  requires_payment_to_continue BOOLEAN DEFAULT true,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE trial_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  company_id UUID NOT NULL REFERENCES company_profiles(id) ON DELETE CASCADE,
  trial_period_id UUID NOT NULL REFERENCES trial_periods(id) ON DELETE CASCADE,
  
  -- Notification
  notification_type TEXT NOT NULL,  -- '3-days-left', '1-day-left', 'expired'
  sent_at TIMESTAMP DEFAULT NOW(),
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- ADMIN & OPERATIONS
-- ============================================================================

CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Admin role
  role TEXT NOT NULL,               -- 'superadmin', 'admin', 'billing_admin', 'support'
  
  -- Permissions
  can_manage_plans BOOLEAN DEFAULT false,
  can_manage_subscriptions BOOLEAN DEFAULT false,
  can_manage_billing BOOLEAN DEFAULT false,
  can_manage_users BOOLEAN DEFAULT false,
  can_view_analytics BOOLEAN DEFAULT false,
  can_manage_admins BOOLEAN DEFAULT false,
  
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE admin_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Admin who made the change
  admin_id UUID NOT NULL REFERENCES admin_users(id) ON DELETE SET NULL,
  admin_name TEXT,
  
  -- What changed
  action TEXT NOT NULL,             -- 'create', 'update', 'delete', 'activate', 'suspend'
  entity_type TEXT NOT NULL,        -- 'plan', 'subscription', 'invoice', 'user'
  entity_id TEXT,
  entity_name TEXT,
  
  -- Change details
  changes_json TEXT,                -- JSON of what changed
  notes TEXT,
  
  -- Status
  status TEXT DEFAULT 'success',    -- 'success', 'failed'
  error_message TEXT,
  
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE system_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Settings key
  setting_key TEXT NOT NULL UNIQUE,  -- 'default_trial_days', 'max_projects_tier1'
  setting_value TEXT,
  setting_type TEXT DEFAULT 'text',  -- 'text', 'number', 'boolean', 'json'
  
  -- Metadata
  category TEXT,                     -- 'trial', 'billing', 'limits', 'features'
  description TEXT,
  is_editable BOOLEAN DEFAULT true,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE payment_gateway_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Gateway
  gateway_name TEXT NOT NULL UNIQUE,  -- 'stripe', 'payfast', 'manual'
  is_enabled BOOLEAN DEFAULT false,
  
  -- Credentials (encrypted in production)
  api_key TEXT,
  api_secret TEXT,
  webhook_secret TEXT,
  
  -- Settings
  config_json TEXT,                 -- Additional config as JSON
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- ANALYTICS & REPORTING
-- ============================================================================

CREATE TABLE subscription_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Date
  report_date DATE NOT NULL,
  
  -- Metrics
  total_active_subscriptions INT DEFAULT 0,
  total_trial_subscriptions INT DEFAULT 0,
  new_subscriptions INT DEFAULT 0,
  cancelled_subscriptions INT DEFAULT 0,
  churned_subscriptions INT DEFAULT 0,
  
  -- By tier
  tier1_count INT DEFAULT 0,
  tier2_count INT DEFAULT 0,
  tier3_count INT DEFAULT 0,
  
  -- Revenue
  mrr DECIMAL(12, 2) DEFAULT 0,     -- Monthly Recurring Revenue
  arr DECIMAL(12, 2) DEFAULT 0,     -- Annual Recurring Revenue
  lifetime_revenue DECIMAL(12, 2) DEFAULT 0,
  
  created_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT unique_report_date UNIQUE(report_date)
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

CREATE INDEX idx_company_subscriptions_status ON company_subscriptions(status);
CREATE INDEX idx_company_subscriptions_plan ON company_subscriptions(plan_id);
CREATE INDEX idx_billing_invoices_company ON billing_invoices(company_id);
CREATE INDEX idx_billing_invoices_status ON billing_invoices(status);
CREATE INDEX idx_payment_transactions_company ON payment_transactions(company_id);
CREATE INDEX idx_feature_quotas_company ON feature_quotas(company_id);
CREATE INDEX idx_feature_usage_logs_company ON feature_usage_logs(company_id);
CREATE INDEX idx_trial_periods_company ON trial_periods(company_id);
CREATE INDEX idx_admin_audit_logs_admin ON admin_audit_logs(admin_id);
CREATE INDEX idx_subscription_analytics_date ON subscription_analytics(report_date);
