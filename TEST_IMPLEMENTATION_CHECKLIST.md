# Test Implementation Checklist

**Status**: 📋 Planning Phase  
**Target Completion**: 8-10 hours  
**Coverage Goal**: 85%+  

---

## Phase 1: Test Infrastructure (2 hours)

- [ ] Install test dependencies
  - [ ] `npm install --save-dev vitest supertest`
  - [ ] Verify `npm run test:api` command works
  - [ ] Check `npm run test:watch` mode
  
- [ ] Create test helpers (`tests/helpers/`)
  - [ ] `generators.ts` - Test data factories
  - [ ] `setup.ts` - Database setup/teardown
  - [ ] `expectations.ts` - Common assertions
  
- [ ] Configure test database
  - [ ] Set TEST_USER_ID constant
  - [ ] Set TEST_COMPANY_ID constant
  - [ ] Configure Supabase test connection
  
**Completion Target**: ✅

---

## Phase 2: Quote Module Implementation (2 hours)

**File**: `tests/tier2/quotes.test.ts`  
**Test Count**: 60 tests

### Core CRUD (8 tests)
- [ ] Create quote with valid data
- [ ] Create quote with missing required fields (fails)
- [ ] Retrieve quote by ID
- [ ] List quotes with pagination
- [ ] Update quote description
- [ ] Update quote status
- [ ] Delete draft quote
- [ ] Cannot delete sent quote

### Quote Workflow (12 tests)
- [ ] Send quote (draft → sent)
- [ ] Accept quote (sent → accepted)
- [ ] Reject quote (sent → rejected)
- [ ] Reopen quote (rejected → draft)
- [ ] Cannot send rejected quote
- [ ] Cannot accept draft quote
- [ ] Auto-set valid_until date
- [ ] Track quote status history

### Line Items (10 tests)
- [ ] Add line items to quote
- [ ] Calculate total amount from lines
- [ ] Update line item quantity
- [ ] Delete line item
- [ ] Cannot delete all line items
- [ ] Tax calculation on lines
- [ ] Discount application
- [ ] Line totals match calculations

### Quote → Invoice (8 tests)
- [ ] Convert accepted quote to invoice
- [ ] Cannot convert draft quote
- [ ] Invoice inherits quote data
- [ ] Invoice line items match quote
- [ ] Invoice amount equals quote amount
- [ ] Create credit note from quote
- [ ] Clone quote
- [ ] Quote PDF generation

### Access Control (12 tests)
- [ ] User cannot access other company quotes
- [ ] User cannot edit other user's quotes
- [ ] Same company users can view quotes
- [ ] Admin can override permissions
- [ ] Quote audit log tracks changes
- [ ] Timestamps are correct

### Validation (10 tests)
- [ ] Customer ID must exist
- [ ] Valid email in customer
- [ ] Amount must be positive
- [ ] Discount cannot exceed 100%
- [ ] Required fields validation
- [ ] Date format validation
- [ ] Reference uniqueness per company

**Current Status**: 📝 Template ready (expect(true).toBe(true))

---

## Phase 3: Purchase Orders Module (2.5 hours)

**File**: `tests/tier2/purchase-orders.test.ts`  
**Test Count**: 80 tests

### Core CRUD (8 tests)
- [ ] Create PO with valid data
- [ ] Retrieve PO by ID
- [ ] List POs with filters
- [ ] Update PO details (before send)
- [ ] Delete draft PO
- [ ] Cannot modify sent PO
- [ ] Soft delete vs hard delete
- [ ] PO numbering sequence

### PO Lifecycle (15 tests)
- [ ] Draft → Sent
- [ ] Sent → Confirmed
- [ ] Confirmed → Partially Received
- [ ] Partially Received → Fully Received
- [ ] Fully Received → Closed
- [ ] Cannot revert to draft once sent
- [ ] Cannot send without line items
- [ ] Track status timestamps

### Line Items (15 tests)
- [ ] Add line items to PO
- [ ] Update ordered quantity
- [ ] Update unit rate
- [ ] Delete line item
- [ ] Calculate line total
- [ ] Tax per line item
- [ ] Total PO amount matching
- [ ] Quantity validation

### Supplier Integration (12 tests)
- [ ] Link PO to supplier
- [ ] Cannot delete supplier with active PO
- [ ] PO lists supplier contact info
- [ ] Update supplier on PO
- [ ] Validate supplier exists
- [ ] Track supplier performance

