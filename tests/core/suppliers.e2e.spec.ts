/**
 * Suppliers E2E Tests (White-label Core Feature)
 * Tests for managing supplier database
 */
import { test, expect } from '@playwright/test';
import { loginUser } from '../helpers/auth';
import { generateTestSupplier } from '../helpers/generators';

test.describe('Supplier Management (Core)', () => {
  test.beforeEach(async ({ page }) => {
    await loginUser(page);
    await page.goto('http://localhost:3000/dashboard/suppliers?company_id=8');
    await page.waitForLoadState('networkidle');
  });

  test('should display suppliers list', async ({ page }) => {
    await expect(page.locator('text=Supplier')).toBeVisible({ timeout: 5000 });
  });

  test('should create new supplier', async ({ page }) => {
    const supplier = generateTestSupplier();
    
    await page.click('button:has-text("Add Supplier")');
    await page.waitForLoadState('networkidle');
    
    // Fill form
    await page.fill('input[name="vendor_name"]', supplier.vendor_name);
    await page.fill('input[name="contact_name"]', supplier.contact_name);
    await page.fill('input[name="email"]', supplier.email);
    await page.fill('input[name="phone"]', supplier.phone);
    await page.fill('input[name="address_line1"]', supplier.address_line1);
    await page.fill('input[name="city"]', supplier.city);
    await page.fill('input[name="payment_terms"]', supplier.payment_terms);
    
    // Submit
    await page.click('button:has-text("Create")');
    
    // Should show success
    await expect(page.locator('[role="alert"]')).toContainText('added', { timeout: 5000 });
  });
});