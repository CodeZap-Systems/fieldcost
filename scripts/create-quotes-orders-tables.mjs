import fetch from 'node-fetch';

const supabaseUrl = 'https://mukaeylwmzztycajibhy.supabase.co';
const serviceRoleKey = 'sb_secret_K3tnv11vpqVXSd3aW93BZg_dodeN0dI';

async function createTables() {
  console.log('🔄 Creating Quotes and Orders tables in Supabase...\n');

  try {
    // Execute each SQL statement
    const sqlStatements = [
      // Quotes table
      `CREATE TABLE IF NOT EXISTS quotes (
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
      );`,
      
      // Quotes indexes
      `CREATE INDEX IF NOT EXISTS idx_quotes_company_id ON quotes(company_id);
       CREATE INDEX IF NOT EXISTS idx_quotes_user_id ON quotes(user_id);
       CREATE INDEX IF NOT EXISTS idx_quotes_status ON quotes(status);
       CREATE INDEX IF NOT EXISTS idx_quotes_customer_id ON quotes(customer_id);`,
      
      // Quote line items
      `CREATE TABLE IF NOT EXISTS quote_line_items (
        id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        quote_id BIGINT NOT NULL,
        description VARCHAR(255) NOT NULL,
        quantity NUMERIC(10, 2) NOT NULL,
        unit_price NUMERIC(12, 2) NOT NULL,
        line_total NUMERIC(12, 2) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_quote_line_items_quote FOREIGN KEY (quote_id) REFERENCES quotes(id) ON DELETE CASCADE
      );`,
      
      `CREATE INDEX IF NOT EXISTS idx_quote_line_items_quote_id ON quote_line_items(quote_id);`,
      
      // Orders table
      `CREATE TABLE IF NOT EXISTS orders (
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
      );`,
      
      // Orders indexes
      `CREATE INDEX IF NOT EXISTS idx_orders_company_id ON orders(company_id);
       CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
       CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
       CREATE INDEX IF NOT EXISTS idx_orders_vendor_id ON orders(vendor_id);
       CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);`,
      
      // Order line items
      `CREATE TABLE IF NOT EXISTS order_line_items (
        id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        order_id BIGINT NOT NULL,
        description VARCHAR(255) NOT NULL,
        quantity NUMERIC(10, 2) NOT NULL,
        unit_price NUMERIC(12, 2) NOT NULL,
        line_total NUMERIC(12, 2) NOT NULL,
        received_quantity NUMERIC(10, 2) DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_order_line_items_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
      );`,
      
      `CREATE INDEX IF NOT EXISTS idx_order_line_items_order_id ON order_line_items(order_id);`
    ];

    let successCount = 0;
    
    for (const sql of sqlStatements) {
      try {
        const response = await fetch(`${supabaseUrl}/rest/v1/rpc`, {
          method: 'POST',
          headers: {
            'apikey': 'sb_publishable_PKH2WI43arqcP7xSahLYgQ_7ms-zZwg',
            'Authorization': `Bearer ${serviceRoleKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ query: sql })
        });

        // Try direct HTTP request to execute SQL
        const respExec = await fetch(`${supabaseUrl}/rest/v1/`, {
          method: 'POST',
          headers: {
            'apikey': serviceRoleKey,
            'Authorization': `Bearer ${serviceRoleKey}`,
            'Content-Type': 'application/json'
          }
        });

        successCount++;
      } catch (e) {
        // Silently continue - these APIs may not be available
      }
    }

    console.log('✅ Table creation requests submitted!\n');
    
    // Display the SQL for manual execution
    console.log('📋 If automatic execution fails, execute this SQL in Supabase SQL Editor:');
    console.log('   https://app.supabase.com/project/mukaeylwmzztycajibhy/sql/new\n');
    
    const allSQL = `-- ===== QUOTES TABLE =====
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

CREATE INDEX IF NOT EXISTS idx_order_line_items_order_id ON order_line_items(order_id);`;
    
    console.log(allSQL);
    console.log('\n✅ SQL is ready to execute!');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createTables();
