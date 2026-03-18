/**
 * Purchase Orders E2E Tests (White-label Core Feature)
 * Tests for managing supplier purchase orders and goods received notes
 */
import { test, expect } from '@playwright/test';
import { loginUser } from '../helpers/auth';
import { generateTestPurchaseOrder, generateTestGoodsReceivedNote } from '../helpers/generators';

test.describe('Purchase Orders & GRN (Core)', () => {
  test.beforeEach(async ({ page }) => {
    await loginUser(page);
    await page.goto('http://localhost:3000/dashboard/purchase-orders?company_id=8');
    await page.waitForLoadState('networkidle');
  });

  test('should display purchase orders list', async ({ page }) => {
    await expect(page.locator('text=Purchase Order')).toBeVisible({ timeout: 5000 });
  });

  test('should create new purchase order', async ({ page }) => {
    const po = generateTestPurchaseOrder();
    
    await page.click('button:has-text("Create New PO")');
    await page.waitForLoadState('networkidle');
    
    // Select supplier
    await page.fill('input[name="supplier_id"]', '1');
    await page.waitForTimeout(500);
    
    // Fill PO reference
    await page.fill('input[name="po_reference"]', po.po_reference);
    
    // Fill line items
    await page.fill('input[name="line_items[0].name"]', po.line_items[0].name);
    await page.fill('input[name="line_items[0].quantity_ordered"]', po.line_items[0].quantity_ordered.toString());
    await page.fill('input[name="line_items[0].unit_rate"]', po.line_items[0].unit_rate.toString());
    
    // Submit
    await page.click('button:has-text("Create")');
    
    // Should show success
    await expect(page.locator('[role="alert"]')).toContainText('created', { timeout: 5000 });
  });
});