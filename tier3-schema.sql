-- FieldCost Tier 3 — Enterprise Schema Extensions
-- Multi-company, GPS, photo evidence, offline sync, RBAC, audit trails, custom workflows

-- ============================================
-- 1. MULTI-COMPANY SETUP
-- ============================================

create table if not exists tier3_companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  registration_number text unique,
  parent_company_id uuid references tier3_companies(id),
  default_currency text default 'ZAR',
  supported_currencies text[] default '{"ZAR", "USD", "EUR"}',
  tier integer default 3,
  max_active_projects integer default 100,
  max_users integer default 50,
  has_dedicated_support boolean default true,
  sla_tier text default 'gold', -- 'gold' or 'platinum'
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- ============================================
-- 2. FIELD ROLE-BASED ACCESS CONTROL
-- ============================================

create table if not exists tier3_field_roles (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references tier3_companies(id) on delete cascade,
  user_id uuid references auth.users on delete cascade,
  role text not null, -- 'crew_member', 'supervisor', 'site_manager', 'project_manager', 'finance', 'admin'
  assigned_at timestamp with time zone default now(),
  assigned_by uuid references auth.users,
  created_at timestamp with time zone default now(),
  unique(company_id, user_id, role)
);

create table if not exists tier3_role_permissions (
  id uuid primary key default gen_random_uuid(),
  role text not null unique, -- Role name
  can_create_tasks boolean default false,
  can_approve_tasks boolean default false,
  can_manage_crew boolean default false,
  can_view_gps boolean default false,
  can_export_data boolean default false,
  can_manage_offline_bundles boolean default false,
  can_access_reports boolean default false,
  can_manage_workflows boolean default false,
  can_sync_to_erp boolean default false,
  created_at timestamp with time zone default now()
);

-- ============================================
-- 3. GPS & GEOLOCATION TRACKING
-- ============================================

create table if not exists task_location_snapshots (
  id uuid primary key default gen_random_uuid(),
  task_id integer not null,
  crew_member_id integer not null,
  latitude numeric(10, 7) not null,
  longitude numeric(10, 7) not null,
  accuracy numeric(5, 2),      -- in meters
  altitude numeric(8, 2),      -- elevation in meters
  gps_timestamp timestamp with time zone not null,
  status text default 'present', -- 'present', 'departed', 'offline'
  is_offline_mode boolean default false,
  synced_at timestamp with time zone,
  user_id uuid references auth.users on delete cascade,
  created_at timestamp with time zone default now(),
  index_gps gin (to_tsvector('english', latitude::text || ' ' || longitude::text))
);

-- ============================================
-- 4. PHOTO EVIDENCE & LEGAL CHAIN OF CUSTODY
-- ============================================

