# Tier 2 Staging - Environment Fix Guide

## Problem
Staging environment returning 401 and HTML redirects because **Supabase environment variables are not configured**.

## Required Environment Variables for Staging

These variables must be set in **Vercel Staging Project Settings**:

```
NEXT_PUBLIC_SUPABASE_URL=https://mukaeylwmzztycajibhy.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_PKH2WI43arqcP7xSahLYgQ_7ms-zZwg
SUPABASE_SERVICE_ROLE_KEY=sb_secret_K3tnv11vpqVXSd3aW93BZg_dodeN0dI
```

## How to Fix (Vercel Dashboard)

1. Go to: https://vercel.com/dinganis-projects/fieldcost/settings/environment-variables
2. Switch to **staging** branch environment (if available)
3. Add these three environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL` 
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. **Redeploy** the staging branch
5. Run test: `node test-staging.mjs`

## Alternative: Deploy via Vercel CLI

```bash
# 1. Install Vercel CLI (if not installed)
npm install -g vercel

# 2. Link project (if not already linked)
vercel link

# 3. Deploy staging with env vars
vercel deploy --prod --env NEXT_PUBLIC_SUPABASE_URL=https://mukaeylwmzztycajibhy.supabase.co --env NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_PKH2WI43arqcP7xSahLYgQ_7ms-zZwg --env SUPABASE_SERVICE_ROLE_KEY=sb_secret_K3tnv11vpqVXSd3aW93BZg_dodeN0dI
```

## Status After Fix

Once environment variables are set and staging is redeployed:
- ✅ Dashboard will load (200 OK)
- ✅ Projects API will respond (JSON)
- ✅ Create Project will work
- ✅ Reports will return JSON

**Expected Result**: 4/4 tests passing (100%) on staging

## Current Status

| Environment | Pass Rate | Issue | Fix Status |
|-------------|-----------|-------|-----------|
| Production (Tier 1) | 80% | Vercel cache | ⏳ Auto-clearing |
| Staging (Tier 2) | 0% | Missing env vars | 🔧 Needs manual fix |
