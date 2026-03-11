-- Tier 2 Feature Tables for FieldCost
-- Run this SQL in your Supabase SQL Editor to create Tier 2 feature support
-- https://app.supabase.com/project/[project-id]/sql/new

-- ============================================================================
-- TIER 2 FEATURE TABLES
-- ============================================================================

-- 1. custom_workflows: Approval and task workflows
CREATE TABLE IF NOT EXISTS custom_workflows (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  applicable_to TEXT DEFAULT 'general',
  requires_approval BOOLEAN DEFAULT false,
  approval_chain TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 2. task_location_snapshots: GPS tracking for tasks
CREATE TABLE IF NOT EXISTS task_location_snapshots (
  id BIGSERIAL PRIMARY KEY,
  task_id INTEGER REFERENCES tasks ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  latitude NUMERIC NOT NULL,
  longitude NUMERIC NOT NULL,
  accuracy NUMERIC,
  altitude NUMERIC,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 3. offline_bundles: Offline sync tracking
CREATE TABLE IF NOT EXISTS offline_bundles (
  id BIGSERIAL PRIMARY KEY,
  device_id TEXT NOT NULL,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  bundle_created_at TIMESTAMP WITH TIME ZONE,
  bundles_synced INTEGER DEFAULT 0,
  tasks_inside_bundle INTEGER DEFAULT 0,
  photos_inside_bundle INTEGER DEFAULT 0,
  data_size_mb NUMERIC DEFAULT 0,
  requires_manual_review BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 4. offline_sync_log: Audit trail for sync operations
CREATE TABLE IF NOT EXISTS offline_sync_log (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  device_id TEXT,
  status TEXT DEFAULT 'in_progress',
  sync_started_at TIMESTAMP WITH TIME ZONE,
  sync_completed_at TIMESTAMP WITH TIME ZONE,
  items_processed INTEGER DEFAULT 0,
  items_failed INTEGER DEFAULT 0,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 5. photo_evidence: Photo storage with metadata
CREATE TABLE IF NOT EXISTS photo_evidence (
  id BIGSERIAL PRIMARY KEY,
  task_id INTEGER REFERENCES tasks ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  caption TEXT,
  taken_at TIMESTAMP WITH TIME ZONE,
  latitude NUMERIC,
  longitude NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 6. photo_evidence_chain: Chain of custody for photos
CREATE TABLE IF NOT EXISTS photo_evidence_chain (
  id BIGSERIAL PRIMARY KEY,
  photo_id BIGINT REFERENCES photo_evidence ON DELETE CASCADE,
  action TEXT,
  actor_id UUID REFERENCES auth.users,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ============================================================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE custom_workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_location_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE offline_bundles ENABLE ROW LEVEL SECURITY;
ALTER TABLE offline_sync_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE photo_evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE photo_evidence_chain ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================================

-- Task Location Snapshots: Users can access own location data
DROP POLICY IF EXISTS "Users can access own location snapshots" ON task_location_snapshots;
CREATE POLICY "Users can access own location snapshots" ON task_location_snapshots
  FOR ALL USING (auth.uid() = user_id);

-- Offline Bundles: Users can access own bundles
DROP POLICY IF EXISTS "Users can access own offline bundles" ON offline_bundles;
CREATE POLICY "Users can access own offline bundles" ON offline_bundles
  FOR ALL USING (auth.uid() = user_id);

-- Offline Sync Log: Users can access own sync history
DROP POLICY IF EXISTS "Users can access own sync logs" ON offline_sync_log;
CREATE POLICY "Users can access own sync logs" ON offline_sync_log
  FOR ALL USING (auth.uid() = user_id);

-- Photo Evidence: Users can access own photos
DROP POLICY IF EXISTS "Users can access own photo evidence" ON photo_evidence;
CREATE POLICY "Users can access own photo evidence" ON photo_evidence
  FOR ALL USING (auth.uid() = user_id);

-- Photo Evidence Chain: Users can access chain for their photos
DROP POLICY IF EXISTS "Users can access own chain of custody" ON photo_evidence_chain;
CREATE POLICY "Users can access own chain of custody" ON photo_evidence_chain
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM photo_evidence 
      WHERE photo_evidence.id = photo_evidence_chain.photo_id
      AND photo_evidence.user_id = auth.uid()
    )
  );

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_task_location_user ON task_location_snapshots(user_id);
CREATE INDEX IF NOT EXISTS idx_task_location_task ON task_location_snapshots(task_id);
CREATE INDEX IF NOT EXISTS idx_offline_bundles_user ON offline_bundles(user_id);
CREATE INDEX IF NOT EXISTS idx_offline_sync_user ON offline_sync_log(user_id);
CREATE INDEX IF NOT EXISTS idx_photo_evidence_user ON photo_evidence(user_id);
CREATE INDEX IF NOT EXISTS idx_photo_evidence_task ON photo_evidence(task_id);
CREATE INDEX IF NOT EXISTS idx_photo_chain_photo ON photo_evidence_chain(photo_id);

-- ============================================================================
-- RUN THIS SQL IN YOUR SUPABASE DASHBOARD
-- ============================================================================
-- 1. Go to: https://app.supabase.com/project/wfpxymvzyyeulwigmhaq/sql/new
-- 2. Paste all content above
-- 3. Click "Run" button
-- 4. Refresh your browser
-- 5. Run tests: node tier2-audit.mjs