create table if not exists photo_evidence (
  id uuid primary key default gen_random_uuid(),
  task_id integer not null,
  project_id integer not null,
  photo_url text not null,
  photo_hash text not null unique, -- SHA-256 for verification chain
  captured_at timestamp with time zone not null,
  captured_by_crew_member_id integer not null,
  captured_at_latitude numeric(10, 7) not null,
  captured_at_longitude numeric(10, 7) not null,
  captured_at_gps_accuracy numeric(5, 2),
  description text,
  legal_grade_verified boolean default false, -- Chain of custody confirmed
  mime_type text default 'image/jpeg',
  file_size_bytes integer,
  user_id uuid references auth.users on delete cascade,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Photo evidence chain of custody
create table if not exists photo_evidence_chain (
  id uuid primary key default gen_random_uuid(),
  photo_id uuid references photo_evidence(id) on delete cascade unique,
  chain_sequence integer not null, -- Order in custody chain
  holder_user_id uuid references auth.users,
  held_from timestamp with time zone,
  held_to timestamp with time zone,
  action text, -- 'captured', 'reviewed', 'approved', 'exported'
  notes text,
  created_at timestamp with time zone default now()
);

-- ============================================
-- 5. OFFLINE SYNC MANAGEMENT
-- ============================================

create table if not exists offline_bundles (
  id uuid primary key default gen_random_uuid(),
  device_id text not null,
  company_id uuid references tier3_companies(id) on delete cascade,
  bundle_created_at timestamp with time zone not null,
  bundles_synced integer default 0,
  tasks_inside_bundle integer default 0,
  photos_inside_bundle integer default 0,
  data_size_mb numeric(10, 2),
  last_synced_at timestamp with time zone,
  requires_manual_review boolean default false,
  user_id uuid references auth.users on delete cascade,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Offline sync log for audit trail
create table if not exists offline_sync_log (
  id uuid primary key default gen_random_uuid(),
  offline_bundle_id uuid references offline_bundles(id) on delete cascade,
  sync_started_at timestamp with time zone not null,
  sync_completed_at timestamp with time zone,
  total_records_synced integer,
  conflicts_detected integer default 0,
  errors_encountered integer default 0,
  status text default 'in_progress', -- 'in_progress', 'completed', 'failed'
  error_details text,
  user_id uuid references auth.users on delete cascade,
  created_at timestamp with time zone default now()
);

-- ============================================
-- 6. AUDIT TRAILS (Operational + Photo Evidence)
-- ============================================

create table if not exists tier3_audit_logs (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references tier3_companies(id) on delete cascade,
  entity_type text not null, -- 'task', 'photo', 'crew', 'workflow', 'invoice', 'gps', 'offline_sync'
  entity_id text not null,
  action text not null,
  user_id uuid references auth.users on delete cascade,
  user_role text,
  timestamp timestamp with time zone default now(),
  change_details jsonb,
  photo_evidence_id uuid references photo_evidence(id),
  gps_latitude numeric(10, 7),
  gps_longitude numeric(10, 7),
  ip_address text,
  created_at timestamp with time zone default now()
);

create index idx_audit_logs_timestamp on tier3_audit_logs(timestamp desc);
create index idx_audit_logs_entity on tier3_audit_logs(entity_type, entity_id);
create index idx_audit_logs_user on tier3_audit_logs(user_id);

-- ============================================
-- 7. CUSTOM WORKFLOWS
-- ============================================

create table if not exists custom_workflows (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references tier3_companies(id) on delete cascade,
  name text not null,
  applicable_to text default 'general', -- 'mining', 'construction', 'general'
  requires_approval boolean default false,
  approval_chain text[] default '{}', -- Array of role names
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create table if not exists workflow_stages (
  id uuid primary key default gen_random_uuid(),
  workflow_id uuid references custom_workflows(id) on delete cascade,
  name text not null,
  stage_order integer not null,
  allowed_transitions text[] default '{}',
  requires_photo_evidence boolean default false,
  requires_gps_verification boolean default false,
  estimated_duration_hours integer,
  notify_roles text[] default '{}',
  created_at timestamp with time zone default now()
);

-- ============================================
-- 8. WIP TRACKING (Live Task Level)
-- ============================================

create table if not exists tier3_wip_snapshots (
  id uuid primary key default gen_random_uuid(),
  project_id integer not null,
  task_id integer not null,
  status text not null, -- 'todo', 'in_progress', 'complete', 'approved', 'invoiced'
  earned_value numeric(5, 2) default 0, -- Percentage complete
  actual_cost_to_date numeric(12, 2) default 0,
  budgeted_cost_to_date numeric(12, 2) default 0,
  variance numeric(12, 2) default 0,
  currency text default 'ZAR',
  photo_certification_count integer default 0,
  crew_presence_verified boolean default false,
  last_updated_by_user_id uuid references auth.users on delete set null,
  last_updated_at timestamp with time zone,
  snapshot_at timestamp with time zone default now(),
  user_id uuid references auth.users on delete cascade,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- ============================================
-- 9. MULTI-CURRENCY SUPPORT
-- ============================================

create table if not exists currency_exchange_rates (
  id uuid primary key default gen_random_uuid(),
  from_currency text not null,
  to_currency text not null,
  rate numeric(12, 6) not null,
  rate_date date not null,
  source text, -- Where rate came from (e.g., 'OANDA', 'XE')
  created_at timestamp with time zone default now(),
  unique(from_currency, to_currency, rate_date)
);

-- ============================================
-- 10. MINING-SPECIFIC WORKFLOWS
-- ============================================

create table if not exists mining_site_workflows (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references tier3_companies(id) on delete cascade,
  project_id integer not null,
  workflow_template text default 'standard_mining', -- 'blast_cycle', 'ore_extraction', 'standard_mining'
  current_stage text not null,
  stage_started_at timestamp with time zone,
  next_stage_estimated_at timestamp with time zone,
  blast_count integer default 0,
  tons_extracted numeric(14, 2) default 0,
  safety_incidents integer default 0,
  environmental_violations integer default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

create index idx_photo_evidence_task on photo_evidence(task_id);
create index idx_photo_evidence_captured_at on photo_evidence(captured_at desc);
create index idx_photo_evidence_hash on photo_evidence(photo_hash);
create index idx_task_location_task on task_location_snapshots(task_id);
create index idx_task_location_gps on task_location_snapshots(latitude, longitude);
create index idx_offline_bundles_device on offline_bundles(device_id);
create index idx_wip_project on tier3_wip_snapshots(project_id);
create index idx_wip_task on tier3_wip_snapshots(task_id);
create index idx_workflows_company on custom_workflows(company_id);
create index idx_field_roles_company on tier3_field_roles(company_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS) FOR TIER 3
-- ============================================

alter table tier3_companies enable row level security;
alter table tier3_field_roles enable row level security;
alter table photo_evidence enable row level security;
alter table task_location_snapshots enable row level security;
alter table offline_bundles enable row level security;
alter table tier3_audit_logs enable row level security;
alter table custom_workflows enable row level security;
alter table tier3_wip_snapshots enable row level security;
alter table mining_site_workflows enable row level security;

-- Policy: Users can access data from companies they have a role in
create policy "Users access own company data" on photo_evidence
  for all using (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM tier3_field_roles
      WHERE tier3_field_roles.user_id = auth.uid()
    )
  );

create policy "Users access own company audit logs" on tier3_audit_logs
  for all using (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM tier3_field_roles
      WHERE tier3_field_roles.user_id = auth.uid()
      AND tier3_field_roles.company_id = tier3_audit_logs.company_id
    )
  );
