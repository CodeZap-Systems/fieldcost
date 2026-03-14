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

export interface SageItem {
  ID: string;
  Code: string;
  Name: string;
  Description?: string;
  SalesPrice?: number;
  PurchasePrice?: number;
  Quantity?: number;
  UnitOfSales?: string;
  Status: number;
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
  private readonly apiToken?: string;
  private readonly baseUrl: string;
  private accessToken: string | null = null;
  private tokenExpiry: Date | null = null;

  constructor(username: string, password: string, apiToken?: string, baseUrl?: string) {
    this.username = username;
    this.password = password;
    this.apiToken = apiToken;
    this.baseUrl = baseUrl || 'https://resellers.accounting.sageone.co.za/api/2.0.0';
  }

  /**
   * Authenticate and get access token
   * Tries API Token method first if provided, then falls back to Basic Auth
   */
  async authenticate(): Promise<boolean> {
    try {
      // If API Token is provided, use it directly
      if (this.apiToken) {
        // Test the token by making a request to Company/Current
        const response = await this.makeRequest<any>(
          'GET',
          '/Company/Current',
          {
            'Authorization': `Bearer ${this.apiToken}`,
            'Accept': 'application/json',
          }
        );
        
        if (response.success) {
          this.accessToken = this.apiToken;
          console.log('✅ Sage API Token authentication successful');
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
        console.log('✅ Sage Basic Auth authentication successful');
        return true;
      }
      console.error('❌ Sage authentication failed');
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
    if (!this.accessToken || (this.tokenExpiry && new Date() >= this.tokenExpiry)) {
      return await this.authenticate();
    }
    return true;
  }

  /**
   * Get current company details
   */
  async getCurrentCompany(): Promise<SageApiResponse<any>> {
    if (!await this.ensureToken()) {
      return { success: false, error: 'Authentication failed' };
    }

    try {
      const response = await this.makeRequest<any>(
        'GET',
        '/Company/Current',
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
   * Get list of items/stock
   */
  async getItems(): Promise<SageApiResponse<SageItem[]>> {
    if (!await this.ensureToken()) {
      return { success: false, error: 'Authentication failed' };
    }

    try {
      const response = await this.makeRequest<{ Items: SageItem[] }>(
        'GET',
        '/Item',
        this.getAuthHeaders()
      );

      return {
        success: response.success,
        data: response.data?.Items,
        error: response.error,
      };
    } catch (error) {
      return { success: false, error: String(error) };
    }
  }

  /**
   * Get specific item by ID
   */
  async getItem(itemId: string): Promise<SageApiResponse<SageItem>> {
    if (!await this.ensureToken()) {
      return { success: false, error: 'Authentication failed' };
    }

    try {
      const response = await this.makeRequest<SageItem>(
        'GET',
        `/Item/${itemId}`,
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
   * Get auth headers with bearer token or API Token
   */
  private getAuthHeaders(): Record<string, string> {
    return {
      'Authorization': `Bearer ${this.accessToken || this.apiToken}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };
  }
}

/**
 * Demo/Testing endpoint identity
 */
export async function testSageConnection(username: string, password: string, apiToken?: string): Promise<SageApiResponse<any>> {
  try {
    const client = new SageOneApiClient(username, password, apiToken);
    
    if (!await client.authenticate()) {
      return { success: false, error: 'Authentication failed with provided credentials' };
    }

    const company = await client.getCurrentCompany();
    return {
      success: company.success,
      data: {
        authenticated: true,
        company: company.data,
      },
      error: company.error,
    };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}
