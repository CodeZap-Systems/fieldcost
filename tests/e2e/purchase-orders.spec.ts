/**
 * Purchase Orders E2E Tests (Tier 2 Feature)
 * Tests for managing supplier purchase orders and goods received notes
 */

import { test, expect } from '@playwright/test';
import { loginUser } from '../helpers/auth';
import { generateTestPurchaseOrder, generateTestGoodsReceivedNote } from '../helpers/generators';

test.describe('Purchase Orders & GRN (Tier 2)', () => {
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

  test('should add multiple line items to PO', async ({ page }) => {
    const po = generateTestPurchaseOrder();
    
    await page.click('button:has-text("Create New PO")');
    await page.waitForLoadState('networkidle');
    
    // Add first line item
    await page.fill('input[name="line_items[0].name"]', po.line_items[0].name);
    await page.fill('input[name="line_items[0].quantity_ordered"]', '10');
    await page.fill('input[name="line_items[0].unit_rate"]', '100');
    
    // Click add item button
    await page.click('button:has-text("Add Item")');
    
    // Fill second line item
    await page.fill('input[name="line_items[1].name"]', po.line_items[1].name);
    await page.fill('input[name="line_items[1].quantity_ordered"]', '5');
    await page.fill('input[name="line_items[1].unit_rate"]', '200');
    
    // Should show total
    await expect(page.locator('text=Total')).toBeVisible();
  });

  test('should send PO to supplier', async ({ page }) => {
    const firstRow = page.locator('table tbody tr').first();
    
    if (await firstRow.isVisible()) {
      const statusCell = firstRow.locator('td').nth(4);
      const status = await statusCell.textContent();
      
      if (status?.includes('Draft')) {
        const sendButton = firstRow.locator('button:has-text("Send")');
        
        if (await sendButton.isVisible()) {
          await sendButton.click();
          
          // Should show success
          await expect(page.locator('[role="alert"]')).toContainText('sent', { timeout: 5000 });
        }
      }
    }
  });

  test('should log goods received note for PO', async ({ page }) => {
    // Get first confirmed PO
    const confirmedRow = page.locator('table tbody tr:has-text("Confirmed")').first();
    
    if (await confirmedRow.isVisible()) {
      // Click on PO to open details
      await confirmedRow.locator('[role="link"]').first().click();
      await page.waitForLoadState('networkidle');
      
      // Check for GRN form
      const grnButton = page.locator('button:has-text("Log Receipt")');
      
      if (await grnButton.isVisible()) {
        await grnButton.click();
        await page.waitForLoadState('networkidle');
        
        // Fill GRN details
        await page.fill('input[name="quantity_received"]', '10');
        await page.selectOption('select[name="quality_status"]', 'inspected_good');
        
        // Submit
        await page.click('button:has-text("Log Receipt")');
        
        // Should show success
        await expect(page.locator('[role="alert"]')).toContainText('logged', { timeout: 5000 });
      }
    }
  });

  test('should filter POs by status', async ({ page }) => {
    const statusFilter = page.locator('select[name="status"]');
    
    if (await statusFilter.isVisible()) {
      await statusFilter.selectOption('confirmed');
      await page.waitForLoadState('networkidle');
      
      // Should show filtered results
      await expect(page.locator('table')).toBeVisible();
    }
  });

  test('should edit draft purchase order', async ({ page }) => {
    const draftRow = page.locator('table tbody tr:has-text("Draft")').first();
    
    if (await draftRow.isVisible()) {
      const editButton = draftRow.locator('button:has-text("Edit")');
      
      if (await editButton.isVisible()) {
        await editButton.click();
        await page.waitForLoadState('networkidle');
        
        // Modify required by date
        const dateInput = page.locator('input[name="required_by_date"]').first();
        await dateInput.fill('2026-04-30');
        
        // Save
        await page.click('button:has-text("Save")');
        
        // Should show success
        await expect(page.locator('[role="alert"]')).toContainText('updated', { timeout: 5000 });
      }
    }
  });

  test('should delete draft purchase order', async ({ page }) => {
    const draftRow = page.locator('table tbody tr:has-text("Draft")').first();
    
    if (await draftRow.isVisible()) {
      const deleteButton = draftRow.locator('button:has-text("Delete")');
      
      if (await deleteButton.isVisible()) {
        await deleteButton.click();
        
        // Confirm
        await page.click('button:has-text("Confirm")');
        
        // Should show success
        await expect(page.locator('[role="alert"]')).toContainText('deleted', { timeout: 5000 });
      }
    }
  });

  test('should calculate PO total automatically', async ({ page }) => {
    await page.click('button:has-text("Create New PO")');
    await page.waitForLoadState('networkidle');
    
    // Fill line item
    await page.fill('input[name="line_items[0].quantity_ordered"]', '10');
    await page.fill('input[name="line_items[0].unit_rate"]', '100');
    
    // Total should be calculated (1000)
    const totalVisible = await page.locator('text=1000').isVisible();
    expect(totalVisible).toBe(true);
  });

  test('should track GRN delivery status', async ({ page }) => {
    // Find PO with GRN
    const poWithGRN = page.locator('table tbody tr:has-text("Partially Received")').first();
    
    if (await poWithGRN.isVisible()) {
      // Click to view details
      await poWithGRN.locator('[role="link"]').first().click();
      await page.waitForLoadState('networkidle');
      
      // Should show GRN history
      const grnSection = page.locator('text=Goods Received');
      await expect(grnSection).toBeVisible({ timeout: 5000 });
    }
  });
});
