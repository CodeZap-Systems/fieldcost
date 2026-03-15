/**
 * Common Test Expectations & Assertions
 * Reusable assertion patterns for Tier 2 API tests
 */

import { expect } from 'vitest';
import type { ApiResponse } from './api';

/**
 * Helper: Expect successful status code (2xx)
 */
export function expectSuccess(response: any) {
  expect(response.status).toBeGreaterThanOrEqual(200);
  expect(response.status).toBeLessThan(300);
}

/**
 * Helper: Expect specific status code
 */
export function expectStatus(response: any, expectedStatus: number) {
  expect(response.status).toBe(expectedStatus);
}

/**
 * Helper: Expect created response (201)
 */
export function expectCreated(response: any) {
  expect(response.status).toBe(201);
  expect(response.body).toBeDefined();
}

/**
 * Helper: Expect OK response (200)
 */
export function expectOK(response: any) {
  expect(response.status).toBe(200);
  expect(response.body).toBeDefined();
}

/**
 * Helper: Expect server error (5xx)
 */
export function expectServerError(response: any) {
  expect(response.status).toBeGreaterThanOrEqual(500);
  expect(response.status).toBeLessThan(600);
}

/**
 * Helper: Expect client error (4xx)
 */
export function expectClientError(response: any) {
  expect(response.status).toBeGreaterThanOrEqual(400);
  expect(response.status).toBeLessThan(500);
}

/**
 * Helper: Expect not found (404)
 */
export function expectNotFound(response: any) {
  expect(response.status).toBe(404);
}

/**
 * Helper: Expect unauthorized (401)
 */
export function expectUnauthorized(response: any) {
  expect(response.status).toBe(401);
}

/**
 * Helper: Expect forbidden (403)
 */
export function expectForbidden(response: any) {
  expect(response.status).toBe(403);
}

/**
 * Helper: Expect validation error (400)
 */
export function expectValidationError(response: any) {
  expect(response.status).toBe(400);
  expect(response.body?.errors || response.body?.message).toBeDefined();
}

/**
 * Helper: Expect response to have required object properties
 */
export function expectHasProperties(data: any, properties: string[]) {
  for (const prop of properties) {
    expect(data).toHaveProperty(prop);
  }
}

/**
 * Helper: Expect array response with pagination
 */
export function expectPaginatedArray(response: any, minItems = 0) {
  expect(Array.isArray(response.body) || response.body?.data).toBeDefined();
  const items = Array.isArray(response.body) ? response.body : response.body?.data;
  expect(items.length).toBeGreaterThanOrEqual(minItems);
}

/**
 * Helper: Expect ID field to be numeric
 */
export function expectNumericId(id: any) {
  expect(typeof id).toBe('number');
  expect(id).toBeGreaterThan(0);
}

/**
 * Helper: Expect ISO date string
 */
export function expectISODate(dateString: any) {
  expect(dateString).toBeDefined();
  expect(typeof dateString).toBe('string');
  // Should be valid ISO date
  expect(new Date(dateString).toISOString()).toBeDefined();
}

/**
 * Helper: Expect status field in response
 */
export function expectStatusField(data: any, expectedStatus: string) {
  expect(data).toHaveProperty('status');
  expect(data.status).toBe(expectedStatus);
}

/**
 * Helper: Expect company_id isolation
 */
export function expectCompanyIsolation(data: any, expectedCompanyId: number) {
  expect(data).toHaveProperty('company_id');
  expect(data.company_id).toBe(expectedCompanyId);
}

/**
 * Helper: Expect timestamps (created_at, updated_at)
 */
export function expectTimestamps(data: any) {
  expect(data).toHaveProperty('created_at');
  expect(data).toHaveProperty('updated_at');
  expectISODate(data.created_at);
  expectISODate(data.updated_at);
}

/**
 * Helper: Expect amount to be valid currency
 */
export function expectValidAmount(amount: any) {
  expect(typeof amount).toBe('number');
  expect(amount).toBeGreaterThanOrEqual(0);
  // Check if it's a valid currency (max 2 decimal places)
  expect(amount * 100).toBe(Math.round(amount * 100));
}

/**
 * Helper: Expect quote structure
 */
export function expectQuoteStructure(quote: any) {
  expectHasProperties(quote, [
    'id',
    'customer_id',
    'company_id',
    'status',
    'description',
    'valid_until',
    'created_at',
  ]);
  expect(['draft', 'sent', 'accepted', 'rejected']).toContain(quote.status);
}

/**
 * Helper: Expect purchase order structure
 */
export function expectPurchaseOrderStructure(po: any) {
  expectHasProperties(po, [
    'id',
    'supplier_id',
    'company_id',
    'status',
    'po_reference',
    'required_by_date',
    'created_at',
  ]);
  expect(['draft', 'sent', 'confirmed', 'partially_received', 'fully_received']).toContain(
    po.status
  );
}

/**
 * Helper: Expect supplier structure
 */
export function expectSupplierStructure(supplier: any) {
  expectHasProperties(supplier, [
    'id',
    'vendor_name',
    'email',
    'phone',
    'company_id',
    'created_at',
  ]);
}

/**
 * Helper: Expect GRN structure
 */
export function expectGRNStructure(grn: any) {
  expectHasProperties(grn, [
    'id',
    'po_id',
    'company_id',
    'quality_status',
    'received_by',
    'received_at_location',
    'created_at',
  ]);
  expect(['inspected_good', 'inspected_defective', 'partial_defect']).toContain(
    grn.quality_status
  );
}

/**
 * Helper: Expect line item structure
 */
export function expectLineItemStructure(lineItem: any) {
  expectHasProperties(lineItem, ['id', 'quantity', 'unit', 'rate']);
  expect(typeof lineItem.quantity).toBe('number');
  expectValidAmount(lineItem.rate);
}

/**
 * Helper: Assert state transition is valid
 */
export function expectValidTransition(
  currentStatus: string,
  newStatus: string,
  allowedTransitions: Record<string, string[]>
) {
  const allowed = allowedTransitions[currentStatus] || [];
  expect(allowed).toContain(newStatus);
}
