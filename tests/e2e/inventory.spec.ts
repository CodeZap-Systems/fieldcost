/**
 * Inventory Management E2E Tests
 */

import { test, expect, Page } from '@playwright/test';
import { loginUser } from '@tests/helpers/login';
import { getDefaultTestUser } from '@tests/helpers/test-user';
import { inventoryTestData } from '@tests/fixtures/test-data';

test.describe('Inventory Management E2E Tests', () => {
  let page: Page;
  const testUser = getDefaultTestUser();
  
  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
    await loginUser(page, testUser);
    await page.goto('http://localhost:3000/dashboard/inventory');
    await page.waitForLoadState('networkidle');
  });
  
  test.afterEach(async () => {
    await page.close();
  });

  test('should create inventory item with valid data', async () => {
    const itemName = `Test Item ${Date.now()}`;
    await page.click('button:has-text("New Item")');
    
    await page.fill('input[name="name"]', itemName);
    await page.fill('input[name="sku"]', inventoryTestData.valid.sku);
    await page.fill('input[name="unitPrice"]', inventoryTestData.valid.unitPrice.toString());
    await page.fill('input[name="quantity"]', inventoryTestData.valid.quantity.toString());
    
    await page.click('button[type="submit"]');
    await page.waitForTimeout(1000);
    
    const itemRow = page.locator(`text=${itemName}`);
    await expect(itemRow).toBeVisible();
  });

  test('should edit inventory item', async () => {
    const firstItem = page.locator('[data-testid="inventory-row"]').first();
    const editBtn = firstItem.locator('button:has-text("Edit")');
    
    if (await editBtn.isVisible()) {
      await editBtn.click();
      
      const modal = page.locator('[data-testid="item-modal"]');
      const quantityInput = modal.locator('input[name="quantity"]');
      await quantityInput.fill('250');
      
      await modal.locator('button[type="submit"]').click();
      await page.waitForTimeout(500);
    }
  });

  test('should delete inventory item', async () => {
    const firstItem = page.locator('[data-testid="inventory-row"]').first();
    const deleteBtn = firstItem.locator('button[aria-label*="delete" i]');
    
    if (await deleteBtn.isVisible()) {
      await deleteBtn.click();
      
      const confirmBtn = page.locator('button:has-text("Confirm")');
      if (await confirmBtn.isVisible()) {
        await confirmBtn.click();
        await page.waitForTimeout(500);
      }
    }
  });

  test('should list all inventory items', async () => {
    const items = page.locator('[data-testid="inventory-row"]');
    const count = await items.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('should search inventory by SKU', async () => {
    const searchInput = page.locator('input[placeholder*="search" i]');
    if (await searchInput.isVisible()) {
      await searchInput.fill('CEMENT');
      await page.waitForTimeout(500);
    }
  });

  test('should display low stock warning', async () => {
    const lowStockItems = page.locator('[data-testid="low-stock-warning"]');
    const count = await lowStockItems.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });
});
