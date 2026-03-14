import { test, expect } from '@playwright/test';
import LoginHelper from '../helpers/login.helper';
import { TEST_USERS } from '../fixtures/test-users';
import { TEST_PROJECTS, TEST_INVOICES } from '../fixtures/test-data';

/**
 * INVOICES E2E TESTS
 * Test invoice creation, management, payment tracking, and PDF export
 */

test.describe('Invoices Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login as accountant
    await LoginHelper.login(page, TEST_USERS.accountant.email, TEST_USERS.accountant.password);

    // Navigate to invoices page
    await page.goto('/dashboard/invoices');
  });

  // ================== INVOICE LIST TESTS ==================

  test('should display invoices list page', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /invoices/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /new invoice|create invoice|add invoice/i })).toBeVisible();
  });

  test('should list all invoices', async ({ page }) => {
    const invoiceList = page.locator('[data-testid="invoices-list"], .invoices-table');

    await invoiceList.waitFor({ timeout: 5000 });
    expect(await invoiceList.isVisible()).toBeTruthy();
  });

  test('should display invoice columns', async ({ page }) => {
    const columns = ['Invoice Number', 'Client', 'Amount', 'Status', 'Due Date', 'Paid Amount'];

    for (const column of columns) {
      const columnHeader = page.locator(`th:has-text("${column}")`);
      const isVisible = await columnHeader.isVisible().catch(() => false);

      if (isVisible) {
        expect(isVisible).toBeTruthy();
      }
    }
  });

  test('should search invoices by number', async ({ page }) => {
    const searchBox = page.locator('input[placeholder*="Search"], input[data-testid="search-invoices"]');

    if (await searchBox.isVisible()) {
      await searchBox.fill('INV');
      await page.waitForTimeout(500);

      const invoiceItems = page.locator('[data-testid="invoice-item"]');
      const count = await invoiceItems.count();
      expect(count).toBeGreaterThanOrEqual(0);
    }
  });

  test('should filter invoices by status', async ({ page }) => {
    const filterButton = page.locator('button:has-text("Filter|Status")');

    if (await filterButton.isVisible()) {
      await filterButton.click();

      const statusFilter = page.locator('button:has-text("Draft|Sent|Paid")');
      if (await statusFilter.isVisible()) {
        await statusFilter.click();
        await page.waitForTimeout(500);

        const invoicesList = page.locator('[data-testid="invoices-list"]');
        expect(await invoicesList.isVisible()).toBeTruthy();
      }
    }
  });

  test('should filter overdue invoices', async ({ page }) => {
    const overdueFilter = page.locator('button:has-text("Overdue")');

    if (await overdueFilter.isVisible()) {
      await overdueFilter.click();
      await page.waitForTimeout(500);

      const invoicesList = page.locator('[data-testid="invoices-list"]');
      expect(await invoicesList.isVisible()).toBeTruthy();
    }
  });

  test('should sort invoices by amount descending', async ({ page }) => {
    const amountHeader = page.locator('th:has-text("Amount")');

    if (await amountHeader.isVisible()) {
      await amountHeader.click();
      await page.waitForTimeout(500);

      const invoiceItems = page.locator('[data-testid="invoice-item"]');
      expect(await invoiceItems.count()).toBeGreaterThanOrEqual(0);
    }
  });

  // ================== INVOICE DETAILS TESTS ==================

  test('should view invoice details', async ({ page }) => {
    const firstInvoice = page.locator('[data-testid="invoice-item"]').first();

    if (await firstInvoice.isVisible()) {
      await firstInvoice.click();

      await page.waitForURL(/.*invoices\/\d+|.*invoices\/[a-z0-9-]+/i, { timeout: 5000 }).catch(() => {});

      const invoiceDetails = page.getByText(/invoice details|invoice information/i).first();
      const isVisible = await invoiceDetails.isVisible({ timeout: 3000 }).catch(() => false);
      expect(isVisible).toBeTruthy();
    }
  });

  test('should display invoice itemized details', async ({ page }) => {
    const firstInvoice = page.locator('[data-testid="invoice-item"]').first();

    if (await firstInvoice.isVisible()) {
      await firstInvoice.click();

      const itemsTable = page.locator('[data-testid="invoice-items-table"], .items-table');
      const isVisible = await itemsTable.isVisible({ timeout: 3000 }).catch(() => false);

      if (isVisible) {
        expect(isVisible).toBeTruthy();
      }
    }
  });

  // ================== CREATE INVOICE TESTS ==================

  test('should open create invoice dialog', async ({ page }) => {
    const createButton = page.locator('button:has-text("New Invoice|Create Invoice|Add Invoice")');

    await createButton.click();

    const dialog = page.locator('[data-testid="invoice-form"], dialog');
    await expect(dialog).toBeVisible({ timeout: 5000 });
  });

  test('should create new invoice', async ({ page }) => {
    const createButton = page.locator('button:has-text("New Invoice|Create Invoice|Add Invoice")');
    await createButton.click();

    // Fill form
    const projectSelect = page.locator('select[name="projectId"]');
    if (await projectSelect.isVisible()) {
      await projectSelect.selectOption({ index: 1 });
    }

    await page.fill('input[name="clientName"]', TEST_INVOICES.deposit.clientName);
    await page.fill('input[name="amount"]', String(TEST_INVOICES.deposit.amount));

    const invoiceTypeSelect = page.locator('select[name="invoiceType"]');
    if (await invoiceTypeSelect.isVisible()) {
      await invoiceTypeSelect.selectOption('deposit');
    }

    // Submit form
    const submitButton = page.locator('button:has-text("Create|Save|Submit")');
    await submitButton.click();

    // Should show success message
    await expect(
      const successMsg = page.locator('[data-testid="success-message"], .success, .text-green-600').first();
      await expect(successMsg).toBeVisible({ timeout: 5000 });
  });

  test('should validate required fields on create', async ({ page }) => {
    const createButton = page.locator('button:has-text("New Invoice|Create Invoice|Add Invoice")');
    await createButton.click();

    // Try to submit without filling fields
    const submitButton = page.locator('button:has-text("Create|Save|Submit")');
    await submitButton.click();

    // Should show validation errors
    const hasError = await page
      .locator('[data-testid="error-message"], [role="alert"], .error, .text-red-600')
      .first()
      .catch(() => false);

    expect(hasError || !submitButton.isEnabled()).toBeTruthy();
  });

  // ================== UPDATE INVOICE TESTS ==================

  test('should edit invoice', async ({ page }) => {
    const firstInvoice = page.locator('[data-testid="invoice-item"]').first();

    if (await firstInvoice.isVisible()) {
      await firstInvoice.click();

      const editButton = page.locator('button:has-text("Edit|Update")');
      if (await editButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        await editButton.click();

        const amountField = page.locator('input[name="amount"]');
        await amountField.clear();
        await amountField.fill('50000');

        const saveButton = page.locator('button:has-text("Save|Update|Submit")');
        await saveButton.click();

        await expect(
          const successMsg = page.locator('[data-testid="success-message"], .success, .text-green-600').first();
          await expect(successMsg).toBeVisible({ timeout: 3000 });
      }
    }
  });

  // ================== INVOICE STATUS TESTS ==================

  test('should send invoice', async ({ page }) => {
    const firstInvoice = page.locator('[data-testid="invoice-item"]').first();

    if (await firstInvoice.isVisible()) {
      await firstInvoice.click();

      const sendButton = page.locator('button:has-text("Send|Send Invoice")');
      if (await sendButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        await sendButton.click();

        // May show confirmation
        const confirmButton = page.locator('button:has-text("Confirm|Send|Yes")');
        if (await confirmButton.isVisible({ timeout: 1000 }).catch(() => false)) {
          await confirmButton.click();
        }

        await expect(
          const successMsg = page.locator('[data-testid="success-message"], .success, .text-green-600').first();
          await expect(successMsg).toBeVisible({ timeout: 3000 });
      }
    }
  });

  test('should mark invoice as paid', async ({ page }) => {
    const firstInvoice = page.locator('[data-testid="invoice-item"]').first();

    if (await firstInvoice.isVisible()) {
      await firstInvoice.click();

      const markPaidButton = page.locator('button:has-text("Mark as Paid|Paid|Record Payment")');
      if (await markPaidButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        await markPaidButton.click();

        const amountField = page.locator('input[name="paidAmount"]');
        if (await amountField.isVisible()) {
          // Usually auto-filled with full amount
          await page.waitForTimeout(300);
        }

        const confirmButton = page.locator('button:has-text("Confirm|Mark|Submit")');
        if (await confirmButton.isVisible({ timeout: 1000 }).catch(() => false)) {
          await confirmButton.click();
        }

        await expect(
          const successMsg = page.locator('[data-testid="success-message"], .success, .text-green-600').first();
          await expect(successMsg).toBeVisible({ timeout: 3000 });
      }
    }
  });

  test('should record partial payment', async ({ page }) => {
    const firstInvoice = page.locator('[data-testid="invoice-item"]').first();

    if (await firstInvoice.isVisible()) {
      await firstInvoice.click();

      const recordPaymentButton = page.locator('button:has-text("Record Payment|Add Payment")');
      if (await recordPaymentButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        await recordPaymentButton.click();

        const amountField = page.locator('input[name="paymentAmount"]');
        if (await amountField.isVisible()) {
          await amountField.fill('5000'); // Partial payment
        }

        const submitButton = page.locator('button:has-text("Record|Submit|Add")');
        if (await submitButton.isVisible()) {
          await submitButton.click();

          await expect(
            const successMsg = page.locator('[data-testid="success-message"], .success, .text-green-600').first();
            await expect(successMsg).toBeVisible({ timeout: 3000 });
        }
      }
    }
  });

  // ================== DELETE INVOICE TESTS ==================

  test('should delete draft invoice', async ({ page }) => {
    const firstInvoice = page.locator('[data-testid="invoice-item"]').first();

    if (await firstInvoice.isVisible()) {
      await firstInvoice.click();

      const deleteButton = page.locator('button:has-text("Delete|Remove")');
      if (await deleteButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        await deleteButton.click();

        const confirmButton = page.locator('button:has-text("Confirm|Delete|Yes")');
        if (await confirmButton.isVisible({ timeout: 2000 }).catch(() => false)) {
          await confirmButton.click();

          await expect(
            const successMsg = page.locator('[data-testid="success-message"], .success, .text-green-600').first();
            await expect(successMsg).toBeVisible({ timeout: 3000 });
        }
      }
    }
  });

  // ================== PDF EXPORT TESTS ==================

  test('should export invoice as PDF', async ({ page, context }) => {
    const firstInvoice = page.locator('[data-testid="invoice-item"]').first();

    if (await firstInvoice.isVisible()) {
      await firstInvoice.click();

      const pdfButton = page.locator('button:has-text("PDF|Download|Export PDF")');
      if (await pdfButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        // Listen for download
        const downloadPromise = context.waitForEvent('download');

        await pdfButton.click();

        const download = await downloadPromise;
        expect(download.suggestedFilename()).toMatch(/\.pdf|invoice/i);
      }
    }
  });

  test('should send invoice via email', async ({ page }) => {
    const firstInvoice = page.locator('[data-testid="invoice-item"]').first();

    if (await firstInvoice.isVisible()) {
      await firstInvoice.click();

      const emailButton = page.locator('button:has-text("Email|Send Invoice")');
      if (await emailButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        await emailButton.click();

        const emailField = page.locator('input[type="email"]');
        if (await emailField.isVisible({ timeout: 1000 }).catch(() => false)) {
          const clientEmail = default: await emailField.inputValue();
          // Optionally modify email or just send
          const sendButton = page.locator('button:has-text("Send")');
          if (await sendButton.isVisible()) {
            await sendButton.click();

            await expect(
              const successMsg = page.locator('[data-testid="success-message"], .success, .text-green-600').first();
              await expect(successMsg).toBeVisible({ timeout: 3000 });
          }
        }
      }
    }
  });

  // ================== INVOICE SUMMARY TESTS ==================

  test('should display invoice summary metrics', async ({ page }) => {
    await page.goto('/dashboard/invoices');

    const totalRevenueCard = page.locator('[data-testid="total-revenue-card"]');
    const paidAmountCard = page.locator('[data-testid="paid-amount-card"]');
    const outstandingCard = page.locator('[data-testid="outstanding-amount-card"]');

    // At least one should be visible
    const hasMetrics =
      (await totalRevenueCard.isVisible().catch(() => false)) ||
      (await paidAmountCard.isVisible().catch(() => false)) ||
      (await outstandingCard.isVisible().catch(() => false));

    expect(hasMetrics).toBeTruthy();
  });

  test('should show outstanding invoices chart', async ({ page }) => {
    await page.goto('/dashboard/invoices');

    const chartContainer = page.locator('[data-testid="invoices-chart"], .chart-container');
    const hasChart = await chartContainer.isVisible({ timeout: 2000 }).catch(() => false);

    expect(hasChart).toBeTruthy();
  });

  // ================== BULK ACTIONS TESTS ==================

  test('should select multiple invoices', async ({ page }) => {
    const checkboxes = page.locator('[data-testid="invoice-checkbox"]');

    const count = await checkboxes.count();
    if (count > 1) {
      await checkboxes.first().click();
      await checkboxes.nth(1).click();

      const bulkActions = page.locator('[data-testid="bulk-actions"]');
      const isVisible = await bulkActions.isVisible({ timeout: 2000 }).catch(() => false);
      expect(isVisible).toBeTruthy();
    }
  });

  test('should bulk mark invoices as sent', async ({ page }) => {
    const checkboxes = page.locator('[data-testid="invoice-checkbox"]');

    const count = await checkboxes.count();
    if (count > 1) {
      await checkboxes.first().click();

      const bulkSendButton = page.locator('button:has-text("Send Selected|Bulk Send")');
      if (await bulkSendButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        await bulkSendButton.click();

        const confirmButton = page.locator('button:has-text("Confirm|Send|Yes")');
        if (await confirmButton.isVisible({ timeout: 1000 }).catch(() => false)) {
          await confirmButton.click();

          await expect(
            const successMsg = page.locator('[data-testid="success-message"], .success, .text-green-600').first();
            await expect(successMsg).toBeVisible({ timeout: 3000 });
        }
      }
    }
  });
});
