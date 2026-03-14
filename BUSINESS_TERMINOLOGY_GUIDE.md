# FieldCost - Terminology & Business Logic Guide

## CRITICAL DISTINCTION: Quotes vs Supplier Purchase Orders

### ❌ DO NOT CONFUSE THESE

```
QUOTES                          | SUPPLIER PURCHASE ORDERS (POs)
====================================================
▶ Documents for CUSTOMERS       | ▶ Documents for SUPPLIERS/VENDORS
▶ "What we're selling"          | ▶ "What we're buying"
▶ Provide quotes for projects   | ▶ Procure materials/services
▶ Customer reviews & accepts    | ▶ Supplier confirms & delivers
▶ Quote → Invoice flow          | ▶ PO → Goods Received → Expense flow
====================================================
```

---

## Module 1: QUOTATION (to Customers) ✅

### Purpose
Provide price quotes to potential or existing customers for construction/mining projects.

### Business Flow
```
Customer Inquiry
    ↓
Create Quote (project-based pricing)
    ↓
Send to Customer for Review
    ↓
Customer Accepts/Rejects
    ↓
IF ACCEPTED: Convert to Invoice
    ↓
Invoice Sent to Customer
    ↓
Customer Pays
```

### Key Data Elements
- **Customer**: Who we're quoting TO
- **Project**: What project this quote is for
- **Line Items**: Labor, materials, equipment we'll provide
- **Quote Status**: Draft → Sent → Accepted → Rejected
- **Valid Until**: Quote expiry date
- **Notes**: Special conditions, terms

### Database Tables
```sql
quotes (
  id, customer_id, project_id, company_id,
  amount, description, reference, status, 
  valid_until, created_at, updated_at
)

quote_line_items (
  id, quote_id, item_id, item_name,
  quantity, rate, total, note
)
```

### API Endpoints
- `POST /api/quotes` - Create new quote
- `GET /api/quotes?company_id=X` - List quotes
- `PATCH /api/quotes/{id}` - Update quote
- `DELETE /api/quotes/{id}` - Delete quote
- `POST /api/quotes/{id}/send` - Send to customer
- `POST /api/quotes/{id}/convert` - Convert to invoice
- `GET /api/quotes/{id}/pdf` - Generate PDF

---

## Module 2: SUPPLIER PURCHASE ORDERS (from Vendors) ✅

### Purpose
Procure materials, equipment, and services from suppliers for projects.

### Business Flow
```
Project Needs Materials/Services
    ↓
Identify Supplier/Vendor
    ↓
Create Purchase Order (PO)
    ↓
Send PO to Supplier for Confirmation
    ↓
Supplier Confirms & Ships
    ↓
Goods Arrive at Site
    ↓
Create Goods Received Note (GRN)
    ↓
Verify Quality/Quantity
    ↓
Supplier Invoice Arrives
    ↓
Record as Expense
    ↓
Pay Supplier
```

### Key Data Elements
- **Supplier/Vendor**: WHO we're buying FROM (company providing materials)
- **Project**: Which project these materials are for
- **Line Items**: Materials, equipment, services we're ordering
- **PO Status**: Draft → Sent to Supplier → Confirmed → Partially Received → Fully Received → Invoiced
- **Required By Date**: When we need the materials delivered
- **GRN Tracking**: What was actually received vs what was ordered

### Database Tables
```sql
suppliers (
  id, company_id, vendor_name, contact_name,
  email, phone, address, payment_terms, 
  created_at, updated_at
)

purchase_orders (
  id, supplier_id, project_id, company_id,
  po_reference, po_date, required_by_date,
  amount, description, status,
  created_at, updated_at
)

purchase_order_line_items (
  id, po_id, item_id, item_name,
  quantity_ordered, unit_rate, total,
  note
)

goods_received_notes (
  id, po_id, grn_date,
  quantity_received, quality_check,
  notes, received_by, created_at
)
```

### API Endpoints
- `POST /api/purchase-orders` - Create new PO
- `GET /api/purchase-orders?company_id=X` - List POs
- `PATCH /api/purchase-orders/{id}` - Update PO
- `DELETE /api/purchase-orders/{id}` - Delete PO
- `POST /api/purchase-orders/{id}/send` - Send to supplier
- `POST /api/purchase-orders/{id}/confirm` - Confirm receipt
- `POST /api/purchase-orders/{id}/grn` - Record Goods Received Note
- `GET /api/purchase-orders/{id}/pdf` - Generate PDF
- `GET /api/purchase-orders/{id}/track` - Track delivery status

