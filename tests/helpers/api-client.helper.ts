import axios, { AxiosInstance } from 'axios';

export interface ApiTestConfig {
  baseURL?: string;
  token?: string;
  companyId?: string;
}

export class ApiClient {
  private client: AxiosInstance;
  private baseURL: string;
  private companyId?: string;

  constructor(config: ApiTestConfig = {}) {
    this.baseURL = config.baseURL || 'https://fieldcost.vercel.app';
    this.companyId = config.companyId;
    
    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json',
        ...(config.token && { 'Authorization': `Bearer ${config.token}` }),
      },
    });
  }

  /**
   * GET request
   */
  async get(endpoint: string, params?: any) {
    return this.client.get(endpoint, {
      params: {
        ...params,
        ...(this.companyId && { company_id: this.companyId }),
      },
    });
  }

  /**
   * POST request
   */
  async post(endpoint: string, data?: any) {
    const payload = {
      ...data,
      ...(this.companyId && !data?.company_id && { company_id: this.companyId }),
    };
    return this.client.post(endpoint, payload);
  }

  /**
   * PUT request
   */
  async put(endpoint: string, data?: any) {
    const payload = {
      ...data,
      ...(this.companyId && !data?.company_id && { company_id: this.companyId }),
    };
    return this.client.put(endpoint, payload);
  }

  /**
   * PATCH request
   */
  async patch(endpoint: string, data?: any) {
    const payload = {
      ...data,
      ...(this.companyId && !data?.company_id && { company_id: this.companyId }),
    };
    return this.client.patch(endpoint, payload);
  }

  /**
   * DELETE request
   */
  async delete(endpoint: string, params?: any) {
    return this.client.delete(endpoint, { params });
  }

  /**
   * Set authentication token
   */
  setToken(token: string) {
    this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  /**
   * Set company context
   */
  setCompanyId(companyId: string) {
    this.companyId = companyId;
  }

  /**
   * Get raw axios instance for advanced usage
   */
  getRawClient(): AxiosInstance {
    return this.client;
  }
}

/**
 * Create API client with test credentials
 */
export async function createTestApiClient(baseURL?: string): Promise<ApiClient> {
  const client = new ApiClient({ baseURL });
  
  try {
    // Login to get token
    const loginResponse = await axios.post(
      `${baseURL}/api/auth/login`,
      {
        email: 'qa_test_user@fieldcost.com',
        password: 'TestPassword123',
      }
    );
    
    if (loginResponse.data.token) {
      client.setToken(loginResponse.data.token);
    } else if (loginResponse.data.session?.access_token) {
      client.setToken(loginResponse.data.session.access_token);
    }
  } catch (error) {
    console.warn('Failed to auto-authenticate API client:', error);
  }
  
  return client;
}
