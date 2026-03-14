# Quotes & Orders Feature - Setup & Testing Guide

## 📋 Prerequisites Checklist

- ✅ API routes created (`/app/api/quotes` and `/app/api/orders`)
- ✅ UI components created (forms and dashboard pages)
- ✅ Build verified (npm run build succeeded)
- ⏳ Database schema created (MANUAL STEP REQUIRED)
- ⏳ Demo data seeded
- ⏳ Tests executed

---

## 🗄️ Step 1: Create Database Tables

**Location:** Supabase SQL Editor  
**URL:** https://app.supabase.com/project/mukaeylwmzztycajibhy/sql/new

1. Open the SQL editor
2. Copy all SQL from: `migrations/20260313_create_quotes_orders.sql`
3. Execute the entire SQL block

The SQL creates 4 tables with RLS policies:
- `quotes` - Main quote documents
- `quote_line_items` - Line items for quotes
- `orders` - Purchase order documents
- `order_line_items` - Line items with delivery tracking

Each table has RLS policies enforcing:
- Users can only see their own company's data
- Only draft documents can be deleted
- Line items are scoped to parent document ownership

---

## 🌱 Step 2: Seed Demo Data

Run the demo data seeding script:

```bash
node scripts/seed-quotes-orders.mjs
```

This will:
- Create 3 sample quotes (draft, sent, accepted)
- Create quote line items with realistic pricing
- Create 3 sample orders (draft, confirmed, delivered)
- Create order line items with partial delivery tracking

**Demo Company ID:** 8  
**Data Created:**
- Quotes: Bathroom Renovation, Kitchen Extension, Deck Construction
- Orders: Building Supplies, Electrical Materials, Lumber

---

## 🧪 Step 3: Run API Tests

Test the Quote and Order endpoints:

```bash
npm run test:api -- tests/api/quotes.spec.ts tests/api/orders.spec.ts
```

**Test Coverage:**
- 17 Quote API tests (API-101 to API-117)
- 22 Order API tests (API-201 to API-222)

Tests verify:
- Create operations with validation
- Filtering by status, customer, vendor, date range
- Status transitions with business rules
- Line item calculations
- Deletion of draft documents only
- Partial delivery tracking

---

## 🎭 Step 4: Run E2E Tests

Test user workflows through the UI:

```bash
npm run test:e2e -- tests/e2e/quotes.spec.ts tests/e2e/orders.spec.ts
```

**Test Coverage:**
- 12 Quote E2E tests (TC101-TC112)
- 14 Order E2E tests (TC201-TC214)

Tests verify:
- Creating quotes and orders
- Editing documents
- Status transitions
- Filtering and searching
- PDF export
- Calculation of totals
- Notes and terms

---

## 🔍 Step 5: Verify Data in Both Company Types

### Demo Company (ID: 8)
- Records seeded via `seed-quotes-orders.mjs`
- Access via dashboard: `/dashboard/quotes` and `/dashboard/orders`
- View demo data pre-populated
- Test creating new records

### Live Companies (IDs: 13, 14)
- Create quotes and orders through the UI
- Verify they appear in their respective dashboards
- Check that live company data is isolated from demo company

**Quick Verification:**
1. Login to demo company
2. Navigate to `/dashboard/quotes` - should see demo quotes
3. Navigate to `/dashboard/orders` - should see demo orders
4. Click "New Quote" or "New Order" and create a record
5. Switch to a live company
6. Navigate to quote/order pages - should see only live company's data

---

## 📊 API Endpoints

### Quotes
- `GET /api/quotes?company_id=8&status=draft` - List quotes
- `POST /api/quotes` - Create quote
- `PATCH /api/quotes?id=123` - Update quote status
- `DELETE /api/quotes?id=123` - Delete draft quote

### Orders
- `GET /api/orders?company_id=8&status=draft` - List orders
- `POST /api/orders` - Create order
- `PATCH /api/orders?id=456` - Update order status
- `DELETE /api/orders?id=456` - Delete draft order

### Sample Request (Create Quote)
```bash
curl -X POST http://localhost:3000/api/quotes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -d '{
    "customerId": 1,
    "lines": [
      {
        "description": "Service",
        "quantity": 10,
        "unit_price": 100
      }
    ],
    "validUntil": "2026-04-13",
    "reference": "Q-001",
    "amount": 1000,
    "currency": "USD"
  }'
```

