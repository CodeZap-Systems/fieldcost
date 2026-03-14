import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkAndCreateTables() {
  console.log('🔍 Checking if tables exist...\n');

  const tablesToCheck = [
    {
      name: 'quotes',
      sql: `CREATE TABLE IF NOT EXISTS quotes (
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
        CONSTRAINT fk_quotes_company FOREIGN KEY (company_id) REFERENCES company_profiles(id) ON DELETE CASCADE,
        CONSTRAINT fk_quotes_user FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
        CONSTRAINT valid_status CHECK (status IN ('draft', 'sent', 'accepted', 'rejected'))
      );`
    },
    {
      name: 'quote_line_items',
      sql: `CREATE TABLE IF NOT EXISTS quote_line_items (
        id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        quote_id BIGINT NOT NULL,
        description VARCHAR(255) NOT NULL,
        quantity NUMERIC(10, 2) NOT NULL,
        unit_price NUMERIC(12, 2) NOT NULL,
        line_total NUMERIC(12, 2) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_quote_line_items_quote FOREIGN KEY (quote_id) REFERENCES quotes(id) ON DELETE CASCADE
      );`
    },
    {
      name: 'orders',
      sql: `CREATE TABLE IF NOT EXISTS orders (
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
        CONSTRAINT fk_orders_company FOREIGN KEY (company_id) REFERENCES company_profiles(id) ON DELETE CASCADE,
        CONSTRAINT fk_orders_user FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
        CONSTRAINT valid_status CHECK (status IN ('draft', 'confirmed', 'delivered', 'cancelled'))
      );`
    },
    {
      name: 'order_line_items',
      sql: `CREATE TABLE IF NOT EXISTS order_line_items (
        id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        order_id BIGINT NOT NULL,
        description VARCHAR(255) NOT NULL,
        quantity NUMERIC(10, 2) NOT NULL,
        unit_price NUMERIC(12, 2) NOT NULL,
        line_total NUMERIC(12, 2) NOT NULL,
        received_quantity NUMERIC(10, 2) DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_order_line_items_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
      );`
    }
  ];

  const missingTables = [];

  for (const table of tablesToCheck) {
    try {
      const { data, error } = await supabase
        .from(table.name)
        .select('id')
        .limit(1);

      if (error && error.code === 'PGRST116') {
        console.log(`⚠️  Table '${table.name}' does not exist`);
        missingTables.push(table);
      } else if (error) {
        console.log(`⚠️  Error checking '${table.name}': ${error.message}`);
        missingTables.push(table);
      } else {
        console.log(`✅ Table '${table.name}' exists`);
      }
    } catch (err) {
      console.log(`⚠️  Exception checking '${table.name}': ${err.message}`);
      missingTables.push(table);
    }
  }

  if (missingTables.length > 0) {
    console.log(`\n⚠️  ${missingTables.length} table(s) missing. Cannot proceed.\n`);
    console.log('📝 To create the tables, execute this SQL in Supabase SQL Editor:');
    console.log('   https://app.supabase.com/project/mukaeylwmzztycajibhy/sql/new\n');
    console.log('Copy the contents of: migrations/20260313_create_quotes_orders.sql\n');
    return false;
  }

  console.log('\n✅ All required tables exist!\n');
  return true;
}

async function main() {
  const ready = await checkAndCreateTables();
  process.exit(ready ? 0 : 1);
}

main();
