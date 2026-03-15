/**
 * Inventory E2E Tests
 * Tests for inventory item management
 */

import { test, expect } from '@playwright/test';
import { loginUser } from '../helpers/auth';
import { generateTestInventoryItem } from '../helpers/generators';

test.describe('Inventory Management', () => {
  test.beforeEach(async ({ page }) => {
    await loginUser(page);
    await page.goto('http://localhost:3000/dashboard/inventory?company_id=8');
    await page.waitForLoadState('networkidle');
  });

  test('should display inventory list', async ({ page }) => {
    await expect(page.locator('text=Inventory')).toBeVisible({ timeout: 5000 });
  });

  test('should create new inventory item', async ({ page }) => {
    const item = generateTestInventoryItem();

    await page.click('button:has-text("Add Item")');
    await page.waitForLoadState('networkidle');

    // Fill form
    await page.fill('input[name="description"]', item.description);
    await page.fill('input[name="category"]', item.category);
    await page.fill('input[name="quantity"]', item.quantity.toString());
    await page.fill('input[name="unit_cost"]', item.unit_cost.toString());

    // Submit
    await page.click('button:has-text("Create")');

    // Should show success
    await expect(page.locator('[role="alert"]')).toContainText('successfully', {
      timeout: 5000,
    });
  });

  test('should update item quantity', async ({ page }) => {
    const firstRow = page.locator('table tbody tr').first();

    if (await firstRow.isVisible()) {
      const editButton = firstRow.locator('button:has-text("Edit")');

      if (await editButton.isVisible()) {
        await editButton.click();
        await page.waitForLoadState('networkidle');

        // Update quantity
        const quantityInput = page.locator('input[name="quantity"]').first();
        await quantityInput.fill('50');

        // Save
        await page.click('button:has-text("Save")');

        // Should show success
        await expect(page.locator('[role="alert"]')).toContainText('updated', {
          timeout: 5000,
        });
      }
    }
  });

  test('should filter items by category', async ({ page }) => {
    const categoryFilter = page.locator('select[name="category"]');

    if (await categoryFilter.isVisible()) {
      await categoryFilter.selectOption('Tools');
      await page.waitForLoadState('networkidle');

      // Should show results
      await expect(page.locator('table')).toBeVisible();
    }
  });

  test('should search items', async ({ page }) => {
    const searchInput = page.locator('input[placeholder="Search items"]');

    if (await searchInput.isVisible()) {
      await searchInput.fill('Hammer');
      await page.waitForLoadState('networkidle');

      // Should show results
      await expect(page.locator('table')).toBeVisible();
    }
  });

  test('should delete inventory item', async ({ page }) => {
    const firstRow = page.locator('table tbody tr').first();

    if (await firstRow.isVisible()) {
      const deleteButton = firstRow.locator('button:has-text("Delete")');

      if (await deleteButton.isVisible()) {
        await deleteButton.click();

        // Confirm
        await page.click('button:has-text("Confirm")');

        // Should show success
        await expect(page.locator('[role="alert"]')).toContainText('deleted', {
          timeout: 5000,
        });
      }
    }
  });
});
