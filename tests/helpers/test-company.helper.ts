/**
 * Test Company Generator
 * Utility functions for company testing
 */

import { Page, expect } from '@playwright/test';

export class TestCompanyGenerator {
  private static companyCounter = 0;

  /**
   * Generate unique company name
   */
  static generateCompanyName(prefix = 'TestCo'): string {
    const timestamp = Date.now();
    this.companyCounter++;
    return `${prefix}_${timestamp}_${this.companyCounter}`;
  }

  /**
   * Create a company via API
   */
  static async createCompanyViaAPI(
    apiUrl: string,
    authToken: string,
    companyData?: Partial<any>
  ) {
    const defaultData = {
      name: this.generateCompanyName(),
      description: 'Test company for automated testing',
      address: '123 Test St, Sydney NSW 2000',
      phone: '+61212345678',
      email: 'test@company.com',
      abn: Math.random().toString().slice(2, 13), // 11 digit ABN
    };

    const data = { ...defaultData, ...companyData };

    const response = await fetch(`${apiUrl}/api/company`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to create company: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Edit company via API
   */
  static async editCompanyViaAPI(
    apiUrl: string,
    authToken: string,
    companyId: string,
    companyData: any
  ) {
    const response = await fetch(`${apiUrl}/api/company/${companyId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(companyData),
    });

    if (!response.ok) {
      throw new Error(`Failed to edit company: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Create company via UI
   */
  static async createCompanyViaUI(page: Page, companyData?: any) {
    await page.goto('/dashboard/setup-company');

    const data = {
      name: this.generateCompanyName(),
      description: 'Test company',
      phone: '+61212345678',
      address: '123 Test St, Sydney NSW 2000',
      ...companyData,
    };

    // Fill form fields
    await page.fill('input[name="companyName"]', data.name);
    await page.fill('input[name="phone"]', data.phone);
    await page.fill('input[name="address"]', data.address);

    if (data.description) {
      const descField = page.locator('textarea[name="description"]');
      if (await descField.isVisible()) {
        await descField.fill(data.description);
      }
    }

    // Submit form
    await page.click('button[type="submit"]');

    // Wait for success
    await expect(page.locator('text=Company updated|Success')).toBeVisible({
      timeout: 5000,
    });

    return data;
  }

  /**
   * Upload company logo
   */
  static async uploadLogo(page: Page, filePath: string) {
    const fileInput = page.locator('input[type="file"]');

    if (await fileInput.isVisible()) {
      await fileInput.setInputFiles(filePath);

      // Wait for upload to complete
      await page.waitForTimeout(2000);
    }
  }

  /**
   * Switch company
   */
  static async switchCompanyViaAPI(
    apiUrl: string,
    authToken: string,
    companyId: string
  ) {
    const response = await fetch(`${apiUrl}/api/company/switch`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ companyId }),
    });

    if (!response.ok) {
      throw new Error(`Failed to switch company: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get current company
   */
  static async getCurrentCompanyViaAPI(
    apiUrl: string,
    authToken: string
  ) {
    const response = await fetch(`${apiUrl}/api/company`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to get company: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Reset counter
   */
  static resetCounter() {
    this.companyCounter = 0;
  }
}

export default TestCompanyGenerator;
