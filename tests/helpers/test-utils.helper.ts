import { Page } from '@playwright/test';

/**
 * Common test utilities
 */

export class TestUtils {
  /**
   * Wait for table to load
   */
  static async waitForTable(page: Page) {
    await page.waitForSelector('table tbody tr', { timeout: 10000 });
  }

  /**
   * Get row count from table
   */
  static async getTableRowCount(page: Page): Promise<number> {
    await this.waitForTable(page);
    const rows = await page.locator('table tbody tr').count();
    return rows;
  }

  /**
   * Click table row action button
   */
  static async clickTableAction(page: Page, rowText: string, action: 'edit' | 'delete' | 'view') {
    const row = page.locator(`text=${rowText}`).locator('xpath=ancestor::tr');
    
    switch (action) {
      case 'edit':
        await row.locator('button[aria-label*="Edit"]').click();
        break;
      case 'delete':
        await row.locator('button[aria-label*="Delete"]').click();
        break;
      case 'view':
        await row.locator('a, button[aria-label*="View"]').first().click();
        break;
    }
  }

  /**
   * Fill form field
   */
  static async fillFormField(page: Page, label: string, value: string) {
    const input = page.locator(`label:has-text("${label}") ~ input, input[placeholder*="${label}"]`).first();
    await input.fill(value);
  }

  /**
   * Select dropdown option
   */
  static async selectDropdown(page: Page, label: string, option: string) {
    const select = page.locator(`label:has-text("${label}") ~ select, select[aria-label*="${label}"]`).first();
    await select.selectOption(option);
  }

  /**
   * Verify toast message
   */
  static async verifyToast(page: Page, message: string, type: 'success' | 'error' | 'info' = 'success') {
    const toast = page.locator(`[role="alert"]${type === 'success' ? ':has-text("Success")' : ''} :has-text("${message}")`);
    await toast.waitFor({ timeout: 5000 });
  }

  /**
   * Clear table search
   */
  static async clearSearch(page: Page) {
    const searchInput = page.locator('input[placeholder*="Search"]').first();
    await searchInput.clear();
  }

  /**
   * Search table
   */
  static async searchTable(page: Page, query: string) {
    const searchInput = page.locator('input[placeholder*="Search"]').first();
    await searchInput.fill(query);
    await page.waitForTimeout(500); // Wait for debounce
  }

  /**
   * Verify table contains text
   */
  static async tableContainsText(page: Page, text: string): Promise<boolean> {
    const rows = await page.locator('table tbody tr').count();
    for (let i = 0; i < rows; i++) {
      const rowText = await page.locator('table tbody tr').nth(i).textContent();
      if (rowText?.includes(text)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Fill textarea
   */
  static async fillTextarea(page: Page, label: string, value: string) {
    const textarea = page.locator(`label:has-text("${label}") ~ textarea, textarea[placeholder*="${label}"]`).first();
    await textarea.fill(value);
  }

  /**
   * Click button by text
   */
  static async clickButton(page: Page, text: string) {
    await page.click(`button:has-text("${text}")`);
  }

  /**
   * Wait for navigation
   */
  static async waitForNavigation(page: Page, url?: string) {
    if (url) {
      await page.waitForURL(`**${url}**`, { timeout: 10000 });
    } else {
      await page.waitForLoadState('networkidle');
    }
  }

  /**
   * Check if element is visible
   */
  static async isElementVisible(page: Page, selector: string): Promise<boolean> {
    try {
      return await page.locator(selector).isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Get element text
   */
  static async getElementText(page: Page, selector: string): Promise<string> {
    return await page.locator(selector).textContent() || '';
  }

  /**
   * Verify modal is open
   */
  static async verifyModalOpen(page: Page) {
    await page.waitForSelector('[role="dialog"]', { timeout: 5000 });
  }

  /**
   * Close modal
   */
  static async closeModal(page: Page) {
    await page.click('button[aria-label="Close"]');
    await page.waitForSelector('[role="dialog"]', { state: 'hidden', timeout: 5000 });
  }

  /**
   * Wait for loading spinner
   */
  static async waitForLoadingComplete(page: Page) {
    await page.waitForSelector('[role="status"]:has-text("Loading")', { state: 'hidden', timeout: 10000 }).catch(() => {
      // Loading spinner might not exist or might be already gone
    });
  }
}

/**
 * Retry mechanism for flaky tests
 */
export async function retryOperation<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 1000
): Promise<T> {
  let lastError: Error | undefined;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }
  }
  
  throw lastError || new Error('Operation failed after retries');
}
