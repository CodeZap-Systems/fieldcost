/**
 * FIELDCOST ADMIN CMS - TypeScript Types
 * 
 * Complete type definitions for subscription management, billing, and admin features
 */

// ============================================================================
// SUBSCRIPTION PLANS
// ============================================================================

export interface SubscriptionPlan {
  id: string;
  name: string;                    // "Starter", "Growth", "Enterprise"
  tier_level: number;              // 1, 2, 3
  description: string;
  display_order: number;
  monthly_price: number;
  annual_price: number | null;
  setup_fee: number;
  currency: string;
  max_projects: number;            // -1 = unlimited
  max_tasks: number;
  max_team_members: number;
  max_invoices: number;
  max_storage_gb: number;
  is_active: boolean;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface PlanFeature {
  id: string;
  plan_id: string;
  feature_key: string;              // "wip-tracking", "geolocation", "erp-sync"
  feature_name: string;
  feature_category: 'core' | 'integration' | 'advanced';
  is_enabled: boolean;
  max_usage: number | null;
  reset_period: 'monthly' | 'yearly' | 'never';
  created_at: string;
}

export interface CreatePlanInput {
  name: string;
  tier_level: number;
  description: string;
  monthly_price: number;
  annual_price?: number;
  setup_fee?: number;
  max_projects: number;
  max_tasks: number;
  max_team_members: number;
  max_invoices: number;
  max_storage_gb: number;
}

// ============================================================================
// COMPANY SUBSCRIPTIONS
// ============================================================================

export interface CompanySubscription {
  id: string;
  company_id: string;
  plan_id: string;
  status: 'trial' | 'active' | 'paused' | 'cancelled' | 'expired';
  subscription_date: string;
  start_date: string;
  end_date: string | null;
  renewal_date: string;
  cancelled_at: string | null;
  custom_max_projects: number | null;
  custom_max_team_members: number | null;
  override_features: string[];
  billing_cycle: 'monthly' | 'annual';
  auto_renew: boolean;
  discount_percent: number;
  discount_reason: string | null;
  created_at: string;
  updated_at: string;
  
