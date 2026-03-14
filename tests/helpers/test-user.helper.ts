/**
 * Test User Generator
 * Utility functions for creating test users
 */

import { Page } from '@playwright/test';
import LoginHelper from './login.helper';

export class TestUserGenerator {
  private static userCounter = 0;

  /**
   * Generate unique email for test user
   */
  static generateEmail(prefix = 'testuser'): string {
    const timestamp = Date.now();
    const counter = ++this.userCounter;
    return `${prefix}_${timestamp}_${counter}@fieldcost-test.com`;
  }

  /**
   * Generate unique company name
   */
  static generateCompanyName(prefix = 'TestCompany'): string {
    const timestamp = Date.now();
    return `${prefix}_${timestamp}`;
  }

  /**
   * Create a test user via registration
   */
  static async createUser(
    page: Page,
    firstName: string,
    lastName: string,
    password: string,
    companyName?: string
  ) {
    const email = this.generateEmail();
    const company = companyName || this.generateCompanyName();

    await LoginHelper.register(page, firstName, lastName, email, password, company);

    return {
      email,
      password,
      firstName,
      lastName,
      companyName: company,
    };
  }

  /**
   * Create multiple test users
   */
  static async createUsers(
    page: Page,
    count: number,
    basePassword = 'TestPassword123'
  ) {
    const users = [];

    for (let i = 0; i < count; i++) {
      const user = await this.createUser(
        page,
        `Test`,
        `User${i + 1}`,
        basePassword
      );
      users.push(user);

      // Add delay between registrations
      await page.waitForTimeout(500);
    }

    return users;
  }

  /**
   * Reset user counter
   */
  static resetCounter() {
    this.userCounter = 0;
  }
}

export default TestUserGenerator;
