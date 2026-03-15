-- Add document export audit logs table
-- Tracks all document exports with encryption status for compliance

CREATE TABLE IF NOT EXISTS document_export_logs (
  id bigserial primary key,
  user_id uuid references auth.users on delete cascade,
  company_id integer,
  document_type text not null, -- 'invoice', 'quote', 'purchase_order'
  document_id text not null,
  encrypted boolean default false,
  filename text,
  export_method text default 'direct', -- 'direct', 'email', 'batch'
  exported_at timestamp with time zone default now(),
  created_at timestamp with time zone default now()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_export_logs_user_company 
ON document_export_logs(user_id, company_id);

CREATE INDEX IF NOT EXISTS idx_export_logs_exported_at 
ON document_export_logs(exported_at DESC);

CREATE INDEX IF NOT EXISTS idx_export_logs_document_type 
ON document_export_logs(document_type);

-- Enable RLS
ALTER TABLE document_export_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only see their own export logs
DROP POLICY IF EXISTS "Users can access own export logs" ON document_export_logs;
CREATE POLICY "Users can access own export logs" ON document_export_logs
  FOR ALL
  USING (auth.uid() = user_id);

-- Add comment for documentation
COMMENT ON TABLE document_export_logs IS 'Audit trail for all document exports, including encryption status for compliance';
COMMENT ON COLUMN document_export_logs.encrypted IS 'Whether the exported document was encrypted';
COMMENT ON COLUMN document_export_logs.export_method IS 'How the document was exported: direct download, email, or batch';
