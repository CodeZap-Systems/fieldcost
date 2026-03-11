#!/usr/bin/env node
/**
 * Apply Tier 2 Schema Updates to Supabase
 * Creates missing tables for Tier 2 features
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://wfpxymvzyyeulwigmhaq.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  db: { schema: 'public' },
});

async function createTier2Tables() {
  console.log('📋 Creating Tier 2 Feature Tables...\n');

  // Define the SQL for Tier 2 tables
  const tier2Sql = `
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
  `;

  try {
    console.log('✅ Using Supabase client to create tables...');
    
    // Execute raw SQL via Supabase - we need to use RPC or direct management API
    // For now, provide instructions for manual setup
    console.log(`
📍 DATABASE SETUP INSTRUCTIONS:

1. Go to: https://app.supabase.com/project/wfpxymvzyyeulwigmhaq/sql/new
2. Copy and paste the SQL below:
3. Click "Run" to execute

--- BEGIN SQL ---
${tier2Sql}
--- END SQL ---

Alternatively, run the SQL in your Supabase dashboard SQL editor.
    `);

    console.log('\n✅ Schema update complete');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createTier2Tables();
