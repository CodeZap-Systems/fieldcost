
-- RLS Policy Fixes: Change from user_id to company_id based isolation
-- This ensures users can only access data for companies they own

-- ============ CUSTOMERS ============
DROP POLICY IF EXISTS "Users can access own customers" ON customers;
CREATE POLICY "Users can access own customers" ON customers
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM company_profiles 
      WHERE company_profiles.id = customers.company_id 
      AND company_profiles.user_id = auth.uid()
    )
  );

-- ============ PROJECTS ============
DROP POLICY IF EXISTS "Users can access own projects" ON projects;
CREATE POLICY "Users can access own projects" ON projects
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM company_profiles 
      WHERE company_profiles.id = projects.company_id 
      AND company_profiles.user_id = auth.uid()
    )
  );

-- ============ ITEMS ============
DROP POLICY IF EXISTS "Users can access own items" ON items;
CREATE POLICY "Users can access own items" ON items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM company_profiles 
      WHERE company_profiles.id = items.company_id 
      AND company_profiles.user_id = auth.uid()
    )
  );

-- ============ CREW_MEMBERS ============
DROP POLICY IF EXISTS "Users can access own crew" ON crew_members;
CREATE POLICY "Users can access own crew" ON crew_members
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM company_profiles 
      WHERE company_profiles.id = crew_members.company_id 
      AND company_profiles.user_id = auth.uid()
    )
  );

-- ============ TASKS ============
DROP POLICY IF EXISTS "Users can access own tasks" ON tasks;
CREATE POLICY "Users can access own tasks" ON tasks
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM company_profiles 
      WHERE company_profiles.id = tasks.company_id 
      AND company_profiles.user_id = auth.uid()
    )
  );

-- ============ INVOICES ============
DROP POLICY IF EXISTS "Users can access own invoices" ON invoices;
CREATE POLICY "Users can access own invoices" ON invoices
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM company_profiles 
      WHERE company_profiles.id = invoices.company_id 
      AND company_profiles.user_id = auth.uid()
    )
  );

-- ============ INVOICE_LINE_ITEMS ============
DROP POLICY IF EXISTS "Users can access own invoice lines" ON invoice_line_items;
CREATE POLICY "Users can access own invoice lines" ON invoice_line_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM company_profiles 
      WHERE company_profiles.id = invoice_line_items.company_id 
      AND company_profiles.user_id = auth.uid()
    )
  );

-- ============ BUDGETS ============
DROP POLICY IF EXISTS "Users can access own budgets" ON budgets;
CREATE POLICY "Users can access own budgets" ON budgets
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM company_profiles 
      WHERE company_profiles.id = budgets.company_id 
      AND company_profiles.user_id = auth.uid()
    )
  );
