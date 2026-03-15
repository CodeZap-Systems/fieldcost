-- Migration: Add branding fields to company_profiles for white-label support
ALTER TABLE company_profiles
  ADD COLUMN IF NOT EXISTS favicon_url text,
  ADD COLUMN IF NOT EXISTS color_palette jsonb,
  ADD COLUMN IF NOT EXISTS font_family text,
  ADD COLUMN IF NOT EXISTS terminology jsonb,
  ADD COLUMN IF NOT EXISTS app_name text,
  ADD COLUMN IF NOT EXISTS icon_set text,
  ADD COLUMN IF NOT EXISTS email_templates jsonb;

-- Optionally, set defaults for new fields
UPDATE company_profiles SET
  color_palette = '{"primary": "#2563eb", "secondary": "#64748b", "accent": "#f59e42", "background": "#f8fafc", "text": "#1e293b"}',
  font_family = 'Inter, sans-serif',
  terminology = '{"project": "Project", "crew": "Crew"}',
  app_name = 'FieldCost',
  email_templates = '{"header": "", "footer": "", "login": ""}'
WHERE color_palette IS NULL OR font_family IS NULL OR terminology IS NULL OR app_name IS NULL OR email_templates IS NULL;
