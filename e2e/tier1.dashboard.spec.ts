import { test, expect } from '@playwright/test';

/**
 * TIER 1: Core Dashboard & CRUD Tests
 * Tests basic dashboard access and core feature pages
 */

test.describe('TIER 1: Dashboard & Pages', () => {
  // Setup: Visit dashboard
  test.beforeEach(async ({ page }) => {
    // Navigate to dashboard (assuming auth is bypassed in test mode)
    await page.goto('/dashboard');
  });

  test('should display dashboard home page', async ({ page }) => {
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    // Dashboard should be visible
    expect(page.url()).toContain('dashboard');
  });

  test('should display projects list page', async ({ page }) => {
    await page.goto('/dashboard/projects');
    await expect(page.getByRole('heading', { name: /projects/i })).toBeVisible({ timeout: 5000 });
  });

  test('should display tasks list page', async ({ page }) => {
    await page.goto('/dashboard/tasks');
    await expect(page.getByRole('heading', { name: /tasks/i })).toBeVisible({ timeout: 5000 });
  });

  test('should display invoices list page', async ({ page }) => {
    await page.goto('/dashboard/invoices');
    await expect(page.getByRole('heading', { name: /invoices/i })).toBeVisible({ timeout: 5000 });
  });

  test('should display items/inventory list page', async ({ page }) => {
    await page.goto('/dashboard/items');
    await expect(page.getByRole('heading', { name: /inventory/i })).toBeVisible({ timeout: 5000 });
  });

  test('should display customers list page', async ({ page }) => {
    await page.goto('/dashboard/customers');
    await expect(page.getByRole('heading', { name: /customers/i })).toBeVisible({ timeout: 5000 });
  });

  test('should display project add/create page', async ({ page }) => {
    await page.goto('/dashboard/projects/add');
    expect(page.url()).toContain('projects/add');
  });

  test('should display task add/create page', async ({ page }) => {
    await page.goto('/dashboard/tasks/add');
    expect(page.url()).toContain('tasks/add');
  });

  test('should display invoice add/create page', async ({ page }) => {
    await page.goto('/dashboard/invoices/add');
    expect(page.url()).toContain('invoices/add');
  });

  test('should navigate to setup company page', async ({ page }) => {
    await page.goto('/dashboard/setup-company');
    expect(page.url()).toContain('setup-company');
  });

  test('should navigate to WIP demo page', async ({ page }) => {
    await page.goto('/dashboard/wip-push-demo');
    expect(page.url()).toContain('wip-push-demo');
  });
});

/**
 * TIER 1: API Health Tests
 */
test.describe('TIER 1: API Health', () => {
  test('should respond to health check endpoint', async ({ page }) => {
    const response = await page.request.get('/api/health');
    expect(response.status()).toBe(200);
  });

  test('should return JSON from health endpoint', async ({ page }) => {
    const response = await page.request.get('/api/health');
    const contentType = response.headers()['content-type'];
    expect(contentType).toContain('application/json');
  });
});
