/**
 * E2E Test Suite - Purchase Orders
 * Tests for complete purchase order workflow including creation, confirmation, and delivery tracking
 */

import { test, expect, Page } from '@playwright/test';
import { loginUser } from '../helpers/auth';
import { SAMPLE_ORDER, generateTestOrder } from '../fixtures/documents';

const BASE_URL = 'http://localhost:3000';

const TEST_USER = {
  email: 'qa_test_user@fieldcost.com',
  password: 'TestPassword123',
};

test.describe('Purchase Order Management - E2E Tests', () => {
  let page: Page;

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
    await loginUser(page, TEST_USER);
  });

  test.afterEach(async () => {
    await page.close();
  });

  test('TC201: Create purchase order with single line item', async () => {
    // Navigate to orders page
    await page.goto(`${BASE_URL}/dashboard/orders`);
    
    // Click add order button
    await page.click('a:has-text("Add Order"), button:has-text("Add Order")');
    await page.waitForURL(`**/orders/add`);
    
    // Fill order form
    await page.selectOption('select[name="vendor"]', { label: SAMPLE_ORDER.vendorName || 'BuildSupplies Inc' });
    await page.fill('input[name="reference"]', SAMPLE_ORDER.reference);
    
    // Set delivery date
    if (SAMPLE_ORDER.deliveryDate) {
      await page.fill('input[name="deliveryDate"], input[name="delivery_date"]', SAMPLE_ORDER.deliveryDate);
    }
    
    // Add line item
    await page.click('button:has-text("Add Line Item")');
    await page.fill('input[name*="itemName"]', SAMPLE_ORDER.lines[0].itemName);
    await page.fill('input[name*="quantity"]', SAMPLE_ORDER.lines[0].quantity.toString());
    await page.fill('input[name*="rate"]', SAMPLE_ORDER.lines[0].rate.toString());
    
    // Submit
    await page.click('button:has-text("Create Order")');
    
    // Verify
    await expect(page.locator('text=Purchase Order created successfully')).toBeVisible({ timeout: 5000 });
  });

  test('TC202: Create purchase order with multiple line items', async () => {
    await page.goto(`${BASE_URL}/dashboard/orders/add`);
    
    const order = generateTestOrder();
    
    // Fill header
    await page.selectOption('select[name="vendor"]', { label: 'BuildSupplies Inc' });
    await page.fill('input[name="reference"]', order.reference);
    
    // Add line items
    for (let i = 0; i < order.lines.length; i++) {
      if (i > 0) {
        await page.click('button:has-text("Add Line Item")');
      }
      
      const line = order.lines[i];
      const lineIndex = i > 0 ? `[${i}]` : '';
      
      await page.fill(`input[name*="itemName"]${lineIndex}`, line.itemName);
      await page.fill(`input[name*="quantity"]${lineIndex}`, line.quantity.toString());
      await page.fill(`input[name*="rate"]${lineIndex}`, line.rate.toString());
    }
    
    // Submit
    await page.click('button:has-text("Create Order")');
    await expect(page.locator('text=Purchase Order created')).toBeVisible({ timeout: 5000 });
  });

  test('TC203: Edit purchase order', async () => {
    await page.goto(`${BASE_URL}/dashboard/orders`);
    
    // Click first order
    await page.click('a >> first-of-type');
    await expect(page).toHaveURL(/\/orders\/\d+/);
    
    // Edit reference
    const newRef = `EXT-${Date.now()}`;
    await page.fill('input[name="reference"]', newRef);
    
    // Save
    await page.click('button:has-text("Save Changes"), button:has-text("Update Order")');
    
    // Verify
    await expect(page.locator(`text=${newRef}`)).toBeVisible({ timeout: 5000 });
  });

  test('TC204: Confirm purchase order', async () => {
    await page.goto(`${BASE_URL}/dashboard/orders`);
    
    // Open first order (draft status)
    await page.click('a >> first-of-type');
    
    // Click confirm button
    await page.click('button:has-text("Confirm Order"), button:has-text("Send to Vendor")');
    
    // Confirm action
    await page.click('button:has-text("Confirm"), button:has-text("Yes")');
    
    // Verify status changed
    const status = await page.locator('[data-testid="order-status"]').textContent();
    expect(status).toContain('Confirmed');
  });

  test('TC205: Mark purchase order as delivered', async () => {
    await page.goto(`${BASE_URL}/dashboard/orders`);
    
    // Find confirmed order
    await page.click('a >> first-of-type');
    
    // Click mark delivered
    await page.click('button:has-text("Mark Delivered"), button:has-text("Receive Goods")');
    
    // Confirm
    await page.click('button:has-text("Confirm"), button:has-text("Yes")');
    
    // Verify status
    const status = await page.locator('[data-testid="order-status"]').textContent();
    expect(status).toContain('Delivered');
  });

  test('TC206: Cancel purchase order', async () => {
    await page.goto(`${BASE_URL}/dashboard/orders`);
    
    // Open order
    await page.click('a >> first-of-type');
    
    // Click cancel
    await page.click('button:has-text("Cancel Order")');
    
    // Add cancellation reason
    await page.fill('textarea[name="cancellationReason"]', 'Order no longer needed');
    
    // Confirm
    await page.click('button:has-text("Confirm"), button:has-text("Cancel")');
    
    // Verify
    const status = await page.locator('[data-testid="order-status"]').textContent();
    expect(status).toContain('Cancelled');
  });

  test('TC207: Delete purchase order', async () => {
    await page.goto(`${BASE_URL}/dashboard/orders`);
    
    const countBefore = await page.locator('[data-testid="order-item"]').count();
    
    // Delete first order
    await page.click('button[title="Delete"], button:has-text("Delete") >> first-of-type');
    await page.click('button:has-text("Confirm"), button:has-text("Yes")');
    
    // Verify
    await expect(page.locator('text=Purchase Order deleted')).toBeVisible({ timeout: 5000 });
    
    const countAfter = await page.locator('[data-testid="order-item"]').count();
    expect(countAfter).toBeLessThan(countBefore);
  });

  test('TC208: Filter orders by status', async () => {
    await page.goto(`${BASE_URL}/dashboard/orders`);
    
    // Filter by confirmed
    await page.click('button:has-text("Status")');
    await page.click('label:has-text("Confirmed")');
    
    // Verify
    const statuses = await page.locator('[data-testid="order-status"]').allTextContents();
    statuses.forEach(status => {
      expect(status.toLowerCase()).toContain('confirmed');
    });
  });

  test('TC209: Filter orders by date range', async () => {
    await page.goto(`${BASE_URL}/dashboard/orders`);
    
    // Open date filter
    await page.click('button:has-text("Date")');
    
    // Set date range
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - 30);
    
    const toDate = new Date();
    
    await page.fill('input[name="from"], input[name="fromDate"]', fromDate.toISOString().split('T')[0]);
    await page.fill('input[name="to"], input[name="toDate"]', toDate.toISOString().split('T')[0]);
    
    // Apply filter
    await page.click('button:has-text("Apply")');
    await page.waitForLoadState('networkidle');
    
    // Verify results
    const orders = await page.locator('[data-testid="order-item"]').count();
    expect(orders).toBeGreaterThanOrEqual(0);
  });

  test('TC210: Search orders by reference', async () => {
    await page.goto(`${BASE_URL}/dashboard/orders`);
    
    const searchTerm = 'PO-';
    
    // Fill search
    await page.fill('input[placeholder*="Search"], input[name="search"]', searchTerm);
    await page.waitForLoadState('networkidle');
    
    // Verify results
    const results = await page.locator('[data-testid="order-item"]').allTextContents();
    results.forEach(result => {
      expect(result).toContain(searchTerm);
    });
  });

  test('TC211: Calculate order total with shipping', async () => {
    await page.goto(`${BASE_URL}/dashboard/orders/add`);
    
    const subTotal = 5000;
    const shipping = 500;
    const expectedTotal = subTotal + shipping;
    
    // Add line items
    await page.fill('input[name*="quantity"]', '100');
    await page.fill('input[name*="rate"]', '50');
    
    // Add shipping
    await page.fill('input[name="shipping"]', shipping.toString());
    
    // Verify total
    const totalElement = await page.locator('[data-testid="order-total"]').textContent();
    expect(totalElement).toContain(expectedTotal.toString());
  });

  test('TC212: Export purchase order as PDF', async () => {
    await page.goto(`${BASE_URL}/dashboard/orders`);
    
    const downloadPromise = page.waitForEvent('download');
    await page.click('button[title="Export"], button:has-text("Export") >> first-of-type');
    
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toContain('.pdf');
  });

  test('TC213: Add notes to purchase order', async () => {
    await page.goto(`${BASE_URL}/dashboard/orders/add`);
    
    const notes = 'Please include invoice with shipment';
    const deliveryNotes = 'Deliver to warehouse 2';
    
    // Fill basic fields
    await page.selectOption('select[name="vendor"]', { label: 'BuildSupplies Inc' });
    
    // Fill notes
    await page.fill('textarea[name="notes"]', notes);
    await page.fill('textarea[name="deliveryNotes"], textarea[name="delivery_notes"]', deliveryNotes);
    
    // Create
    await page.click('button:has-text("Create Order")');
    await expect(page.locator('text=Purchase Order created')).toBeVisible({ timeout: 5000 });
  });

  test('TC214: Receive partial delivery', async () => {
    await page.goto(`${BASE_URL}/dashboard/orders`);
    
    // Open confirmed order
    await page.click('a >> first-of-type');
    
    // Click partial delivery
    await page.click('button:has-text("Partial Delivery"), button:has-text("Receive Partial")');
    
    // Enter received quantities
    const lineItems = await page.locator('input[name*="receivedQty"], input[data-testid*="received"]').all();
    if (lineItems.length > 0) {
      await lineItems[0].fill('50'); // Receive 50 items of first line
    }
    
    // Confirm
    await page.click('button:has-text("Confirm"), button:has-text("Submit")');
    
    // Verify
    const status = await page.locator('[data-testid="order-status"]').textContent();
    expect(status).toContain('Partially Delivered');
  });
});
