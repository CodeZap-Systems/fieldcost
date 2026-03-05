-- Ensure legacy demo workspaces get the latest Task + Crew structure
alter table tasks add column if not exists description text;
alter table tasks add column if not exists photo_url text;

create table if not exists crew_members (
	id serial primary key,
	name text not null,
	hourly_rate numeric default 0,
	user_id uuid references auth.users on delete cascade,
	created_at timestamp with time zone default now()
);

alter table tasks
	add column if not exists crew_member_id integer references crew_members(id) on delete set null;

alter table tasks
	add column if not exists billable boolean default true;

update tasks set billable = coalesce(billable, true);

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

alter table invoices add column if not exists reference text;
alter table invoices add column if not exists invoice_number text;
alter table invoices add column if not exists status text default 'draft';
alter table invoices add column if not exists issued_on date default current_date;
alter table invoices add column if not exists due_on date;
alter table invoices add column if not exists currency text default 'ZAR';