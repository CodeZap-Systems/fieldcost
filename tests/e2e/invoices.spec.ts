/**
 * Invoices E2E Tests
 * Tests for invoice creation and management
 */

import { test, expect } from '@playwright/test';
import { loginUser } from '../helpers/auth';
import { generateTestInvoice } from '../helpers/generators';

test.describe('Invoice Management', () => {
  test.beforeEach(async ({ page }) => {
    await loginUser(page);
    await page.goto('http://localhost:3000/dashboard/invoices?company_id=8');
    await page.waitForLoadState('networkidle');
  });

  test('should display invoices list', async ({ page }) => {
    await expect(page.locator('text=Invoice')).toBeVisible({ timeout: 5000 });
  });

  test('should create new invoice', async ({ page }) => {
    const invoice = generateTestInvoice();

    await page.click('button:has-text("Create Invoice")');
    await page.waitForLoadState('networkidle');

    // Fill form
    await page.fill('input[name="invoice_number"]', invoice.invoice_number);

    // Select customer
    const customerSelect = page.locator('select[name="customer_id"]');
    if (await customerSelect.isVisible()) {
      await customerSelect.selectOption('1');
    }

    // Fill amount
    await page.fill('input[name="amount"]', invoice.amount.toString());

    // Submit
    await page.click('button:has-text("Create")');

    // Should show success
    await expect(page.locator('[role="alert"]')).toContainText('successfully', { timeout: 5000 });
  });

  test('should add line items to invoice', async ({ page }) => {
    await page.click('button:has-text("Create Invoice")');
    await page.waitForLoadState('networkidle');

    const invoice = generateTestInvoice();

    // Fill invoice details
    await page.fill('input[name="invoice_number"]', invoice.invoice_number);

    // Click add item
    const addItemBtn = page.locator('button:has-text("Add Item")');
    if (await addItemBtn.isVisible()) {
      await addItemBtn.click();

      // Fill line item
      await page.fill('input[name="line_items[0].description"]', 'Professional Services');
      await page.fill('input[name="line_items[0].quantity"]', '10');
      await page.fill('input[name="line_items[0].rate"]', '150');

      // Should show auto-calculated amount
      await expect(page.locator('text=1500')).toBeVisible();
    }
  });

  test('should calculate invoice totals', async ({ page }) => {
    await page.click('button:has-text("Create Invoice")');
    await page.waitForLoadState('networkidle');

    // Fill line item
    await page.fill('input[name="line_items[0].quantity"]', '10');
    await page.fill('input[name="line_items[0].rate"]', '100');

    // Total should be 1000
    const totalVisible = await page.locator('text=1000').isVisible();
    expect(totalVisible).toBe(true);
  });

  test('should filter invoices by status', async ({ page }) => {
    const statusFilter = page.locator('select[name="status"]');

    if (await statusFilter.isVisible()) {
      await statusFilter.selectOption('draft');
      await page.waitForLoadState('networkidle');

      // Should show results
      await expect(page.locator('table')).toBeVisible();
    }
  });

  test('should generate PDF from invoice', async ({ page, context }) => {
    const firstRow = page.locator('table tbody tr').first();

    if (await firstRow.isVisible()) {
      // Listen for download
      const downloadPromise = context.waitForEvent('download');

      const pdfButton = firstRow.locator('button:has-text("PDF")');
      if (await pdfButton.isVisible()) {
        await pdfButton.click();

        const download = await downloadPromise;
        expect(download.suggestedFilename()).toContain('.pdf');
      }
    }
  });
});
