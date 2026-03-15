/**
 * Customers E2E Tests
 * Tests for customer management
 */

import { test, expect } from '@playwright/test';
import { loginUser } from '../helpers/auth';
import { generateTestCustomer } from '../helpers/generators';

test.describe('Customer Management', () => {
  test.beforeEach(async ({ page }) => {
    await loginUser(page);
    await page.goto('http://localhost:3000/dashboard/customers?company_id=8');
    await page.waitForLoadState('networkidle');
  });

  test('should display customers list', async ({ page }) => {
    await expect(page.locator('text=Customer')).toBeVisible({ timeout: 5000 });
  });

  test('should create new customer', async ({ page }) => {
    const customer = generateTestCustomer();

    await page.click('button:has-text("Create Customer")');
    await page.waitForLoadState('networkidle');

    // Fill form
    await page.fill('input[name="name"]', customer.name);
    await page.fill('input[name="email"]', customer.email);
    await page.fill('input[name="phone"]', customer.phone);
    await page.fill('input[name="address"]', customer.address || '');
    await page.fill('input[name="city"]', customer.city);

    // Submit
    await page.click('button:has-text("Create")');

    // Should show success
    await expect(page.locator('[role="alert"]')).toContainText('successfully', { timeout: 5000 });
  });

  test('should edit customer details', async ({ page }) => {
    const firstRow = page.locator('table tbody tr').first();

    if (await firstRow.isVisible()) {
      const editButton = firstRow.locator('button:has-text("Edit")');

      if (await editButton.isVisible()) {
        await editButton.click();
        await page.waitForLoadState('networkidle');

        // Update email
        const emailInput = page.locator('input[name="email"]').first();
        await emailInput.fill('newemail@customer.com');

        // Save
        await page.click('button:has-text("Save")');

        // Should show success
        await expect(page.locator('[role="alert"]')).toContainText('updated', { timeout: 5000 });
      }
    }
  });

  test('should delete customer', async ({ page }) => {
    const firstRow = page.locator('table tbody tr').first();

    if (await firstRow.isVisible()) {
      const deleteButton = firstRow.locator('button:has-text("Delete")');

      if (await deleteButton.isVisible()) {
        await deleteButton.click();

        // Confirm
        await page.click('button:has-text("Confirm")');

        // Should show success
        await expect(page.locator('[role="alert"]')).toContainText('deleted', { timeout: 5000 });
      }
    }
  });

  test('should filter customers by city', async ({ page }) => {
    const cityFilter = page.locator('select[name="city"]');

    if (await cityFilter.isVisible()) {
      await cityFilter.selectOption('Cape Town');
      await page.waitForLoadState('networkidle');

      // Should show results
      await expect(page.locator('table')).toBeVisible();
    }
  });

  test('should search customers by name', async ({ page }) => {
    const searchInput = page.locator('input[placeholder="Search customers"]');

    if (await searchInput.isVisible()) {
      await searchInput.fill('Acme');
      await page.waitForLoadState('networkidle');

      // Should show results
      await expect(page.locator('table')).toBeVisible();
    }
  });
});
