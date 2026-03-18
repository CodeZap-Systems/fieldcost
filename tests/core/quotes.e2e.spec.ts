/**
 * Quotes E2E Tests (White-label Core Feature)
 * Tests for creating, sending, and converting quotations
 */
import { test, expect } from '@playwright/test';
import { loginUser } from '../helpers/auth';
import { generateTestQuote } from '../helpers/generators';

test.describe('Quotations (Core)', () => {
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
});