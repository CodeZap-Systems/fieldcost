-- FieldCost MVP: Supabase schema (7 tables)

-- 1. users (managed by Supabase Auth)
-- 2. projects
create table if not exists projects (
  id serial primary key,
  name text not null,
  description text,
  photo_url text,
  user_id uuid references auth.users on delete cascade,
  created_at timestamp with time zone default now()
);

-- 3. customers
create table if not exists customers (
  id serial primary key,
  name text not null,
  email text,
  user_id uuid references auth.users on delete cascade,
  created_at timestamp with time zone default now()
);

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
  created_at timestamp with time zone default now()
);

-- 5. crew members
create table if not exists crew_members (
  id serial primary key,
  name text not null,
  hourly_rate numeric default 0,
  user_id uuid references auth.users on delete cascade,
  created_at timestamp with time zone default now()
);

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
  created_at timestamp with time zone default now()
);

alter table tasks add column if not exists description text;
alter table tasks add column if not exists photo_url text;

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
  created_at timestamp with time zone default now()
);

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
  created_at timestamp with time zone default now()
);

-- 8. budgets
create table if not exists budgets (
  id serial primary key,
  project_id integer references projects(id) on delete cascade,
  planned_amount numeric,
  actual_amount numeric default 0,
  user_id uuid references auth.users on delete cascade,
  created_at timestamp with time zone default now()
);

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
