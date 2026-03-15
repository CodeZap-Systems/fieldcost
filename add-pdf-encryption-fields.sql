-- Add PDF encryption fields to company_profiles
-- This migration adds support for optional PDF encryption on invoice exports

ALTER TABLE company_profiles ADD COLUMN IF NOT EXISTS pdf_encryption_enabled boolean default false;
ALTER TABLE company_profiles ADD COLUMN IF NOT EXISTS pdf_encryption_password text;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_company_profiles_pdf_encryption 
ON company_profiles(id, pdf_encryption_enabled);

-- Add comment for documentation
COMMENT ON COLUMN company_profiles.pdf_encryption_enabled IS 'Enable PDF encryption for exported invoices';
COMMENT ON COLUMN company_profiles.pdf_encryption_password IS 'Password for PDF encryption (stored encrypted in production)';
