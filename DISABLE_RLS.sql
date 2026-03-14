-- More aggressive fix: Disable RLS on quotes and orders tables
-- Your app already enforces authorization via company_id and user_id filtering

ALTER TABLE quotes DISABLE ROW LEVEL SECURITY;
ALTER TABLE quote_line_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE order_line_items DISABLE ROW LEVEL SECURITY;
