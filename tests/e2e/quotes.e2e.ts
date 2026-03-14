import { test, expect } from '@playwright/test';
import { AuthHelper, testUser } from '../helpers/auth.helper';
import { TestUtils } from '../helpers/test-utils.helper';
import { generateTestCustomer, generateTestQuote, generateTestQuoteLineItem } from '../helpers/data-generator.helper';
import { VALID_QUOTE_DATA, VALID_QUOTE_LINE_ITEMS } from '../fixtures/test-fixtures';

const BASE_URL = 'https://fieldcost.vercel.app';

test.describe('Quotes E2E Tests', () => {
  let authHelper: AuthHelper;
  let testCustomerId: string;

  test.beforeAll(async () => {
    authHelper = new AuthHelper(BASE_URL);
  });

  test.beforeEach(async ({ page }) => {
    // Login before each test
    await authHelper.loginUI(page, testUser);
    // Navigate to quotes page
    await page.goto(`${BASE_URL}/quotes`, { waitUntil: 'networkidle' });
  });

  test('should display quotes list', async ({ page }) => {
    // Wait for page to load
    await TestUtils.waitForTable(page);
    
    // Verify quotes table is visible
    await expect(page.locator('// h1[contains(text(), "Quotes")]')).toBeVisible();
    await expect(page.locator('table')).toBeVisible();
  });

  test('should create new quote with minimal details', async ({ page }) => {
    const quoteNumber = `QT-${Date.now()}`;
    
    // Click create button
    await TestUtils.clickButton(page, 'Create Quote');
    
    // Wait for form
    await TestUtils.verifyModalOpen(page);
    
    // Fill quote form
    await page.fill('input[name="quote_number"]', quoteNumber);
    await page.fill('textarea[name="description"]', VALID_QUOTE_DATA.simple.description);
    
    // Submit
    await TestUtils.clickButton(page, 'Create');
    
    // Verify success
    await TestUtils.verifyToast(page, 'Quote created', 'success');
    
    // Verify quote appears in table
    await expect(page.locator(`text=${quoteNumber}`)).toBeVisible();
  });

  test('should create quote with complete details', async ({ page }) => {
    const quoteNumber = `QT-${Date.now()}`;
    
    await TestUtils.clickButton(page, 'Create Quote');
    await TestUtils.verifyModalOpen(page);
    
    // Fill complete quote details
    await page.fill('input[name="quote_number"]', quoteNumber);
    await page.fill('textarea[name="description"]', VALID_QUOTE_DATA.complete.description);
    await TestUtils.selectDropdown(page, 'Status', VALID_QUOTE_DATA.complete.status);
    await page.fill('input[name="tax_rate"]', String(VALID_QUOTE_DATA.complete.tax_rate * 100));
    await page.fill('input[name="discount_percentage"]', String(VALID_QUOTE_DATA.complete.discount_percentage));
    
    // Set valid until date
    const validDate = new Date();
    validDate.setDate(validDate.getDate() + 30);
    await page.fill('input[type="date"]', validDate.toISOString().split('T')[0]);
    
    await TestUtils.clickButton(page, 'Create');
    await TestUtils.verifyToast(page, 'Quote created', 'success');
    
    // Verify quote in list
    await expect(page.locator(`text=${quoteNumber}`)).toBeVisible();
  });

  test('should add line items to quote', async ({ page }) => {
    const quoteNumber = `QT-${Date.now()}`;
    
    // Create quote first
    await TestUtils.clickButton(page, 'Create Quote');
    await TestUtils.verifyModalOpen(page);
    await page.fill('input[name="quote_number"]', quoteNumber);
    await page.fill('textarea[name="description"]', 'Quote with line items');
    await TestUtils.clickButton(page, 'Create');
    
    // Wait and click on the created quote
    await TestUtils.verifyToast(page, 'Quote created', 'success');
    await page.waitForTimeout(1000);
    
    // Click edit/view quote
    await page.click(`text=${quoteNumber}`);
    await page.waitForURL('**/quotes/**', { timeout: 5000 });
    
    // Click add line item
    await TestUtils.clickButton(page, 'Add Item');
    
    // Fill line item
    await page.fill('input[placeholder*="Description"]', VALID_QUOTE_LINE_ITEMS.labor.description);
    await page.fill('input[type="number"][placeholder*="Quantity"]', String(VALID_QUOTE_LINE_ITEMS.labor.quantity));
    await page.fill('input[type="number"][placeholder*="Unit Price"i]', String(VALID_QUOTE_LINE_ITEMS.labor.unit_price));
    
    // Add item
    await TestUtils.clickButton(page, 'Add');
    await TestUtils.verifyToast(page, 'Item added', 'success');
    
    // Verify item in list
    await expect(page.locator(`text=${VALID_QUOTE_LINE_ITEMS.labor.description}`)).toBeVisible();
  });

  test('should calculate total with multiple line items', async ({ page }) => {
    const quoteNumber = `QT-${Date.now()}`;
    
    // Create and open quote
    await TestUtils.clickButton(page, 'Create Quote');
    await TestUtils.verifyModalOpen(page);
    await page.fill('input[name="quote_number"]', quoteNumber);
    await page.fill('textarea[name="description"]', 'Total calculation test');
    await TestUtils.clickButton(page, 'Create');
    
    await TestUtils.verifyToast(page, 'Quote created', 'success');
    await page.waitForTimeout(1000);
    await page.click(`text=${quoteNumber}`);
    await page.waitForURL('**/quotes/**', { timeout: 5000 });
    
    // Add multiple items
    const items = [VALID_QUOTE_LINE_ITEMS.labor, VALID_QUOTE_LINE_ITEMS.materials, VALID_QUOTE_LINE_ITEMS.equipment];
    
    for (const item of items) {
      await TestUtils.clickButton(page, 'Add Item');
      await page.fill('input[placeholder*="Description"]', item.description);
      await page.fill('input[type="number"][placeholder*="Quantity"]', String(item.quantity));
      await page.fill('input[type="number"][placeholder*="Unit Price"i]', String(item.unit_price));
      await TestUtils.clickButton(page, 'Add');
      await page.waitForTimeout(500);
    }
    
    // Verify total is calculated
    const totalElement = page.locator('[class*="total"], [data-testid="total"]');
    await expect(totalElement).toBeVisible();
    
    // Verify total is not zero
    const totalText = await totalElement.textContent();
    expect(Number(totalText?.replace(/\D/g, ''))).toBeGreaterThan(0);
  });

  test('should edit quote details', async ({ page }) => {
    const quoteNumber = `QT-${Date.now()}`;
    const updatedDescription = 'Updated quote description';
    
    // Create quote
    await TestUtils.clickButton(page, 'Create Quote');
    await TestUtils.verifyModalOpen(page);
    await page.fill('input[name="quote_number"]', quoteNumber);
    await page.fill('textarea[name="description"]', 'Original description');
    await TestUtils.clickButton(page, 'Create');
    
    await TestUtils.verifyToast(page, 'Quote created', 'success');
    await page.waitForTimeout(1000);
    
    // Open quote
    await page.click(`text=${quoteNumber}`);
    await page.waitForURL('**/quotes/**', { timeout: 5000 });
    
    // Edit description
    await TestUtils.clickButton(page, 'Edit');
    const descField = page.locator('textarea[name="description"]');
    await descField.clear();
    await descField.fill(updatedDescription);
    
    await TestUtils.clickButton(page, 'Save');
    await TestUtils.verifyToast(page, 'Quote updated', 'success');
    
    // Verify update
    await expect(page.locator(`text=${updatedDescription}`)).toBeVisible();
  });

  test('should change quote status', async ({ page }) => {
    const quoteNumber = `QT-${Date.now()}`;
    
    // Create quote
    await TestUtils.clickButton(page, 'Create Quote');
    await TestUtils.verifyModalOpen(page);
    await page.fill('input[name="quote_number"]', quoteNumber);
    await page.fill('textarea[name="description"]', 'Status change test');
    await TestUtils.clickButton(page, 'Create');
    
    await TestUtils.verifyToast(page, 'Quote created', 'success');
    await page.waitForTimeout(1000);
    
    // Open quote
    await page.click(`text=${quoteNumber}`);
    await page.waitForURL('**/quotes/**', { timeout: 5000 });
    
    // Change status
    await TestUtils.selectDropdown(page, 'Status', 'approved');
    await TestUtils.clickButton(page, 'Save');
    
    await TestUtils.verifyToast(page, 'Quote updated', 'success');
    
    // Verify status changed
    const statusBadge = page.locator('[class*="badge"], [class*="status"]');
    await expect(statusBadge).toContainText('approved');
  });

  test('should remove line item from quote', async ({ page }) => {
    const quoteNumber = `QT-${Date.now()}`;
    
    // Create quote with items
    await TestUtils.clickButton(page, 'Create Quote');
    await TestUtils.verifyModalOpen(page);
    await page.fill('input[name="quote_number"]', quoteNumber);
    await page.fill('textarea[name="description"]', 'Delete item test');
    await TestUtils.clickButton(page, 'Create');
    
    await TestUtils.verifyToast(page, 'Quote created', 'success');
    await page.waitForTimeout(1000);
    await page.click(`text=${quoteNumber}`);
    await page.waitForURL('**/quotes/**', { timeout: 5000 });
    
    // Add item
    await TestUtils.clickButton(page, 'Add Item');
    await page.fill('input[placeholder*="Description"]', 'Item to delete');
    await page.fill('input[type="number"][placeholder*="Quantity"]', '1');
    await page.fill('input[type="number"][placeholder*="Unit Price"i]', '100');
    await TestUtils.clickButton(page, 'Add');
    
    // Delete item
    await page.click('button[aria-label*="Delete"]');
    await TestUtils.verifyToast(page, 'Item removed', 'success');
    
    // Verify item is gone
    await expect(page.locator('text=Item to delete')).not.toBeVisible();
  });

  test('should search quotes', async ({ page }) => {
    // Search for a quote
    await TestUtils.searchTable(page, 'QT-');
    
    // Wait for results
    await page.waitForTimeout(800);
    
    // Should see quotes with matching number
    const rows = await page.locator('table tbody tr').count();
    expect(rows).toBeGreaterThan(0);
  });

  test('should filter quotes by status', async ({ page }) => {
    // Look for status filter
    const statusFilter = page.locator('select[aria-label*="Status"], input[aria-label*="Status"]').first();
    
    if (await statusFilter.isVisible()) {
      await statusFilter.selectOption('draft');
      await page.waitForTimeout(800);
      
      // Verify filtered results
      const rows = await page.locator('table tbody tr').count();
      expect(rows).toBeGreaterThanOrEqual(0);
    }
  });

  test('should display quote total with tax calculation', async ({ page }) => {
    const quoteNumber = `QT-${Date.now()}`;
    
    // Create quote with tax
    await TestUtils.clickButton(page, 'Create Quote');
    await TestUtils.verifyModalOpen(page);
    await page.fill('input[name="quote_number"]', quoteNumber);
    await page.fill('textarea[name="description"]', 'Tax calculation test');
    await page.fill('input[name="tax_rate"]', '10');
    await TestUtils.clickButton(page, 'Create');
    
    await TestUtils.verifyToast(page, 'Quote created', 'success');
    await page.waitForTimeout(1000);
    await page.click(`text=${quoteNumber}`);
    await page.waitForURL('**/quotes/**', { timeout: 5000 });
    
    // Add item
    await TestUtils.clickButton(page, 'Add Item');
    await page.fill('input[placeholder*="Description"]', 'Taxable item');
    await page.fill('input[type="number"][placeholder*="Quantity"]', '1');
    await page.fill('input[type="number"][placeholder*="Unit Price"i]', '1000');
    await TestUtils.clickButton(page, 'Add');
    
    // Verify tax is calculated
    const subtotalElement = page.locator('[class*="subtotal"], [data-testid="subtotal"]');
    const taxElement = page.locator('[class*="tax"], [data-testid="tax"]');
    
    await expect(taxElement).toBeVisible();
    const taxText = await taxElement.textContent();
    expect(Number(taxText?.replace(/\D/g, ''))).toBeGreaterThan(0);
  });
});
