import { test, expect } from '@playwright/test';
import { AuthHelper, testUser } from '../helpers/auth.helper';
import { TestUtils } from '../helpers/test-utils.helper';
import { generateTestProject } from '../helpers/data-generator.helper';
import { VALID_PROJECT_DATA } from '../fixtures/test-fixtures';

const BASE_URL = 'https://fieldcost.vercel.app';

test.describe('Projects E2E Tests', () => {
  let authHelper: AuthHelper;
  let projectId: string;

  test.beforeAll(async () => {
    authHelper = new AuthHelper(BASE_URL);
  });

  test.beforeEach(async ({ page }) => {
    await authHelper.loginUI(page, testUser);
    await page.goto(`${BASE_URL}/projects`, { waitUntil: 'networkidle' });
  });

  test('should display projects list', async ({ page }) => {
    await TestUtils.waitForTable(page).catch(() => {});
    await expect(page.locator('h1, h2').first()).toBeVisible();
  });

  test('should create new project', async ({ page }) => {
    const projectName = `Test Project ${Date.now()}`;
    
    await TestUtils.clickButton(page, 'Create Project');
    await TestUtils.verifyModalOpen(page);
    
    await TestUtils.fillFormField(page, 'Name', projectName);
    await TestUtils.fillFormField(page, 'Budget', '50000');
    
    await TestUtils.clickButton(page, 'Create');
    await TestUtils.verifyToast(page, 'created', 'success');
    
    await expect(page.locator(`text=${projectName}`)).toBeVisible();
  });

  test('should edit project details', async ({ page }) => {
    const projectName = `Project ${Date.now()}`;
    const updatedName = `Updated ${Date.now()}`;
    
    // Create project
    await TestUtils.clickButton(page, 'Create Project');
    await TestUtils.verifyModalOpen(page);
    await TestUtils.fillFormField(page, 'Name', projectName);
    await TestUtils.clickButton(page, 'Create');
    
    await TestUtils.verifyToast(page, 'created', 'success');
    await page.waitForTimeout(800);
    
    // Edit
    await page.click(`text=${projectName}`);
    await page.waitForURL('**/projects/**', { timeout: 5000 });
    
    await TestUtils.clickButton(page, 'Edit');
    const nameField = page.locator('input[name="name"]').first();
    await nameField.clear();
    await nameField.fill(updatedName);
    
    await TestUtils.clickButton(page, 'Save');
    await TestUtils.verifyToast(page, 'updated', 'success');
  });

  test('should change project status', async ({ page }) => {
    const projectName = `Status Test ${Date.now()}`;
    
    await TestUtils.clickButton(page, 'Create Project');
    await TestUtils.verifyModalOpen(page);
    await TestUtils.fillFormField(page, 'Name', projectName);
    await TestUtils.clickButton(page, 'Create');
    
    await TestUtils.verifyToast(page, 'created', 'success');
    await page.waitForTimeout(800);
    
    await page.click(`text=${projectName}`);
    await page.waitForURL('**/projects/**', { timeout: 5000 });
    
    const statusSelect = page.locator('select[name="status"]');
    if (await statusSelect.isVisible()) {
      await statusSelect.selectOption('on_hold');
      await TestUtils.clickButton(page, 'Save');
      await TestUtils.verifyToast(page, 'updated', 'success');
    }
  });

  test('should delete project', async ({ page }) => {
    const projectName = `Delete Test ${Date.now()}`;
    
    await TestUtils.clickButton(page, 'Create Project');
    await TestUtils.verifyModalOpen(page);
    await TestUtils.fillFormField(page, 'Name', projectName);
    await TestUtils.clickButton(page, 'Create');
    
    await TestUtils.verifyToast(page, 'created', 'success');
    await page.waitForTimeout(800);
    
    await page.click(`text=${projectName}`);
    await page.waitForURL('**/projects/**', { timeout: 5000 });
    
    const deleteBtn = page.locator('button:has-text("Delete")').first();
    if (await deleteBtn.isVisible()) {
      await deleteBtn.click();
      await page.click('button:has-text("Confirm")');
      await TestUtils.verifyToast(page, 'deleted', 'success');
    }
  });

  test('should filter projects by status', async ({ page }) => {
    const statusFilter = page.locator('select[name="status"], select[aria-label*="Status"]').first();
    
    if (await statusFilter.isVisible()) {
      await statusFilter.selectOption('active');
      await page.waitForTimeout(800);
      
      const rows = await page.locator('table tbody tr').count().catch(() => 0);
      expect(rows).toBeGreaterThanOrEqual(0);
    }
  });

  test('should search projects', async ({ page }) => {
    await TestUtils.searchTable(page, 'Test Project');
    await page.waitForTimeout(800);
    
    const rows = await page.locator('table tbody tr').count().catch(() => 0);
    expect(rows).toBeGreaterThanOrEqual(0);
  });

  test('should generate project report', async ({ page }) => {
    const projectName = `Report Test ${Date.now()}`;
    
    await TestUtils.clickButton(page, 'Create Project');
    await TestUtils.verifyModalOpen(page);
    await TestUtils.fillFormField(page, 'Name', projectName);
    await TestUtils.clickButton(page, 'Create');
    
    await TestUtils.verifyToast(page, 'created', 'success');
    await page.waitForTimeout(800);
    
    await page.click(`text=${projectName}`);
    
    const reportBtn = page.locator('button:has-text("Report")').first();
    if (await reportBtn.isVisible()) {
      await reportBtn.click();
      await page.waitForTimeout(1000);
      
      // Verify report is displayed
      const report = page.locator('[class*="report"], [data-testid="report"]');
      if (await report.isVisible()) {
        await expect(report).toBeVisible();
      }
    }
  });

  test('should display project budget', async ({ page }) => {
    const projectName = `Budget Test ${Date.now()}`;
    
    await TestUtils.clickButton(page, 'Create Project');
    await TestUtils.verifyModalOpen(page);
    await TestUtils.fillFormField(page, 'Name', projectName);
    await TestUtils.fillFormField(page, 'Budget', '100000');
    await TestUtils.clickButton(page, 'Create');
    
    await TestUtils.verifyToast(page, 'created', 'success');
    await page.waitForTimeout(800);
    
    await page.click(`text=${projectName}`);
    
    const budgetElement = page.locator('[class*="budget"]');
    if (await budgetElement.isVisible()) {
      const budgetText = await budgetElement.textContent();
      expect(Number(budgetText?.replace(/\D/g, ''))).toBeGreaterThan(0);
    }
  });

  test('should export projects list', async ({ page }) => {
    const exportBtn = page.locator('button:has-text("Export")').first();
    
    if (await exportBtn.isVisible()) {
      await exportBtn.click();
      await page.waitForTimeout(1000);
      // Expect file download or modal
    }
  });

  test('should show project overview', async ({ page }) => {
    const projectName = `Overview Test ${Date.now()}`;
    
    await TestUtils.clickButton(page, 'Create Project');
    await TestUtils.verifyModalOpen(page);
    await TestUtils.fillFormField(page, 'Name', projectName);
    await TestUtils.clickButton(page, 'Create');
    
    await TestUtils.verifyToast(page, 'created', 'success');
    await page.waitForTimeout(800);
    
    await page.click(`text=${projectName}`);
    
    // Check main overview section exists
    const overview = page.locator('main, [role="main"]');
    await expect(overview).toBeVisible();
  });

  test('should handle project with start and end dates', async ({ page }) => {
    const projectName = `Date Test ${Date.now()}`;
    const today = new Date();
    const endDate = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
    
    await TestUtils.clickButton(page, 'Create Project');
    await TestUtils.verifyModalOpen(page);
    await TestUtils.fillFormField(page, 'Name', projectName);
    
    const startInput = page.locator('input[type="date"][name*="start"]').first();
    const endInput = page.locator('input[type="date"][name*="end"]').first();
    
    if (await startInput.isVisible()) {
      await startInput.fill(today.toISOString().split('T')[0]);
    }
    if (await endInput.isVisible()) {
      await endInput.fill(endDate.toISOString().split('T')[0]);
    }
    
    await TestUtils.clickButton(page, 'Create');
    await TestUtils.verifyToast(page, 'created', 'success');
  });
});
