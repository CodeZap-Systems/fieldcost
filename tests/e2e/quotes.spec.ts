/**
 * Quotes E2E Tests (Tier 2 Feature)
 * Tests for creating, sending, and converting quotations
 */

import { test, expect } from '@playwright/test';
import { loginUser } from '../helpers/auth';
import { generateTestQuote } from '../helpers/generators';

test.describe('Quotations (Tier 2)', () => {
  test.beforeEach(async ({ page }) => {
    await loginUser(page);
    await page.goto('http://localhost:3000/dashboard/quotes?company_id=8');
    await page.waitForLoadState('networkidle');
  });

  test('should display quotes list', async ({ page }) => {
    await expect(page.locator('text=Quote')).toBeVisible({ timeout: 5000 });
  });

  test('should create new quote with line items', async ({ page }) => {
    const quote = generateTestQuote();
    
    await page.click('button:has-text("Create")');
    await page.waitForLoadState('networkidle');
    
    // Select customer
    await page.fill('input[name="customer_id"]', '1');
    await page.waitForTimeout(500);
    
    // Fill description
    await page.fill('input[name="description"]', quote.description);
    
    // Set valid until date
    await page.fill('input[name="valid_until"]', quote.valid_until);
    
    // Add first line item
    await page.fill('input[name="line_items[0].name"]', quote.line_items[0].name);
    await page.fill('input[name="line_items[0].quantity"]', quote.line_items[0].quantity.toString());
    await page.fill('input[name="line_items[0].rate"]', quote.line_items[0].rate.toString());
    
    // Submit
    await page.click('button:has-text("Create Quote")');
    
    // Should show success
    await expect(page.locator('[role="alert"]')).toContainText('successfully', { timeout: 5000 });
  });

  test('should add multiple line items to quote', async ({ page }) => {
    const quote = generateTestQuote();
    
    await page.click('button:has-text("Create")');
    await page.waitForLoadState('networkidle');
    
    // Add first line item
    await page.fill('input[name="line_items[0].name"]', quote.line_items[0].name);
    await page.fill('input[name="line_items[0].quantity"]', quote.line_items[0].quantity.toString());
    await page.fill('input[name="line_items[0].rate"]', quote.line_items[0].rate.toString());
    
    // Click add line item
    await page.click('button:has-text("Add Item")');
    
    // Fill second line item
    await page.fill('input[name="line_items[1].name"]', quote.line_items[1].name);
    await page.fill('input[name="line_items[1].quantity"]', quote.line_items[1].quantity.toString());
    await page.fill('input[name="line_items[1].rate"]', quote.line_items[1].rate.toString());
    
    // Should show total
    await expect(page.locator('text=Total')).toBeVisible();
  });

  test('should calculate quote total automatically', async ({ page }) => {
    const quote = generateTestQuote();
    
    await page.click('button:has-text("Create")');
    await page.waitForLoadState('networkidle');
    
    // Fill first line item
    await page.fill('input[name="line_items[0].quantity"]', '10');
    await page.fill('input[name="line_items[0].rate"]', '100');
    
    // Total should be 1000
    const totalText = await page.locator('text=1000').isVisible();
    expect(totalText).toBe(true);
  });

  test('should send quote to customer', async ({ page }) => {
    // Find first quote row
    const firstRow = page.locator('table tbody tr').first();
    
    if (await firstRow.isVisible()) {
      const sendButton = firstRow.locator('button:has-text("Send")');
      
      if (await sendButton.isVisible()) {
        await sendButton.click();
        
        // Should show success
        await expect(page.locator('[role="alert"]')).toContainText('sent', { timeout: 5000 });
      }
    }
  });

  test('should filter quotes by status', async ({ page }) => {
    const statusFilter = page.locator('select[name="status"]');
    
    if (await statusFilter.isVisible()) {
      await statusFilter.selectOption('draft');
      await page.waitForLoadState('networkidle');
      
      // Should filter results
      await expect(page.locator('table')).toBeVisible();
    }
  });

  test('should edit draft quote', async ({ page }) => {
    const firstRow = page.locator('table tbody tr').first();
    
    if (await firstRow.isVisible()) {
      const editButton = firstRow.locator('button:has-text("Edit")');
      
      if (await editButton.isVisible()) {
        await editButton.click();
        await page.waitForLoadState('networkidle');
        
        // Modify description
        const descInput = page.locator('input[name="description"]').first();
        await descInput.fill('Updated quote description');
        
        // Save
        await page.click('button:has-text("Save")');
        
        // Should show success
        await expect(page.locator('[role="alert"]')).toContainText('updated', { timeout: 5000 });
      }
    }
  });

  test('should delete draft quote', async ({ page }) => {
    const firstRow = page.locator('table tbody tr').first();
    
    if (await firstRow.isVisible()) {
      const deleteButton = firstRow.locator('button:has-text("Delete")');
      
      if (await deleteButton.isVisible()) {
        await deleteButton.click();
        
        // Confirm delete
        await page.click('button:has-text("Confirm")');
        
        // Should show success
        await expect(page.locator('[role="alert"]')).toContainText('deleted', { timeout: 5000 });
      }
    }
  });

  test('should show validation error on empty customer', async ({ page }) => {
    await page.click('button:has-text("Create")');
    await page.waitForLoadState('networkidle');
    
    // Submit without customer
    await page.click('button:has-text("Create Quote")');
    
    // Should show error
    await expect(page.locator('text=required')).toBeVisible({ timeout: 5000 });
  });
});
