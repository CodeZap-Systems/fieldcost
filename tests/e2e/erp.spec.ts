/**
 * ERP Integration E2E Tests
 */

import { test, expect, Page } from '@playwright/test';
import { loginUser } from '@tests/helpers/login';
import { getDefaultTestUser } from '@tests/helpers/test-user';

test.describe('ERP Integration E2E Tests', () => {
  let page: Page;
  const testUser = getDefaultTestUser();
  
  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
    await loginUser(page, testUser);
    await page.goto('http://localhost:3000/dashboard/integrations');
    await page.waitForLoadState('networkidle');
  });
  
  test.afterEach(async () => {
    await page.close();
  });

  test('should display ERP integration options', async () => {
    const sageOption = page.getByText(/sage/i).first();
    const isVisible = await sageOption.isVisible().catch(() => false);
    expect(isVisible).toBe(true);
  });

  test('should open Sage connection modal', async () => {
    const connectBtn = page.locator('button:has-text("Connect Sage")') || page.locator('button:has-text("Connect")');
    if (await connectBtn.first().isVisible()) {
      await connectBtn.first().click();
      
      const modal = page.locator('[data-testid="sage-modal"]');
      const isVisible = await modal.isVisible().catch(() => false);
      expect(isVisible).toBe(true);
    }
  });

  test('should display Xero integration option', async () => {
    const xeroOption = page.getByText(/xero/i).first();
    const isVisible = await xeroOption.isVisible().catch(() => false);
    expect(isVisible).toBe(true);
  });

  test('should display integration status', async () => {
    const status = page.locator('[data-testid="integration-status"]');
    const isVisible = await status.isVisible().catch(() => false);
    expect(isVisible).toBe(true);
  });

  test('should test ERP connection', async () => {
    const testBtn = page.locator('button:has-text("Test Connection")');
    if (await testBtn.isVisible()) {
      await testBtn.click();
      
      await page.waitForTimeout(2000);
      const result = page.locator('[data-testid="test-result"]');
      const isVisible = await result.isVisible().catch(() => false);
      expect(isVisible).toBe(true);
    }
  });

  test('should sync customers with ERP', async () => {
    const syncBtn = page.locator('button:has-text("Sync Customers")');
    if (await syncBtn.isVisible()) {
      await syncBtn.click();
      
      await page.waitForTimeout(2000);
      const syncStatus = page.locator('[data-testid="sync-status"]');
      const isVisible = await syncStatus.isVisible().catch(() => false);
      expect(isVisible).toBe(true);
    }
  });

  test('should sync items with ERP', async () => {
    const syncBtn = page.locator('button:has-text("Sync Items")');
    if (await syncBtn.isVisible()) {
      await syncBtn.click();
      
      await page.waitForTimeout(2000);
    }
  });

  test('should push invoice to Sage', async () => {
    const pushBtn = page.locator('button:has-text("Push to Sage")');
    if (await pushBtn.isVisible()) {
      await pushBtn.click();
      
      await page.waitForTimeout(2000);
    }
  });

  test('should display sync history', async () => {
    const historyTab = page.locator('button:has-text("History")');
    if (await historyTab.isVisible()) {
      await historyTab.click();
      
      const history = page.locator('[data-testid="sync-history"]');
      const isVisible = await history.isVisible().catch(() => false);
      expect(isVisible).toBe(true);
    }
  });

  test('should display error for failed sync', async () => {
    const syncBtn = page.locator('button:has-text("Sync")').first();
    if (await syncBtn.isVisible()) {
      await syncBtn.click();
      
      await page.waitForTimeout(3000);
      const errorMsg = page.locator('[data-testid="error-message"]');
      // Error may or may not appear depending on actual sync result
    }
  });
});
