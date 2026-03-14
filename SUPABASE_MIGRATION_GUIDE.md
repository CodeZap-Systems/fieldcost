# How to Create Quotes and Orders Tables in Supabase

## Quick Method

1. **Go to your Supabase Project SQL Editor:**
   - URL: https://app.supabase.com/project/mukaeylwmzztycajibhy/sql/new

2. **Copy the migration SQL:**
   - File location: `/migrations/20260313_create_quotes_orders.sql`
   - Copy all content from that file

3. **Paste into Supabase SQL Editor**

4. **Click "Run" to execute**

## What Gets Created

### Tables
- ✅ `quotes` - Quote records with status (draft/sent/accepted/rejected)
- ✅ `quote_line_items` - Line items for each quote
- ✅ `orders` - Purchase order records with status (draft/confirmed/delivered/cancelled)
- ✅ `order_line_items` - Line items for each order

### Features
- ✅ Foreign key constraints to `companies` and `auth.users`
- ✅ Row Level Security (RLS) policies for multi-tenant isolation
- ✅ Indexes on company_id, user_id, status, and customer_id
- ✅ Automatic timestamps (created_at, updated_at)

## SQL Commands

The migration file contains these main SQL statements:

```sql
-- Create quotes table
CREATE TABLE quotes (
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
  CONSTRAINT fk_quotes_company FOREIGN KEY (company_id) REFERENCES companies(id),
  CONSTRAINT fk_quotes_user FOREIGN KEY (user_id) REFERENCES auth.users(id),
  CONSTRAINT valid_status CHECK (status IN ('draft', 'sent', 'accepted', 'rejected'))
);

-- Create quote_line_items table
CREATE TABLE quote_line_items (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  quote_id BIGINT NOT NULL,
  description VARCHAR(255) NOT NULL,
  quantity NUMERIC(10, 2) NOT NULL,
  unit_price NUMERIC(12, 2) NOT NULL,
  line_total NUMERIC(12, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_quote_line_items_quote FOREIGN KEY (quote_id) REFERENCES quotes(id) ON DELETE CASCADE
);

-- Create orders table
CREATE TABLE orders (
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
  CONSTRAINT fk_orders_company FOREIGN KEY (company_id) REFERENCES companies(id),
  CONSTRAINT fk_orders_user FOREIGN KEY (user_id) REFERENCES auth.users(id),
  CONSTRAINT valid_status CHECK (status IN ('draft', 'confirmed', 'delivered', 'cancelled'))
);

-- Create order_line_items table
CREATE TABLE order_line_items (
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
```

## After Creation

Once tables are created, your API endpoints will:
- ✅ `/api/quotes` - Return 200 with quote data
- ✅ `/api/orders` - Return 200 with order data
- ✅ Dashboard Quote & Order sections will load properly

All endpoints already have RLS policies and proper authentication in place!
