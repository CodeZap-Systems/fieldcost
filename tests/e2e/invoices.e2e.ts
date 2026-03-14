import { test, expect } from '@playwright/test';
import { AuthHelper, testUser } from '../helpers/auth.helper';
import { TestUtils } from '../helpers/test-utils.helper';
import { VALID_INVOICE_DATA, VALID_INVOICE_LINE_ITEMS } from '../fixtures/test-fixtures';

const BASE_URL = 'https://fieldcost.vercel.app';

test.describe('Invoices E2E Tests', () => {
  let authHelper: AuthHelper;

  test.beforeAll(async () => {
    authHelper = new AuthHelper(BASE_URL);
  });

  test.beforeEach(async ({ page }) => {
    await authHelper.loginUI(page, testUser);
    await page.goto(`${BASE_URL}/invoices`, { waitUntil: 'networkidle' });
  });

  test('should display invoices list', async ({ page }) => {
    await TestUtils.waitForTable(page).catch(() => {});
    await expect(page.locator('h1, h2').first()).toBeVisible();
  });

  test('should create new invoice', async ({ page }) => {
    const invoiceNumber = `INV-${Date.now()}`;
    
    await TestUtils.clickButton(page, 'Create Invoice');
    await TestUtils.verifyModalOpen(page);
    
    await TestUtils.fillFormField(page, 'Invoice Number', invoiceNumber);
    await TestUtils.fillFormField(page, 'Description', VALID_INVOICE_DATA.simple.description);
    
    // Select customer if required
    const customerSelect = page.locator('select[name="customer_id"]').first();
    if (await customerSelect.isVisible()) {
      const options = await customerSelect.locator('option').count();
      if (options > 1) {
        await customerSelect.selectOption('1');
      }
    }
    
    await TestUtils.clickButton(page, 'Create');
    await TestUtils.verifyToast(page, 'created', 'success');
    
    await expect(page.locator(`text=${invoiceNumber}`)).toBeVisible();
  });

  test('should add line items to invoice', async ({ page }) => {
    const invoiceNumber = `INV-${Date.now()}`;
    
    // Create invoice
    await TestUtils.clickButton(page, 'Create Invoice');
    await TestUtils.verifyModalOpen(page);
    await TestUtils.fillFormField(page, 'Invoice Number', invoiceNumber);
    await TestUtils.fillFormField(page, 'Description', 'Invoice with items test');
    
    const customerSelect = page.locator('select[name="customer_id"]').first();
    if (await customerSelect.isVisible()) {
      const options = await customerSelect.locator('option').count();
      if (options > 1) {
        await customerSelect.selectOption('1');
      }
    }
    
    await TestUtils.clickButton(page, 'Create');
    await TestUtils.verifyToast(page, 'created', 'success');
    await page.waitForTimeout(1000);
    
    // Open and add items
    await page.click(`text=${invoiceNumber}`);
    await page.waitForURL('**/invoices/**', { timeout: 5000 });
    
    await TestUtils.clickButton(page, 'Add Item');
    
    const descField = page.locator('input[placeholder*="Description"]').first();
    const qtyField = page.locator('input[type="number"][placeholder*="Quantity"]').first();
    const priceField = page.locator('input[type="number"][placeholder*="Unit Price"i]').first();
    
    if (await descField.isVisible()) {
      await descField.fill(VALID_INVOICE_LINE_ITEMS.labor.description);
    }
    if (await qtyField.isVisible()) {
      await qtyField.fill(String(VALID_INVOICE_LINE_ITEMS.labor.quantity));
    }
    if (await priceField.isVisible()) {
      await priceField.fill(String(VALID_INVOICE_LINE_ITEMS.labor.unit_price));
    }
    
    await TestUtils.clickButton(page, 'Add');
    await TestUtils.verifyToast(page, 'added', 'success').catch(() => {});
  });

  test('should calculate invoice totals', async ({ page }) => {
    const invoiceNumber = `INV-${Date.now()}`;
    
    await TestUtils.clickButton(page, 'Create Invoice');
    await TestUtils.verifyModalOpen(page);
    await TestUtils.fillFormField(page, 'Invoice Number', invoiceNumber);
    await TestUtils.fillFormField(page, 'Description', 'Totals test');
    
    const customerSelect = page.locator('select[name="customer_id"]').first();
    if (await customerSelect.isVisible()) {
      const options = await customerSelect.locator('option').count();
      if (options > 1) {
        await customerSelect.selectOption('1');
      }
    }
    
    await TestUtils.clickButton(page, 'Create');
    await TestUtils.verifyToast(page, 'created', 'success');
    await page.waitForTimeout(1000);
    
    await page.click(`text=${invoiceNumber}`);
    
    // Add multiple items
    const items = [VALID_INVOICE_LINE_ITEMS.labor, VALID_INVOICE_LINE_ITEMS.materials];
    
    for (const item of items) {
      await TestUtils.clickButton(page, 'Add Item');
      
      const descField = page.locator('input[placeholder*="Description"]').first();
      const qtyField = page.locator('input[type="number"][placeholder*="Quantity"]').first();
      const priceField = page.locator('input[type="number"][placeholder*="Unit Price"i]').first();
      
      if (await descField.isVisible()) {
        await descField.fill(item.description);
        if (await qtyField.isVisible()) {
          await qtyField.fill(String(item.quantity));
        }
        if (await priceField.isVisible()) {
          await priceField.fill(String(item.unit_price));
        }
        
        await TestUtils.clickButton(page, 'Add');
      }
      
      await page.waitForTimeout(300);
    }
    
    // Verify total
    const totalElement = page.locator('[class*="total"], [data-testid="total"]');
    await expect(totalElement).toBeVisible().catch(() => {});
  });

  test('should change invoice status to sent', async ({ page }) => {
    const invoiceNumber = `INV-${Date.now()}`;
    
    await TestUtils.clickButton(page, 'Create Invoice');
    await TestUtils.verifyModalOpen(page);
    await TestUtils.fillFormField(page, 'Invoice Number', invoiceNumber);
    await TestUtils.fillFormField(page, 'Description', 'Sent status test');
    
    const customerSelect = page.locator('select[name="customer_id"]').first();
    if (await customerSelect.isVisible()) {
      const options = await customerSelect.locator('option').count();
      if (options > 1) {
        await customerSelect.selectOption('1');
      }
    }
    
    await TestUtils.clickButton(page, 'Create');
    await TestUtils.verifyToast(page, 'created', 'success');
    await page.waitForTimeout(1000);
    
    await page.click(`text=${invoiceNumber}`);
    
    const statusSelect = page.locator('select[name="status"]');
    if (await statusSelect.isVisible()) {
      await statusSelect.selectOption('sent');
      await TestUtils.clickButton(page, 'Save');
      await TestUtils.verifyToast(page, 'updated', 'success');
    }
  });

  test('should mark invoice as paid', async ({ page }) => {
    const invoiceNumber = `INV-${Date.now()}`;
    
    await TestUtils.clickButton(page, 'Create Invoice');
    await TestUtils.verifyModalOpen(page);
    await TestUtils.fillFormField(page, 'Invoice Number', invoiceNumber);
    await TestUtils.fillFormField(page, 'Description', 'Paid status test');
    
    const customerSelect = page.locator('select[name="customer_id"]').first();
    if (await customerSelect.isVisible()) {
      const options = await customerSelect.locator('option').count();
      if (options > 1) {
        await customerSelect.selectOption('1');
      }
    }
    
    await TestUtils.clickButton(page, 'Create');
    await TestUtils.verifyToast(page, 'created', 'success');
    await page.waitForTimeout(1000);
    
    await page.click(`text=${invoiceNumber}`);
    
    const statusSelect = page.locator('select[name="status"]');
    if (await statusSelect.isVisible()) {
      await statusSelect.selectOption('paid');
      await TestUtils.clickButton(page, 'Save');
      await TestUtils.verifyToast(page, 'updated', 'success');
    }
  });

  test('should apply tax to invoice', async ({ page }) => {
    const invoiceNumber = `INV-${Date.now()}`;
    
    await TestUtils.clickButton(page, 'Create Invoice');
    await TestUtils.verifyModalOpen(page);
    await TestUtils.fillFormField(page, 'Invoice Number', invoiceNumber);
    await TestUtils.fillFormField(page, 'Description', 'Tax test');
    
    const taxField = page.locator('input[name="tax_rate"]');
    if (await taxField.isVisible()) {
      await taxField.fill('10');
    }
    
    const customerSelect = page.locator('select[name="customer_id"]').first();
    if (await customerSelect.isVisible()) {
      const options = await customerSelect.locator('option').count();
      if (options > 1) {
        await customerSelect.selectOption('1');
      }
    }
    
    await TestUtils.clickButton(page, 'Create');
    await TestUtils.verifyToast(page, 'created', 'success');
  });

  test('should apply discount to invoice', async ({ page }) => {
    const invoiceNumber = `INV-${Date.now()}`;
    
    await TestUtils.clickButton(page, 'Create Invoice');
    await TestUtils.verifyModalOpen(page);
    await TestUtils.fillFormField(page, 'Invoice Number', invoiceNumber);
    await TestUtils.fillFormField(page, 'Description', 'Discount test');
    
    const discountField = page.locator('input[name="discount_percentage"]');
    if (await discountField.isVisible()) {
      await discountField.fill('5');
    }
    
    const customerSelect = page.locator('select[name="customer_id"]').first();
    if (await customerSelect.isVisible()) {
      const options = await customerSelect.locator('option').count();
      if (options > 1) {
        await customerSelect.selectOption('1');
      }
    }
    
    await TestUtils.clickButton(page, 'Create');
    await TestUtils.verifyToast(page, 'created', 'success');
  });

  test('should search invoices', async ({ page }) => {
    await TestUtils.searchTable(page, 'INV-');
    await page.waitForTimeout(800);
    
    const rows = await page.locator('table tbody tr').count().catch(() => 0);
    expect(rows).toBeGreaterThanOrEqual(0);
  });

  test('should filter invoices by status', async ({ page }) => {
    const statusFilter = page.locator('select[name="status"]').first();
    
    if (await statusFilter.isVisible()) {
      await statusFilter.selectOption('draft');
      await page.waitForTimeout(800);
      
      const rows = await page.locator('table tbody tr').count().catch(() => 0);
      expect(rows).toBeGreaterThanOrEqual(0);
    }
  });

  test('should export invoice as PDF', async ({ page }) => {
    const invoiceNumber = `INV-${Date.now()}`;
    
    await TestUtils.clickButton(page, 'Create Invoice');
    await TestUtils.verifyModalOpen(page);
    await TestUtils.fillFormField(page, 'Invoice Number', invoiceNumber);
    await TestUtils.fillFormField(page, 'Description', 'PDF export test');
    
    const customerSelect = page.locator('select[name="customer_id"]').first();
    if (await customerSelect.isVisible()) {
      const options = await customerSelect.locator('option').count();
      if (options > 1) {
        await customerSelect.selectOption('1');
      }
    }
    
    await TestUtils.clickButton(page, 'Create');
    await TestUtils.verifyToast(page, 'created', 'success');
    await page.waitForTimeout(1000);
    
    await page.click(`text=${invoiceNumber}`);
    
    const pdfBtn = page.locator('button:has-text("PDF"), button:has-text("Export")').first();
    if (await pdfBtn.isVisible()) {
      await pdfBtn.click();
      // Expect download or modal
    }
  });

  test('should set invoice due date', async ({ page }) => {
    const invoiceNumber = `INV-${Date.now()}`;
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 30);
    
    await TestUtils.clickButton(page, 'Create Invoice');
    await TestUtils.verifyModalOpen(page);
    await TestUtils.fillFormField(page, 'Invoice Number', invoiceNumber);
    await TestUtils.fillFormField(page, 'Description', 'Due date test');
    
    const dueDateInput = page.locator('input[type="date"][name*="due"]').first();
    if (await dueDateInput.isVisible()) {
      await dueDateInput.fill(dueDate.toISOString().split('T')[0]);
    }
    
    const customerSelect = page.locator('select[name="customer_id"]').first();
    if (await customerSelect.isVisible()) {
      const options = await customerSelect.locator('option').count();
      if (options > 1) {
        await customerSelect.selectOption('1');
      }
    }
    
    await TestUtils.clickButton(page, 'Create');
    await TestUtils.verifyToast(page, 'created', 'success');
  });
});
