/**
 * API Test Helpers
 * Utilities for making API requests in tests
 */

import axios, { AxiosInstance } from 'axios';
import { TestUser } from './testUsers';

const BASE_URL = 'http://localhost:3000';

export class ApiClient {
  private client: AxiosInstance;
  private token?: string;
  
  constructor(token?: string) {
    this.token = token;
    this.client = axios.create({
      baseURL: BASE_URL,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    });
  }
  
  /**
   * GET request
   */
  async get<T>(url: string, params?: Record<string, any>): Promise<T> {
    const response = await this.client.get<T>(url, { params });
    return response.data;
  }
  
  /**
   * POST request
   */
  async post<T>(url: string, data?: any): Promise<T> {
    const response = await this.client.post<T>(url, data);
    return response.data;
  }
  
  /**
   * PATCH request
   */
  async patch<T>(url: string, data?: any): Promise<T> {
    const response = await this.client.patch<T>(url, data);
    return response.data;
  }
  
  /**
   * DELETE request
   */
  async delete<T>(url: string): Promise<T> {
    const response = await this.client.delete<T>(url);
    return response.data;
  }
  
  /**
   * Get raw response for status code checking
   */
  async getRaw(url: string, params?: Record<string, any>) {
    return this.client.get(url, { params });
  }
  
  /**
   * Post raw response
   */
  async postRaw(url: string, data?: any) {
    return this.client.post(url, data);
  }
}

/**
 * Create API client for authenticated user
 */
export async function createAuthenticatedClient(user: TestUser): Promise<ApiClient> {
  // In a real scenario, you'd get a token from login
  // For now, return a client that can be used for API testing
  return new ApiClient();
}

/**
 * Create unauthenticated API client
 */
export function createUnauthenticatedClient(): ApiClient {
  return new ApiClient();
}
