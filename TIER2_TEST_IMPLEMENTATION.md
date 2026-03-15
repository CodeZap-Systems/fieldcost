# Tier 2 Test Implementation Guide

**Status**: 🚀 Ready to Implement  
**Test Framework**: Vitest + Supertest (HTTP client)  
**Database**: Supabase Test Instance  

---

## Quick Start: Running Tests

```bash
# Install test dependencies (if needed)
npm install --save-dev vitest supertest

# Run all Tier 2 tests
npm run test:api

# Run specific test file
npm run test tests/tier2/quotes.test.ts

# Run with coverage
npm run test:coverage

# Watch mode for development
npm run test:watch
```

---

## Test Implementation Checklist

### 1. Quotes Module Tests (60+ tests)
**File**: `tests/tier2/quotes.test.ts`

```typescript
// Template ready - customize with:
import { createTestQuote, expectSuccess, expectError } from '../helpers';

describe('Quotes API', () => {
  it('should create quote with valid data', async () => {
    const quote = createTestQuote();
    const response = await api.post('/api/quotes')
      .set('user_id', TEST_USER_ID)
      .send(quote);
    
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.status).toBe('draft');
  });
});
```

**Priority**: 🔴 HIGH (Foundation for other modules)

---

### 2. Purchase Orders Tests (80+ tests)
**File**: `tests/tier2/purchase-orders.test.ts`

**Key Integration Point**: GRN updates PO status  
Ensure tests verify:
- PO status auto-updates when GRN created
- Line items track quantity_received
- Full receipt auto-closes PO

**Priority**: 🔴 HIGH (Core workflow)

---

### 3. Suppliers Tests (50+ tests)
**File**: `tests/tier2/suppliers.test.ts`

**Focus Areas**:
- CRUD operations
- Validation (email format, required fields)
- Deletion prevention when POs exist
- Performance (1000+ suppliers)

**Priority**: 🟡 MEDIUM

---

### 4. Goods Received Notes Tests (100+ tests)
**File**: `tests/tier2/goods-received-notes.test.ts`

**Critical Tests**:
- GRN creates → updates PO line quantity_received
- PO status transitions: draft → partially_received → fully_received
- Quality control workflow (good/defective/partial)
- Defect rejection triggers credit note

**Priority**: 🔴 HIGH (Most complex)

---

## Test Helpers & Utilities

### Create `tests/helpers/generators.ts`

```typescript
export function createTestQuote(overrides = {}) {
  return {
    customer_id: 1,
    company_id: TEST_COMPANY_ID,
    reference: `QUOTE-${Date.now()}`,
    description: 'Test quote',
    valid_until: new Date(Date.now() + 30*24*60*60*1000).toISOString(),
    lines: [
      {
        item_name: 'Service',
        quantity: 10,
        unit: 'hours',
        rate: 150,
        note: 'Test service'
      }
    ],
    ...overrides
  };
}

export function createTestPO(overrides = {}) {
  return {
    supplier_id: 1,
    company_id: TEST_COMPANY_ID,
    po_reference: `PO-${Date.now()}`,
    required_by_date: new Date(Date.now() + 14*24*60*60*1000).toISOString(),
    lines: [
      {
        item_name: 'Material',
        quantity_ordered: 100,
        unit: 'pcs',
        unit_rate: 25,
        note: 'Test material'
      }
    ],
    ...overrides
  };
}

export function createTestGRN(poId: number, poLineId: number, overrides = {}) {
  return {
    po_id: poId,
    po_line_item_id: poLineId,
    quantity_received: 50,
    unit: 'pcs',
    quality_status: 'inspected_good',
    received_by: 'Test User',
    received_at_location: 'Warehouse A',
    ...overrides
  };
}
```

---

## API Test Structure

### Base Setup

```typescript
import request from 'supertest';

const API_URL = 'http://localhost:3000';
const TEST_USER_ID = 'test-user-123';
const TEST_COMPANY_ID = 1;

const api = request(API_URL);

describe('Feature Tests', () => {
  beforeEach(async () => {
    // Setup: Create test data
  });

  afterEach(async () => {
    // Cleanup: Delete test data
  });

  it('should test functionality', async () => {
    const response = await api
      .post('/api/endpoint')
      .set('user_id', TEST_USER_ID)
      .send(testData);

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
  });
});
```

