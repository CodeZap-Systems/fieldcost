/**
 * E2E Test Suite - Quotes
 * Tests for complete quote workflow including creation, editing, acceptance, and rejection
 */

import { test, expect, Page } from '@playwright/test';
import { loginUser } from '../helpers/auth';
import { SAMPLE_QUOTE, generateTestQuote } from '../fixtures/documents';

const BASE_URL = 'http://localhost:3000';

const TEST_USER = {
  email: 'qa_test_user@fieldcost.com',
  password: 'TestPassword123',
};

test.describe('Quote Management - E2E Tests', () => {
  let page: Page;

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
    await loginUser(page, TEST_USER);
  });

  test.afterEach(async () => {
    await page.close();
  });

  test('TC101: Create quote with single line item', async () => {
    // Navigate to quotes page
    await page.goto(`${BASE_URL}/dashboard/quotes`);
    
    // Click add quote button
    await page.click('a:has-text("Add Quote"), button:has-text("Add Quote")');
    await page.waitForURL(`**/quotes/add`);
    
    // Fill quote form
    await page.selectOption('select[name="customer"]', { label: SAMPLE_QUOTE.customerName });
    await page.fill('input[name="reference"]', SAMPLE_QUOTE.reference);
    
    // Set valid until date
    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + 30);
    await page.fill('input[name="validUntil"], input[name="valid_until"]', 
      validUntil.toISOString().split('T')[0]);
    
    // Add line item
    await page.click('button:has-text("Add Line Item")');
    await page.fill('input[name*="itemName"]', SAMPLE_QUOTE.lines[0].itemName);
    await page.fill('input[name*="quantity"]', SAMPLE_QUOTE.lines[0].quantity.toString());
    await page.fill('input[name*="rate"]', SAMPLE_QUOTE.lines[0].rate.toString());
    
    // Submit form
    await page.click('button:has-text("Create Quote")');
    
    // Verify success
    await expect(page.locator('text=Quote created successfully')).toBeVisible({ timeout: 5000 });
  });

  test('TC102: Create quote with multiple line items', async () => {
    await page.goto(`${BASE_URL}/dashboard/quotes/add`);
    
    const quote = generateTestQuote();
    
    // Fill header
    await page.selectOption('select[name="customer"]', { label: 'XYZ Development Inc' });
    await page.fill('input[name="reference"]', quote.reference);
    
    // Add all line items
    for (let i = 0; i < quote.lines.length; i++) {
      if (i > 0) {
        await page.click('button:has-text("Add Line Item")');
      }
      
      const line = quote.lines[i];
      const lineIndex = i > 0 ? `[${i}]` : '';
      
      await page.fill(`input[name*="itemName"]${lineIndex}`, line.itemName);
      await page.fill(`input[name*="quantity"]${lineIndex}`, line.quantity.toString());
      await page.fill(`input[name*="rate"]${lineIndex}`, line.rate.toString());
    }
    
    // Submit
    await page.click('button:has-text("Create Quote")');
    await expect(page.locator('text=Quote created successfully')).toBeVisible({ timeout: 5000 });
  });

  test('TC103: Edit quote', async () => {
    await page.goto(`${BASE_URL}/dashboard/quotes`);
    
    // Click first quote
    await page.click('a >> first-of-type');
    await expect(page).toHaveURL(/\/quotes\/\d+/);
    
    // Edit reference
    const newReference = `MODIFIED-${Date.now()}`;
    await page.fill('input[name="reference"]', newReference);
    
    // Save
    await page.click('button:has-text("Save Changes"), button:has-text("Update Quote")');
    
    // Verify
    await expect(page.locator(`text=${newReference}`)).toBeVisible({ timeout: 5000 });
  });

  test('TC104: Accept quote', async () => {
    await page.goto(`${BASE_URL}/dashboard/quotes`);
    
    // Open first quote
    await page.click('a >> first-of-type');
    
    // Click accept button
    await page.click('button:has-text("Accept Quote"), button:has-text("Approve")');
    
    // Confirm acceptance
    await page.click('button:has-text("Confirm"), button:has-text("Yes")');
    
    // Verify status changed to accepted
    const status = await page.locator('[data-testid="quote-status"]').textContent();
    expect(status).toContain('Accepted');
  });

  test('TC105: Reject quote', async () => {
    await page.goto(`${BASE_URL}/dashboard/quotes`);
    
    // Open first quote
    await page.click('a >> first-of-type');
    
    // Click reject button
    await page.click('button:has-text("Reject Quote"), button:has-text("Decline")');
    
    // Add rejection reason
    await page.fill('textarea[name="rejectionReason"]', 'Price too high');
    
    // Confirm rejection
    await page.click('button:has-text("Confirm"), button:has-text("Submit")');
    
    // Verify status
    const status = await page.locator('[data-testid="quote-status"]').textContent();
    expect(status).toContain('Rejected');
  });

  test('TC106: Delete quote', async () => {
    await page.goto(`${BASE_URL}/dashboard/quotes`);
    
    const countBefore = await page.locator('[data-testid="quote-item"]').count();
    
    // Delete first quote
    await page.click('button[title="Delete"], button:has-text("Delete") >> first-of-type');
    await page.click('button:has-text("Confirm"), button:has-text("Yes")');
    
    // Verify deletion
    await expect(page.locator('text=Quote deleted')).toBeVisible({ timeout: 5000 });
    
    const countAfter = await page.locator('[data-testid="quote-item"]').count();
    expect(countAfter).toBeLessThan(countBefore);
  });

  test('TC107: Filter quotes by status', async () => {
    await page.goto(`${BASE_URL}/dashboard/quotes`);
    
    // Filter by accepted
    await page.click('button:has-text("Status")');
    await page.click('label:has-text("Accepted")');
    
    // Verify results
    const statuses = await page.locator('[data-testid="quote-status"]').allTextContents();
    statuses.forEach(status => {
      expect(status.toLowerCase()).toContain('accepted');
    });
  });

  test('TC108: Convert quote to invoice', async () => {
    await page.goto(`${BASE_URL}/dashboard/quotes`);
    
    // Open accepted quote
    await page.click('a >> first-of-type');
    
    // Click convert to invoice
    await page.click('button:has-text("Convert to Invoice")');
    
    // Confirm conversion
    await page.click('button:has-text("Confirm"), button:has-text("Yes")');
    
    // Verify invoice created
    await expect(page.locator('text=Invoice created from quote')).toBeVisible({ timeout: 5000 });
  });

  test('TC109: Verify quote expiration warning', async () => {
    await page.goto(`${BASE_URL}/dashboard/quotes/add`);
    
    // Set valid until date to yesterday
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 1);
    
    await page.fill('input[name="validUntil"], input[name="valid_until"]', 
      pastDate.toISOString().split('T')[0]);
    
    // Should show warning
    await expect(page.locator('text=expired|past')).toBeVisible({ timeout: 3000 });
  });

  test('TC110: Export quote as PDF', async () => {
    await page.goto(`${BASE_URL}/dashboard/quotes`);
    
    const downloadPromise = page.waitForEvent('download');
    await page.click('button[title="Export"], button:has-text("Export") >> first-of-type');
    
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toContain('.pdf');
  });

  test('TC111: Calculate quote total with tax', async () => {
    await page.goto(`${BASE_URL}/dashboard/quotes/add`);
    
    const subTotal = 1000;
    const taxPercent = 15;
    const expectedTotal = subTotal * (1 + taxPercent / 100);
    
    // Add line item with subtotal
    await page.fill('input[name*="quantity"]', '10');
    await page.fill('input[name*="rate"]', '100');
    
    // Apply tax
    await page.fill('input[name="tax"], input[name="taxPercent"]', taxPercent.toString());
    
    // Verify total
    const totalElement = await page.locator('[data-testid="quote-total"]').textContent();
    expect(totalElement).toContain(expectedTotal.toString());
  });

  test('TC112: Add notes and terms to quote', async () => {
    await page.goto(`${BASE_URL}/dashboard/quotes/add`);
    
    const terms = 'Payment due within 30 days of acceptance';
    const notes = 'This quote includes all materials and labor';
    
    // Fill basic fields
    await page.selectOption('select[name="customer"]', { label: 'Test Customer' });
    
    // Fill terms and notes
    await page.fill('textarea[name="terms"]', terms);
    await page.fill('textarea[name="notes"]', notes);
    
    // Create and verify
    await page.click('button:has-text("Create Quote")');
    await expect(page.locator('text=Quote created')).toBeVisible({ timeout: 5000 });
  });
});
