-- Beta Access Gate
-- Creates the beta_access table used to allowlist users for internal beta.
-- Apply this migration via: Supabase Dashboard → SQL Editor, or `supabase db push`.
--
-- Admin procedure: see BETA_ACCESS.md for how to grant/revoke access.

-- 1. Create table
create table if not exists beta_access (
  id          bigserial primary key,
  -- Either user_id (after first sign-in) or email can be used to grant access.
  user_id     uuid    references auth.users (id) on delete cascade,
  email       text,
  granted_by  text    not null default 'admin',
  granted_at  timestamp with time zone not null default now(),
  revoked_at  timestamp with time zone,
  notes       text,

  constraint beta_access_user_or_email check (user_id is not null or email is not null)
);

-- Indexes
create index if not exists idx_beta_access_user_id on beta_access (user_id) where revoked_at is null;
create index if not exists idx_beta_access_email   on beta_access (lower(email)) where revoked_at is null;

-- 2. Enable Row Level Security
alter table beta_access enable row level security;

-- Service role can do everything (used by admin procedures)
-- No policies needed for anon/authenticated: beta_access is admin-only via service role.
-- The middleware check runs server-side with the service role key and is not
-- exposed to the client.

comment on table beta_access is
  'Allowlist for internal beta access. Managed by admins only. '
  'See BETA_ACCESS.md for grant/revoke procedures.';
comment on column beta_access.user_id  is 'Supabase Auth user ID — preferred once user has signed in at least once.';
comment on column beta_access.email    is 'Email address — useful to pre-approve before first sign-in.';
comment on column beta_access.revoked_at is 'NULL means access is currently active; set to now() to revoke.';