  // Relations
  plan?: SubscriptionPlan;
  company?: CompanyProfile;
}

export interface UpgradeSubscriptionInput {
  company_id: string;
  new_plan_id: string;
  billing_cycle: 'monthly' | 'annual';
  effective_date?: string;
}

export interface UpdateSubscriptionInput {
  company_id: string;
  status?: string;
  discount_percent?: number;
  discount_reason?: string;
  custom_max_projects?: number;
  custom_max_team_members?: number;
  override_features?: string[];
}

// ============================================================================
// BILLING & INVOICES
// ============================================================================

export interface BillingInvoice {
  id: string;
  company_id: string;
  subscription_id: string;
  invoice_number: string;          // "INV-2026-001"
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  subtotal: number;
  tax_amount: number;
  discount_amount: number;
  total_amount: number;
  paid_amount: number;
  issue_date: string;
  due_date: string;
  paid_date: string | null;
  invoice_items: InvoiceItem[];
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  unit_price: number;
  amount: number;
  tax_percent?: number;
}

export interface CreateInvoiceInput {
  company_id: string;
  subscription_id: string;
  issue_date: string;
  due_date: string;
  items: InvoiceItem[];
  notes?: string;
  send_email?: boolean;
}

// ============================================================================
// PAYMENT METHODS & TRANSACTIONS
// ============================================================================

export interface PaymentMethod {
  id: string;
  company_id: string;
  payment_type: 'credit_card' | 'bank_transfer' | 'check';
  is_primary: boolean;
  is_active: boolean;
  card_last_four: string | null;
  card_brand: string | null;
  card_expiry: string | null;
  bank_name: string | null;
  account_number: string | null;
  account_holder: string | null;
  external_payment_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface PaymentTransaction {
  id: string;
  company_id: string;
  invoice_id: string | null;
  payment_method_id: string | null;
  transaction_type: 'charge' | 'refund' | 'adjustment';
  amount: number;
  currency: string;
  status: 'pending' | 'success' | 'failed' | 'reversed';
  status_message: string | null;
  payment_gateway: string;
  gateway_transaction_id: string | null;
  gateway_response: object | null;
  retry_count: number;
  next_retry_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProcessPaymentInput {
  company_id: string;
  invoice_id: string;
  amount: number;
  payment_method_id: string;
}

// ============================================================================
// FEATURE QUOTAS & USAGE
// ============================================================================

export interface FeatureQuota {
  id: string;
  company_id: string;
  feature_key: string;
  current_usage: number;
  max_quota: number | null;
  reset_period: 'monthly' | 'yearly';
  reset_date: string;
  is_exceeded: boolean;
  last_reset_at: string;
  created_at: string;
  updated_at: string;
}

export interface FeatureUsageLog {
  id: string;
  company_id: string;
  user_id: string;
  feature_key: string;
  usage_amount: number;
  action: 'create' | 'update' | 'export' | 'sync';
  resource_type: string;
  resource_id: string | null;
  created_at: string;
}

// ============================================================================
// TRIALS
// ============================================================================

export interface TrialPeriod {
  id: string;
  company_id: string;
  user_id: string;
  plan_id: string;
  trial_tier: number;
  days_duration: number;
  status: 'active' | 'converted' | 'expired' | 'cancelled';
  start_date: string;
  end_date: string;
  converted_at: string | null;
  has_payment_method: boolean;
  requires_payment_to_continue: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateTrialInput {
  company_id: string;
  user_id: string;
  plan_id: string;
  trial_tier: number;
  days_duration?: number;
}

// ============================================================================
// ADMIN MANAGEMENT
// ============================================================================

export interface AdminUser {
  id: string;
  user_id: string;
  role: 'superadmin' | 'admin' | 'billing_admin' | 'support';
  can_manage_plans: boolean;
  can_manage_subscriptions: boolean;
  can_manage_billing: boolean;
  can_manage_users: boolean;
  can_view_analytics: boolean;
  can_manage_admins: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AdminAuditLog {
  id: string;
  admin_id: string;
  admin_name: string;
  action: 'create' | 'update' | 'delete' | 'activate' | 'suspend';
  entity_type: 'plan' | 'subscription' | 'invoice' | 'user';
  entity_id: string;
  entity_name: string;
  changes_json: object;
  notes: string | null;
  status: 'success' | 'failed';
  error_message: string | null;
  created_at: string;
}

// ============================================================================
// SETTINGS & CONFIGURATION
// ============================================================================

export interface SystemSettings {
  id: string;
  setting_key: string;              // 'default_trial_days', 'max_projects_tier1'
  setting_value: string;
  setting_type: 'text' | 'number' | 'boolean' | 'json';
  category: 'trial' | 'billing' | 'limits' | 'features';
  description: string;
  is_editable: boolean;
  created_at: string;
  updated_at: string;
}

export interface PaymentGatewayConfig {
  id: string;
  gateway_name: string;              // 'stripe', 'payfast', 'manual'
  is_enabled: boolean;
  api_key?: string;
  api_secret?: string;
  webhook_secret?: string;
  config_json?: object;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// ANALYTICS
// ============================================================================

export interface SubscriptionAnalytics {
  id: string;
  report_date: string;
  total_active_subscriptions: number;
  total_trial_subscriptions: number;
  new_subscriptions: number;
  cancelled_subscriptions: number;
  churned_subscriptions: number;
  tier1_count: number;
  tier2_count: number;
  tier3_count: number;
  mrr: number;
  arr: number;
  lifetime_revenue: number;
  created_at: string;
}

export interface ChartData {
  date: string;
  value: number;
  metric: string;
}

// ============================================================================
// DASHBOARD STATS
// ============================================================================

export interface AdminDashboardStats {
  total_subscriptions: number;
  active_subscriptions: number;
  trial_subscriptions: number;
  mrr: number;
  arr: number;
  churn_rate: number;
  new_subscriptions_this_month: number;
  tier_breakdown: {
    tier1: number;
    tier2: number;
    tier3: number;
  };
  payment_success_rate: number;
  pending_invoices: number;
  overdue_invoices: number;
  top_features: Array<{ feature: string; usage: number }>;
  recent_transactions: PaymentTransaction[];
  recent_audits: AdminAuditLog[];
}

// ============================================================================
// RELATED TYPES
// ============================================================================

export interface CompanyProfile {
  id: string;
  user_id: string;
  name: string;
  email: string;
  phone: string | null;
  website: string | null;
  logo_url: string | null;
  subscription_tier: number;
  is_demo: boolean;
  trial_end_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  created_at: string;
  updated_at: string;
}
