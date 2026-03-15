-- Migration: Create workflows table for no-code workflow engine
CREATE TABLE IF NOT EXISTS workflows (
  id uuid PRIMARY KEY,
  company_id integer REFERENCES company_profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  steps jsonb NOT NULL,
  triggers text[] DEFAULT '{}',
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_workflows_company_id ON workflows(company_id);