### Goods Received Notes (15 tests)
- [ ] GRN creates PO line → quantity_received updates
- [ ] Partial GRN received
- [ ] Full quantity GRN received
- [ ] PO status auto-updates after GRN
- [ ] Cannot receive more than ordered
- [ ] GRN creates audit record
- [ ] Track received_at timestamp
- [ ] Multiple GRNs per PO line

### Access Control (10 tests)
- [ ] User cannot access other company POs
- [ ] Cannot edit other user's PO
- [ ] Company isolation enforced
- [ ] Admin override works
- [ ] Audit logs track changes

### PDF Export (5 tests)
- [ ] Export PO to PDF
- [ ] PDF includes all line items
- [ ] PDF includes supplier details
- [ ] PDF includes delivery date
- [ ] PDF encryption when configured

**Current Status**: 📝 Template ready

---

## Phase 4: Suppliers Module (1.5 hours)

**File**: `tests/tier2/suppliers.test.ts`  
**Test Count**: 50 tests

### Core CRUD (10 tests)
- [ ] Create supplier with valid data
- [ ] Required fields validation
- [ ] Retrieve supplier by ID
- [ ] List suppliers with pagination
- [ ] Update supplier details
- [ ] Delete supplier (no active POs)
- [ ] Cannot delete supplier with POs
- [ ] Soft delete archive
- [ ] Search suppliers by name
- [ ] Filter by rating

### Contact Details (8 tests)
- [ ] Validate email format
- [ ] Validate phone number format
- [ ] Validate postal address
- [ ] Multiple contact persons
- [ ] Primary contact designator
- [ ] Contact history tracking
- [ ] Update contact details
- [ ] Contact visibility per company

### Rating & Performance (12 tests)
- [ ] Track on-time delivery rate
- [ ] Track quality score
- [ ] Track response time
- [ ] Calculate overall rating
- [ ] Auto-update metrics after GRN
- [ ] Quality incidents tracking
- [ ] Performance thresholds alerts
- [ ] Rating history timeline

### Access Control (10 tests)
- [ ] Company isolation
- [ ] Cross-company data leak prevention
- [ ] Bulk operations isolation
- [ ] Audit trail completeness

### Integration (10 tests)
- [ ] Supplier search in PO creation
- [ ] PO lists supplier details
- [ ] Invoice links supplier
- [ ] GRN references supplier
- [ ] Performance metrics in reports

**Current Status**: 📝 Template ready

---

## Phase 5: Goods Received Notes Module (3 hours)

**File**: `tests/tier2/goods-received-notes.test.ts`  
**Test Count**: 100+ tests

### Core CRUD (12 tests)
- [ ] Create GRN with valid data
- [ ] Retrieve GRN by ID
- [ ] List GRNs for PO
- [ ] Update GRN status
- [ ] Delete GRN (if not final)
- [ ] Cannot delete confirmed GRN
- [ ] Timestamps track lifecycle
- [ ] Sequential numbering

### Quality Control (20 tests)
- [ ] Mark goods as inspected_good
- [ ] Mark goods as inspected_defective
- [ ] Mark goods as partial_defect
- [ ] Quality status history
- [ ] Defect notes capture
- [ ] Photo/attachment support
- [ ] Quality inspector tracking
- [ ] Override quality checks

### Workflow Integration (25 tests)
- [ ] GRN updates PO line quantity_received
  - [ ] 1 GRN: 50 received out of 100 → quantity_received = 50
  - [ ] 2nd GRN: 25 received → quantity_received = 75
  - [ ] 3rd GRN: 25 received → quantity_received = 100
- [ ] PO status auto-updates
  - [ ] Partial receive → partially_received
  - [ ] Full receive → fully_received
- [ ] Location tracking (warehouse, bin)
- [ ] Received by user tracking
- [ ] Timestamp accuracy
- [ ] PO line item link verification
- [ ] Cannot receive without PO reference

### Defective Goods Handling (15 tests)
- [ ] Mark goods as defective
- [ ] Create return order
- [ ] Create credit note
- [ ] Track defect reason
- [ ] Supplier notification workflow
- [ ] QC hold/release gates
- [ ] Defect statistics tracking
- [ ] Root cause analysis forms

### Alerts & Notifications (10 tests)
- [ ] Alert on partial receipt
- [ ] Alert on quality issues
- [ ] Notification to supervisor
- [ ] Email to supplier (if defective)
- [ ] Dashboard alerts display

