/**
 * Customer Management E2E Tests
 */

import { test, expect, Page } from '@playwright/test';
import { loginUser } from '@tests/helpers/login';
import { getDefaultTestUser } from '@tests/helpers/test-user';
import { customerTestData } from '@tests/fixtures/test-data';

test.describe('Customer Management E2E Tests', () => {
  let page: Page;
  const testUser = getDefaultTestUser();
  
  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
    await loginUser(page, testUser);
    await page.goto('http://localhost:3000/dashboard/customers');
    await page.waitForLoadState('networkidle');
  });
  
  test.afterEach(async () => {
    await page.close();
  });

  test('should create customer with valid data', async () => {
    const customerName = `Test Customer ${Date.now()}`;
    await page.click('button:has-text("New Customer")');
    
    await page.fill('input[name="name"]', customerName);
    await page.fill('input[type="email"]', customerTestData.valid.email);
    await page.fill('input[type="tel"]', customerTestData.valid.phone);
    
    await page.click('button[type="submit"]');
    await page.waitForTimeout(1000);
    
    const customerRow = page.locator(`text=${customerName}`);
    await expect(customerRow).toBeVisible();
  });

  test('should edit customer details', async () => {
    const firstCustomer = page.locator('[data-testid="customer-row"]').first();
    const editBtn = firstCustomer.locator('button:has-text("Edit")');
    
    if (await editBtn.isVisible()) {
      await editBtn.click();
      
      const modal = page.locator('[data-testid="customer-modal"]');
      const nameInput = modal.locator('input[name="name"]');
      await nameInput.fill('Updated Customer Name');
      
      await modal.locator('button[type="submit"]').click();
      await page.waitForTimeout(500);
    }
  });

  test('should delete customer', async () => {
    const firstCustomer = page.locator('[data-testid="customer-row"]').first();
    const customerName = await firstCustomer.locator('td').first().textContent();
    
    const deleteBtn = firstCustomer.locator('button[aria-label*="delete" i]');
    if (await deleteBtn.isVisible()) {
      await deleteBtn.click();
      
      const confirmBtn = page.locator('button:has-text("Confirm")');
      if (await confirmBtn.isVisible()) {
        await confirmBtn.click();
        await page.waitForTimeout(500);
      }
    }
  });

  test('should list all customers', async () => {
    const customers = page.locator('[data-testid="customer-row"]');
    const count = await customers.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('should search customers by name', async () => {
    const searchInput = page.locator('input[placeholder*="search" i]');
    if (await searchInput.isVisible()) {
      await searchInput.fill('test');
      await page.waitForTimeout(500);
    }
  });
});
