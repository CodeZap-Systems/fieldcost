# Orders & Quotes Implementation Guide

## Overview

This guide explains how the Orders (Purchase Orders) and Quotes features are implemented in FieldCost, reusing the existing Invoice logic and UI patterns.

## Architecture

Both Orders and Quotes follow the same architectural pattern as Invoices:

```
┌─────────────────┐
│   Front-End UI  │  (Reuses Invoice form layout)
├─────────────────┤
│  API Routes     │  /api/quotes, /api/orders
├─────────────────┤
│  Supabase DB    │  quotes, quote_line_items, orders, order_line_items
└─────────────────┘
```

---

## 📦 Database Schema

### Quotes Table

```sql
CREATE TABLE quotes (
  id BIGINT PRIMARY KEY,
  user_id UUID NOT NULL,
  company_id INT NOT NULL,
  customer_id INT,
  customer_name VARCHAR,
  amount DECIMAL(15,2),
  description TEXT,
  reference VARCHAR UNIQUE,
  quote_number VARCHAR,
  status VARCHAR DEFAULT 'draft',  -- draft|sent|accepted|rejected
  valid_until DATE,
  rejection_reason TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  FOREIGN KEY (user_id) REFERENCES auth.users(id),
  FOREIGN KEY (company_id) REFERENCES company_profiles(id),
  FOREIGN KEY (customer_id) REFERENCES customers(id)
);

CREATE TABLE quote_line_items (
  id BIGINT PRIMARY KEY,
  quote_id BIGINT NOT NULL,
  item_id INT,
  name VARCHAR,
  quantity DECIMAL(10,2),
  rate DECIMAL(12,2),
  total DECIMAL(15,2),
  project VARCHAR,
  note TEXT,
  user_id UUID NOT NULL,
  company_id INT NOT NULL,
  source VARCHAR,
  task_ref VARCHAR,
  
  FOREIGN KEY (quote_id) REFERENCES quotes(id) ON DELETE CASCADE
);
```

### Orders Table

```sql
CREATE TABLE orders (
  id BIGINT PRIMARY KEY,
  user_id UUID NOT NULL,
  company_id INT NOT NULL,
  vendor_id INT,
  vendor_name VARCHAR,
  customer_id INT,
  amount DECIMAL(15,2),
  description TEXT,
  reference VARCHAR UNIQUE,
  po_number VARCHAR,
  status VARCHAR DEFAULT 'draft',  -- draft|confirmed|delivered|cancelled
  delivery_date DATE,
  cancellation_reason TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  FOREIGN KEY (user_id) REFERENCES auth.users(id),
  FOREIGN KEY (company_id) REFERENCES company_profiles(id)
);

CREATE TABLE order_line_items (
  id BIGINT PRIMARY KEY,
  order_id BIGINT NOT NULL,
  item_id INT,
  name VARCHAR,
  quantity DECIMAL(10,2),
  rate DECIMAL(12,2),
  total DECIMAL(15,2),
  received_qty DECIMAL(10,2) DEFAULT 0,
  user_id UUID NOT NULL,
  company_id INT NOT NULL,
  note TEXT,
  source VARCHAR,
  task_ref VARCHAR,
  
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);
```

---

## 🔌 API Endpoints

### Quotes Endpoints

```
GET    /api/quotes?company_id={id}&status={status}&expiring=true
POST   /api/quotes
PATCH  /api/quotes/{id}
DELETE /api/quotes/{id}
POST   /api/quotes/{id}/convert-to-invoice
GET    /api/quotes/expiring?days=7&company_id={id}
```

### Orders Endpoints

```
GET    /api/orders?company_id={id}&status={status}
POST   /api/orders
PATCH  /api/orders/{id}
DELETE /api/orders/{id}
POST   /api/orders/{id}/receive
GET    /api/orders/pending-delivery?company_id={id}
```

---

## 📱 UI Components

### Reused from Invoice

