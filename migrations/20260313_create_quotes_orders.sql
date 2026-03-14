-- ===================================
-- QUOTES AND ORDERS SCHEMA MIGRATION
-- ===================================
-- This SQL creates the necessary tables for the Quotes and Orders features.
-- Execute this in your Supabase SQL Editor:
-- https://app.supabase.com/project/mukaeylwmzztycajibhy/sql/new

-- ===== QUOTES TABLE =====
CREATE TABLE IF NOT EXISTS quotes (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id UUID NOT NULL,
  company_id INT NOT NULL,
  customer_id INT,
  quote_number VARCHAR(50) UNIQUE NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'draft',
  amount NUMERIC(12, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  valid_until DATE NOT NULL,
  reference VARCHAR(255),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_quotes_company FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
  CONSTRAINT fk_quotes_user FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
  CONSTRAINT valid_status CHECK (status IN ('draft', 'sent', 'accepted', 'rejected'))
);

CREATE INDEX IF NOT EXISTS idx_quotes_company_id ON quotes(company_id);
CREATE INDEX IF NOT EXISTS idx_quotes_user_id ON quotes(user_id);
CREATE INDEX IF NOT EXISTS idx_quotes_status ON quotes(status);
CREATE INDEX IF NOT EXISTS idx_quotes_customer_id ON quotes(customer_id);

-- Enable RLS on quotes table
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only see their own company's quotes"
  ON quotes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert quotes for their company"
  ON quotes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their company's quotes"
  ON quotes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete draft quotes"
  ON quotes FOR DELETE
  USING (auth.uid() = user_id AND status = 'draft');

-- ===== QUOTE LINE ITEMS TABLE =====
CREATE TABLE IF NOT EXISTS quote_line_items (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  quote_id BIGINT NOT NULL,
  description VARCHAR(255) NOT NULL,
  quantity NUMERIC(10, 2) NOT NULL,
  unit_price NUMERIC(12, 2) NOT NULL,
  line_total NUMERIC(12, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_quote_line_items_quote FOREIGN KEY (quote_id) REFERENCES quotes(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_quote_line_items_quote_id ON quote_line_items(quote_id);

-- Enable RLS on quote_line_items
ALTER TABLE quote_line_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view line items for their quotes"
  ON quote_line_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM quotes
      WHERE quotes.id = quote_line_items.quote_id
      AND quotes.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert line items for their quotes"
  ON quote_line_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM quotes
      WHERE quotes.id = quote_line_items.quote_id
      AND quotes.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update line items for their quotes"
  ON quote_line_items FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM quotes
      WHERE quotes.id = quote_line_items.quote_id
      AND quotes.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete line items for draft quotes"
  ON quote_line_items FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM quotes
      WHERE quotes.id = quote_line_items.quote_id
      AND quotes.user_id = auth.uid()
      AND quotes.status = 'draft'
    )
  );

-- ===== ORDERS TABLE =====
CREATE TABLE IF NOT EXISTS orders (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id UUID NOT NULL,
  company_id INT NOT NULL,
  po_number VARCHAR(50) UNIQUE NOT NULL,
  vendor_id INT,
  vendor_name VARCHAR(255),
  customer_id INT,
  status VARCHAR(20) NOT NULL DEFAULT 'draft',
  amount NUMERIC(12, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  delivery_date DATE NOT NULL,
  reference VARCHAR(255),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_orders_company FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
  CONSTRAINT fk_orders_user FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
  CONSTRAINT valid_status CHECK (status IN ('draft', 'confirmed', 'delivered', 'cancelled'))
);

CREATE INDEX IF NOT EXISTS idx_orders_company_id ON orders(company_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_vendor_id ON orders(vendor_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);

-- Enable RLS on orders table
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only see their own company's orders"
  ON orders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert orders for their company"
  ON orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their company's orders"
  ON orders FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete draft orders"
  ON orders FOR DELETE
  USING (auth.uid() = user_id AND status = 'draft');

-- ===== ORDER LINE ITEMS TABLE =====
CREATE TABLE IF NOT EXISTS order_line_items (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  order_id BIGINT NOT NULL,
  description VARCHAR(255) NOT NULL,
  quantity NUMERIC(10, 2) NOT NULL,
  unit_price NUMERIC(12, 2) NOT NULL,
  line_total NUMERIC(12, 2) NOT NULL,
  received_quantity NUMERIC(10, 2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_order_line_items_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_order_line_items_order_id ON order_line_items(order_id);

-- Enable RLS on order_line_items
ALTER TABLE order_line_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view line items for their orders"
  ON order_line_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_line_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert line items for their orders"
  ON order_line_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_line_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update line items for their orders"
  ON order_line_items FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_line_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete line items for draft orders"
  ON order_line_items FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_line_items.order_id
      AND orders.user_id = auth.uid()
      AND orders.status = 'draft'
    )
  );

-- ===== VERIFICATION QUERIES =====
-- Run these to verify the tables and policies are created correctly:
-- SELECT COUNT(*) FROM information_schema.tables WHERE table_name IN ('quotes', 'quote_line_items', 'orders', 'order_line_items');
-- SELECT schemaname, tablename FROM pg_tables WHERE schemaname = 'public' AND tablename LIKE '%quote%' OR tablename LIKE '%order%';
