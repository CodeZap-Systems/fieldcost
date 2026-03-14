import https from "https";

interface XeroAuthToken {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  token_type: string;
}

interface XeroInvoice {
  InvoiceID: string;
  InvoiceNumber: string;
  Status: string;
  Total: number;
  LineAmountTypes: string;
  Contact: {
    ContactID: string;
    Name: string;
  };
}

interface XeroContact {
  ContactID: string;
  Name: string;
  EmailAddress?: string;
  Phones?: Array<{
    PhoneNumber: string;
    PhoneType: string;
  }>;
}

interface XeroItem {
  ItemID: string;
  Code: string;
  Description: string;
  UnitAmount: number;
  Quantity?: number;
  SalesDetails?: {
    UnitAmount: number;
  };
}

export class XeroApiClient {
  private clientId: string;
  private clientSecret: string;
  private redirectUri: string;
  private baseUrl = "https://api.xero.com/api.xro/2.0";
  private authBaseUrl = "https://login.xero.com/identity/connect/token";
  private accessToken?: string;
  private refreshToken?: string;
  private tenantId?: string;
  private tokenExpiry?: number;

  constructor(
    clientId: string,
    clientSecret: string,
    redirectUri: string,
    accessToken?: string,
    refreshToken?: string,
    tenantId?: string
  ) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.redirectUri = redirectUri;
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.tenantId = tenantId;
  }

  /**
   * Generate OAuth authorization URL
   */
  getAuthorizationUrl(state?: string): string {
    const params = new URLSearchParams({
      response_type: "code",
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      scope: "offline_access openid profile email accounting",
      state: state || "fieldcost-xero-auth",
    });

    return `https://login.xero.com/identity/connect/authorize?${params.toString()}`;
  }

  /**
   * Exchange authorization code for access token
   */
  async exchangeCodeForToken(code: string): Promise<XeroAuthToken> {
    return new Promise((resolve, reject) => {
      const body = new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: this.redirectUri,
        client_id: this.clientId,
        client_secret: this.clientSecret,
      });

      const options = {
        hostname: "login.xero.com",
        path: "/identity/connect/token",
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Content-Length": Buffer.byteLength(body.toString()),
        },
      };

      const req = https.request(options, (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          try {
            const result = JSON.parse(data);
            this.accessToken = result.access_token;
            this.refreshToken = result.refresh_token;
            this.tokenExpiry = Date.now() + result.expires_in * 1000;
            resolve(result);
          } catch (error) {
            reject(new Error(`Failed to parse token response: ${data}`));
          }
        });
      });

      req.on("error", reject);
      req.write(body.toString());
      req.end();
    });
  }

  /**
   * Refresh access token
   */
  async refreshAccessToken(): Promise<XeroAuthToken> {
    if (!this.refreshToken) {
      throw new Error("No refresh token available");
    }

    return new Promise((resolve, reject) => {
      const body = new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: this.refreshToken!,
        client_id: this.clientId,
        client_secret: this.clientSecret,
      });

      const options = {
        hostname: "login.xero.com",
        path: "/identity/connect/token",
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Content-Length": Buffer.byteLength(body.toString()),
        },
      };

      const req = https.request(options, (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          try {
            const result = JSON.parse(data);
            this.accessToken = result.access_token;
            if (result.refresh_token) {
              this.refreshToken = result.refresh_token;
            }
            this.tokenExpiry = Date.now() + result.expires_in * 1000;
            resolve(result);
          } catch (error) {
            reject(new Error(`Failed to parse refresh token response: ${data}`));
          }
        });
      });

      req.on("error", reject);
      req.write(body.toString());
      req.end();
    });
  }

  /**
   * Ensure token is valid, refresh if needed
   */
  private async ensureValidToken(): Promise<void> {
    if (!this.accessToken) {
      throw new Error("No access token available. Please authenticate first.");
    }

    // Refresh if token expires in next 1 minute
    if (this.tokenExpiry && Date.now() > this.tokenExpiry - 60000) {
      await this.refreshAccessToken();
    }
  }

  /**
   * Make authenticated HTTP request to Xero API
   */
  private async makeRequest<T>(
    method: string,
    path: string,
    body?: unknown
  ): Promise<T> {
    await this.ensureValidToken();

    return new Promise((resolve, reject) => {
      const bodyStr = body ? JSON.stringify(body) : undefined;
      const options = {
        hostname: "api.xero.com",
        path: `/api.xro/2.0${path}`,
        method,
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          "Xero-Tenant-Id": this.tenantId || "",
          "Content-Type": "application/json",
          Accept: "application/json",
          ...(bodyStr && { "Content-Length": Buffer.byteLength(bodyStr) }),
        },
      };

      const req = https.request(options, (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          try {
            const result = JSON.parse(data);
            if (res.statusCode && res.statusCode >= 400) {
              reject(new Error(`Xero API Error: ${JSON.stringify(result)}`));
            } else {
              resolve(result);
            }
          } catch (error) {
            reject(new Error(`Failed to parse response: ${data}`));
          }
        });
      });

      req.on("error", reject);
      if (bodyStr) {
        req.write(bodyStr);
      }
      req.end();
    });
  }

  /**
   * Get list of contacts (customers/suppliers)
   */
  async getContacts(): Promise<XeroContact[]> {
    const response = await this.makeRequest<{ Contacts: XeroContact[] }>(
      "GET",
      "/Contacts"
    );
    return response.Contacts || [];
  }

  /**
   * Get single contact by ID
   */
  async getContact(contactId: string): Promise<XeroContact> {
    const response = await this.makeRequest<{ Contacts: XeroContact[] }>(
      "GET",
      `/Contacts/${contactId}`
    );
    return response.Contacts[0];
  }

  /**
   * Create a new contact
   */
  async createContact(contact: {
    Name: string;
    EmailAddress?: string;
    ContactStatus?: string;
  }): Promise<XeroContact> {
    const response = await this.makeRequest<{ Contacts: XeroContact[] }>(
      "PUT",
      "/Contacts",
      { Contacts: [contact] }
    );
    return response.Contacts[0];
  }

  /**
   * Get list of items (products/services)
   */
  async getItems(): Promise<XeroItem[]> {
    const response = await this.makeRequest<{ Items: XeroItem[] }>(
      "GET",
      "/Items"
    );
    return response.Items || [];
  }

  /**
   * Get single item by ID
   */
  async getItem(itemId: string): Promise<XeroItem> {
    const response = await this.makeRequest<{ Items: XeroItem[] }>(
      "GET",
      `/Items/${itemId}`
    );
    return response.Items[0];
  }

  /**
   * Get list of invoices
   */
  async getInvoices(
    filter?: string,
    order?: string
  ): Promise<XeroInvoice[]> {
    let path = "/Invoices";
    const params = new URLSearchParams();
    if (filter) params.append("where", filter);
    if (order) params.append("order", order);
    const queryString = params.toString();
    if (queryString) path += `?${queryString}`;

    const response = await this.makeRequest<{ Invoices: XeroInvoice[] }>(
      "GET",
      path
    );
    return response.Invoices || [];
  }

  /**
   * Create invoice
   */
  async createInvoice(invoice: {
    Type: string; // "ACCREC" for sales, "ACCPAY" for purchase
    Contact: { Name: string };
    LineItems: Array<{
      Description: string;
      Quantity: number;
      UnitAmount: number;
    }>;
    DueDate?: string;
    Reference?: string;
  }): Promise<XeroInvoice> {
    const response = await this.makeRequest<{ Invoices: XeroInvoice[] }>(
      "PUT",
      "/Invoices",
      { Invoices: [invoice] }
    );
    return response.Invoices[0];
  }

  /**
   * Test Xero connection
   */
  async testConnection(): Promise<{ success: boolean; tenant?: string }> {
    try {
      const contacts = await this.getContacts();
      return { success: true, tenant: this.tenantId };
    } catch (error) {
      return { success: false };
    }
  }

  /**
   * Set tenant ID (required for all API calls)
   */
  setTenantId(tenantId: string): void {
    this.tenantId = tenantId;
  }

  /**
   * Get current tenant ID
   */
  getTenantId(): string | undefined {
    return this.tenantId;
  }

  /**
   * Get current access token
   */
  getAccessToken(): string | undefined {
    return this.accessToken;
  }

  /**
   * Get current refresh token
   */
  getRefreshToken(): string | undefined {
    return this.refreshToken;
  }
}

/**
 * Test Xero connection with basic auth
 */
export async function testXeroConnection(
  clientId: string,
  clientSecret: string,
  redirectUri: string,
  accessToken?: string,
  tenantId?: string
): Promise<{ success: boolean; error?: string; data?: unknown }> {
  try {
    const client = new XeroApiClient(
      clientId,
      clientSecret,
      redirectUri,
      accessToken,
      undefined,
      tenantId
    );

    const result = await client.testConnection();

    return {
      success: result.success,
      data: result,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export default XeroApiClient;
