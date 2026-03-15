-- Tier 2: Quotation Module - Database Migration
-- Quotes are documents TO CUSTOMERS (what we're selling/quoting)
-- Migration timestamp: 2026-03-15T00:00:00

-- 1. quotes table (main quotation document)
create table if not exists quotes (
  id serial primary key,
  customer_id integer references customers(id) on delete cascade,
  project_id integer references projects(id) on delete set null,
  company_id integer not null,
  user_id uuid references auth.users on delete cascade,
  
  -- Quote details
  amount numeric(12, 2) default 0,
  description text,
  reference text unique,  -- Quote reference number (e.g., "QT-2026-001")
  status text default 'draft',  -- draft, sent, accepted, rejected
  valid_until date,  -- Quote expiration date
  
  -- Audit trails
  sent_on timestamp with time zone,
  accepted_on timestamp with time zone,
  rejected_on timestamp with time zone,
  rejection_reason text,
  
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Indexes for performance
create index if not exists idx_quotes_company_id on quotes(company_id);
create index if not exists idx_quotes_customer_id on quotes(customer_id);
create index if not exists idx_quotes_project_id on quotes(project_id);
create index if not exists idx_quotes_user_id on quotes(user_id);
create index if not exists idx_quotes_status on quotes(status);

-- 2. quote_line_items table (individual line items in quotation)
create table if not exists quote_line_items (
  id serial primary key,
  quote_id integer references quotes(id) on delete cascade,
  item_id integer references items(id) on delete set null,
  
  -- Line item details
  item_name text not null,  -- Name of service/material/labor
  description text,  -- Additional description
  quantity numeric(10, 2) not null default 1,
  unit text default 'ea',  -- Unit of measure (ea, hrs, m2, etc.)
  rate numeric(12, 2) not null default 0,  -- Price per unit
  total numeric(12, 2) generated always as (quantity * rate) stored,
  note text,  -- Special notes for this line item
  
  company_id integer not null,
  user_id uuid references auth.users on delete cascade,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Indexes for performance
create index if not exists idx_quote_line_items_quote_id on quote_line_items(quote_id);
create index if not exists idx_quote_line_items_item_id on quote_line_items(item_id);
create index if not exists idx_quote_line_items_company_id on quote_line_items(company_id);

-- 3. quote_approvals table (optional: track approval workflow if needed later)
create table if not exists quote_approvals (
  id serial primary key,
  quote_id integer references quotes(id) on delete cascade,
  approver_id uuid references auth.users on delete cascade,
  
  -- Approval status
  status text default 'pending',  -- pending, approved, rejected
  approved_at timestamp with time zone,
  rejection_reason text,
  
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create index if not exists idx_quote_approvals_quote_id on quote_approvals(quote_id);