- **Form Layout**: Same tabbed interface (Details, Line Items, Payments, Notes)
- **Line Item Input**: Identical quantity/rate/total calculation
- **Date Picker**: Same calendar widget
- **Status Badges**: Reuse styling (different status values)
- **PDF Generator**: Same formatter with quote/order template
- **Customer Selector**: Same dropdown logic

### Unique UI Elements

**Quotes:**
- "Valid Until" date field (30 days default)
- "Accept/Reject" buttons in quote view
- Expiration warning badge
- "Convert to Invoice" action

**Orders:**
- "Vendor" selector (instead of customer)
- "Delivery Date" field (14 days default)
- "Confirm Order" button
- "Mark Delivered" with quantity tracking
- "Partial Delivery" support

---

## 🔄 Status Workflows

### Quote Status Flow

```
┌──────┐
│Draft │
└──┬───┘
   │ Send
   ▼
┌──────┐
│ Sent │
└──┬───┘
   │ Accept │ Reject
   ▼        ▼
┌────────┐ ┌────────┐
│Accepted│ │Rejected│
└────────┘ └────────┘
   │
   │ Convert to Invoice
   ▼
┌─────────┐
│ Invoiced│ (becomes invoice, quote closed)
└─────────┘
```

### Order Status Flow

```
┌──────┐
│Draft │
└──┬───┘
   │ Confirm
   ▼
┌───────────┐
│ Confirmed │
└──┬────────┘
   │ Receive
   ▼
┌──────────┐
│Delivered │
└──────────┘

OR

┌──────┐
│Draft │
└──┬───┘
   │ Cancel
   ▼
┌──────────┐
│Cancelled │
└──────────┘
```

---

## 🧩 Implementation Details

### Validation Rules

**Quotes:**
- Customer ID required
- Valid Until date must be >= today
- Auto-calculates expiration warning at 7 days
- Cannot modify accepted/rejected quotes
- Can only delete draft quotes
- Cannot convert rejected quotes

**Orders:**
- Vendor OR Customer required
- Delivery date must be >= today + 1 day
- Partial delivery tracking per line item
- Cannot delete confirmed/delivered orders
- Can cancel draft or confirmed orders
- Received quantities cannot exceed ordered

### Data Isolation

Both features inherit FieldCost's data isolation:
- User can only access quotes/orders in their companies
- Company context validated on every request
- User ID automatically set from authenticated session
- Multi-company environment fully supported

---

## 🏗️ File Structure

```
app/
├── api/
│   ├── quotes/
│   │   └── route.ts          # Quote CRUD endpoints
│   └── orders/
│       └── route.ts          # Order CRUD endpoints
│
├── dashboard/
│   ├── quotes/
│   │   ├── page.tsx          # Quote list page
│   │   ├── QuoteForm.tsx     # Reuses InvoiceForm pattern
│   │   └── add/
│   │       └── page.tsx      # New quote page
│   │
│   └── orders/
│       ├── page.tsx          # Order list page
│       ├── OrderForm.tsx     # Reuses InvoiceForm pattern
│       └── add/
│           └── page.tsx      # New order page
│
└── components/
    ├── QuoteStatus.tsx       # Status badge component
    └── OrderStatus.tsx       # Status badge component

lib/
├── quoteValidation.ts        # Reuses invoiceValidation
└── orderValidation.ts        # Reuses invoiceValidation
```

---

## 🎯 Form Implementation

### Using Existing Invoice Form Pattern

```tsx
// QuoteForm.tsx (minimal differences from InvoiceForm)
export default function QuoteForm({ onAdd, preset, companyId }) {
  const [lines, setLines] = useState<LineItem[]>([newLineItem()]);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [validUntil, setValidUntil] = useState('');
  
  const handleAdd = async (quote) => {
    const res = await fetch('/api/quotes', {
      method: 'POST',
      body: JSON.stringify(quote)
    });
    return res.ok;
  };
  
  return (
    // Same form layout as invoice
    // Just different API endpoint and status options
    <form onSubmit={handleAdd}>
      {/* Customer select */}
      {/* Line items (same as invoice) */}
      {/* Valid Until date picker */}
      {/* Status selector with quote statuses */}
    </form>
  );
}
```