---

## 🧠 Business Rules Implemented

### Quote Status Flow
```
draft → sent → [accepted|rejected]
        ↓
   (Can convert accepted quote to invoice)
```

- Quotes have 30-day default validity
- Can only be deleted if in draft status
- Status transitions validated

### Order Status Flow
```
draft → confirmed → [delivered|cancelled]
```

- Orders have 14-day default delivery date
- Partial delivery tracking with received_quantities
- Can only be deleted if in draft status
- Overdue detection if delivery_date < today

---

## 🔐 Row Level Security (RLS)

All tables have RLS enabled:

**SELECT Policy:** Users see only their company's records
```sql
WHERE auth.uid() = user_id AND company_id = {their_company_id}
```

**INSERT Policy:** Users can create records for their company
```sql
WHERE auth.uid() = user_id
```

**UPDATE Policy:** Users can modify their company's records
```sql
WHERE auth.uid() = user_id
```

**DELETE Policy:** Users can only delete draft records
```sql
WHERE auth.uid() = user_id AND status = 'draft'
```

---

## 🐛 Troubleshooting

### Tables don't exist
- Execute the migration SQL in Supabase SQL editor
- Verify tables exist: `SELECT * FROM information_schema.tables WHERE table_name LIKE '%quote%'`

### Demo data not creating
- Ensure tables exist first
- Check that demo user ID is correct in `seed-quotes-orders.mjs`
- Look for foreign key constraint errors

### API tests failing
- Verify authentication is working
- Check that company_id matches authenticated user's company
- Ensure line items are properly formatted

### E2E tests failing
- Ensure dev server is running on port 3000
- Verify test user credentials are correct
- Check that forms render without JavaScript errors

---

## 📝 File Structure

```
/app
  /api
    /quotes
      route.ts          # Quote CRUD endpoints
    /orders
      route.ts          # Order CRUD endpoints
  /dashboard
    /quotes
      page.tsx          # Quote list page
      add/page.tsx      # Create quote page
      QuoteForm.tsx     # Quote form component
    /orders
      page.tsx          # Order list page
      add/page.tsx      # Create order page
      OrderForm.tsx     # Order form component

/tests
  /api
    quotes.spec.ts      # 17 API tests
    orders.spec.ts      # 22 API tests
  /e2e
    quotes.spec.ts      # 12 E2E tests
    orders.spec.ts      # 14 E2E tests
  /helpers
    testUsers.ts        # Test user fixtures
  /fixtures
    documents.ts        # Sample document data

/migrations
  20260313_create_quotes_orders.sql # Database schema

/scripts
  seed-quotes-orders.mjs  # Demo data seeding
  execute-migration.mjs   # Migration executor
```

---

## ✅ Validation Checklist

After completing all steps, verify:

- [ ] Database tables created in Supabase
- [ ] Demo data seeded successfully
- [ ] Can view demo quotes in `/dashboard/quotes`
- [ ] Can view demo orders in `/dashboard/orders`
- [ ] Can create new quote through UI
- [ ] Can create new order through UI
- [ ] Quote/order appears after creation
- [ ] API tests pass (17 + 22 = 39 total)
- [ ] E2E tests pass (12 + 14 = 26 total)
- [ ] Data isolation: Demo company sees only demo data
- [ ] Data isolation: Live company sees only their data
- [ ] Line items calculate correctly
- [ ] Status transitions work properly
- [ ] Can't delete non-draft documents
- [ ] RLS policies enforce security

---

## 🚀 Next Steps

1. Execute SQL migration in Supabase
2. Run: `node scripts/seed-quotes-orders.mjs`
3. Run: `npm run test:api -- tests/api/quotes.spec.ts tests/api/orders.spec.ts`
4. Run: `npm run test:e2e -- tests/e2e/quotes.spec.ts tests/e2e/orders.spec.ts`
5. Test manually in UI at `/dashboard/quotes` and `/dashboard/orders`
6. Deploy to production

---

**Created:** March 13, 2026  
**Feature:** Orders & Quotes Ordering System  
**Status:** Ready for testing