---

## Key Integration Tests

### Test 1: Quote → Invoice Conversion

```typescript
it('should convert accepted quote to invoice', async () => {
  // 1. Create quote
  const quoteRes = await api.post('/api/quotes')
    .set('user_id', TEST_USER_ID)
    .send(createTestQuote());
  
  const quoteId = quoteRes.body.id;
  
  // 2. Send quote (draft → sent)
  await api.post(`/api/quotes/${quoteId}/send`)
    .set('user_id', TEST_USER_ID);
  
  // 3. Accept quote (sent → accepted)
  await api.patch(`/api/quotes/${quoteId}`)
    .set('user_id', TEST_USER_ID)
    .send({ status: 'accepted' });
  
  // 4. Convert to invoice
  const invoiceRes = await api.post(`/api/quotes/${quoteId}/convert`)
    .set('user_id', TEST_USER_ID);
  
  expect(invoiceRes.status).toBe(201);
  expect(invoiceRes.body.type).toBe('invoice');
  expect(invoiceRes.body.amount).toBe(quoteRes.body.amount);
});
```

### Test 2: PO → GRN → Status Auto-Update

```typescript
it('should auto-update PO status on full GRN receipt', async () => {
  // 1. Create PO with 2 line items (100 pcs each)
  const poRes = await api.post('/api/purchase-orders')
    .set('user_id', TEST_USER_ID)
    .send({
      ...createTestPO(),
      lines: [
        { item_name: 'ItemA', quantity_ordered: 100, unit_rate: 25 },
        { item_name: 'ItemB', quantity_ordered: 100, unit_rate: 50 }
      ]
    });
  
  const poId = poRes.body.id;
  const [lineId1, lineId2] = poRes.body.line_items.map(l => l.id);
  
  // 2. Check initial PO status = 'draft'
  let po = await api.get(`/api/purchase-orders/${poId}`)
    .set('user_id', TEST_USER_ID);
  expect(po.body.status).toBe('draft');
  
  // 3. Receive 50 pcs of ItemA
  await api.post('/api/goods-received-notes')
    .set('user_id', TEST_USER_ID)
    .send({
      po_id: poId,
      po_line_item_id: lineId1,
      quantity_received: 50
    });
  
  // 4. Check PO status = 'partially_received'
  po = await api.get(`/api/purchase-orders/${poId}`)
    .set('user_id', TEST_USER_ID);
  expect(po.body.status).toBe('partially_received');
  
  // 5. Receive remaining 50 of ItemA + all 100 of ItemB
  await api.post('/api/goods-received-notes')
    .send({ po_id: poId, po_line_item_id: lineId1, quantity_received: 50 });
  
  await api.post('/api/goods-received-notes')
    .send({ po_id: poId, po_line_item_id: lineId2, quantity_received: 100 });
  
  // 6. Check PO auto-updated to 'fully_received'
  po = await api.get(`/api/purchase-orders/${poId}`)
    .set('user_id', TEST_USER_ID);
  expect(po.body.status).toBe('fully_received');
});
```

### Test 3: Quality Control Defect Rejection

```typescript
it('should handle defective goods rejection', async () => {
  // 1. Create and send PO
  const poRes = await api.post('/api/purchase-orders').send(createTestPO());
  const poId = poRes.body.id;
  const lineId = poRes.body.line_items[0].id;
  
  // 2. Create GRN with quality issues
  const grnRes = await api.post('/api/goods-received-notes')
    .set('user_id', TEST_USER_ID)
    .send({
      po_id: poId,
      po_line_item_id: lineId,
      quantity_received: 50,
      quality_status: 'inspected_defective',
      damage_notes: 'Packaging damaged, 5 units defective'
    });
  
  const grnId = grnRes.body.id;
  
  // 3. Verify GRN marked as defective
  expect(grnRes.body.quality_status).toBe('inspected_defective');
  
  // 4. Verify credit note created
  // (Check if credit memo appears in invoicing system)
});
```

