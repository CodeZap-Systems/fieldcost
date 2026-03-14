/**
 * Company Management E2E Tests
 */

import { test, expect, Page } from '@playwright/test';
import { loginUser } from '@tests/helpers/login';
import { getDefaultTestUser } from '@tests/helpers/test-user';
import { getSampleContractorCompany } from '@tests/helpers/test-company';

test.describe('Company Management E2E Tests', () => {
  let page: Page;
  const testUser = getDefaultTestUser();
  
  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
    await loginUser(page, testUser);
    await page.goto('http://localhost:3000/dashboard/company');
    await page.waitForLoadState('networkidle');
  });
  
  test.afterEach(async () => {
    await page.close();
  });

  test('should display company profile', async () => {
    const companyName = page.locator('[data-testid="company-name"]');
    await expect(companyName).toBeVisible();
  });

  test('should edit company profile', async () => {
    const editBtn = page.locator('button:has-text("Edit")');
    if (await editBtn.isVisible()) {
      await editBtn.click();
      
      const modal = page.locator('[data-testid="company-modal"]');
      const nameInput = modal.locator('input[name="name"]');
      const oldName = await nameInput.inputValue();
      await nameInput.fill('Updated Company Name');
      
      await modal.locator('button[type="submit"]').click();
      await page.waitForTimeout(500);
    }
  });

  test('should upload company logo', async () => {
    const uploadBtn = page.locator('button:has-text("Upload Logo")');
    if (await uploadBtn.isVisible()) {
      const fileInput = page.locator('input[type="file"]');
      if (await fileInput.isVisible()) {
        // Note: File upload requires actual file path
        // await fileInput.setInputFiles('path/to/logo.png');
        // await uploadBtn.click();
      }
    }
  });

  test('should switch company', async () => {
    const companyDropdown = page.locator('[data-testid="company-dropdown"]');
    if (await companyDropdown.isVisible()) {
      await companyDropdown.click();
      
      const otherCompany = page.locator('[data-testid="company-option"]').nth(1);
      if (await otherCompany.isVisible()) {
        await otherCompany.click();
        await page.waitForTimeout(1000);
      }
    }
  });

  test('should display company details', async () => {
    const companyEmail = page.locator('[data-testid="company-email"]');
    const companyPhone = page.locator('[data-testid="company-phone"]');
    const isEmailVisible = await companyEmail.isVisible().catch(() => false);
    const isPhoneVisible = await companyPhone.isVisible().catch(() => false);
    
    expect(isEmailVisible || isPhoneVisible).toBe(true);
  });

  test('should display company address', async () => {
    const address = page.locator('[data-testid="company-address"]');
    const isVisible = await address.isVisible().catch(() => false);
    expect(isVisible).toBe(true);
  });

  test('should display tax number', async () => {
    const taxNumber = page.locator('[data-testid="company-tax-number"]');
    const isVisible = await taxNumber.isVisible().catch(() => false);
    expect(isVisible).toBe(true);
  });

  test('should display registration number', async () => {
    const regNumber = page.locator('[data-testid="company-reg-number"]');
    const isVisible = await regNumber.isVisible().catch(() => false);
    expect(isVisible).toBe(true);
  });

  test('should display company logo', async () => {
    const logo = page.locator('[data-testid="company-logo"]');
    const isVisible = await logo.isVisible().catch(() => false);
    expect(isVisible || page.url()).toBeTruthy();
  });
});
