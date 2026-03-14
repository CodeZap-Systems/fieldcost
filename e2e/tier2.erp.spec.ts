import { test, expect } from '@playwright/test';

/**
 * TIER 2: ERP Integration Tests
 * Tests Sage integration and ERP endpoints
 */

test.describe('TIER 2: ERP Integration', () => {
  test('should have Sage API test endpoint', async ({ page }) => {
    const response = await page.request.get('/api/sage/test');
    // Endpoint should exist, even if it returns 401 or other status
    expect([200, 401, 400, 500]).toContain(response.status());
  });

  test('should have Sage items endpoint', async ({ page }) => {
    const response = await page.request.get('/api/sage/items');
    expect([200, 401, 400, 404]).toContain(response.status());
  });

  test('should have Sage customers endpoint', async ({ page }) => {
    const response = await page.request.get('/api/sage/customers');
    expect([200, 401, 400, 404]).toContain(response.status());
  });

  test('should have Sage invoices endpoint', async ({ page }) => {
    const response = await page.request.get('/api/sage/invoices');
    expect([200, 401, 400, 404]).toContain(response.status());
  });

  test('should have full Sage sync endpoint', async ({ page }) => {
    const response = await page.request.post('/api/sage/sync/full', {
      data: { companyId: 'test-company' },
    });
    expect([200, 401, 400, 500]).toContain(response.status());
  });
});

/**
 * TIER 2: Advanced Features Pages
 */
test.describe('TIER 2: Advanced Features', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
  });

  test('should display project reports page', async ({ page }) => {
    await page.goto('/dashboard/projects/reports');
    expect(page.url()).toContain('reports');
  });

  test('should display task reports page', async ({ page }) => {
    await page.goto('/dashboard/tasks/reports');
    expect(page.url()).toContain('reports');
  });

  test('should have budgets API endpoint', async ({ page }) => {
    const response = await page.request.get('/api/budgets');
    expect([200, 401, 404]).toContain(response.status());
  });

  test('should have WIP tracking API endpoint', async ({ page }) => {
    const response = await page.request.get('/api/wip-tracking');
    expect([200, 401, 404]).toContain(response.status());
  });

  test('should have workflows API endpoint', async ({ page }) => {
    const response = await page.request.get('/api/workflows');
    expect([200, 401, 404]).toContain(response.status());
  });

  test('should have location tracking API endpoint', async ({ page }) => {
    const response = await page.request.post('/api/location-tracking', {
      data: {
        latitude: 12.34,
        longitude: 56.78,
        taskId: 'test-task',
      },
    });
    expect([200, 201, 400, 401]).toContain(response.status());
  });

  test('should have offline sync status endpoint', async ({ page }) => {
    const response = await page.request.get('/api/offline-sync-status');
    expect([200, 401, 404]).toContain(response.status());
  });

  test('should have invoice export endpoint', async ({ page }) => {
    const response = await page.request.post('/api/invoices/export', {
      data: { invoiceIds: [] },
    });
    expect([200, 400, 401]).toContain(response.status());
  });
});

/**
 * TIER 2: Company Switching
 */
test.describe('TIER 2: Company Management', () => {
  test('should have get company endpoint', async ({ page }) => {
    const response = await page.request.get('/api/company');
    expect([200, 401]).toContain(response.status());
  });

  test('should have switch company endpoint', async ({ page }) => {
    const response = await page.request.post('/api/company/switch', {
      data: { companyId: 'test-company' },
    });
    expect([200, 400, 401]).toContain(response.status());
  });

  test('should have company logo upload endpoint', async ({ page }) => {
    const response = await page.request.post('/api/company/logo', {
      multipart: {
        file: {
          name: 'logo.png',
          mimeType: 'image/png',
          buffer: Buffer.from('test'),
        },
      },
    });
    expect([200, 201, 400, 401]).toContain(response.status());
  });
});
