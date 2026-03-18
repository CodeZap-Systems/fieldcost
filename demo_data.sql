-- Insert demo suppliers
insert into suppliers (company_id, user_id, vendor_name, contact_name, email, phone, address_line1, city, country, payment_terms, rating, notes)
values
  (1, 'demo-user-uuid-1', 'Acme Supplies (FieldCost Demo)', 'Jane Supplier', 'supplier1@demo.com', '555-1001', '123 Demo St', 'Demo City', 'DemoLand', 'net 30', 4.5, 'Preferred demo supplier'),
  (1, 'demo-user-uuid-1', 'Beta Vendors (FieldCost Demo)', 'John Vendor', 'supplier2@demo.com', '555-1002', '456 Vendor Ave', 'Vendorville', 'DemoLand', 'net 15', 4.0, 'Backup demo supplier');

-- Insert demo purchase orders
insert into purchase_orders (supplier_id, project_id, company_id, user_id, po_reference, po_date, required_by_date, delivery_date, total_amount, total_received, description, status)
values
  (1, 1, 1, 'demo-user-uuid-1', 'PO-2026-001', '2026-03-01', '2026-03-10', '2026-03-09', 2000.00, 2000.00, 'Demo PO for Project Alpha', 'fully_received'),
  (2, 2, 1, 'demo-user-uuid-1', 'PO-2026-002', '2026-03-02', '2026-03-12', '2026-03-11', 1500.00, 1000.00, 'Demo PO for Project Beta', 'partially_received');

-- Insert demo purchase order line items
insert into purchase_order_line_items (po_id, item_id, item_name, description, quantity_ordered, quantity_received, unit, unit_rate, company_id, user_id, note)
values
  (1, 1, 'Diesel (FieldCost Demo)', 'Bulk diesel for site', 100, 100, 'liters', 10.00, 1, 'demo-user-uuid-1', 'Urgent delivery'),
  (1, 2, 'Cement (FieldCost Demo)', 'Cement for foundations', 50, 50, 'bags', 20.00, 1, 'demo-user-uuid-1', NULL),
  (2, 2, 'Cement (FieldCost Demo)', 'Cement for pit expansion', 75, 50, 'bags', 20.00, 1, 'demo-user-uuid-1', 'Partial delivery');

-- Insert demo goods received notes (GRN)
insert into goods_received_notes (po_id, po_line_item_id, company_id, user_id, grn_number, grn_date, quantity_received, unit, quality_status, received_by, received_at_location)
values
  (1, 1, 1, 'demo-user-uuid-1', 'GRN-2026-00001', '2026-03-09', 100, 'liters', 'accepted', 'Site Foreman', 'Alpha Site'),
  (1, 2, 1, 'demo-user-uuid-1', 'GRN-2026-00002', '2026-03-09', 50, 'bags', 'accepted', 'Site Foreman', 'Alpha Site'),
  (2, 3, 1, 'demo-user-uuid-1', 'GRN-2026-00003', '2026-03-11', 50, 'bags', 'accepted', 'Site Foreman', 'Beta Site');

-- Insert demo quotes
insert into quotes (customer_id, project_id, company_id, user_id, amount, description, reference, status, valid_until, sent_on)
values
  (1, 1, 1, 'demo-user-uuid-1', 5000.00, 'Quote for Alpha Project (FieldCost Demo)', 'QT-2026-001', 'sent', '2026-04-01', '2026-03-01'),
  (2, 2, 1, 'demo-user-uuid-1', 8000.00, 'Quote for Beta Project (FieldCost Demo)', 'QT-2026-002', 'draft', '2026-04-10', NULL);

-- Insert demo quote line items
insert into quote_line_items (quote_id, item_id, item_name, description, quantity, unit, rate, company_id, user_id, note)
values
  (1, 1, 'Diesel (FieldCost Demo)', 'Diesel for Alpha', 100, 'liters', 12.00, 1, 'demo-user-uuid-1', NULL),
  (1, 2, 'Cement (FieldCost Demo)', 'Cement for Alpha', 50, 'bags', 22.00, 1, 'demo-user-uuid-1', NULL),
  (2, 2, 'Cement (FieldCost Demo)', 'Cement for Beta', 75, 'bags', 21.00, 1, 'demo-user-uuid-1', NULL);

-- Insert demo quote approvals
insert into quote_approvals (quote_id, approver_id, status, approved_at)
values
  (1, 'demo-user-uuid-1', 'approved', '2026-03-02'),
  (2, 'demo-user-uuid-1', 'pending', NULL);
-- Demo data for FieldCost MVP (branding preserved for demo)

-- Insert demo users (admin and subcontractor)
-- (Supabase Auth manages users, so demo users should be created via the app or Supabase dashboard)

-- Insert demo projects
insert into projects (name, description, user_id)
values
  ('FieldCost Demo Project Alpha', 'Earthworks for Site A (FieldCost Demo)', 'demo-user-uuid-1'),
  ('FieldCost Demo Project Beta', 'Mining pit expansion (FieldCost Demo)', 'demo-user-uuid-1');

-- Insert demo customers
insert into customers (name, email, user_id)
values
  ('Acme Construction (FieldCost Demo)', 'acme@example.com', 'demo-user-uuid-1'),
  ('Beta Mining (FieldCost Demo)', 'beta@example.com', 'demo-user-uuid-1');

-- Insert demo items (inventory)
insert into items (name, price, stock_in, stock_used, user_id)
values
  ('Diesel (FieldCost Demo)', 20.00, 1000, 200, 'demo-user-uuid-1'),
  ('Cement (FieldCost Demo)', 80.00, 500, 120, 'demo-user-uuid-1');

-- Insert demo tasks
insert into tasks (name, project_id, seconds, status, user_id)
values
  ('Excavate trench (FieldCost Demo)', 1, 7200, 'done', 'demo-user-uuid-1'),
  ('Pour concrete (FieldCost Demo)', 1, 3600, 'in-progress', 'demo-user-uuid-1'),
  ('Haul material (FieldCost Demo)', 2, 1800, 'todo', 'demo-user-uuid-1');

-- Insert demo invoices
insert into invoices (customer_id, amount, description, user_id)
values
  (1, 5000.00, 'Earthworks completed (FieldCost Demo)', 'demo-user-uuid-1'),
  (2, 12000.00, 'Mining pit expansion (FieldCost Demo)', 'demo-user-uuid-1');

-- Insert demo budgets
insert into budgets (project_id, planned_amount, actual_amount, user_id)
values
  (1, 10000.00, 8000.00, 'demo-user-uuid-1'),
  (2, 20000.00, 12000.00, 'demo-user-uuid-1');
