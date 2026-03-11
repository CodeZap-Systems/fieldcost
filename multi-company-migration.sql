-- Migration: Add company_id to all data tables for multi-company support
-- This allows each company to be completely self-contained like Sage One

-- 1. Fix company_profiles: Allow multiple companies per user (remove UNIQUE constraint)
ALTER TABLE company_profiles DROP CONSTRAINT IF EXISTS company_profiles_user_id_key;

-- 2. Add company_id to projects table
ALTER TABLE projects ADD COLUMN IF NOT EXISTS company_id INTEGER REFERENCES company_profiles(id) ON DELETE CASCADE;

-- 3. Add company_id to customers table
ALTER TABLE customers ADD COLUMN IF NOT EXISTS company_id INTEGER REFERENCES company_profiles(id) ON DELETE CASCADE;

-- 4. Add company_id to items table
ALTER TABLE items ADD COLUMN IF NOT EXISTS company_id INTEGER REFERENCES company_profiles(id) ON DELETE CASCADE;

-- 5. Add company_id to crew_members table
ALTER TABLE crew_members ADD COLUMN IF NOT EXISTS company_id INTEGER REFERENCES company_profiles(id) ON DELETE CASCADE;

-- 6. Add company_id to tasks table
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS company_id INTEGER REFERENCES company_profiles(id) ON DELETE CASCADE;

-- 7. Add company_id to invoices table
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS company_id INTEGER REFERENCES company_profiles(id) ON DELETE CASCADE;

-- 8. Add company_id to invoice_line_items table
ALTER TABLE invoice_line_items ADD COLUMN IF NOT EXISTS company_id INTEGER REFERENCES company_profiles(id) ON DELETE CASCADE;

-- 9. Add company_id to budgets table
ALTER TABLE budgets ADD COLUMN IF NOT EXISTS company_id INTEGER REFERENCES company_profiles(id) ON DELETE CASCADE;

-- 10. Populate company_id for existing records (link to user's company)
UPDATE projects p SET company_id = cp.id FROM company_profiles cp WHERE p.user_id = cp.user_id AND p.company_id IS NULL;
UPDATE customers c SET company_id = cp.id FROM company_profiles cp WHERE c.user_id = cp.user_id AND c.company_id IS NULL;
UPDATE items i SET company_id = cp.id FROM company_profiles cp WHERE i.user_id = cp.user_id AND i.company_id IS NULL;
UPDATE crew_members cm SET company_id = cp.id FROM company_profiles cp WHERE cm.user_id = cp.user_id AND cm.company_id IS NULL;
UPDATE tasks t SET company_id = cp.id FROM company_profiles cp WHERE t.user_id = cp.user_id AND t.company_id IS NULL;
UPDATE invoices inv SET company_id = cp.id FROM company_profiles cp WHERE inv.user_id = cp.user_id AND inv.company_id IS NULL;
UPDATE invoice_line_items ili SET company_id = cp.id FROM company_profiles cp WHERE ili.user_id = cp.user_id AND ili.company_id IS NULL;
UPDATE budgets b SET company_id = cp.id FROM company_profiles cp WHERE b.user_id = cp.user_id AND b.company_id IS NULL;

-- 11. Create indexes for company_id (performance optimization)
CREATE INDEX IF NOT EXISTS projects_company_id_idx ON projects(company_id);
CREATE INDEX IF NOT EXISTS customers_company_id_idx ON customers(company_id);
CREATE INDEX IF NOT EXISTS items_company_id_idx ON items(company_id);
CREATE INDEX IF NOT EXISTS crew_members_company_id_idx ON crew_members(company_id);
CREATE INDEX IF NOT EXISTS tasks_company_id_idx ON tasks(company_id);
CREATE INDEX IF NOT EXISTS invoices_company_id_idx ON invoices(company_id);
CREATE INDEX IF NOT EXISTS invoice_line_items_company_id_idx ON invoice_line_items(company_id);
CREATE INDEX IF NOT EXISTS budgets_company_id_idx ON budgets(company_id);

-- 12. Update RLS policies to include company_id checking
-- Projects: Access own projects in selected company
DROP POLICY IF EXISTS "Users can access own projects" ON projects;
CREATE POLICY "Users can access own projects" ON projects
  FOR ALL USING (auth.uid() = user_id AND company_id IN (
    SELECT id FROM company_profiles WHERE user_id = auth.uid()
  ));

-- Customers: Access own customers in selected company
DROP POLICY IF EXISTS "Users can access own customers" ON customers;
CREATE POLICY "Users can access own customers" ON customers
  FOR ALL USING (auth.uid() = user_id AND company_id IN (
    SELECT id FROM company_profiles WHERE user_id = auth.uid()
  ));

-- Items: Access own items in selected company
DROP POLICY IF EXISTS "Users can access own items" ON items;
CREATE POLICY "Users can access own items" ON items
  FOR ALL USING (auth.uid() = user_id AND company_id IN (
    SELECT id FROM company_profiles WHERE user_id = auth.uid()
  ));

-- Crew Members: Access own crew in selected company
DROP POLICY IF EXISTS "Users can access own crew members" ON crew_members;
CREATE POLICY "Users can access own crew members" ON crew_members
  FOR ALL USING (auth.uid() = user_id AND company_id IN (
    SELECT id FROM company_profiles WHERE user_id = auth.uid()
  ));

-- Tasks: Access own tasks in selected company
DROP POLICY IF EXISTS "Users can access own tasks" ON tasks;
CREATE POLICY "Users can access own tasks" ON tasks
  FOR ALL USING (auth.uid() = user_id AND company_id IN (
    SELECT id FROM company_profiles WHERE user_id = auth.uid()
  ));

-- Invoices: Access own invoices in selected company
DROP POLICY IF EXISTS "Users can access own invoices" ON invoices;
CREATE POLICY "Users can access own invoices" ON invoices
  FOR ALL USING (auth.uid() = user_id AND company_id IN (
    SELECT id FROM company_profiles WHERE user_id = auth.uid()
  ));

-- Invoice Line Items: Access own invoice items in selected company
DROP POLICY IF EXISTS "Users can access own invoice items" ON invoice_line_items;
CREATE POLICY "Users can access own invoice items" ON invoice_line_items
  FOR ALL USING (auth.uid() = user_id AND company_id IN (
    SELECT id FROM company_profiles WHERE user_id = auth.uid()
  ));

-- Budgets: Access own budgets in selected company
DROP POLICY IF EXISTS "Users can access own budgets" ON budgets;
CREATE POLICY "Users can access own budgets" ON budgets
  FOR ALL USING (auth.uid() = user_id AND company_id IN (
    SELECT id FROM company_profiles WHERE user_id = auth.uid()
  ));
