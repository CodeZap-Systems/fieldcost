-- Demo data for FieldCost MVP

-- Insert demo users (admin and subcontractor)
-- (Supabase Auth manages users, so demo users should be created via the app or Supabase dashboard)

-- Insert demo projects
insert into projects (name, description, user_id)
values
  ('Demo Project Alpha', 'Earthworks for Site A', 'demo-user-uuid-1'),
  ('Demo Project Beta', 'Mining pit expansion', 'demo-user-uuid-1');

-- Insert demo customers
insert into customers (name, email, user_id)
values
  ('Acme Construction', 'acme@example.com', 'demo-user-uuid-1'),
  ('Beta Mining', 'beta@example.com', 'demo-user-uuid-1');

-- Insert demo items (inventory)
insert into items (name, price, stock_in, stock_used, user_id)
values
  ('Diesel', 20.00, 1000, 200, 'demo-user-uuid-1'),
  ('Cement', 80.00, 500, 120, 'demo-user-uuid-1');

-- Insert demo tasks
insert into tasks (name, project_id, seconds, status, user_id)
values
  ('Excavate trench', 1, 7200, 'done', 'demo-user-uuid-1'),
  ('Pour concrete', 1, 3600, 'in-progress', 'demo-user-uuid-1'),
  ('Haul material', 2, 1800, 'todo', 'demo-user-uuid-1');

-- Insert demo invoices
insert into invoices (customer_id, amount, description, user_id)
values
  (1, 5000.00, 'Earthworks completed', 'demo-user-uuid-1'),
  (2, 12000.00, 'Mining pit expansion', 'demo-user-uuid-1');

-- Insert demo budgets
insert into budgets (project_id, planned_amount, actual_amount, user_id)
values
  (1, 10000.00, 8000.00, 'demo-user-uuid-1'),
  (2, 20000.00, 12000.00, 'demo-user-uuid-1');
