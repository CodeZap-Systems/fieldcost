-- Tier 2: Supplier Purchase Order Module - Database Migration
-- Purchase Orders are documents FROM SUPPLIERS (what we're buying)
-- Includes GRN (Goods Received Notes) tracking
-- Migration timestamp: 2026-03-15T00:01:00

-- 1. suppliers table (vendor/supplier master data)
create table if not exists suppliers (
  id serial primary key,
  company_id integer not null,
  user_id uuid references auth.users on delete cascade,
  
  -- Supplier details
  vendor_name text not null,
  contact_name text,
  email text,
  phone text,
  
  -- Address
  address_line1 text,
  address_line2 text,
  city text,
  province text,
  postal_code text,
  country text,
  
  -- Payment terms
  payment_terms text default 'net 30',
  tax_id text,
  
  -- Rating/notes
  rating numeric(3, 1) default 0,  -- 0-5 scale
  notes text,
  
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Indexes for performance
create index if not exists idx_suppliers_company_id on suppliers(company_id);
create index if not exists idx_suppliers_user_id on suppliers(user_id);

-- 2. purchase_orders table (main PO document)
create table if not exists purchase_orders (
  id serial primary key,
  supplier_id integer references suppliers(id) on delete restrict,
  project_id integer references projects(id) on delete set null,
  company_id integer not null,
  user_id uuid references auth.users on delete cascade,
  
  -- PO details
  po_reference text unique not null,  -- PO number (e.g., "PO-2026-001")
  po_date date default current_date,
  required_by_date date,  -- When materials needed on site
  delivery_date date,  -- Actual delivery date
  
  -- Amount tracking
  total_amount numeric(12, 2) default 0,
  total_received numeric(12, 2) default 0,  -- Amount received so far
  description text,
  
  -- Status tracking: draft -> sent_to_supplier -> confirmed -> partially_received -> fully_received -> invoiced
  status text default 'draft',
  sent_to_supplier_on timestamp with time zone,
  confirmed_on timestamp with time zone,
  first_delivery_on timestamp with time zone,
  fully_received_on timestamp with time zone,
  invoiced_on timestamp with time zone,
  
  -- Audit trails
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Indexes for performance
create index if not exists idx_purchase_orders_company_id on purchase_orders(company_id);
create index if not exists idx_purchase_orders_supplier_id on purchase_orders(supplier_id);
create index if not exists idx_purchase_orders_project_id on purchase_orders(project_id);
create index if not exists idx_purchase_orders_user_id on purchase_orders(user_id);
create index if not exists idx_purchase_orders_status on purchase_orders(status);
create index if not exists idx_purchase_orders_po_reference on purchase_orders(po_reference);

-- 3. purchase_order_line_items table (individual items ordered)
create table if not exists purchase_order_line_items (
  id serial primary key,
  po_id integer references purchase_orders(id) on delete cascade,
  item_id integer references items(id) on delete set null,
  
  -- Line item details
  item_name text not null,  -- Material/service name
  description text,
  quantity_ordered numeric(10, 2) not null default 1,
  quantity_received numeric(10, 2) default 0,  -- Actual received (tracked via GRN)
  unit text default 'ea',  -- Unit of measure (ea, m, kg, etc.)
  unit_rate numeric(12, 2) not null default 0,  -- Price per unit
  total numeric(12, 2) generated always as (quantity_ordered * unit_rate) stored,
  
  note text,  -- Special instructions for this line item
  
  company_id integer not null,
  user_id uuid references auth.users on delete cascade,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Indexes for performance
create index if not exists idx_po_line_items_po_id on purchase_order_line_items(po_id);
create index if not exists idx_po_line_items_item_id on purchase_order_line_items(item_id);
create index if not exists idx_po_line_items_company_id on purchase_order_line_items(company_id);

-- 4. goods_received_notes (GRN) table - CORE FEATURE for tracking deliveries
create table if not exists goods_received_notes (
  id serial primary key,
  po_id integer references purchase_orders(id) on delete cascade,
  po_line_item_id integer references purchase_order_line_items(id) on delete cascade,
  company_id integer not null,
  user_id uuid references auth.users on delete cascade,
  
  -- GRN details
  grn_number text unique not null,  -- GRN reference (e.g., "GRN-2026-00001")
  grn_date date default current_date,
  
  -- Delivery tracking
  quantity_received numeric(10, 2) not null default 1,
  unit text,  -- Should match PO line item unit
  
  -- Quality control
  quality_status text default 'accepted',  -- accepted, inspected_good, rejected
  quality_notes text,
  damage_notes text,
  
  -- Receiving details
  received_by text,  -- Who received the goods
  received_at_location text,  -- Where received (site, warehouse, etc.)
  
  -- Follow-up
  rejection_reason text,  -- If rejected, why
  follow_up_required boolean default false,
  follow_up_notes text,
  
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Indexes for performance
create index if not exists idx_grn_po_id on goods_received_notes(po_id);
create index if not exists idx_grn_po_line_item_id on goods_received_notes(po_line_item_id);
create index if not exists idx_grn_company_id on goods_received_notes(company_id);
create index if not exists idx_grn_grn_number on goods_received_notes(grn_number);
create index if not exists idx_grn_quality_status on goods_received_notes(quality_status);