---

## Data Isolation Tests (Critical)

```typescript
describe('Company Data Isolation', () => {
  it('user cannot access another company data', async () => {
    // Create quote in company 1
    const quote1 = await api.post('/api/quotes')
      .set('user_id', 'user-company-1')
      .send({ ...createTestQuote(), company_id: 1 });
    
    // Try to access from company 2
    const response = await api.get('/api/quotes')
      .set('user_id', 'user-company-2')
      .query({ company_id: 1 });
    
    // Should be empty or return 403
    if (response.status === 200) {
      expect(response.body.length).toBe(0);
    }
    expect([403, 200]).toContain(response.status);
  });
});
```

---

## Running Tests Locally

### 1. Start Test Server
```bash
# Terminal 1: Start dev server
npm run dev

# Terminal 2: Run tests
npm run test:api

# Terminal 3: Watch mode
npm run test:watch
```

### 2. Verify Success
```
PASS  tests/tier2/quotes.test.ts (15/60)
PASS  tests/tier2/purchase-orders.test.ts (22/80)
PASS  tests/tier2/suppliers.test.ts (18/50)
PASS  tests/tier2/goods-received-notes.test.ts (45/100)

Total: 100/290 tests passing ✅
Coverage: 78% 📈
```

---

## Common Testing Patterns

### Pattern 1: State Transition Testing

```typescript
it('should follow correct state transitions', async () => {
  const quote = await createQuote();
  
  // draft → sent
  await expectTransition(quote, 'draft', 'sent', '/send');
  
  // sent → accepted
  await expectTransition(quote, 'sent', 'accepted', '/accept');
  
  // Invalid: accepted → draft (should fail)
  const result = await revertStatus(quote.id, 'draft');
  expect(result.status).toBe(400);
});
```

### Pattern 2: Cascading Update Testing

```typescript
it('should cascade updates correctly', async () => {
  const po = await createPO();
  const line = po.lines[0];
  
  // Create GRN
  const grn = await createGRN(po.id, line.id, 50);
  
  // Verify PO line updated
  const updated = await getPO(po.id);
  expect(updated.lines[0].quantity_received).toBe(50);
  expect(updated.status).toBe('partially_received');
});
```

### Pattern 3: Permission Testing

```typescript
it('should enforce permissions', async () => {
  const quote = await createQuoteAsUser1();
  
  // User 2 cannot access
  const response = await api.get(`/api/quotes/${quote.id}`)
    .set('user_id', TEST_USER_2);
  
  expect(response.status).toBe(403);
});
```

---

## Debugging Failed Tests

### Check Test Output
```bash
npm run test:api -- --reporter=verbose

# Specific test
npm run test tests/tier2/quotes.test.ts -- --reporter=verbose
```

### Common Issues

| Error | Solution |
|-------|----------|
| 404 Not Found | Check if endpoint exists in routes |
| 400 Bad Request | Verify required fields in request |
| 401 Unauthorized | Ensure user_id header is set |
| Database timeout | Check if Supabase is accessible |
| Async issues | Use `await` for async operations |

---

## Coverage Goals

```
┌─────────────────────┬─────────┬──────┬──────┐
│ File                │ Stmts   │ Miss │ Cov  │
├─────────────────────┼─────────┼──────┼──────┤
│ api/quotes/         │ 450     │ 90   │ 80%  │
│ api/purchase-orders │ 520     │ 104  │ 80%  │  
│ api/suppliers/      │ 180     │ 27   │ 85%  │
│ api/goods-received  │ 420     │ 63   │ 85%  │
├─────────────────────┼─────────┼──────┼──────┤
│ TOTAL               │ 1570    │ 284  │ 82%  │
└─────────────────────┴─────────┴──────┴──────┘

Target: 85%+ coverage
Estimated time: 8-10 hours
```

---

**Last Updated**: March 15, 2026  
**Ready for Implementation**: ✅ YES
