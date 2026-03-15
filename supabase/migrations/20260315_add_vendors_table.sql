-- Add vendors table for managing suppliers/vendors
create table if not exists vendors (
  id serial primary key,
  name text not null,
  email text,
  phone text,
  company_name text,
  contact_person text,
  user_id uuid references auth.users on delete cascade,
  company_id integer default 1,
  created_at timestamp with time zone default now()
);

alter table vendors add column if not exists company_id integer default 1;
alter table vendors add column if not exists phone text;
alter table vendors add column if not exists company_name text;
alter table vendors add column if not exists contact_person text;

-- Enable Row Level Security
alter table vendors enable row level security;

-- RLS Policy: users can access their own vendors
drop policy if exists "Users can access own vendors" on vendors;
create policy "Users can access own vendors" on vendors
  for all using (auth.uid() = user_id);

-- Add unique constraint for vendor names per company
ALTER TABLE vendors
ADD CONSTRAINT vendors_company_id_name_unique UNIQUE (company_id, LOWER(name));

-- Add check constraint for non-empty names
ALTER TABLE vendors
ADD CONSTRAINT vendors_name_not_empty CHECK (TRIM(name) <> '');
