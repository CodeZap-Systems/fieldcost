# Beta Access Management

This document explains how to grant or revoke access during the FieldCost internal beta.

## How the beta gate works

When `BETA_GATING=true` is set in your deployment environment, every authenticated
user is checked against the `beta_access` table in Supabase before they can reach any
protected route.  Users who are **not** in the allowlist are redirected to
`/auth/beta-waitlist` with instructions to contact an administrator.

The check matches on:

1. **`user_id`** — the Supabase Auth UUID (preferred, stable across email changes).
2. **`email`** — the email address used to sign in (useful to pre-approve before first sign-in).

A row is considered "active" when `revoked_at IS NULL`.

---

## Prerequisites

- Access to the [Supabase Dashboard](https://app.supabase.com) SQL Editor, or
- The Supabase CLI with `SUPABASE_SERVICE_ROLE_KEY` in your local environment.

The `beta_access` table is created by migration
`supabase/migrations/20260330_create_beta_access.sql`.  Run it once against your
Supabase project if you have not already applied it.

---

## Granting access

### Option A — Grant by email (before first sign-in)

```sql
INSERT INTO beta_access (email, granted_by, notes)
VALUES (
  'user@example.com',
  'admin@yourcompany.com',
  'Internal beta tester'
);
```

### Option B — Grant by user_id (after first sign-in)

Find the user's UUID in **Supabase Dashboard → Authentication → Users**, then:

```sql
INSERT INTO beta_access (user_id, granted_by, notes)
VALUES (
  'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
  'admin@yourcompany.com',
  'Internal beta tester'
);
```

### Option C — Grant an entire email domain

Not natively supported by the allowlist table, but you can handle this in
the middleware by adding a domain check before the `beta_access` query.
Alternatively, insert one row per user as they sign up.

---

## Revoking access

```sql
UPDATE beta_access
SET revoked_at = now()
WHERE email = 'user@example.com'
  AND revoked_at IS NULL;
```

Or by `user_id`:

```sql
UPDATE beta_access
SET revoked_at = now()
WHERE user_id = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
  AND revoked_at IS NULL;
```

---

## Listing current beta users

```sql
SELECT
  user_id,
  email,
  granted_by,
  granted_at,
  notes
FROM beta_access
WHERE revoked_at IS NULL
ORDER BY granted_at DESC;
```

---

## Disabling the beta gate

Set `BETA_GATING=false` (or unset it) in your Vercel / deployment environment.
The middleware check is skipped and all authenticated users can access the app.

---

## Microsoft Entra (Azure AD) sign-in

Users who sign in via "Sign in with Microsoft" will be authenticated through Supabase
OAuth.  Their Supabase `user_id` is assigned on first sign-in.

**To pre-approve a Microsoft user before their first sign-in**, use **Option A** above
with their work email address.  After their first sign-in, their `beta_access` row
can be updated to also set `user_id` for stability.

### Required environment variables

```
NEXT_PUBLIC_SITE_URL=https://fieldcost.vercel.app
```

Configure in Supabase Dashboard → Auth → Providers → Azure:

| Field | Value |
|-------|-------|
| Azure tenant ID | Your Microsoft Entra tenant ID |
| Azure client ID | App registration client ID |
| Azure client secret | App registration client secret |

Add this redirect URI in Supabase Auth URL Configuration:

```
https://fieldcost.vercel.app/auth/callback
```

Add this redirect URI in your Azure app registration:

```
https://<your-supabase-project>.supabase.co/auth/v1/callback
```

---

## Troubleshooting

| Symptom | Likely cause | Fix |
|---------|-------------|-----|
| User is redirected to `/auth/beta-waitlist` immediately after login | Not in `beta_access` table | Grant access (see above) |
| `BETA_GATING` env var is missing | No gating | Set `BETA_GATING=true` in Vercel env |
| Microsoft login button returns error | Supabase Azure provider not configured | Configure in Supabase Dashboard → Auth → Providers → Azure |
| Callback URL mismatch | Redirect URIs don't match | Ensure `/auth/callback` is in Supabase allowed redirect URLs |
