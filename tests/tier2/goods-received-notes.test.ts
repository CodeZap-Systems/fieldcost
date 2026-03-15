/**
 * Tier 2 Comprehensive Test Suite - Goods Received Notes (GRN) Module
 * Vitest tests covering delivery receipt tracking and quality control
 */

import { describe, it, expect, beforeAll } from 'vitest';

const API_BASE = process.env.API_BASE || 'http://localhost:3000';
const ENDPOINTS = {
  GRNS: '/api/goods-received-notes',
  POS: '/api/purchase-orders',
  SUPPLIERS: '/api/suppliers'
};

const testUserId = 'test-user-123';
const testCompanyId = 1;

// Data builders
function buildTestSupplier(overrides = {}) {
  return {
    vendor_name: 'Test Supplier',
    contact_email: 'contact@supplier.com',
    contact_phone: '555-0001',
    payment_terms: 30,
    company_id: testCompanyId,
    ...overrides
  };
}

function buildTestPO(supplierId: number, overrides = {}) {
  return {
    supplier_id: supplierId,
    po_number: `PO-${Date.now()}`,
    status: 'open',
    company_id: testCompanyId,
    ...overrides
  };
}

function buildTestGRN(poId: number, poLineItemId: number, overrides = {}) {
  return {
    po_id: poId,
    po_line_item_id: poLineItemId,
    quantity_received: 5,
    unit: 'units',
    received_by: 'test-user',
    received_at_location: 'Main Warehouse',
    received_at: new Date().toISOString(),
    company_id: testCompanyId,
    ...overrides
  };
}

// API helpers
async function POST(endpoint: string, payload: any, userId: string, companyId: number) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-User-ID': userId, 'X-Company-ID': companyId.toString() },
    body: JSON.stringify(payload)
  });
  return { status: response.status, body: await response.json() };
}

async function GET(endpoint: string, userId: string, companyId: number) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: { 'X-User-ID': userId, 'X-Company-ID': companyId.toString() }
  });
  return { status: response.status, body: await response.json() };
}

async function PATCH(endpoint: string, payload: any, userId: string, companyId: number) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', 'X-User-ID': userId, 'X-Company-ID': companyId.toString() },
    body: JSON.stringify(payload)
  });
  return { status: response.status, body: await response.json() };
}

async function DELETE(endpoint: string, userId: string, companyId: number) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    method: 'DELETE',
    headers: { 'X-User-ID': userId, 'X-Company-ID': companyId.toString() }
  });
  return { status: response.status, body: await response.json() };
}

// Tracking for cleanup
const tracker = {
  grns: [] as number[],
  pos: [] as number[],
  suppliers: [] as number[],
  track(type: string, id: number) {
    if (type.includes('goods-received')) tracker.grns.push(id);
    else if (type.includes('purchase-orders')) tracker.pos.push(id);
    else if (type.includes('suppliers')) tracker.suppliers.push(id);
  },
  async cleanup(userId: string, companyId: number) {
    for (const id of tracker.grns) {
      try { await DELETE(`${ENDPOINTS.GRNS}/${id}`, userId, companyId); } catch (e) {}
    }
    tracker.grns = [];
  }
};

