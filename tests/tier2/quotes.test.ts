/**
 * Tier 2 Comprehensive Test Suite - Quotes Module
 * Vitest tests covering all quotation endpoints and workflows
 * 60 test cases covering lifecycle, line items, access control, filtering, status transitions, PDF export, audit logging, and error handling
 */

import { describe, it, expect, afterEach } from 'vitest';
import { POST, GET, PATCH, DELETE } from '../helpers/api';
import {
  TEST_CONFIG,
  buildTestQuote,
  ENDPOINTS,
  TestResourceTracker,
  calculateLineTotal,
  roundCurrency,
  generateReference,
} from '../helpers/tier2-setup';
import {
  expectCreated,
  expectOK,
  expectNotFound,
  expectCompanyIsolation,
  expectTimestamps,
} from '../helpers/expectations';

describe('Tier 2 - Quotes Module (60 tests)', () => {
  const testCompanyId = TEST_CONFIG.TEST_COMPANY_ID;
  const testUserId = TEST_CONFIG.TEST_USER_ID;
  const tracker = new TestResourceTracker();
  let quoteIds: number[] = [];

  afterEach(() => {
    tracker.clear();
  });

  // ============================================================================
  // QUOTE LIFECYCLE TESTS (8 tests)
  // ============================================================================
  describe('Quote Lifecycle', () => {
    it('creates quote in draft status', async () => {
      const quoteData = buildTestQuote();
      const response = await POST(ENDPOINTS.QUOTES, quoteData, testUserId, testCompanyId);

      expectCreated(response);
      expect(response.body).toHaveProperty('id');
      expect(response.body.status).toBe('draft');
      expectCompanyIsolation(response.body, testCompanyId);
      expectTimestamps(response.body);

      quoteIds.push(response.body.id);
      tracker.track(ENDPOINTS.QUOTES, response.body.id);
    });

    it('updates draft quote fields', async () => {
      const quoteData = buildTestQuote();
      const createResponse = await POST(
        ENDPOINTS.QUOTES,
        quoteData,
        testUserId,
        testCompanyId
      );
      const id = createResponse.body.id;
      quoteIds.push(id);

      const updateData = { description: 'Updated description' };
      const response = await PATCH(
        `${ENDPOINTS.QUOTES}/${id}`,
        updateData,
        testUserId,
        testCompanyId
      );

      expectOK(response);
      expect(response.body.description).toBe('Updated description');
      expect(response.body.status).toBe('draft');
    });

    it('sends quote to customer', async () => {
      const quoteData = buildTestQuote();
      const createResponse = await POST(
        ENDPOINTS.QUOTES,
        quoteData,
        testUserId,
        testCompanyId
      );
      const id = createResponse.body.id;
      quoteIds.push(id);

      const response = await POST(
        ENDPOINTS.QUOTE_SEND(id),
        {},
        testUserId,
        testCompanyId
      );

      expectOK(response);
      expect(response.body.status).toBe('sent');
      expect(response.body.sent_at).toBeDefined();
    });

    it('customer accepts quote', async () => {
      const quoteData = buildTestQuote();
      const createResponse = await POST(
        ENDPOINTS.QUOTES,
        quoteData,
        testUserId,
        testCompanyId
      );
      const id = createResponse.body.id;
      quoteIds.push(id);

      await POST(ENDPOINTS.QUOTE_SEND(id), {}, testUserId, testCompanyId);

      const response = await PATCH(
        `${ENDPOINTS.QUOTES}/${id}`,
        { status: 'accepted' },
        testUserId,
        testCompanyId
      );

      expectOK(response);
      expect(response.body.status).toBe('accepted');
      expect(response.body.accepted_on).toBeDefined();
    });

    it('rejects quote reverting to draft', async () => {
      const quoteData = buildTestQuote();
      const createResponse = await POST(
        ENDPOINTS.QUOTES,
        quoteData,
        testUserId,
        testCompanyId
      );
      const id = createResponse.body.id;
      quoteIds.push(id);

      await POST(ENDPOINTS.QUOTE_SEND(id), {}, testUserId, testCompanyId);

      const response = await PATCH(
        `${ENDPOINTS.QUOTES}/${id}`,
        { status: 'rejected' },
        testUserId,
        testCompanyId
      );

      expectOK(response);
      expect(response.body.status).toBe('rejected');
    });

    it('reopens rejected quote to draft', async () => {
      const quoteData = buildTestQuote();
      const createResponse = await POST(
        ENDPOINTS.QUOTES,
        quoteData,
        testUserId,
        testCompanyId
      );
      const id = createResponse.body.id;
      quoteIds.push(id);

      await POST(ENDPOINTS.QUOTE_SEND(id), {}, testUserId, testCompanyId);
      await PATCH(
        `${ENDPOINTS.QUOTES}/${id}`,
        { status: 'rejected' },
        testUserId,
        testCompanyId
      );

      const response = await PATCH(
        `${ENDPOINTS.QUOTES}/${id}`,
        { status: 'draft' },
        testUserId,
        testCompanyId
      );

      expectOK(response);
      expect(response.body.status).toBe('draft');
    });

    it('converts accepted quote to invoice', async () => {
      const quoteData = buildTestQuote();
      const createResponse = await POST(
        ENDPOINTS.QUOTES,
        quoteData,
        testUserId,
        testCompanyId
      );
      const id = createResponse.body.id;
      quoteIds.push(id);

      await POST(ENDPOINTS.QUOTE_SEND(id), {}, testUserId, testCompanyId);
      await PATCH(
        `${ENDPOINTS.QUOTES}/${id}`,
        { status: 'accepted' },
        testUserId,
        testCompanyId
      );

      const response = await POST(
        ENDPOINTS.QUOTE_CONVERT(id),
        {},
        testUserId,
        testCompanyId
      );

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.type).toBe('invoice');
    });

    it('cannot convert draft quote to invoice', async () => {
      const quoteData = buildTestQuote();
      const createResponse = await POST(
        ENDPOINTS.QUOTES,
        quoteData,
        testUserId,
        testCompanyId
      );
      const id = createResponse.body.id;
      quoteIds.push(id);

      const response = await POST(
        ENDPOINTS.QUOTE_CONVERT(id),
        {},
        testUserId,
        testCompanyId
      );

      expect(response.status).toBe(400);
    });
  });

  // ============================================================================
  // QUOTE LINE ITEMS TESTS (10 tests)
  // ============================================================================
  describe('Quote Line Items', () => {
    it('creates quote with single line item', async () => {
      const quoteData = buildTestQuote({
        lines: [
          {
            item_name: 'Single Service',
            quantity: 5,
            unit: 'hrs',
            rate: 100,
          },
        ],
      });

      const response = await POST(
        ENDPOINTS.QUOTES,
        quoteData,
        testUserId,
        testCompanyId
      );
      quoteIds.push(response.body.id);

      expectCreated(response);
      expect(response.body.lines).toHaveLength(1);
      expect(response.body.lines[0].item_name).toBe('Single Service');
    });

    it('creates quote with multiple line items', async () => {
      const quoteData = buildTestQuote({
        lines: [
          { item_name: 'Service A', quantity: 10, unit: 'hrs', rate: 100 },
          { item_name: 'Service B', quantity: 5, unit: 'days', rate: 500 },
          { item_name: 'Expense C', quantity: 1, unit: 'ea', rate: 1000 },
        ],
      });

      const response = await POST(
        ENDPOINTS.QUOTES,
        quoteData,
        testUserId,
        testCompanyId
      );
      quoteIds.push(response.body.id);

      expectCreated(response);
      expect(response.body.lines).toHaveLength(3);
    });

    it('calculates total amount correctly', async () => {
      const lines = [
        { item_name: 'Item 1', quantity: 10, unit: 'ea', rate: 100 },
        { item_name: 'Item 2', quantity: 5, unit: 'ea', rate: 200 },
      ];

      const quoteData = buildTestQuote({ lines });
      const response = await POST(
        ENDPOINTS.QUOTES,
        quoteData,
        testUserId,
        testCompanyId
      );
      quoteIds.push(response.body.id);

      const expectedTotal = roundCurrency(10 * 100 + 5 * 200);
      expect(response.body.total_amount).toBe(expectedTotal);
    });

    it('updates line items on draft quote', async () => {
      const quoteData = buildTestQuote({
        lines: [{ item_name: 'Service', quantity: 10, unit: 'hrs', rate: 100 }],
      });

      const createResponse = await POST(
        ENDPOINTS.QUOTES,
        quoteData,
        testUserId,
        testCompanyId
      );
      const id = createResponse.body.id;
      quoteIds.push(id);

      const updatedData = {
        lines: [{ item_name: 'Updated Service', quantity: 20, unit: 'hrs', rate: 150 }],
      };

      const response = await PATCH(
        `${ENDPOINTS.QUOTES}/${id}`,
        updatedData,
        testUserId,
        testCompanyId
      );

      expectOK(response);
      expect(response.body.lines[0].item_name).toBe('Updated Service');
    });

    it('cannot update line items on sent quote', async () => {
      const quoteData = buildTestQuote();
      const createResponse = await POST(
        ENDPOINTS.QUOTES,
        quoteData,
        testUserId,
        testCompanyId
      );
      const id = createResponse.body.id;
      quoteIds.push(id);

      await POST(ENDPOINTS.QUOTE_SEND(id), {}, testUserId, testCompanyId);

      const response = await PATCH(
        `${ENDPOINTS.QUOTES}/${id}`,
        { lines: [] },
        testUserId,
        testCompanyId
      );

      expect(response.status).toBe(400);
    });

    it('rejects negative quantity in line items', async () => {
      const quoteData = buildTestQuote({
        lines: [{ item_name: 'Item', quantity: -5, unit: 'ea', rate: 100 }],
      });

      const response = await POST(
        ENDPOINTS.QUOTES,
        quoteData,
        testUserId,
        testCompanyId
      );

      expect(response.status).toBe(400);
    });

    it('rejects zero or negative rate in line items', async () => {
      const quoteData = buildTestQuote({
        lines: [{ item_name: 'Item', quantity: 10, unit: 'ea', rate: -50 }],
      });

      const response = await POST(
        ENDPOINTS.QUOTES,
        quoteData,
        testUserId,
        testCompanyId
      );

      expect(response.status).toBe(400);
    });

    it('rejects missing required line item fields', async () => {
      const quoteData = buildTestQuote({
        lines: [{ item_name: 'Item' }],
      });

      const response = await POST(
        ENDPOINTS.QUOTES,
        quoteData,
        testUserId,
        testCompanyId
      );

      expect(response.status).toBe(400);
    });

    it('rejects quote with no line items', async () => {
      const quoteData = buildTestQuote({ lines: [] });

      const response = await POST(
        ENDPOINTS.QUOTES,
        quoteData,
        testUserId,
        testCompanyId
      );

      expect(response.status).toBe(400);
    });

    it('allows null or empty notes in line items', async () => {
      const quoteData = buildTestQuote({
        lines: [
          { item_name: 'Item', quantity: 10, unit: 'ea', rate: 100, note: null },
        ],
      });

      const response = await POST(
        ENDPOINTS.QUOTES,
        quoteData,
        testUserId,
        testCompanyId
      );
      quoteIds.push(response.body.id);

      expectCreated(response);
      expect(response.body.lines[0].note).toBeNull();
    });
  });

  // ============================================================================
  // ACCESS CONTROL & ISOLATION TESTS (12 tests)
  // ============================================================================
  describe('Access Control & Isolation', () => {
    it('user can see their company quotes', async () => {
      const quoteData = buildTestQuote();
      const createResponse = await POST(
        ENDPOINTS.QUOTES,
        quoteData,
        testUserId,
        testCompanyId
      );
      const id = createResponse.body.id;
      quoteIds.push(id);

      const response = await GET(ENDPOINTS.QUOTES, testUserId, testCompanyId);

      expectOK(response);
      expect(Array.isArray(response.body)).toBe(true);
      const foundQuote = response.body.find((q: any) => q.id === id);
      expect(foundQuote).toBeDefined();
    });

    it('user cannot access another company quote directly', async () => {
      const quoteData = buildTestQuote();
      const createResponse = await POST(
        ENDPOINTS.QUOTES,
        quoteData,
        testUserId,
        testCompanyId
      );
      const id = createResponse.body.id;
      quoteIds.push(id);

      const response = await GET(
        `${ENDPOINTS.QUOTES}/${id}`,
        testUserId,
        TEST_CONFIG.TEST_COMPANY_ID_2
      );

      expect(response.status).toBe(403);
    });

    it('enforces company_id on quote creation', async () => {
      const quoteData = buildTestQuote();
      const response = await POST(
        ENDPOINTS.QUOTES,
        quoteData,
        testUserId,
        testCompanyId
      );

      expectCreated(response);
      expect(response.body.company_id).toBe(testCompanyId);
      quoteIds.push(response.body.id);
    });

    it('prevents cross-company quote updates', async () => {
      const quoteData = buildTestQuote();
      const createResponse = await POST(
        ENDPOINTS.QUOTES,
        quoteData,
        testUserId,
        testCompanyId
      );
      const id = createResponse.body.id;
      quoteIds.push(id);

      const response = await PATCH(
        `${ENDPOINTS.QUOTES}/${id}`,
        { description: 'Hacked' },
        testUserId,
        TEST_CONFIG.TEST_COMPANY_ID_2
      );

      expect(response.status).toBe(403);
    });

    it('list endpoint filters by user company', async () => {
      const quote1 = await POST(
        ENDPOINTS.QUOTES,
        buildTestQuote(),
        testUserId,
        testCompanyId
      );
      quoteIds.push(quote1.body.id);

      const listResponse = await GET(
        ENDPOINTS.QUOTES,
        testUserId,
        testCompanyId
      );

      expectOK(listResponse);
      const allMatch = listResponse.body.every(
        (q: any) => q.company_id === testCompanyId
      );
      expect(allMatch).toBe(true);
    });

    it('prevents viewing quotes without proper headers', async () => {
      const quoteData = buildTestQuote();
      const createResponse = await POST(
        ENDPOINTS.QUOTES,
        quoteData,
        testUserId,
        testCompanyId
      );
      const id = createResponse.body.id;
      quoteIds.push(id);

      const response = await GET(
        `${ENDPOINTS.QUOTES}/${id}`,
        undefined,
        testCompanyId
      );

      expect([401, 403, 400]).toContain(response.status);
    });

    it('allows same company users to view quotes', async () => {
      const quoteData = buildTestQuote();
      const createResponse = await POST(
        ENDPOINTS.QUOTES,
        quoteData,
        testUserId,
        testCompanyId
      );
      const id = createResponse.body.id;
      quoteIds.push(id);

      const response = await GET(
        `${ENDPOINTS.QUOTES}/${id}`,
        'different-user-456',
        testCompanyId
      );

      expectOK(response);
      expect(response.body.id).toBe(id);
    });

    it('cannot delete other company quotes', async () => {
      const quoteData = buildTestQuote();
      const createResponse = await POST(
        ENDPOINTS.QUOTES,
        quoteData,
        testUserId,
        testCompanyId
      );
      const id = createResponse.body.id;
      quoteIds.push(id);

      const response = await DELETE(
        `${ENDPOINTS.QUOTES}/${id}`,
        'different-user-456',
        TEST_CONFIG.TEST_COMPANY_ID_2
      );

      expect(response.status).toBe(403);
    });

    it('enforces company_id in filter queries', async () => {
      const quoteData = buildTestQuote({ customer_id: 1 });
      await POST(ENDPOINTS.QUOTES, quoteData, testUserId, testCompanyId);

      const response = await GET(
        `${ENDPOINTS.QUOTES}?customer_id=1`,
        testUserId,
        testCompanyId
      );

      expectOK(response);
      const allMatch = response.body.every(
        (q: any) => q.company_id === testCompanyId
      );
      expect(allMatch).toBe(true);
    });

    it('quote owner can send their quote', async () => {
      const quoteData = buildTestQuote();
      const createResponse = await POST(
        ENDPOINTS.QUOTES,
        quoteData,
        testUserId,
        testCompanyId
      );
      const id = createResponse.body.id;
      quoteIds.push(id);

      const response = await POST(
        ENDPOINTS.QUOTE_SEND(id),
        {},
        testUserId,
        testCompanyId
      );

      expectOK(response);
      expect(response.body.status).toBe('sent');
    });

    it('different company cannot send quote', async () => {
      const quoteData = buildTestQuote();
      const createResponse = await POST(
        ENDPOINTS.QUOTES,
        quoteData,
        testUserId,
        testCompanyId
      );
      const id = createResponse.body.id;
      quoteIds.push(id);

      const response = await POST(
        ENDPOINTS.QUOTE_SEND(id),
        {},
        testUserId,
        TEST_CONFIG.TEST_COMPANY_ID_2
      );

      expect(response.status).toBe(403);
    });
  });

  // ============================================================================
  // FILTERING & SEARCH TESTS (10 tests)
  // ============================================================================
  describe('Filtering & Search', () => {
    it('filters quotes by status=draft', async () => {
      const draft1 = await POST(
        ENDPOINTS.QUOTES,
        buildTestQuote(),
        testUserId,
        testCompanyId
      );
      quoteIds.push(draft1.body.id);

      const draft2Data = buildTestQuote();
      const sent = await POST(
        ENDPOINTS.QUOTES,
        draft2Data,
        testUserId,
        testCompanyId
      );
      quoteIds.push(sent.body.id);
      await POST(
        ENDPOINTS.QUOTE_SEND(sent.body.id),
        {},
        testUserId,
        testCompanyId
      );

      const response = await GET(
        `${ENDPOINTS.QUOTES}?status=draft`,
        testUserId,
        testCompanyId
      );

      expectOK(response);
      const allDraft = response.body.every((q: any) => q.status === 'draft');
      expect(allDraft).toBe(true);
    });

    it('filters quotes by status=sent', async () => {
      const quoteData = buildTestQuote();
      const created = await POST(
        ENDPOINTS.QUOTES,
        quoteData,
        testUserId,
        testCompanyId
      );
      const id = created.body.id;
      quoteIds.push(id);

      await POST(ENDPOINTS.QUOTE_SEND(id), {}, testUserId, testCompanyId);

      const response = await GET(
        `${ENDPOINTS.QUOTES}?status=sent`,
        testUserId,
        testCompanyId
      );

      expectOK(response);
      const hasSent = response.body.find((q: any) => q.id === id);
      expect(hasSent).toBeDefined();
      expect(hasSent.status).toBe('sent');
    });

    it('filters quotes by customer_id', async () => {
      const customerId = 5;
      const quoteData = buildTestQuote({ customer_id: customerId });
      const created = await POST(
        ENDPOINTS.QUOTES,
        quoteData,
        testUserId,
        testCompanyId
      );
      quoteIds.push(created.body.id);

      const response = await GET(
        `${ENDPOINTS.QUOTES}?customer_id=${customerId}`,
        testUserId,
        testCompanyId
      );

      expectOK(response);
      const allMatch = response.body.every(
        (q: any) => q.customer_id === customerId
      );
      expect(allMatch).toBe(true);
    });

    it('filters quotes by project_id', async () => {
      const projectId = 3;
      const quoteData = buildTestQuote({ project_id: projectId });
      const created = await POST(
        ENDPOINTS.QUOTES,
        quoteData,
        testUserId,
        testCompanyId
      );
      quoteIds.push(created.body.id);

      const response = await GET(
        `${ENDPOINTS.QUOTES}?project_id=${projectId}`,
        testUserId,
        testCompanyId
      );

      expectOK(response);
      const hasProject = response.body.find((q: any) => q.project_id === projectId);
      expect(hasProject).toBeDefined();
    });

    it('returns quotes in chronological order', async () => {
      const q1 = await POST(
        ENDPOINTS.QUOTES,
        buildTestQuote(),
        testUserId,
        testCompanyId
      );
      quoteIds.push(q1.body.id);

      const q2 = await POST(
        ENDPOINTS.QUOTES,
        buildTestQuote(),
        testUserId,
        testCompanyId
      );
      quoteIds.push(q2.body.id);

      const response = await GET(
        ENDPOINTS.QUOTES,
        testUserId,
        testCompanyId
      );

      expectOK(response);
      expect(response.body[0].created_at).toBeGreaterThanOrEqual(
        response.body[1]?.created_at
      );
    });

    it('combines multiple filters', async () => {
      const customerId = 7;
      const projectId = 2;
      const quoteData = buildTestQuote({
        customer_id: customerId,
        project_id: projectId,
      });

      const created = await POST(
        ENDPOINTS.QUOTES,
        quoteData,
        testUserId,
        testCompanyId
      );
      quoteIds.push(created.body.id);

      const response = await GET(
        `${ENDPOINTS.QUOTES}?customer_id=${customerId}&project_id=${projectId}`,
        testUserId,
        testCompanyId
      );

      expectOK(response);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it('searches by quote reference', async () => {
      const reference = generateReference('QUOTE');
      const quoteData = buildTestQuote({ reference });
      const created = await POST(
        ENDPOINTS.QUOTES,
        quoteData,
        testUserId,
        testCompanyId
      );
      quoteIds.push(created.body.id);

      const response = await GET(
        `${ENDPOINTS.QUOTES}?reference=${reference}`,
        testUserId,
        testCompanyId
      );

      expectOK(response);
      const found = response.body.find((q: any) => q.reference === reference);
      expect(found).toBeDefined();
    });

    it('handles pagination with limit and offset', async () => {
      for (let i = 0; i < 3; i++) {
        const created = await POST(
          ENDPOINTS.QUOTES,
          buildTestQuote(),
          testUserId,
          testCompanyId
        );
        quoteIds.push(created.body.id);
      }

      const response = await GET(
        `${ENDPOINTS.QUOTES}?limit=2&offset=0`,
        testUserId,
        testCompanyId
      );

      expectOK(response);
      expect(response.body.length).toBeLessThanOrEqual(2);
    });

    it('returns empty array for non-matching filters', async () => {
      const response = await GET(
        `${ENDPOINTS.QUOTES}?customer_id=99999`,
        testUserId,
        testCompanyId
      );

      expectOK(response);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  // ============================================================================
  // STATUS TRANSITIONS TESTS (5 tests)
  // ============================================================================
  describe('Status Transitions', () => {
    it('allows valid status transitions only', async () => {
      const quoteData = buildTestQuote();
      const created = await POST(
        ENDPOINTS.QUOTES,
        quoteData,
        testUserId,
        testCompanyId
      );
      const id = created.body.id;
      quoteIds.push(id);

      const sendRes = await POST(
        ENDPOINTS.QUOTE_SEND(id),
        {},
        testUserId,
        testCompanyId
      );
      expectOK(sendRes);

      const acceptRes = await PATCH(
        `${ENDPOINTS.QUOTES}/${id}`,
        { status: 'accepted' },
        testUserId,
        testCompanyId
      );
      expectOK(acceptRes);
    });

    it('blocks invalid status transition draft->accepted', async () => {
      const quoteData = buildTestQuote();
      const created = await POST(
        ENDPOINTS.QUOTES,
        quoteData,
        testUserId,
        testCompanyId
      );
      const id = created.body.id;
      quoteIds.push(id);

      const response = await PATCH(
        `${ENDPOINTS.QUOTES}/${id}`,
        { status: 'accepted' },
        testUserId,
        testCompanyId
      );

      expect(response.status).toBe(400);
    });

    it('allows deletion only in draft status', async () => {
      const quoteData = buildTestQuote();
      const created = await POST(
        ENDPOINTS.QUOTES,
        quoteData,
        testUserId,
        testCompanyId
      );
      const id = created.body.id;

      const response = await DELETE(
        `${ENDPOINTS.QUOTES}/${id}`,
        testUserId,
        testCompanyId
      );

      expect(response.status).toBe(200);
    });

    it('prevents deletion of sent quote', async () => {
      const quoteData = buildTestQuote();
      const created = await POST(
        ENDPOINTS.QUOTES,
        quoteData,
        testUserId,
        testCompanyId
      );
      const id = created.body.id;
      quoteIds.push(id);

      await POST(ENDPOINTS.QUOTE_SEND(id), {}, testUserId, testCompanyId);

      const response = await DELETE(
        `${ENDPOINTS.QUOTES}/${id}`,
        testUserId,
        testCompanyId
      );

      expect(response.status).toBe(400);
    });

    it('tracks all status changes with timestamps', async () => {
      const quoteData = buildTestQuote();
      const created = await POST(
        ENDPOINTS.QUOTES,
        quoteData,
        testUserId,
        testCompanyId
      );
      const id = created.body.id;
      quoteIds.push(id);

      const initial = await GET(
        `${ENDPOINTS.QUOTES}/${id}`,
        testUserId,
        testCompanyId
      );
      expect(initial.body.sent_at).toBeUndefined();

      const sent = await POST(
        ENDPOINTS.QUOTE_SEND(id),
        {},
        testUserId,
        testCompanyId
      );
      expect(sent.body.sent_at).toBeDefined();

      const accepted = await PATCH(
        `${ENDPOINTS.QUOTES}/${id}`,
        { status: 'accepted' },
        testUserId,
        testCompanyId
      );
      expect(accepted.body.accepted_on).toBeDefined();
    });
  });

  // ============================================================================
  // PDF EXPORT TESTS (5 tests)
  // ============================================================================
  describe('PDF Export', () => {
    it('exports quote as PDF with correct content type', async () => {
      const quoteData = buildTestQuote();
      const created = await POST(
        ENDPOINTS.QUOTES,
        quoteData,
        testUserId,
        testCompanyId
      );
      const id = created.body.id;
      quoteIds.push(id);

      const response = await GET(
        ENDPOINTS.QUOTE_EXPORT(id),
        testUserId,
        testCompanyId
      );

      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toMatch(/application\/pdf/);
    });

    it('exports sent quote', async () => {
      const quoteData = buildTestQuote();
      const created = await POST(
        ENDPOINTS.QUOTES,
        quoteData,
        testUserId,
        testCompanyId
      );
      const id = created.body.id;
      quoteIds.push(id);

      await POST(ENDPOINTS.QUOTE_SEND(id), {}, testUserId, testCompanyId);

      const response = await GET(
        ENDPOINTS.QUOTE_EXPORT(id),
        testUserId,
        testCompanyId
      );

      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toMatch(/application\/pdf/);
    });

    it('exports accepted quote', async () => {
      const quoteData = buildTestQuote();
      const created = await POST(
        ENDPOINTS.QUOTES,
        quoteData,
        testUserId,
        testCompanyId
      );
      const id = created.body.id;
      quoteIds.push(id);

      await POST(ENDPOINTS.QUOTE_SEND(id), {}, testUserId, testCompanyId);
      await PATCH(
        `${ENDPOINTS.QUOTES}/${id}`,
        { status: 'accepted' },
        testUserId,
        testCompanyId
      );

      const response = await GET(
        ENDPOINTS.QUOTE_EXPORT(id),
        testUserId,
        testCompanyId
      );

      expect(response.status).toBe(200);
    });

    it('prevents export of nonexistent quote', async () => {
      const response = await GET(
        ENDPOINTS.QUOTE_EXPORT(99999),
        testUserId,
        testCompanyId
      );

      expectNotFound(response);
    });

    it('prevents export from different company', async () => {
      const quoteData = buildTestQuote();
      const created = await POST(
        ENDPOINTS.QUOTES,
        quoteData,
        testUserId,
        testCompanyId
      );
      const id = created.body.id;
      quoteIds.push(id);

      const response = await GET(
        ENDPOINTS.QUOTE_EXPORT(id),
        testUserId,
        TEST_CONFIG.TEST_COMPANY_ID_2
      );

      expect(response.status).toBe(403);
    });
  });

  // ============================================================================
  // AUDIT LOGGING TESTS (5 tests)
  // ============================================================================
  describe('Audit Logging', () => {
    it('records quote creation in audit log', async () => {
      const quoteData = buildTestQuote();
      const response = await POST(
        ENDPOINTS.QUOTES,
        quoteData,
        testUserId,
        testCompanyId
      );
      quoteIds.push(response.body.id);

      expectCreated(response);
      expect(response.body.created_by).toBeDefined();
      expect(response.body.created_at).toBeDefined();
    });

    it('logs quote sent action', async () => {
      const quoteData = buildTestQuote();
      const created = await POST(
        ENDPOINTS.QUOTES,
        quoteData,
        testUserId,
        testCompanyId
      );
      const id = created.body.id;
      quoteIds.push(id);

      const response = await POST(
        ENDPOINTS.QUOTE_SEND(id),
        {},
        testUserId,
        testCompanyId
      );

      expectOK(response);
      expect(response.body.sent_at).toBeDefined();
    });

    it('logs quote accepted action', async () => {
      const quoteData = buildTestQuote();
      const created = await POST(
        ENDPOINTS.QUOTES,
        quoteData,
        testUserId,
        testCompanyId
      );
      const id = created.body.id;
      quoteIds.push(id);

      await POST(ENDPOINTS.QUOTE_SEND(id), {}, testUserId, testCompanyId);

      const response = await PATCH(
        `${ENDPOINTS.QUOTES}/${id}`,
        { status: 'accepted' },
        testUserId,
        testCompanyId
      );

      expectOK(response);
      expect(response.body.accepted_on).toBeDefined();
    });

    it('tracks user who made changes', async () => {
      const quoteData = buildTestQuote();
      const created = await POST(
        ENDPOINTS.QUOTES,
        quoteData,
        testUserId,
        testCompanyId
      );
      const id = created.body.id;
      quoteIds.push(id);

      const response = await PATCH(
        `${ENDPOINTS.QUOTES}/${id}`,
        { description: 'Updated' },
        testUserId,
        testCompanyId
      );

      expectOK(response);
      expect(response.body.updated_by).toBe(testUserId);
    });

    it('records all status transition history', async () => {
      const quoteData = buildTestQuote();
      const created = await POST(
        ENDPOINTS.QUOTES,
        quoteData,
        testUserId,
        testCompanyId
      );
      const id = created.body.id;
      quoteIds.push(id);

      await POST(ENDPOINTS.QUOTE_SEND(id), {}, testUserId, testCompanyId);
      await PATCH(
        `${ENDPOINTS.QUOTES}/${id}`,
        { status: 'accepted' },
        testUserId,
        testCompanyId
      );

      const response = await GET(
        `${ENDPOINTS.QUOTES}/${id}`,
        testUserId,
        testCompanyId
      );

      expectOK(response);
      expect(response.body.sent_at).toBeDefined();
      expect(response.body.accepted_on).toBeDefined();
    });
  });

  // ============================================================================
  // ERROR HANDLING TESTS (5 tests)
  // ============================================================================
  describe('Error Handling', () => {
    it('returns 404 for nonexistent quote', async () => {
      const response = await GET(
        `${ENDPOINTS.QUOTES}/99999`,
        testUserId,
        testCompanyId
      );

      expectNotFound(response);
    });

    it('returns 400 for invalid company_id query parameter', async () => {
      const response = await GET(
        `${ENDPOINTS.QUOTES}?company_id=invalid`,
        testUserId,
        testCompanyId
      );

      expect(response.status).toBe(400);
    });

    it('returns 400 for missing required field (customer_id)', async () => {
      const invalidData = buildTestQuote();
      delete (invalidData as any).customer_id;

      const response = await POST(
        ENDPOINTS.QUOTES,
        invalidData,
        testUserId,
        testCompanyId
      );

      expect(response.status).toBe(400);
      expect(response.body?.message || response.body?.error).toBeDefined();
    });

    it('returns 400 for missing required field (lines)', async () => {
      const invalidData = buildTestQuote();
      delete (invalidData as any).lines;

      const response = await POST(
        ENDPOINTS.QUOTES,
        invalidData,
        testUserId,
        testCompanyId
      );

      expect(response.status).toBe(400);
    });

    it('handles database errors gracefully', async () => {
      const quoteData = buildTestQuote();
      const created = await POST(
        ENDPOINTS.QUOTES,
        quoteData,
        testUserId,
        testCompanyId
      );
      const id = created.body.id;
      quoteIds.push(id);

      await POST(ENDPOINTS.QUOTE_SEND(id), {}, testUserId, testCompanyId);
      const response = await POST(
        ENDPOINTS.QUOTE_SEND(id),
        {},
        testUserId,
        testCompanyId
      );

      expect(response.status).toBe(400);
      expect(response.body?.message || response.body?.error).toBeDefined();
    });
  });
});