---

## 💾 Sample API Requests

### Create Quote

```bash
curl -X POST http://localhost:3000/api/quotes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "customerId": 1,
    "customerName": "ABC Corp",
    "reference": "QUOTE-001",
    "amount": 50000,
    "validUntil": "2026-04-13",
    "company_id": 1,
    "lines": [
      {
        "itemId": 1,
        "itemName": "Consulting",
        "quantity": 40,
        "rate": 150,
        "total": 6000
      }
    ]
  }'
```

### Accept Quote

```bash
curl -X PATCH http://localhost:3000/api/quotes/123 \
  -H "Content-Type: application/json" \
  -d '{"status": "accepted"}'
```

### Convert to Invoice

```bash
curl -X POST http://localhost:3000/api/quotes/123/convert-to-invoice \
  -H "Authorization: Bearer {token}"
```

### Create Order

```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "vendorName": "BuildSupplies Inc",
    "reference": "PO-001",
    "amount": 8500,
    "deliveryDate": "2026-04-13",
    "company_id": 1,
    "lines": [
      {
        "itemName": "Cement Bags",
        "quantity": 100,
        "rate": 45,
        "total": 4500
      }
    ]
  }'
```

### Confirm Order

```bash
curl -X PATCH http://localhost:3000/api/orders/456 \
  -H "Content-Type: application/json" \
  -d '{"status": "confirmed"}'
```

### Receive Goods

```bash
curl -X POST http://localhost:3000/api/orders/456/receive \
  -H "Content-Type: application/json" \
  -d '{
    "received_quantities": [100, 200],
    "notes": "Goods received in good condition"
  }'
```

---

## 🧪 Testing the Features

### E2E Tests
- All workflows in `tests/e2e/quotes.spec.ts` and `tests/e2e/orders.spec.ts`
- Test quote creation, acceptance, conversion
- Test order creation, confirmation, delivery
- Verify PDF export for both

### API Tests
- All endpoints in `tests/api/quotes.spec.ts` and `tests/api/orders.spec.ts`
- Test status transitions
- Test data validation
- Test error handling

### Manual Testing

```bash
# Start development server
npm run dev

# Navigate to dashboard
# Access quotes: http://localhost:3000/dashboard/quotes
# Access orders: http://localhost:3000/dashboard/orders

# Create test quote/order
# Verify form validation
# Test PDF export
# Verify status changes
```

---

## ⚠️ Important Notes

1. **Database Migrations**: Need to run Supabase migrations to create quotes/orders tables before deploying
2. **Permissions**: Ensure user role supports quote/order creation (admin/user)
3. **Company Context**: Both features strictly enforce company data isolation
4. **PDF Generation**: Uses same template engine as invoices with custom quote/order formatting
5. **Notifications**: Consider adding email notifications for quote expiry and order delivery delays

---

## 🔐 Security Checklist

- [x] User authentication required
- [x] Company context validation
- [x] SQL injection protection (Supabase ORM)
- [x] Rate limiting on API routes
- [x] Audit logging for status changes
- [x] Data encryption per Supabase defaults
- [x] Row-level security policies (if configured)

---

## 📦 Dependencies

- Existing: Supabase, Next.js, React
- New: None (reuses existing libraries)
- Optional: email-js (for notifications)

---

## 🚀 Deployment Steps

1. Create database tables (quotes, quote_line_items, orders, order_line_items)
2. Deploy API routes (`/api/quotes`, `/api/orders`)
3. Deploy UI components
4. Run migrations
5. Update navigation menus
6. Test in staging
7. Deploy to production

---

**Document Version**: 1.0
**Last Updated**: March 13, 2026
**Implementation Status**: ✅ Complete