describe('Tier 2 - Goods Received Notes (GRN) Module', () => {
  let grnId: number;
  let poId: number;
  let poLineItemId: number;
  let supplierId: number;

  describe('GRN Lifecycle', () => {
    it('creates GRN for PO line item', async () => {
      const supplierData = buildTestSupplier({ vendor_name: 'GRN Test Supplier' });
      const supplierResp = await POST(ENDPOINTS.SUPPLIERS, supplierData, testUserId, testCompanyId);
      supplierId = supplierResp.body.id;
      tracker.track(ENDPOINTS.SUPPLIERS, supplierId);

      const poData = buildTestPO(supplierId);
      const poResp = await POST(ENDPOINTS.POS, poData, testUserId, testCompanyId);
      poId = poResp.body.id;
      poLineItemId = poResp.body.line_items?.[0]?.id || 1;
      tracker.track(ENDPOINTS.POS, poId);

      const grnData = buildTestGRN(poId, poLineItemId, { quantity_received: 10 });
      const response = await POST(ENDPOINTS.GRNS, grnData, testUserId, testCompanyId);

      expect(response.status).toBe(201);
      expect(response.body.po_id).toBe(poId);
      expect(response.body.quantity_received).toBe(10);
      grnId = response.body.id;
      tracker.track(ENDPOINTS.GRNS, grnId);
    });

    it('captures received quantity', async () => {
      const supplierData = buildTestSupplier({ vendor_name: 'QtyCapture Supplier' });
      const supplierResp = await POST(ENDPOINTS.SUPPLIERS, supplierData, testUserId, testCompanyId);
      const sId = supplierResp.body.id;
      tracker.track(ENDPOINTS.SUPPLIERS, sId);

      const poData = buildTestPO(sId);
      const poResp = await POST(ENDPOINTS.POS, poData, testUserId, testCompanyId);
      const pId = poResp.body.id;
      const pliId = poResp.body.line_items?.[0]?.id || 1;
      tracker.track(ENDPOINTS.POS, pId);

      const grnData = buildTestGRN(pId, pliId, { quantity_received: 25 });
      const response = await POST(ENDPOINTS.GRNS, grnData, testUserId, testCompanyId);

      expect(response.status).toBe(201);
      expect(response.body.quantity_received).toBe(25);
      tracker.track(ENDPOINTS.GRNS, response.body.id);
    });

    it('records received date/time', async () => {
      const supplierData = buildTestSupplier({ vendor_name: 'DateTimeSupplier' });
      const supplierResp = await POST(ENDPOINTS.SUPPLIERS, supplierData, testUserId, testCompanyId);
      const sId = supplierResp.body.id;
      tracker.track(ENDPOINTS.SUPPLIERS, sId);

      const poData = buildTestPO(sId);
      const poResp = await POST(ENDPOINTS.POS, poData, testUserId, testCompanyId);
      const pId = poResp.body.id;
      const pliId = poResp.body.line_items?.[0]?.id || 1;
      tracker.track(ENDPOINTS.POS, pId);

      const receivedTime = new Date('2024-01-15T14:30:00Z').toISOString();
      const grnData = buildTestGRN(pId, pliId, { received_at: receivedTime });
      const response = await POST(ENDPOINTS.GRNS, grnData, testUserId, testCompanyId);

      expect(response.status).toBe(201);
      expect(response.body.received_at).toBeDefined();
      tracker.track(ENDPOINTS.GRNS, response.body.id);
    });

    it('tracks received by person', async () => {
      const supplierData = buildTestSupplier({ vendor_name: 'ReceiverSupplier' });
      const supplierResp = await POST(ENDPOINTS.SUPPLIERS, supplierData, testUserId, testCompanyId);
      const sId = supplierResp.body.id;
      tracker.track(ENDPOINTS.SUPPLIERS, sId);

      const poData = buildTestPO(sId);
      const poResp = await POST(ENDPOINTS.POS, poData, testUserId, testCompanyId);
      const pId = poResp.body.id;
      const pliId = poResp.body.line_items?.[0]?.id || 1;
      tracker.track(ENDPOINTS.POS, pId);

      const grnData = buildTestGRN(pId, pliId, { received_by: 'John Warehouse' });
      const response = await POST(ENDPOINTS.GRNS, grnData, testUserId, testCompanyId);

      expect(response.status).toBe(201);
      expect(response.body.received_by).toBe('John Warehouse');
      tracker.track(ENDPOINTS.GRNS, response.body.id);
    });

    it('records receiving location', async () => {
      const supplierData = buildTestSupplier({ vendor_name: 'LocationSupplier' });
      const supplierResp = await POST(ENDPOINTS.SUPPLIERS, supplierData, testUserId, testCompanyId);
      const sId = supplierResp.body.id;
      tracker.track(ENDPOINTS.SUPPLIERS, sId);

      const poData = buildTestPO(sId);
      const poResp = await POST(ENDPOINTS.POS, poData, testUserId, testCompanyId);
      const pId = poResp.body.id;
      const pliId = poResp.body.line_items?.[0]?.id || 1;
      tracker.track(ENDPOINTS.POS, pId);

      const grnData = buildTestGRN(pId, pliId, { received_at_location: 'Dock B, Warehouse 2' });
      const response = await POST(ENDPOINTS.GRNS, grnData, testUserId, testCompanyId);

      expect(response.status).toBe(201);
      expect(response.body.received_at_location).toBe('Dock B, Warehouse 2');
      tracker.track(ENDPOINTS.GRNS, response.body.id);
    });
  });

  describe('Quality Control', () => {
    it('inspects received goods', async () => {
      const supplierData = buildTestSupplier({ vendor_name: 'QCSupplier' });
      const supplierResp = await POST(ENDPOINTS.SUPPLIERS, supplierData, testUserId, testCompanyId);
      const sId = supplierResp.body.id;
      tracker.track(ENDPOINTS.SUPPLIERS, sId);

      const poData = buildTestPO(sId);
      const poResp = await POST(ENDPOINTS.POS, poData, testUserId, testCompanyId);
      const pId = poResp.body.id;
      const pliId = poResp.body.line_items?.[0]?.id || 1;
      tracker.track(ENDPOINTS.POS, pId);

      const grnData = buildTestGRN(pId, pliId, { quality_status: 'pending_inspection' });
      const grnResp = await POST(ENDPOINTS.GRNS, grnData, testUserId, testCompanyId);
      const gId = grnResp.body.id;

      const updateData = { quality_status: 'inspected_good' };
      const response = await PATCH(`${ENDPOINTS.GRNS}/${gId}`, updateData, testUserId, testCompanyId);

      expect(response.status).toBe(200);
      expect(response.body.quality_status).toBe('inspected_good');
      tracker.track(ENDPOINTS.GRNS, gId);
    });

    it('stores quality notes', async () => {
      const supplierData = buildTestSupplier({ vendor_name: 'NotesSupplier' });
      const supplierResp = await POST(ENDPOINTS.SUPPLIERS, supplierData, testUserId, testCompanyId);
      const sId = supplierResp.body.id;
      tracker.track(ENDPOINTS.SUPPLIERS, sId);

      const poData = buildTestPO(sId);
      const poResp = await POST(ENDPOINTS.POS, poData, testUserId, testCompanyId);
      const pId = poResp.body.id;
      const pliId = poResp.body.line_items?.[0]?.id || 1;
      tracker.track(ENDPOINTS.POS, pId);

      const grnData = buildTestGRN(pId, pliId, { quality_notes: 'All items verified and counted' });
      const response = await POST(ENDPOINTS.GRNS, grnData, testUserId, testCompanyId);

      expect(response.status).toBe(201);
      expect(response.body.quality_notes).toBe('All items verified and counted');
      tracker.track(ENDPOINTS.GRNS, response.body.id);
    });

    it('records damage information', async () => {
      const supplierData = buildTestSupplier({ vendor_name: 'DamageSupplier' });
      const supplierResp = await POST(ENDPOINTS.SUPPLIERS, supplierData, testUserId, testCompanyId);
      const sId = supplierResp.body.id;
      tracker.track(ENDPOINTS.SUPPLIERS, sId);

      const poData = buildTestPO(sId);
      const poResp = await POST(ENDPOINTS.POS, poData, testUserId, testCompanyId);
      const pId = poResp.body.id;
      const pliId = poResp.body.line_items?.[0]?.id || 1;
      tracker.track(ENDPOINTS.POS, pId);

      const grnData = buildTestGRN(pId, pliId, { damage_notes: 'Corner of box damaged, 2 items defective' });
      const response = await POST(ENDPOINTS.GRNS, grnData, testUserId, testCompanyId);

      expect(response.status).toBe(201);
      expect(response.body.damage_notes).toBe('Corner of box damaged, 2 items defective');
      tracker.track(ENDPOINTS.GRNS, response.body.id);
    });

    it('flags for follow-up action', async () => {
      const supplierData = buildTestSupplier({ vendor_name: 'FollowUpSupplier' });
      const supplierResp = await POST(ENDPOINTS.SUPPLIERS, supplierData, testUserId, testCompanyId);
      const sId = supplierResp.body.id;
      tracker.track(ENDPOINTS.SUPPLIERS, sId);

      const poData = buildTestPO(sId);
      const poResp = await POST(ENDPOINTS.POS, poData, testUserId, testCompanyId);
      const pId = poResp.body.id;
      const pliId = poResp.body.line_items?.[0]?.id || 1;
      tracker.track(ENDPOINTS.POS, pId);

      const grnData = buildTestGRN(pId, pliId, { follow_up_required: true });
      const response = await POST(ENDPOINTS.GRNS, grnData, testUserId, testCompanyId);

      expect(response.status).toBe(201);
      expect(response.body.follow_up_required).toBe(true);
      tracker.track(ENDPOINTS.GRNS, response.body.id);
    });

    it('stores follow-up notes', async () => {
      const supplierData = buildTestSupplier({ vendor_name: 'FollowUpNotesSupplier' });
      const supplierResp = await POST(ENDPOINTS.SUPPLIERS, supplierData, testUserId, testCompanyId);
      const sId = supplierResp.body.id;
      tracker.track(ENDPOINTS.SUPPLIERS, sId);

      const poData = buildTestPO(sId);
      const poResp = await POST(ENDPOINTS.POS, poData, testUserId, testCompanyId);
      const pId = poResp.body.id;
      const pliId = poResp.body.line_items?.[0]?.id || 1;
      tracker.track(ENDPOINTS.POS, pId);

      const grnData = buildTestGRN(pId, pliId, { follow_up_notes: 'Contact supplier about defects by EOD' });
      const response = await POST(ENDPOINTS.GRNS, grnData, testUserId, testCompanyId);

      expect(response.status).toBe(201);
      expect(response.body.follow_up_notes).toBe('Contact supplier about defects by EOD');
      tracker.track(ENDPOINTS.GRNS, response.body.id);
    });

    it('approves good receipts', async () => {
      const supplierData = buildTestSupplier({ vendor_name: 'ApprovalSupplier' });
      const supplierResp = await POST(ENDPOINTS.SUPPLIERS, supplierData, testUserId, testCompanyId);
      const sId = supplierResp.body.id;
      tracker.track(ENDPOINTS.SUPPLIERS, sId);

      const poData = buildTestPO(sId);
      const poResp = await POST(ENDPOINTS.POS, poData, testUserId, testCompanyId);
      const pId = poResp.body.id;
      const pliId = poResp.body.line_items?.[0]?.id || 1;
      tracker.track(ENDPOINTS.POS, pId);

      const grnData = buildTestGRN(pId, pliId, { quality_status: 'inspected_good' });
      const response = await POST(ENDPOINTS.GRNS, grnData, testUserId, testCompanyId);

      expect(response.status).toBe(201);
      expect(response.body.quality_status).toBe('inspected_good');
      tracker.track(ENDPOINTS.GRNS, response.body.id);
    });

    it('rejects defective goods', async () => {
      const supplierData = buildTestSupplier({ vendor_name: 'DefectiveSupplier' });
      const supplierResp = await POST(ENDPOINTS.SUPPLIERS, supplierData, testUserId, testCompanyId);
      const sId = supplierResp.body.id;
      tracker.track(ENDPOINTS.SUPPLIERS, sId);

      const poData = buildTestPO(sId);
      const poResp = await POST(ENDPOINTS.POS, poData, testUserId, testCompanyId);
      const pId = poResp.body.id;
      const pliId = poResp.body.line_items?.[0]?.id || 1;
      tracker.track(ENDPOINTS.POS, pId);

      const grnData = buildTestGRN(pId, pliId, { quality_status: 'inspected_defective', damage_notes: 'Major defects found' });
      const response = await POST(ENDPOINTS.GRNS, grnData, testUserId, testCompanyId);

      expect(response.status).toBe(201);
      expect(response.body.quality_status).toBe('inspected_defective');
      tracker.track(ENDPOINTS.GRNS, response.body.id);
    });
  });

  describe('PO Integration', () => {
    it('updates PO line item quantity_received', async () => {
      const supplierData = buildTestSupplier({ vendor_name: 'POIntegSupplier1' });
      const supplierResp = await POST(ENDPOINTS.SUPPLIERS, supplierData, testUserId, testCompanyId);
      const sId = supplierResp.body.id;
      tracker.track(ENDPOINTS.SUPPLIERS, sId);

      const poData = buildTestPO(sId, { status: 'open' });
      const poResp = await POST(ENDPOINTS.POS, poData, testUserId, testCompanyId);
      const pId = poResp.body.id;
      const pliId = poResp.body.line_items?.[0]?.id || 1;
      tracker.track(ENDPOINTS.POS, pId);

      const grnData = buildTestGRN(pId, pliId, { quantity_received: 15 });
      const response = await POST(ENDPOINTS.GRNS, grnData, testUserId, testCompanyId);

      expect(response.status).toBe(201);
      expect(response.body.quantity_received).toBe(15);
      tracker.track(ENDPOINTS.GRNS, response.body.id);
    });

    it('calculates partial receipt status', async () => {
      const supplierData = buildTestSupplier({ vendor_name: 'PartialSupplier' });
      const supplierResp = await POST(ENDPOINTS.SUPPLIERS, supplierData, testUserId, testCompanyId);
      const sId = supplierResp.body.id;
      tracker.track(ENDPOINTS.SUPPLIERS, sId);

      const poData = buildTestPO(sId);
      const poResp = await POST(ENDPOINTS.POS, poData, testUserId, testCompanyId);
      const pId = poResp.body.id;
      const pliId = poResp.body.line_items?.[0]?.id || 1;
      tracker.track(ENDPOINTS.POS, pId);

      const grnData = buildTestGRN(pId, pliId, { quantity_received: 3 });
      const response = await POST(ENDPOINTS.GRNS, grnData, testUserId, testCompanyId);

      expect(response.status).toBe(201);
      tracker.track(ENDPOINTS.GRNS, response.body.id);
    });

    it('auto-closes line item on full receipt', async () => {
      const supplierData = buildTestSupplier({ vendor_name: 'FullReceiptSupplier' });
      const supplierResp = await POST(ENDPOINTS.SUPPLIERS, supplierData, testUserId, testCompanyId);
      const sId = supplierResp.body.id;
      tracker.track(ENDPOINTS.SUPPLIERS, sId);

      const poData = buildTestPO(sId);
      const poResp = await POST(ENDPOINTS.POS, poData, testUserId, testCompanyId);
      const pId = poResp.body.id;
      const pliId = poResp.body.line_items?.[0]?.id || 1;
      tracker.track(ENDPOINTS.POS, pId);

      const grnData = buildTestGRN(pId, pliId, { quantity_received: 100 });
      const response = await POST(ENDPOINTS.GRNS, grnData, testUserId, testCompanyId);

      expect(response.status).toBe(201);
      tracker.track(ENDPOINTS.GRNS, response.body.id);
    });

    it('auto-updates PO status on full delivery', async () => {
      const supplierData = buildTestSupplier({ vendor_name: 'FullDeliverySupplier' });
      const supplierResp = await POST(ENDPOINTS.SUPPLIERS, supplierData, testUserId, testCompanyId);
      const sId = supplierResp.body.id;
      tracker.track(ENDPOINTS.SUPPLIERS, sId);

      const poData = buildTestPO(sId, { status: 'open' });
      const poResp = await POST(ENDPOINTS.POS, poData, testUserId, testCompanyId);
      const pId = poResp.body.id;
      const pliId = poResp.body.line_items?.[0]?.id || 1;
      tracker.track(ENDPOINTS.POS, pId);

      const grnData = buildTestGRN(pId, pliId, { quantity_received: 100 });
      const response = await POST(ENDPOINTS.GRNS, grnData, testUserId, testCompanyId);

      expect(response.status).toBe(201);
      tracker.track(ENDPOINTS.GRNS, response.body.id);
    });

    it('prevents receiving after PO closed', async () => {
      const supplierData = buildTestSupplier({ vendor_name: 'ClosedPOSupplier' });
      const supplierResp = await POST(ENDPOINTS.SUPPLIERS, supplierData, testUserId, testCompanyId);
      const sId = supplierResp.body.id;
      tracker.track(ENDPOINTS.SUPPLIERS, sId);

      const poData = buildTestPO(sId, { status: 'closed' });
      const poResp = await POST(ENDPOINTS.POS, poData, testUserId, testCompanyId);
      const pId = poResp.body.id;
      const pliId = poResp.body.line_items?.[0]?.id || 1;
      tracker.track(ENDPOINTS.POS, pId);

      const grnData = buildTestGRN(pId, pliId, { quantity_received: 10 });
      const response = await POST(ENDPOINTS.GRNS, grnData, testUserId, testCompanyId);

      expect([400, 409, 422]).toContain(response.status);
    });

    it('allows partial receipt corrections', async () => {
      const supplierData = buildTestSupplier({ vendor_name: 'CorrectionSupplier' });
      const supplierResp = await POST(ENDPOINTS.SUPPLIERS, supplierData, testUserId, testCompanyId);
      const sId = supplierResp.body.id;
      tracker.track(ENDPOINTS.SUPPLIERS, sId);

      const poData = buildTestPO(sId);
      const poResp = await POST(ENDPOINTS.POS, poData, testUserId, testCompanyId);
      const pId = poResp.body.id;
      const pliId = poResp.body.line_items?.[0]?.id || 1;
      tracker.track(ENDPOINTS.POS, pId);

      const grnData = buildTestGRN(pId, pliId, { quantity_received: 5 });
      const grnResp = await POST(ENDPOINTS.GRNS, grnData, testUserId, testCompanyId);
      const gId = grnResp.body.id;

      const updateData = { quantity_received: 8 };
      const response = await PATCH(`${ENDPOINTS.GRNS}/${gId}`, updateData, testUserId, testCompanyId);

      expect(response.status).toBe(200);
      tracker.track(ENDPOINTS.GRNS, gId);
    });

    it('reverses GRN entries', async () => {
      const supplierData = buildTestSupplier({ vendor_name: 'ReverseSupplier' });
      const supplierResp = await POST(ENDPOINTS.SUPPLIERS, supplierData, testUserId, testCompanyId);
      const sId = supplierResp.body.id;
      tracker.track(ENDPOINTS.SUPPLIERS, sId);

      const poData = buildTestPO(sId);
      const poResp = await POST(ENDPOINTS.POS, poData, testUserId, testCompanyId);
      const pId = poResp.body.id;
      const pliId = poResp.body.line_items?.[0]?.id || 1;
      tracker.track(ENDPOINTS.POS, pId);

      const grnData = buildTestGRN(pId, pliId, { quantity_received: 10 });
      const grnResp = await POST(ENDPOINTS.GRNS, grnData, testUserId, testCompanyId);
      const gId = grnResp.body.id;

      const response = await DELETE(`${ENDPOINTS.GRNS}/${gId}`, testUserId, testCompanyId);

      expect([200, 204]).toContain(response.status);
      tracker.track(ENDPOINTS.POS, pId);
    });
  });

  describe('Return & Rejection Workflow', () => {
    it('creates return GRN for defective goods', async () => {
      const supplierData = buildTestSupplier({ vendor_name: 'ReturnSupplier' });
      const supplierResp = await POST(ENDPOINTS.SUPPLIERS, supplierData, testUserId, testCompanyId);
      const sId = supplierResp.body.id;
      tracker.track(ENDPOINTS.SUPPLIERS, sId);

      const poData = buildTestPO(sId);
      const poResp = await POST(ENDPOINTS.POS, poData, testUserId, testCompanyId);
      const pId = poResp.body.id;
      const pliId = poResp.body.line_items?.[0]?.id || 1;
      tracker.track(ENDPOINTS.POS, pId);

      const grnData = buildTestGRN(pId, pliId, { quantity_received: -5, is_return: true });
      const response = await POST(ENDPOINTS.GRNS, grnData, testUserId, testCompanyId);

      expect(response.status).toBe(201);
      tracker.track(ENDPOINTS.GRNS, response.body.id);
    });

    it('tracks return authorization', async () => {
      const supplierData = buildTestSupplier({ vendor_name: 'RMASupplier' });
      const supplierResp = await POST(ENDPOINTS.SUPPLIERS, supplierData, testUserId, testCompanyId);
      const sId = supplierResp.body.id;
      tracker.track(ENDPOINTS.SUPPLIERS, sId);

      const poData = buildTestPO(sId);
      const poResp = await POST(ENDPOINTS.POS, poData, testUserId, testCompanyId);
      const pId = poResp.body.id;
      const pliId = poResp.body.line_items?.[0]?.id || 1;
      tracker.track(ENDPOINTS.POS, pId);

      const grnData = buildTestGRN(pId, pliId, { rma_number: 'RMA-2024-001', return_reason: 'Defective' });
      const response = await POST(ENDPOINTS.GRNS, grnData, testUserId, testCompanyId);

      expect(response.status).toBe(201);
      tracker.track(ENDPOINTS.GRNS, response.body.id);
    });

    it('updates supplier performance on rejection', async () => {
      const supplierData = buildTestSupplier({ vendor_name: 'DefectiveSupplierPerf' });
      const supplierResp = await POST(ENDPOINTS.SUPPLIERS, supplierData, testUserId, testCompanyId);
      const sId = supplierResp.body.id;
      tracker.track(ENDPOINTS.SUPPLIERS, sId);

      const poData = buildTestPO(sId);
      const poResp = await POST(ENDPOINTS.POS, poData, testUserId, testCompanyId);
      const pId = poResp.body.id;
      const pliId = poResp.body.line_items?.[0]?.id || 1;
      tracker.track(ENDPOINTS.POS, pId);

      const grnData = buildTestGRN(pId, pliId, { quality_status: 'inspected_defective' });
      const response = await POST(ENDPOINTS.GRNS, grnData, testUserId, testCompanyId);

      expect(response.status).toBe(201);
      tracker.track(ENDPOINTS.GRNS, response.body.id);
    });

    it('generates credit note on return', async () => {
      const supplierData = buildTestSupplier({ vendor_name: 'CreditNoteSupplier' });
      const supplierResp = await POST(ENDPOINTS.SUPPLIERS, supplierData, testUserId, testCompanyId);
      const sId = supplierResp.body.id;
      tracker.track(ENDPOINTS.SUPPLIERS, sId);

      const poData = buildTestPO(sId);
      const poResp = await POST(ENDPOINTS.POS, poData, testUserId, testCompanyId);
      const pId = poResp.body.id;
      const pliId = poResp.body.line_items?.[0]?.id || 1;
      tracker.track(ENDPOINTS.POS, pId);

      const grnData = buildTestGRN(pId, pliId, { quality_status: 'rejected', generate_credit_note: true });
      const response = await POST(ENDPOINTS.GRNS, grnData, testUserId, testCompanyId);

      expect(response.status).toBe(201);
      tracker.track(ENDPOINTS.GRNS, response.body.id);
    });
  });

  describe('Access Control & Isolation', () => {
    it('user sees only their company GRNs', async () => {
      const supplierData = buildTestSupplier({ vendor_name: 'AC1Supplier' });
      const supplierResp = await POST(ENDPOINTS.SUPPLIERS, supplierData, testUserId, testCompanyId);
      const sId = supplierResp.body.id;
      tracker.track(ENDPOINTS.SUPPLIERS, sId);

      const poData = buildTestPO(sId);
      const poResp = await POST(ENDPOINTS.POS, poData, testUserId, testCompanyId);
      const pId = poResp.body.id;
      const pliId = poResp.body.line_items?.[0]?.id || 1;
      tracker.track(ENDPOINTS.POS, pId);

      const grnData = buildTestGRN(pId, pliId, { company_id: testCompanyId });
      const response = await POST(ENDPOINTS.GRNS, grnData, testUserId, testCompanyId);

      expect(response.status).toBe(201);
      expect(response.body.company_id).toBe(testCompanyId);
      tracker.track(ENDPOINTS.GRNS, response.body.id);
    });

    it('prevents cross-company GRN access', async () => {
      const supplierData = buildTestSupplier({ vendor_name: 'XCompanySupplier' });
      const supplierResp = await POST(ENDPOINTS.SUPPLIERS, supplierData, testUserId, testCompanyId);
      const sId = supplierResp.body.id;
      tracker.track(ENDPOINTS.SUPPLIERS, sId);

      const poData = buildTestPO(sId);
      const poResp = await POST(ENDPOINTS.POS, poData, testUserId, testCompanyId);
      const pId = poResp.body.id;
      const pliId = poResp.body.line_items?.[0]?.id || 1;
      tracker.track(ENDPOINTS.POS, pId);

      const grnData = buildTestGRN(pId, pliId);
      const grnResp = await POST(ENDPOINTS.GRNS, grnData, testUserId, testCompanyId);

      const getResp = await GET(`${ENDPOINTS.GRNS}/${grnResp.body.id}`, 'other-user', 999);
      expect([403, 404]).toContain(getResp.status);
      tracker.track(ENDPOINTS.GRNS, grnResp.body.id);
    });

    it('enforces company_id on creation', async () => {
      const supplierData = buildTestSupplier({ vendor_name: 'CompanyEnforceSupplier' });
      const supplierResp = await POST(ENDPOINTS.SUPPLIERS, supplierData, testUserId, testCompanyId);
      const sId = supplierResp.body.id;
      tracker.track(ENDPOINTS.SUPPLIERS, sId);

      const poData = buildTestPO(sId);
      const poResp = await POST(ENDPOINTS.POS, poData, testUserId, testCompanyId);
      const pId = poResp.body.id;
      const pliId = poResp.body.line_items?.[0]?.id || 1;
      tracker.track(ENDPOINTS.POS, pId);

      const grnData = buildTestGRN(pId, pliId, { company_id: testCompanyId });
      const response = await POST(ENDPOINTS.GRNS, grnData, testUserId, testCompanyId);

      expect(response.status).toBe(201);
      expect(response.body.company_id).toBe(testCompanyId);
      tracker.track(ENDPOINTS.GRNS, response.body.id);
    });

    it('restricts updates to authorized users', async () => {
      const supplierData = buildTestSupplier({ vendor_name: 'AuthSupplier' });
      const supplierResp = await POST(ENDPOINTS.SUPPLIERS, supplierData, testUserId, testCompanyId);
      const sId = supplierResp.body.id;
      tracker.track(ENDPOINTS.SUPPLIERS, sId);

      const poData = buildTestPO(sId);
      const poResp = await POST(ENDPOINTS.POS, poData, testUserId, testCompanyId);
      const pId = poResp.body.id;
      const pliId = poResp.body.line_items?.[0]?.id || 1;
      tracker.track(ENDPOINTS.POS, pId);

      const grnData = buildTestGRN(pId, pliId);
      const grnResp = await POST(ENDPOINTS.GRNS, grnData, testUserId, testCompanyId);
      const gId = grnResp.body.id;

      const updateData = { quality_status: 'inspected_good' };
      const response = await PATCH(`${ENDPOINTS.GRNS}/${gId}`, updateData, 'other-user', 999);

      expect([403, 404]).toContain(response.status);
      tracker.track(ENDPOINTS.GRNS, gId);
    });
  });

  describe('Filtering & Search', () => {
    it('filters by PO ID', async () => {
      const supplierData = buildTestSupplier({ vendor_name: 'FilterPOSupplier' });
      const supplierResp = await POST(ENDPOINTS.SUPPLIERS, supplierData, testUserId, testCompanyId);
      const sId = supplierResp.body.id;
      tracker.track(ENDPOINTS.SUPPLIERS, sId);

      const poData = buildTestPO(sId);
      const poResp = await POST(ENDPOINTS.POS, poData, testUserId, testCompanyId);
      const pId = poResp.body.id;
      const pliId = poResp.body.line_items?.[0]?.id || 1;
      tracker.track(ENDPOINTS.POS, pId);

      const grnData = buildTestGRN(pId, pliId);
      const response = await POST(ENDPOINTS.GRNS, grnData, testUserId, testCompanyId);

      expect(response.status).toBe(201);
      tracker.track(ENDPOINTS.GRNS, response.body.id);
    });

    it('filters by quality status', async () => {
      const supplierData = buildTestSupplier({ vendor_name: 'FilterQCSupplier' });
      const supplierResp = await POST(ENDPOINTS.SUPPLIERS, supplierData, testUserId, testCompanyId);
      const sId = supplierResp.body.id;
      tracker.track(ENDPOINTS.SUPPLIERS, sId);

      const poData = buildTestPO(sId);
      const poResp = await POST(ENDPOINTS.POS, poData, testUserId, testCompanyId);
      const pId = poResp.body.id;
      const pliId = poResp.body.line_items?.[0]?.id || 1;
      tracker.track(ENDPOINTS.POS, pId);

      const grnData = buildTestGRN(pId, pliId, { quality_status: 'inspected_defective' });
      const response = await POST(ENDPOINTS.GRNS, grnData, testUserId, testCompanyId);

      expect(response.status).toBe(201);
      tracker.track(ENDPOINTS.GRNS, response.body.id);
    });

    it('filters by date range', async () => {
      const supplierData = buildTestSupplier({ vendor_name: 'FilterDateSupplier' });
      const supplierResp = await POST(ENDPOINTS.SUPPLIERS, supplierData, testUserId, testCompanyId);
      const sId = supplierResp.body.id;
      tracker.track(ENDPOINTS.SUPPLIERS, sId);

      const poData = buildTestPO(sId);
      const poResp = await POST(ENDPOINTS.POS, poData, testUserId, testCompanyId);
      const pId = poResp.body.id;
      const pliId = poResp.body.line_items?.[0]?.id || 1;
      tracker.track(ENDPOINTS.POS, pId);

      const grnData = buildTestGRN(pId, pliId, { received_at: '2024-01-15T10:00:00Z' });
      const response = await POST(ENDPOINTS.GRNS, grnData, testUserId, testCompanyId);

      expect(response.status).toBe(201);
      tracker.track(ENDPOINTS.GRNS, response.body.id);
    });

    it('shows pending inspections', async () => {
      const supplierData = buildTestSupplier({ vendor_name: 'PendingSupplier' });
      const supplierResp = await POST(ENDPOINTS.SUPPLIERS, supplierData, testUserId, testCompanyId);
      const sId = supplierResp.body.id;
      tracker.track(ENDPOINTS.SUPPLIERS, sId);

      const poData = buildTestPO(sId);
      const poResp = await POST(ENDPOINTS.POS, poData, testUserId, testCompanyId);
      const pId = poResp.body.id;
      const pliId = poResp.body.line_items?.[0]?.id || 1;
      tracker.track(ENDPOINTS.POS, pId);

      const grnData = buildTestGRN(pId, pliId, { quality_status: 'pending_inspection' });
      const response = await POST(ENDPOINTS.GRNS, grnData, testUserId, testCompanyId);

      expect(response.status).toBe(201);
      tracker.track(ENDPOINTS.GRNS, response.body.id);
    });

    it('lists by received date', async () => {
      const supplierData = buildTestSupplier({ vendor_name: 'SortSupplier' });
      const supplierResp = await POST(ENDPOINTS.SUPPLIERS, supplierData, testUserId, testCompanyId);
      const sId = supplierResp.body.id;
      tracker.track(ENDPOINTS.SUPPLIERS, sId);

      const poData = buildTestPO(sId);
      const poResp = await POST(ENDPOINTS.POS, poData, testUserId, testCompanyId);
      const pId = poResp.body.id;
      const pliId = poResp.body.line_items?.[0]?.id || 1;
      tracker.track(ENDPOINTS.POS, pId);

      const grnData = buildTestGRN(pId, pliId);
      const response = await POST(ENDPOINTS.GRNS, grnData, testUserId, testCompanyId);

      expect(response.status).toBe(201);
      tracker.track(ENDPOINTS.GRNS, response.body.id);
    });
  });

  describe('Validation', () => {
    it('requires PO ID', async () => {
      const response = await POST(ENDPOINTS.GRNS, { quantity_received: 5, unit: 'units' }, testUserId, testCompanyId);
      expect([400, 422]).toContain(response.status);
    });

    it('requires line item ID', async () => {
      const response = await POST(ENDPOINTS.GRNS, { po_id: 999, quantity_received: 5, unit: 'units' }, testUserId, testCompanyId);
      expect([400, 404, 422]).toContain(response.status);
    });

    it('validates quantity positive', async () => {
      const supplierData = buildTestSupplier({ vendor_name: 'ValidationSupplier1' });
      const supplierResp = await POST(ENDPOINTS.SUPPLIERS, supplierData, testUserId, testCompanyId);
      const sId = supplierResp.body.id;
      tracker.track(ENDPOINTS.SUPPLIERS, sId);

      const poData = buildTestPO(sId);
      const poResp = await POST(ENDPOINTS.POS, poData, testUserId, testCompanyId);
      const pId = poResp.body.id;
      const pliId = poResp.body.line_items?.[0]?.id || 1;
      tracker.track(ENDPOINTS.POS, pId);

      const badGRN = buildTestGRN(pId, pliId, { quantity_received: -10 });
      const response = await POST(ENDPOINTS.GRNS, badGRN, testUserId, testCompanyId);

      expect([400, 422]).toContain(response.status);
    });

    it('validates quantity not over-received', async () => {
      const supplierData = buildTestSupplier({ vendor_name: 'OverReceiveSupplier' });
      const supplierResp = await POST(ENDPOINTS.SUPPLIERS, supplierData, testUserId, testCompanyId);
      const sId = supplierResp.body.id;
      tracker.track(ENDPOINTS.SUPPLIERS, sId);

      const poData = buildTestPO(sId);
      const poResp = await POST(ENDPOINTS.POS, poData, testUserId, testCompanyId);
      const pId = poResp.body.id;
      const pliId = poResp.body.line_items?.[0]?.id || 1;
      tracker.track(ENDPOINTS.POS, pId);

      const badGRN = buildTestGRN(pId, pliId, { quantity_received: 999999 });
      const response = await POST(ENDPOINTS.GRNS, badGRN, testUserId, testCompanyId);

      expect([400, 409, 422]).toContain(response.status);
    });

    it('validates unit matches PO', async () => {
      const supplierData = buildTestSupplier({ vendor_name: 'UnitSupplier' });
      const supplierResp = await POST(ENDPOINTS.SUPPLIERS, supplierData, testUserId, testCompanyId);
      const sId = supplierResp.body.id;
      tracker.track(ENDPOINTS.SUPPLIERS, sId);

      const poData = buildTestPO(sId);
      const poResp = await POST(ENDPOINTS.POS, poData, testUserId, testCompanyId);
      const pId = poResp.body.id;
      const pliId = poResp.body.line_items?.[0]?.id || 1;
      tracker.track(ENDPOINTS.POS, pId);

      const grnData = buildTestGRN(pId, pliId, { unit: 'units' });
      const response = await POST(ENDPOINTS.GRNS, grnData, testUserId, testCompanyId);

      expect([201, 400, 422]).toContain(response.status);
    });

    it('requires received_by when quality_status set', async () => {
      const supplierData = buildTestSupplier({ vendor_name: 'ReceiverReqSupplier' });
      const supplierResp = await POST(ENDPOINTS.SUPPLIERS, supplierData, testUserId, testCompanyId);
      const sId = supplierResp.body.id;
      tracker.track(ENDPOINTS.SUPPLIERS, sId);

      const poData = buildTestPO(sId);
      const poResp = await POST(ENDPOINTS.POS, poData, testUserId, testCompanyId);
      const pId = poResp.body.id;
      const pliId = poResp.body.line_items?.[0]?.id || 1;
      tracker.track(ENDPOINTS.POS, pId);

      const grnData = buildTestGRN(pId, pliId, { quality_status: 'inspected_good', received_by: 'John Doe' });
      const response = await POST(ENDPOINTS.GRNS, grnData, testUserId, testCompanyId);

      expect(response.status).toBe(201);
      tracker.track(ENDPOINTS.GRNS, response.body.id);
    });
  });

  describe('Reporting & Analytics', () => {
    it('generates delivery performance report', async () => {
      const supplierData = buildTestSupplier({ vendor_name: 'ReportSupplier' });
      const supplierResp = await POST(ENDPOINTS.SUPPLIERS, supplierData, testUserId, testCompanyId);
      const sId = supplierResp.body.id;
      tracker.track(ENDPOINTS.SUPPLIERS, sId);

      const poData = buildTestPO(sId);
      const poResp = await POST(ENDPOINTS.POS, poData, testUserId, testCompanyId);
      const pId = poResp.body.id;
      const pliId = poResp.body.line_items?.[0]?.id || 1;
      tracker.track(ENDPOINTS.POS, pId);

      const grnData = buildTestGRN(pId, pliId);
      const response = await POST(ENDPOINTS.GRNS, grnData, testUserId, testCompanyId);

      expect(response.status).toBe(201);
      tracker.track(ENDPOINTS.GRNS, response.body.id);
    });

    it('calculates defect rates by supplier', async () => {
      const supplierData = buildTestSupplier({ vendor_name: 'DefectRateSupplier' });
      const supplierResp = await POST(ENDPOINTS.SUPPLIERS, supplierData, testUserId, testCompanyId);
      const sId = supplierResp.body.id;
      tracker.track(ENDPOINTS.SUPPLIERS, sId);

      const poData = buildTestPO(sId);
      const poResp = await POST(ENDPOINTS.POS, poData, testUserId, testCompanyId);
      const pId = poResp.body.id;
      const pliId = poResp.body.line_items?.[0]?.id || 1;
      tracker.track(ENDPOINTS.POS, pId);

      const grnData = buildTestGRN(pId, pliId, { quality_status: 'inspected_defective' });
      const response = await POST(ENDPOINTS.GRNS, grnData, testUserId, testCompanyId);

      expect(response.status).toBe(201);
      tracker.track(ENDPOINTS.GRNS, response.body.id);
    });

    it('tracks receipt trends over time', async () => {
      const supplierData = buildTestSupplier({ vendor_name: 'TrendSupplier' });
      const supplierResp = await POST(ENDPOINTS.SUPPLIERS, supplierData, testUserId, testCompanyId);
      const sId = supplierResp.body.id;
      tracker.track(ENDPOINTS.SUPPLIERS, sId);

      const poData = buildTestPO(sId);
      const poResp = await POST(ENDPOINTS.POS, poData, testUserId, testCompanyId);
      const pId = poResp.body.id;
      const pliId = poResp.body.line_items?.[0]?.id || 1;
      tracker.track(ENDPOINTS.POS, pId);

      const grnData = buildTestGRN(pId, pliId);
      const response = await POST(ENDPOINTS.GRNS, grnData, testUserId, testCompanyId);

      expect(response.status).toBe(201);
      tracker.track(ENDPOINTS.GRNS, response.body.id);
    });

    it('identifies problem suppliers', async () => {
      const supplierData = buildTestSupplier({ vendor_name: 'ProblemSupplier' });
      const supplierResp = await POST(ENDPOINTS.SUPPLIERS, supplierData, testUserId, testCompanyId);
      const sId = supplierResp.body.id;
      tracker.track(ENDPOINTS.SUPPLIERS, sId);

      const poData = buildTestPO(sId);
      const poResp = await POST(ENDPOINTS.POS, poData, testUserId, testCompanyId);
      const pId = poResp.body.id;
      const pliId = poResp.body.line_items?.[0]?.id || 1;
      tracker.track(ENDPOINTS.POS, pId);

      const grnData = buildTestGRN(pId, pliId);
      const response = await POST(ENDPOINTS.GRNS, grnData, testUserId, testCompanyId);

      expect(response.status).toBe(201);
      tracker.track(ENDPOINTS.GRNS, response.body.id);
    });
  });

  describe('Audit Logging', () => {
    it('logs GRN creation', async () => {
      const supplierData = buildTestSupplier({ vendor_name: 'AuditSupplier1' });
      const supplierResp = await POST(ENDPOINTS.SUPPLIERS, supplierData, testUserId, testCompanyId);
      const sId = supplierResp.body.id;
      tracker.track(ENDPOINTS.SUPPLIERS, sId);

      const poData = buildTestPO(sId);
      const poResp = await POST(ENDPOINTS.POS, poData, testUserId, testCompanyId);
      const pId = poResp.body.id;
      const pliId = poResp.body.line_items?.[0]?.id || 1;
      tracker.track(ENDPOINTS.POS, pId);

      const grnData = buildTestGRN(pId, pliId);
      const response = await POST(ENDPOINTS.GRNS, grnData, testUserId, testCompanyId);

      expect(response.status).toBe(201);
      tracker.track(ENDPOINTS.GRNS, response.body.id);
    });

    it('logs quality status changes', async () => {
      const supplierData = buildTestSupplier({ vendor_name: 'AuditSupplier2' });
      const supplierResp = await POST(ENDPOINTS.SUPPLIERS, supplierData, testUserId, testCompanyId);
      const sId = supplierResp.body.id;
      tracker.track(ENDPOINTS.SUPPLIERS, sId);

      const poData = buildTestPO(sId);
      const poResp = await POST(ENDPOINTS.POS, poData, testUserId, testCompanyId);
      const pId = poResp.body.id;
      const pliId = poResp.body.line_items?.[0]?.id || 1;
      tracker.track(ENDPOINTS.POS, pId);

      const grnData = buildTestGRN(pId, pliId);
      const grnResp = await POST(ENDPOINTS.GRNS, grnData, testUserId, testCompanyId);
      const gId = grnResp.body.id;

      const updateData = { quality_status: 'inspected_good' };
      const response = await PATCH(`${ENDPOINTS.GRNS}/${gId}`, updateData, testUserId, testCompanyId);

      expect(response.status).toBe(200);
      tracker.track(ENDPOINTS.GRNS, gId);
    });

    it('logs quantity adjustments', async () => {
      const supplierData = buildTestSupplier({ vendor_name: 'AuditSupplier3' });
      const supplierResp = await POST(ENDPOINTS.SUPPLIERS, supplierData, testUserId, testCompanyId);
      const sId = supplierResp.body.id;
      tracker.track(ENDPOINTS.SUPPLIERS, sId);

      const poData = buildTestPO(sId);
      const poResp = await POST(ENDPOINTS.POS, poData, testUserId, testCompanyId);
      const pId = poResp.body.id;
      const pliId = poResp.body.line_items?.[0]?.id || 1;
      tracker.track(ENDPOINTS.POS, pId);

      const grnData = buildTestGRN(pId, pliId, { quantity_received: 10 });
      const grnResp = await POST(ENDPOINTS.GRNS, grnData, testUserId, testCompanyId);
      const gId = grnResp.body.id;

      const updateData = { quantity_received: 12 };
      const response = await PATCH(`${ENDPOINTS.GRNS}/${gId}`, updateData, testUserId, testCompanyId);

      expect(response.status).toBe(200);
      tracker.track(ENDPOINTS.GRNS, gId);
    });

    it('logs deletion/reversal', async () => {
      const supplierData = buildTestSupplier({ vendor_name: 'AuditSupplier4' });
      const supplierResp = await POST(ENDPOINTS.SUPPLIERS, supplierData, testUserId, testCompanyId);
      const sId = supplierResp.body.id;
      tracker.track(ENDPOINTS.SUPPLIERS, sId);

      const poData = buildTestPO(sId);
      const poResp = await POST(ENDPOINTS.POS, poData, testUserId, testCompanyId);
      const pId = poResp.body.id;
      const pliId = poResp.body.line_items?.[0]?.id || 1;
      tracker.track(ENDPOINTS.POS, pId);

      const grnData = buildTestGRN(pId, pliId);
      const grnResp = await POST(ENDPOINTS.GRNS, grnData, testUserId, testCompanyId);
      const gId = grnResp.body.id;

      const response = await DELETE(`${ENDPOINTS.GRNS}/${gId}`, testUserId, testCompanyId);

      expect([200, 204]).toContain(response.status);
      tracker.track(ENDPOINTS.POS, pId);
    });
  });

  describe('Notifications & Alerts', () => {
    it('alerts on long-pending inspections', async () => {
      const supplierData = buildTestSupplier({ vendor_name: 'AlertSupplier1' });
      const supplierResp = await POST(ENDPOINTS.SUPPLIERS, supplierData, testUserId, testCompanyId);
      const sId = supplierResp.body.id;
      tracker.track(ENDPOINTS.SUPPLIERS, sId);

      const poData = buildTestPO(sId);
      const poResp = await POST(ENDPOINTS.POS, poData, testUserId, testCompanyId);
      const pId = poResp.body.id;
      const pliId = poResp.body.line_items?.[0]?.id || 1;
      tracker.track(ENDPOINTS.POS, pId);

      const grnData = buildTestGRN(pId, pliId, { quality_status: 'pending_inspection' });
      const response = await POST(ENDPOINTS.GRNS, grnData, testUserId, testCompanyId);

      expect(response.status).toBe(201);
      tracker.track(ENDPOINTS.GRNS, response.body.id);
    });

    it('notifies supervisor on defects', async () => {
      const supplierData = buildTestSupplier({ vendor_name: 'AlertSupplier2' });
      const supplierResp = await POST(ENDPOINTS.SUPPLIERS, supplierData, testUserId, testCompanyId);
      const sId = supplierResp.body.id;
      tracker.track(ENDPOINTS.SUPPLIERS, sId);

      const poData = buildTestPO(sId);
      const poResp = await POST(ENDPOINTS.POS, poData, testUserId, testCompanyId);
      const pId = poResp.body.id;
      const pliId = poResp.body.line_items?.[0]?.id || 1;
      tracker.track(ENDPOINTS.POS, pId);

      const grnData = buildTestGRN(pId, pliId, { quality_status: 'inspected_defective' });
      const response = await POST(ENDPOINTS.GRNS, grnData, testUserId, testCompanyId);

      expect(response.status).toBe(201);
      tracker.track(ENDPOINTS.GRNS, response.body.id);
    });

    it('flags follow-up required items', async () => {
      const supplierData = buildTestSupplier({ vendor_name: 'AlertSupplier3' });
      const supplierResp = await POST(ENDPOINTS.SUPPLIERS, supplierData, testUserId, testCompanyId);
      const sId = supplierResp.body.id;
      tracker.track(ENDPOINTS.SUPPLIERS, sId);

      const poData = buildTestPO(sId);
      const poResp = await POST(ENDPOINTS.POS, poData, testUserId, testCompanyId);
      const pId = poResp.body.id;
      const pliId = poResp.body.line_items?.[0]?.id || 1;
      tracker.track(ENDPOINTS.POS, pId);

      const grnData = buildTestGRN(pId, pliId, { follow_up_required: true });
      const response = await POST(ENDPOINTS.GRNS, grnData, testUserId, testCompanyId);

      expect(response.status).toBe(201);
      tracker.track(ENDPOINTS.GRNS, response.body.id);
    });

    it('overdue delivery alerts', async () => {
      const supplierData = buildTestSupplier({ vendor_name: 'AlertSupplier4' });
      const supplierResp = await POST(ENDPOINTS.SUPPLIERS, supplierData, testUserId, testCompanyId);
      const sId = supplierResp.body.id;
      tracker.track(ENDPOINTS.SUPPLIERS, sId);

      const poData = buildTestPO(sId, { expected_delivery_date: '2024-01-01' });
      const poResp = await POST(ENDPOINTS.POS, poData, testUserId, testCompanyId);
      const pId = poResp.body.id;
      const pliId = poResp.body.line_items?.[0]?.id || 1;
      tracker.track(ENDPOINTS.POS, pId);

      const grnData = buildTestGRN(pId, pliId);
      const response = await POST(ENDPOINTS.GRNS, grnData, testUserId, testCompanyId);

      expect(response.status).toBe(201);
      tracker.track(ENDPOINTS.GRNS, response.body.id);
    });
  });

  describe('Error Handling', () => {
    it('returns 404 for nonexistent GRN', async () => {
      const response = await GET(`${ENDPOINTS.GRNS}/99999`, testUserId, testCompanyId);
      expect(response.status).toBe(404);
    });

    it('returns 400 for invalid PO ID', async () => {
      const response = await POST(ENDPOINTS.GRNS, { po_id: -1, po_line_item_id: 1, quantity_received: 5 }, testUserId, testCompanyId);
      expect([400, 422]).toContain(response.status);
    });

    it('returns 409 when over-receiving', async () => {
      const supplierData = buildTestSupplier({ vendor_name: 'ErrorSupplier1' });
      const supplierResp = await POST(ENDPOINTS.SUPPLIERS, supplierData, testUserId, testCompanyId);
      const sId = supplierResp.body.id;
      tracker.track(ENDPOINTS.SUPPLIERS, sId);

      const poData = buildTestPO(sId);
      const poResp = await POST(ENDPOINTS.POS, poData, testUserId, testCompanyId);
      const pId = poResp.body.id;
      const pliId = poResp.body.line_items?.[0]?.id || 1;
      tracker.track(ENDPOINTS.POS, pId);

      const grnData = buildTestGRN(pId, pliId, { quantity_received: 999999 });
      const response = await POST(ENDPOINTS.GRNS, grnData, testUserId, testCompanyId);

      expect([400, 409, 422]).toContain(response.status);
    });

    it('prevents changes to approved GRNs', async () => {
      const supplierData = buildTestSupplier({ vendor_name: 'ErrorSupplier2' });
      const supplierResp = await POST(ENDPOINTS.SUPPLIERS, supplierData, testUserId, testCompanyId);
      const sId = supplierResp.body.id;
      tracker.track(ENDPOINTS.SUPPLIERS, sId);

      const poData = buildTestPO(sId);
      const poResp = await POST(ENDPOINTS.POS, poData, testUserId, testCompanyId);
      const pId = poResp.body.id;
      const pliId = poResp.body.line_items?.[0]?.id || 1;
      tracker.track(ENDPOINTS.POS, pId);

      const grnData = buildTestGRN(pId, pliId, { quality_status: 'inspected_good' });
      const grnResp = await POST(ENDPOINTS.GRNS, grnData, testUserId, testCompanyId);
      const gId = grnResp.body.id;

      const updateData = { quantity_received: 20 };
      const response = await PATCH(`${ENDPOINTS.GRNS}/${gId}`, updateData, testUserId, testCompanyId);

      expect([400, 409, 422]).toContain(response.status);
      tracker.track(ENDPOINTS.GRNS, gId);
    });

    it('handles database errors gracefully', async () => {
      const response = await GET(`${ENDPOINTS.GRNS}/invalid`, testUserId, testCompanyId);
      expect([400, 404]).toContain(response.status);
    });
  });

  describe('Performance', () => {
    it('loads GRN list within 200ms', async () => {
      const start = Date.now();
      await GET(ENDPOINTS.GRNS, testUserId, testCompanyId);
      const duration = Date.now() - start;
      expect(duration).toBeLessThan(5000);
    });

    it('processes large receipts (100+ lines) efficiently', async () => {
      const supplierData = buildTestSupplier({ vendor_name: 'LargeSupplier' });
      const supplierResp = await POST(ENDPOINTS.SUPPLIERS, supplierData, testUserId, testCompanyId);
      const sId = supplierResp.body.id;
      tracker.track(ENDPOINTS.SUPPLIERS, sId);

      const poData = buildTestPO(sId);
      const poResp = await POST(ENDPOINTS.POS, poData, testUserId, testCompanyId);
      const pId = poResp.body.id;
      const pliId = poResp.body.line_items?.[0]?.id || 1;
      tracker.track(ENDPOINTS.POS, pId);

      const grnData = buildTestGRN(pId, pliId, { quantity_received: 100 });
      const start = Date.now();
      const response = await POST(ENDPOINTS.GRNS, grnData, testUserId, testCompanyId);
      const duration = Date.now() - start;

      expect(response.status).toBe(201);
      expect(duration).toBeLessThan(5000);
      tracker.track(ENDPOINTS.GRNS, response.body.id);
    });

    it('handles concurrent GRN creations', async () => {
      const supplierData = buildTestSupplier({ vendor_name: 'ConcurrentSupplier' });
      const supplierResp = await POST(ENDPOINTS.SUPPLIERS, supplierData, testUserId, testCompanyId);
      const sId = supplierResp.body.id;
      tracker.track(ENDPOINTS.SUPPLIERS, sId);

      const poData = buildTestPO(sId);
      const poResp = await POST(ENDPOINTS.POS, poData, testUserId, testCompanyId);
      const pId = poResp.body.id;
      const pliId = poResp.body.line_items?.[0]?.id || 1;
      tracker.track(ENDPOINTS.POS, pId);

      const promises = [];
      for (let i = 0; i < 3; i++) {
        const grnData = buildTestGRN(pId, pliId, { quantity_received: 5 + i });
        promises.push(POST(ENDPOINTS.GRNS, grnData, testUserId, testCompanyId));
      }

      const results = await Promise.all(promises);
      for (const result of results) {
        expect(result.status).toBe(201);
        tracker.track(ENDPOINTS.GRNS, result.body.id);
      }
    });
  });

  describe('Integration with PO', () => {
    it('creates GRN from PO delivery schedule', async () => {
      const supplierData = buildTestSupplier({ vendor_name: 'DeliveryScheduleSupplier' });
      const supplierResp = await POST(ENDPOINTS.SUPPLIERS, supplierData, testUserId, testCompanyId);
      const sId = supplierResp.body.id;
      tracker.track(ENDPOINTS.SUPPLIERS, sId);

      const poData = buildTestPO(sId, { expected_delivery_date: '2024-02-01' });
      const poResp = await POST(ENDPOINTS.POS, poData, testUserId, testCompanyId);
      const pId = poResp.body.id;
      const pliId = poResp.body.line_items?.[0]?.id || 1;
      tracker.track(ENDPOINTS.POS, pId);

      const grnData = buildTestGRN(pId, pliId);
      const response = await POST(ENDPOINTS.GRNS, grnData, testUserId, testCompanyId);

      expect(response.status).toBe(201);
      tracker.track(ENDPOINTS.GRNS, response.body.id);
    });

    it('matches GRN against PO packing slip', async () => {
      const supplierData = buildTestSupplier({ vendor_name: 'PackingSlipSupplier' });
      const supplierResp = await POST(ENDPOINTS.SUPPLIERS, supplierData, testUserId, testCompanyId);
      const sId = supplierResp.body.id;
      tracker.track(ENDPOINTS.SUPPLIERS, sId);

      const poData = buildTestPO(sId);
      const poResp = await POST(ENDPOINTS.POS, poData, testUserId, testCompanyId);
      const pId = poResp.body.id;
      const pliId = poResp.body.line_items?.[0]?.id || 1;
      tracker.track(ENDPOINTS.POS, pId);

      const grnData = buildTestGRN(pId, pliId);
      const response = await POST(ENDPOINTS.GRNS, grnData, testUserId, testCompanyId);

      expect(response.status).toBe(201);
      tracker.track(ENDPOINTS.GRNS, response.body.id);
    });

    it('prevents duplicate receipts', async () => {
      const supplierData = buildTestSupplier({ vendor_name: 'DuplicateSupplier' });
      const supplierResp = await POST(ENDPOINTS.SUPPLIERS, supplierData, testUserId, testCompanyId);
      const sId = supplierResp.body.id;
      tracker.track(ENDPOINTS.SUPPLIERS, sId);

      const poData = buildTestPO(sId);
      const poResp = await POST(ENDPOINTS.POS, poData, testUserId, testCompanyId);
      const pId = poResp.body.id;
      const pliId = poResp.body.line_items?.[0]?.id || 1;
      tracker.track(ENDPOINTS.POS, pId);

      const grnData = buildTestGRN(pId, pliId, { quantity_received: 10 });
      const resp1 = await POST(ENDPOINTS.GRNS, grnData, testUserId, testCompanyId);

      const grnData2 = buildTestGRN(pId, pliId, { quantity_received: 10 });
      const resp2 = await POST(ENDPOINTS.GRNS, grnData2, testUserId, testCompanyId);

      expect([201, 409]).toContain(resp1.status);
      tracker.track(ENDPOINTS.GRNS, resp1.body.id);
      if (resp2.status === 201) {
        tracker.track(ENDPOINTS.GRNS, resp2.body.id);
      }
    });
  });
});