---

## 🔴 INCORRECT USAGE (NEVER USE)

### ❌ Wrong: "Sales Order"
FieldCost uses **Quotations** for selling to customers, NOT "Sales Orders".
- Quote = what we're quoting to the customer
- NOT a "sales order"

### ❌ Wrong: Using PO for Sales
Purchase Orders are ONLY for buying from suppliers.
- PO = what we're ordering from vendors
- NOT for customer orders or sales

### ❌ Wrong: "Order" (ambiguous)
Always specify:
- "Purchase Order" (from supplier) ✅
- "Quotation/Quote" (to customer) ✅
- "Order" alone → UNCLEAR ❌

---

## Feature Comparison Table

| Feature | Quote | PO |
|---------|-------|-----|
| **Direction** | Outbound (to customers) | Inbound (from suppliers) |
| **Document For** | Customers | Suppliers/Vendors |
| **Primary Use** | Revenue generation | Cost management |
| **Approval** | Customer approves | Supplier confirms |
| **Payment Flow** | Customer pays us | We pay supplier |
| **Status Track** | Draft→Sent→Accepted | Draft→Sent→Confirmed→Received |
| **Follow-up Doc** | Invoice (to customer) | GRN + Expense (from supplier) |
| **Link to Project** | Yes (what we're quoting) | Yes (what materials for) |
| **Conversion** | Quote → Invoice | PO → Expense/Invoice from supplier |

---

## Implementation Roadmap

### Phase 1: Quotes (Weeks 1-3)
Build quotation module first:
- Create quotes for customers
- Convert quotes to invoices
- Track quote lifecycle
- Generate quote PDFs

### Phase 2: Supplier POs (Weeks 4-6)
Build purchase order module after quotes:
- Create POs for suppliers
- Manage supplier master data
- Track goods received (GRN)
- Link POs to expenses
- Generate PO PDFs

### Phase 3: Integration (Week 7)
- Link quotes and POs to projects
- Track project profit margins (revenue from quotes - costs from POs)
- Generate financial reports
- Supplier performance metrics

---

## Database Relationship Diagram

```
Customers ──→ Quotes ──→ Quote Line Items
             ↓
          Invoices (generated from quote)

Projects
    ├─→ Quotes (what we're quoting to customer)
    └─→ Purchase Orders (what we're buying for project)
            ↓
        PO Line Items
            ↓
        Goods Received Notes
            ↓
        Expenses (recorded cost)

Suppliers ──→ Purchase Orders
```

---

## API Routing Clarity

```
CUSTOMER-FACING (QUOTES):
  /api/quotes                    - Quote management
  /api/quotes/{id}/convert       - Convert quote to invoice

SUPPLIER-FACING (PURCHASE ORDERS):
  /api/purchase-orders           - PO management
  /api/suppliers                 - Supplier master data
  /api/purchase-orders/{id}/grn  - Goods Received Notes
  /api/purchase-orders/{id}/send - Send PO to supplier

SHARED OPERATIONS:
  /api/invoices                  - Customer invoices (from quotes)
  /api/expenses                  - Supplier costs (from POs)
  /api/projects                  - Projects (linked to both)
```

---

## Testing Strategy

### Quote Tests
- Create quote from project
- Send quote to customer
- Customer accepts quote
- Convert quote to invoice
- Generate quote PDF

### Purchase Order Tests
- Create PO from project need
- Send PO to supplier
- Supplier confirms
- Receive goods (GRN)
- Record expense from PO
- Generate PO PDF
- Track delivery performance

### Integration Tests
- Quote → Invoice → Payment flow
- PO → GRN → Expense → Payment flow
- Project profitability (quotes - POs = margin)

---

## Summary

**QUOTES = To CUSTOMERS (What We Sell)**
- Module 1 of Tier 2
- Weeks 1-3
- Difficulty: Medium (60/100)

**PURCHASE ORDERS = From SUPPLIERS (What We Buy)**
- Module 2 of Tier 2
- Weeks 4-6
- Difficulty: Medium-Hard (65/100)

**Key Point**: These are NOT the same thing. Quotes go OUT to customers. POs come IN from suppliers. Never confuse them.

