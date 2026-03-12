-- FieldCost MVP: Supabase schema (7 tables)

-- 1. users (managed by Supabase Auth)
-- 2. projects
create table if not exists projects (
  id serial primary key,
  name text not null,
  description text,
  photo_url text,
  user_id uuid references auth.users on delete cascade,
  company_id integer default 1,
  created_at timestamp with time zone default now()
);

alter table projects add column if not exists company_id integer default 1;

-- 3. customers
create table if not exists customers (
  id serial primary key,
  name text not null,
  email text,
  user_id uuid references auth.users on delete cascade,
  company_id integer default 1,
  created_at timestamp with time zone default now()
);

alter table customers add column if not exists company_id integer default 1;

-- 3b. company profiles (1:1 per auth user for now)
create table if not exists company_profiles (
  id serial primary key,
  user_id uuid references auth.users on delete cascade unique,
  name text not null,
  email text,
  phone text,
  address_line1 text,
  address_line2 text,
  city text,
  province text,
  postal_code text,
  country text,
  logo_url text,
  logo_external_url text,
  invoice_template text default 'standard',
  default_currency text default 'ZAR',
  erp_targets text[] default '{}',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- 4. items (inventory)
create table if not exists items (
  id serial primary key,
  name text not null,
  price numeric,
  stock_in integer default 0,
  stock_used integer default 0,
  item_type text default 'physical',
  user_id uuid references auth.users on delete cascade,
  company_id integer default 1,
  created_at timestamp with time zone default now()
);

alter table items add column if not exists company_id integer default 1;

-- 5. crew members
create table if not exists crew_members (
  id serial primary key,
  name text not null,
  hourly_rate numeric default 0,
  user_id uuid references auth.users on delete cascade,
  company_id integer default 1,
  created_at timestamp with time zone default now()
);

alter table crew_members add column if not exists company_id integer default 1;

-- 6. tasks
create table if not exists tasks (
  id serial primary key,
  name text not null,
  description text,
  project_id integer references projects(id) on delete cascade,
  seconds integer default 0,
  status text default 'todo',
  assigned_to text,
  crew_member_id integer references crew_members(id) on delete set null,
  billable boolean default true,
  photo_url text,
  user_id uuid references auth.users on delete cascade,
  company_id integer default 1,
  created_at timestamp with time zone default now()
);

alter table tasks add column if not exists description text;
alter table tasks add column if not exists photo_url text;
alter table tasks add column if not exists company_id integer default 1;

-- 7. invoices
create table if not exists invoices (
  id serial primary key,
  customer_id integer references customers(id) on delete cascade,
  amount numeric,
  description text,
  reference text,
  invoice_number text,
  status text default 'draft',
  issued_on date default current_date,
  due_on date,
  currency text default 'ZAR',
  user_id uuid references auth.users on delete cascade,
  company_id integer default 1,
  created_at timestamp with time zone default now()
);

alter table invoices add column if not exists company_id integer default 1;

create table if not exists invoice_line_items (
  id serial primary key,
  invoice_id integer references invoices(id) on delete cascade,
  item_id integer references items(id),
  name text not null,
  quantity numeric default 1,
  rate numeric default 0,
  total numeric default 0,
  project text,
  note text,
  source text,
  task_ref text,
  user_id uuid references auth.users on delete cascade,
  company_id integer default 1,
  created_at timestamp with time zone default now()
);

alter table invoice_line_items add column if not exists company_id integer default 1;

-- 8. budgets
create table if not exists budgets (
  id serial primary key,
  project_id integer references projects(id) on delete cascade,
  planned_amount numeric,
  actual_amount numeric default 0,
  user_id uuid references auth.users on delete cascade,
  company_id integer default 1,
  created_at timestamp with time zone default now()
);

alter table budgets add column if not exists company_id integer default 1;

-- Row Level Security (RLS) policies (examples)
-- Enable RLS
alter table projects enable row level security;
alter table customers enable row level security;
alter table items enable row level security;
alter table crew_members enable row level security;
alter table tasks enable row level security;
alter table invoices enable row level security;
alter table invoice_line_items enable row level security;
alter table company_profiles enable row level security;
alter table budgets enable row level security;

-- Policy: users can access their own rows
drop policy if exists "Users can access own projects" on projects;
create policy "Users can access own projects" on projects
  for all using (auth.uid() = user_id);

drop policy if exists "Users can access own customers" on customers;
create policy "Users can access own customers" on customers
  for all using (auth.uid() = user_id);

drop policy if exists "Users can access own items" on items;
create policy "Users can access own items" on items
  for all using (auth.uid() = user_id);

drop policy if exists "Users can access own crew" on crew_members;
create policy "Users can access own crew" on crew_members
  for all using (auth.uid() = user_id);

-- TIER 2 FEATURE TABLES

-- custom_workflows: Approval and task workflows
create table if not exists custom_workflows (
  id bigserial primary key,
  name text not null,
  applicable_to text default 'general',
  requires_approval boolean default false,
  approval_chain text[] default '{}',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- task_location_snapshots: GPS tracking for tasks
create table if not exists task_location_snapshots (
  id bigserial primary key,
  task_id integer references tasks on delete cascade,
  user_id uuid references auth.users on delete cascade,
  latitude numeric not null,
  longitude numeric not null,
  accuracy numeric,
  altitude numeric,
  recorded_at timestamp with time zone default now(),
  created_at timestamp with time zone default now()
);

-- offline_bundles: Offline sync tracking
create table if not exists offline_bundles (
  id bigserial primary key,
  device_id text not null,
  user_id uuid references auth.users on delete cascade,
  bundle_created_at timestamp with time zone,
  bundles_synced integer default 0,
  tasks_inside_bundle integer default 0,
  photos_inside_bundle integer default 0,
  data_size_mb numeric default 0,
  requires_manual_review boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- offline_sync_log: Audit trail for sync operations
create table if not exists offline_sync_log (
  id bigserial primary key,
  user_id uuid references auth.users on delete cascade,
  device_id text,
  status text default 'in_progress',
  sync_started_at timestamp with time zone,
  sync_completed_at timestamp with time zone,
  items_processed integer default 0,
  items_failed integer default 0,
  error_message text,
  created_at timestamp with time zone default now()
);

-- photo_evidence: Photo storage with metadata
create table if not exists photo_evidence (
  id bigserial primary key,
  task_id integer references tasks on delete cascade,
  user_id uuid references auth.users on delete cascade,
  photo_url text not null,
  caption text,
  taken_at timestamp with time zone,
  latitude numeric,
  longitude numeric,
  created_at timestamp with time zone default now()
);

-- photo_evidence_chain: Chain of custody for photos
create table if not exists photo_evidence_chain (
  id bigserial primary key,
  photo_id bigint references photo_evidence on delete cascade,
  action text,
  actor_id uuid references auth.users,
  timestamp timestamp with time zone default now()
);

-- Enable RLS on new tables
alter table custom_workflows enable row level security;
alter table task_location_snapshots enable row level security;
alter table offline_bundles enable row level security;
alter table offline_sync_log enable row level security;
alter table photo_evidence enable row level security;
alter table photo_evidence_chain enable row level security;

-- RLS Policies for Tier 2 tables
drop policy if exists "Users can access own location snapshots" on task_location_snapshots;
create policy "Users can access own location snapshots" on task_location_snapshots
  for all using (auth.uid() = user_id);

drop policy if exists "Users can access own offline bundles" on offline_bundles;
create policy "Users can access own offline bundles" on offline_bundles
  for all using (auth.uid() = user_id);

drop policy if exists "Users can access own sync logs" on offline_sync_log;
create policy "Users can access own sync logs" on offline_sync_log
  for all using (auth.uid() = user_id);

drop policy if exists "Users can access own photo evidence" on photo_evidence;
create policy "Users can access own photo evidence" on photo_evidence
  for all using (auth.uid() = user_id);

drop policy if exists "Users can access own chain of custody" on photo_evidence_chain;
create policy "Users can access own chain of custody" on photo_evidence_chain
  for all using (
    exists (
      select 1 from photo_evidence where photo_evidence.id = photo_evidence_chain.photo_id
      and photo_evidence.user_id = auth.uid()
    )
  );

drop policy if exists "Users can access own tasks" on tasks;
create policy "Users can access own tasks" on tasks
  for all using (auth.uid() = user_id);

drop policy if exists "Users can access own invoices" on invoices;
create policy "Users can access own invoices" on invoices
  for all using (auth.uid() = user_id);

drop policy if exists "Users can access own invoice lines" on invoice_line_items;
create policy "Users can access own invoice lines" on invoice_line_items
  for all using (auth.uid() = user_id);

drop policy if exists "Users can access own company profile" on company_profiles;
create policy "Users can access own company profile" on company_profiles
  for all using (auth.uid() = user_id);

drop policy if exists "Users can access own budgets" on budgets;
create policy "Users can access own budgets" on budgets
  for all using (auth.uid() = user_id);
