/**
 * Sage Business Cloud Accounting API Client
 * Real implementation for Sage One BCA API integration
 * API Documentation: https://resellers.accounting.sageone.co.za
 */

import https from 'https';

export interface SageCompany {
  ID: string;
  Name: string;
  Status: number;
}

export interface SageContact {
  ID: string;
  Name: string;
  Email?: string;
}

export interface SageInvoiceItem {
  Description: string;
  Quantity: number;
  UnitAmount: number;
  ProjectReference?: string;
  Notes?: string;
}

export interface SageInvoicePayload {
  CustomerName: string;
  CustomerEmail?: string;
  InvoiceNumber: string;
  InvoiceDate: string;
  DueDate?: string;
  Reference?: string;
  Items: SageInvoiceItem[];
  Notes?: string;
}

export interface SageApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  statusCode?: number;
}

/**
 * Sage One API Client
 * Supports both v1.4.2 and v2.0.0 API endpoints
 */
export class SageOneApiClient {
  private readonly username: string;
  private readonly password: string;
  private readonly apiKey?: string;
  private readonly baseUrl: string;
  private accessToken: string | null = null;
  private tokenExpiry: Date | null = null;

  constructor(username: string, password: string, apiKey?: string, baseUrl?: string) {
    this.username = username;
    this.password = password;
    this.apiKey = apiKey;
    this.baseUrl = baseUrl || 'https://resellers.accounting.sageone.co.za/api/2.0.0';
  }

  /**
   * Authenticate and get access token
   * Tries API Key method first if provided, then falls back to Basic Auth
   */
  async authenticate(): Promise<boolean> {
    try {
      // If API Key is provided, try that method first
      if (this.apiKey) {
        const response = await this.makeRequest<any>(
          'GET',
          '/Company/Current',
          {
            'Authorization': `Bearer ${this.apiKey}`,
            'Accept': 'application/json',
          }
        );
        
        if (response.success) {
          this.accessToken = this.apiKey;
          return true;
        }
      }

      // Fall back to Basic Auth with username/password
      const credentials = Buffer.from(`${this.username}:${this.password}`).toString('base64');
      
      const response = await this.makeRequest<{ AccessToken: string; ExpiresIn: number }>(
        'GET',
        '/User',
        {
          'Authorization': `Basic ${credentials}`,
          'Accept': 'application/json',
        }
      );

      if (response.success && response.data?.AccessToken) {
        this.accessToken = response.data.AccessToken;
        // Set expiry 1 minute before actual expiry to ensure refresh
        this.tokenExpiry = new Date(Date.now() + (response.data.ExpiresIn - 60) * 1000);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Sage authentication failed:', error);
      return false;
    }
  }

  /**
   * Check and refresh token if needed
   */
  private async ensureToken(): Promise<boolean> {
    if (!this.accessToken || !this.tokenExpiry || new Date() >= this.tokenExpiry) {
      return await this.authenticate();
    }
    return true;
  }

  /**
   * Get list of companies
   */
  async getCompanies(): Promise<SageApiResponse<SageCompany[]>> {
    if (!await this.ensureToken()) {
      return { success: false, error: 'Authentication failed' };
    }

    try {
      const response = await this.makeRequest<{ Companies: SageCompany[] }>(
        'GET',
        '/Company',
        this.getAuthHeaders()
      );

      return {
        success: response.success,
        data: response.data?.Companies,
        error: response.error,
      };
    } catch (error) {
      return { success: false, error: String(error) };
    }
  }

  /**
   * Get list of contacts/customers
   */
  async getContacts(): Promise<SageApiResponse<SageContact[]>> {
    if (!await this.ensureToken()) {
      return { success: false, error: 'Authentication failed' };
    }

    try {
      const response = await this.makeRequest<{ Contacts: SageContact[] }>(
        'GET',
        '/Contact',
        this.getAuthHeaders()
      );

      return {
        success: response.success,
        data: response.data?.Contacts,
        error: response.error,
      };
    } catch (error) {
      return { success: false, error: String(error) };
    }
  }

  /**
   * Create an invoice in Sage One
   */
  async createInvoice(payload: SageInvoicePayload): Promise<SageApiResponse<{ InvoiceID: string; InvoiceNumber: string }>> {
    if (!await this.ensureToken()) {
      return { success: false, error: 'Authentication failed' };
    }

    try {
      const invoiceData = {
        ContactName: payload.CustomerName,
        InvoiceNumber: payload.InvoiceNumber,
        InvoiceDate: payload.InvoiceDate,
        DueDate: payload.DueDate || payload.InvoiceDate,
        Reference: payload.Reference || '',
        Notes: payload.Notes || '',
        LineItems: payload.Items.map((item) => ({
          Description: item.Description,
          Quantity: item.Quantity,
          UnitAmount: item.UnitAmount,
          ProjectReference: item.ProjectReference || '',
          Notes: item.Notes || '',
        })),
      };

      const response = await this.makeRequest<{ InvoiceID: string; InvoiceNumber: string }>(
        'POST',
        '/Invoice',
        this.getAuthHeaders(),
        invoiceData
      );

      return {
        success: response.success,
        data: response.data,
        error: response.error,
      };
    } catch (error) {
      return { success: false, error: String(error) };
    }
  }

  /**
   * Get invoice details
   */
  async getInvoice(invoiceId: string): Promise<SageApiResponse<any>> {
    if (!await this.ensureToken()) {
      return { success: false, error: 'Authentication failed' };
    }

    try {
      const response = await this.makeRequest<any>(
        'GET',
        `/Invoice/${invoiceId}`,
        this.getAuthHeaders()
      );

      return {
        success: response.success,
        data: response.data,
        error: response.error,
      };
    } catch (error) {
      return { success: false, error: String(error) };
    }
  }

  /**
   * Make HTTP request to Sage API
   */
  private makeRequest<T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    endpoint: string,
    headers: Record<string, string>,
    body?: any
  ): Promise<SageApiResponse<T>> {
    return new Promise((resolve) => {
      const url = new URL(this.baseUrl + endpoint);
      const options = {
        hostname: url.hostname,
        port: 443,
        path: url.pathname + url.search,
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
      };

      const req = https.request(options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          try {
            const parsed = data ? JSON.parse(data) : {};
            resolve({
              success: res.statusCode && res.statusCode >= 200 && res.statusCode < 300,
              data: parsed as T,
              statusCode: res.statusCode,
            });
          } catch (error) {
            resolve({
              success: false,
              error: `Failed to parse response: ${String(error)}`,
              statusCode: res.statusCode,
            });
          }
        });
      });

      req.on('error', (error) => {
        resolve({
          success: false,
          error: `Request failed: ${error.message}`,
        });
      });

      if (body) {
        req.write(JSON.stringify(body));
      }

      req.end();
    });
  }

  /**
   * Get auth headers with bearer token or API Key
   */
  private getAuthHeaders(): Record<string, string> {
    return {
      'Authorization': `Bearer ${this.accessToken || this.apiKey}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };
  }
}

/**
 * Demo/Testing endpoint identity
 */
export async function testSageConnection(username: string, password: string): Promise<SageApiResponse<any>> {
  try {
    const client = new SageOneApiClient(username, password);
    
    if (!await client.authenticate()) {
      return { success: false, error: 'Authentication failed with provided credentials' };
    }

    const companies = await client.getCompanies();
    return {
      success: companies.success,
      data: {
        authenticated: true,
        companies: companies.data,
      },
      error: companies.error,
    };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}
