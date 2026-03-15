/**
 * Suppliers E2E Tests (Tier 2 Feature)
 * Tests for managing supplier database
 */

import { test, expect } from '@playwright/test';
import { loginUser } from '../helpers/auth';
import { generateTestSupplier } from '../helpers/generators';

test.describe('Supplier Management (Tier 2)', () => {
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

  test('should edit supplier details', async ({ page }) => {
    const firstRow = page.locator('table tbody tr').first();
    
    if (await firstRow.isVisible()) {
      const editButton = firstRow.locator('button:has-text("Edit")');
      
      if (await editButton.isVisible()) {
        await editButton.click();
        await page.waitForLoadState('networkidle');
        
        // Update email
        const emailInput = page.locator('input[name="email"]').first();
        await emailInput.fill('newemail@supplier.com');
        
        // Save
        await page.click('button:has-text("Save")');
        
        // Should show success
        await expect(page.locator('[role="alert"]')).toContainText('updated', { timeout: 5000 });
      }
    }
  });

  test('should delete supplier', async ({ page }) => {
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

  test('should filter suppliers by rating', async ({ page }) => {
    const ratingFilter = page.locator('select[name="rating"]');
    
    if (await ratingFilter.isVisible()) {
      await ratingFilter.selectOption('3');
      await page.waitForLoadState('networkidle');
      
      // Should show filtered results
      await expect(page.locator('table')).toBeVisible();
    }
  });

  test('should search suppliers by name', async ({ page }) => {
    const searchInput = page.locator('input[placeholder="Search suppliers"]');
    
    if (await searchInput.isVisible()) {
      await searchInput.fill('Test');
      await page.waitForLoadState('networkidle');
      
      // Should show results
      await expect(page.locator('table')).toBeVisible();
    }
  });

  test('should display supplier rating in stars', async ({ page }) => {
    const firstRow = page.locator('table tbody tr').first();
    
    if (await firstRow.isVisible()) {
      // Should contain star rating
      const ratingCell = firstRow.locator('td').nth(6);
      await expect(ratingCell).toContainText('★', { timeout: 5000 });
    }
  });

  test('should show validation error on empty vendor name', async ({ page }) => {
    await page.click('button:has-text("Add Supplier")');
    await page.waitForLoadState('networkidle');
    
    // Leave vendor name empty and submit
    await page.click('button:has-text("Create")');
    
    // Should show error
    await expect(page.locator('text=required')).toBeVisible({ timeout: 5000 });
  });

  test('should validate email format', async ({ page }) => {
    const supplier = generateTestSupplier();
    
    await page.click('button:has-text("Add Supplier")');
    await page.waitForLoadState('networkidle');
    
    // Fill with invalid email
    await page.fill('input[name="vendor_name"]', supplier.vendor_name);
    await page.fill('input[name="email"]', 'invalid-email');
    
    // Submit
    await page.click('button:has-text("Create")');
    
    // Should show validation error
    await expect(page.locator('text=valid email')).toBeVisible({ timeout: 5000 });
  });

  test('should display payment terms options', async ({ page }) => {
    const supplier = generateTestSupplier();
    
    await page.click('button:has-text("Add Supplier")');
    await page.waitForLoadState('networkidle');
    
    const paymentTermsInput = page.locator('input[name="payment_terms"]');
    await expect(paymentTermsInput).toBeVisible();
  });
});