### Performance Tests (10 tests)
- [ ] Create 100 GRNs per PO (batch)
- [ ] List 1000 GRNs (pagination)
- [ ] Bulk mark as received
- [ ] Calculate totals (100+ lines)
- [ ] Load time under 2 seconds

### Access Control (8 tests)
- [ ] User can only create for their company
- [ ] Cannot modify other company GRNs
- [ ] Audit trail enforcement
- [ ] Role-based receive rights

**Current Status**: 📝 Template ready

---

## Phase 6: Integration Tests (1 hour)

### End-to-End Workflows

- [ ] **Quote → Invoice Workflow**
  - [ ] Create Quote → Accept → Convert to Invoice
  - [ ] Verify invoice inherits quote data
  - [ ] Check audit trail completeness

- [ ] **Quote → PO Workflow**
  - [ ] Create Quote → Accept → Create PO from Quote
  - [ ] Verify line items match
  - [ ] Verify amounts match

- [ ] **PO → Receipt Workflow**
  - [ ] Create PO → Send → Receive → GRN
  - [ ] Verify quantity tracking
  - [ ] Verify status auto-updates
  - [ ] Verify timestamps flow

- [ ] **Defect Handling Workflow**
  - [ ] GRN with defect → Quality hold
  - [ ] Create return PO (credit)
  - [ ] Mark as resolved

---

## Phase 7: Data Isolation & Security (1 hour)

- [ ] **Company Isolation**
  - [ ] User A cannot see Company B quotes
  - [ ] PO queries filtered by user's company
  - [ ] Supplier list isolated per company
  - [ ] GRN data not accessible cross-company

- [ ] **Row Level Security (RLS)**
  - [ ] Supabase policies enforced
  - [ ] Direct DB access blocked
  - [ ] API enforces company_id

- [ ] **Permission Levels**
  - [ ] Admin: Full access
  - [ ] Manager: Can approve/send
  - [ ] User: Can create only
  - [ ] Viewer: Read-only access

---

## Phase 8: Error Handling (0.5 hours)

- [ ] **HTTP Status Codes**
  - [ ] 201 Created (POST success)
  - [ ] 200 OK (GET/PATCH success)
  - [ ] 400 Bad Request (validation)
  - [ ] 401 Unauthorized (no user_id)
  - [ ] 403 Forbidden (no access)
  - [ ] 404 Not Found (resource missing)
  - [ ] 409 Conflict (duplicate reference)
  - [ ] 500 Server Error handling

- [ ] **Error Messages**
  - [ ] Clear, user-friendly messages
  - [ ] No sensitive data exposure
  - [ ] Validation error details

---

## Final Validation Checklist

### Code Quality
- [ ] No console.logs in test code
- [ ] All async/await properly handled
- [ ] No hardcoded test IDs (use factories)
- [ ] Comments explain complex tests
- [ ] Tests are independent (no ordering)

### Coverage
- [ ] `npm run test:coverage` shows 85%+
- [ ] All major code paths tested
- [ ] Error paths tested
- [ ] Edge cases covered

### Performance
- [ ] Full test suite runs in < 5 minutes
- [ ] Individual tests < 5 seconds
- [ ] Database cleanup between tests

### Documentation
- [ ] README.md updated with test instructions
- [ ] Test data structures documented
- [ ] Complex tests have comments
- [ ] Known limitations documented

---

## Progress Tracking

```
Phase 1 (Infrastructure):     ░░░░░░░░░░ 0%
Phase 2 (Quotes):             ░░░░░░░░░░ 0%
Phase 3 (Purchase Orders):    ░░░░░░░░░░ 0%
Phase 4 (Suppliers):          ░░░░░░░░░░ 0%
Phase 5 (GRN):                ░░░░░░░░░░ 0%
Phase 6 (Integration):        ░░░░░░░░░░ 0%
Phase 7 (Security):           ░░░░░░░░░░ 0%
Phase 8 (Error Handling):     ░░░░░░░░░░ 0%
─────────────────────────────────────────
TOTAL:                        ░░░░░░░░░░ 0%
```

---

## Quick Commands

```bash
# Install dependencies
npm install --save-dev vitest supertest

# Run all tests
npm run test:api

# Run with coverage
npm run test:coverage

# Watch mode
npm run test:watch

# Specific test file
npm run test tests/tier2/quotes.test.ts

# Specific test case
npm run test:api -- -t "should create quote"
```

---

**Last Updated**: March 15, 2026  
**Estimated Total Time**: 8-10 hours  
**Target Coverage**: 85%+  
