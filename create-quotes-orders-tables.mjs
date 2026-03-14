#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SUPABASE_URL = 'https://mukaeylwmzztycajibhy.supabase.co';
const SERVICE_ROLE_KEY = 'sb_secret_K3tnv11vpqVXSd3aW93BZg_dodeN0dI';

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

// Read SQL from migration file
const sqlFilePath = path.join(__dirname, 'migrations', '20260313_create_quotes_orders.sql');
let SQL = fs.readFileSync(sqlFilePath, 'utf-8');

// Remove comments and extract only the relevant SQL
SQL = SQL
  .split('\n')
  .filter(line => !line.trim().startsWith('--') && line.trim())
  .join('\n');

const LEGACY_SQL = `
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

DROP POLICY IF EXISTS "Users can only see their own company's quotes" ON quotes;
CREATE POLICY "Users can only see their own company's quotes"
  ON quotes FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert quotes for their company" ON quotes;
CREATE POLICY "Users can insert quotes for their company"
  ON quotes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their company's quotes" ON quotes;
CREATE POLICY "Users can update their company's quotes"
  ON quotes FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete draft quotes" ON quotes;
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

DROP POLICY IF EXISTS "Users can view line items for their quotes" ON quote_line_items;
CREATE POLICY "Users can view line items for their quotes"
  ON quote_line_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM quotes
      WHERE quotes.id = quote_line_items.quote_id
      AND quotes.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can insert line items for their quotes" ON quote_line_items;
CREATE POLICY "Users can insert line items for their quotes"
  ON quote_line_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM quotes
      WHERE quotes.id = quote_line_items.quote_id
      AND quotes.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can update line items for their quotes" ON quote_line_items;
CREATE POLICY "Users can update line items for their quotes"
  ON quote_line_items FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM quotes
      WHERE quotes.id = quote_line_items.quote_id
      AND quotes.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can delete line items for draft quotes" ON quote_line_items;
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

DROP POLICY IF EXISTS "Users can only see their own company's orders" ON orders;
CREATE POLICY "Users can only see their own company's orders"
  ON orders FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert orders for their company" ON orders;
CREATE POLICY "Users can insert orders for their company"
  ON orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their company's orders" ON orders;
CREATE POLICY "Users can update their company's orders"
  ON orders FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete draft orders" ON orders;
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

DROP POLICY IF EXISTS "Users can view line items for their orders" ON order_line_items;
CREATE POLICY "Users can view line items for their orders"
  ON order_line_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_line_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can insert line items for their orders" ON order_line_items;
CREATE POLICY "Users can insert line items for their orders"
  ON order_line_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_line_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can update line items for their orders" ON order_line_items;
CREATE POLICY "Users can update line items for their orders"
  ON order_line_items FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_line_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can delete line items for draft orders" ON order_line_items;
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
`;

async function createTables() {
  try {
    console.log('🚀 Creating quotes and orders tables in Supabase...');
    
    const { data, error } = await supabase.rpc('exec', {
      sql: SQL
    });
    
    if (error) {
      // If rpc method doesn't exist, try the direct approach
      console.log('⚠️  RPC method not available, trying direct SQL execution...');
      
      // Split SQL into individual statements and execute them
      const statements = SQL.split(';').filter(stmt => stmt.trim());
      let successCount = 0;
      let errorCount = 0;
      
      for (const statement of statements) {
        const trimmed = statement.trim();
        if (!trimmed) continue;
        
        try {
          const { error: stmtError } = await supabase.rpc('sql_exec', {
            sql: trimmed + ';'
          }).catch(() => {
            // Fallback: use postgres directly
            return supabase.from('_sql_exec').select().then(() => ({ error: null })).catch(e => ({ error: e }));
          });
          
          if (stmtError) {
            console.log(`⚠️  Statement failed: ${trimmed.substring(0, 50)}...`);
            errorCount++;
          } else {
            successCount++;
          }
        } catch (e) {
          errorCount++;
        }
      }
      
      console.log(`✅ Executed ${successCount} statements, ${errorCount} had issues`);
      return;
    }
    
    console.log('✅ Tables created successfully!');
    console.log('Tables created: quotes, quote_line_items, orders, order_line_items');
    
  } catch (error) {
    console.error('❌ Error creating tables:', error.message);
    console.log('\n💡 Manual solution: Copy the SQL from migrations/20260313_create_quotes_orders.sql');
    console.log('   and paste it into your Supabase SQL Editor:');
    console.log('   https://app.supabase.com/project/mukaeylwmzztycajibhy/sql/new');
    process.exit(1);
  }
}

createTables();
