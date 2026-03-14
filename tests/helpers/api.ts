/**
 * API Test Helper
 * Utilities for making API requests in Jest tests
 */

import { request as makeRequest, APIRequestContext } from '@playwright/test';

export interface APITestConfig {
  baseURL?: string;
  headers?: Record<string, string>;
  token?: string;
}

export class APIHelper {
  private baseURL: string;
  private headers: Record<string, string>;
  private token?: string;

  constructor(config?: APITestConfig) {
    this.baseURL = config?.baseURL || 'http://localhost:3000';
    this.headers = config?.headers || {
      'Content-Type': 'application/json',
    };
    this.token = config?.token;
  }

  /**
   * Set authorization token
   */
  setToken(token: string) {
    this.token = token;
  }

  /**
   * Get headers with auth
   */
  private getHeaders(): Record<string, string> {
    const headers = { ...this.headers };
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    return headers;
  }

  /**
   * GET request
   */
  async get(path: string, params?: Record<string, any>) {
    const url = new URL(this.baseURL + path);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    const context = await makeRequest.newContext();
    const response = await context.get(url.toString(), {
      headers: this.getHeaders(),
    });
    await context.dispose();
    return response;
  }

  /**
   * POST request
   */
  async post(path: string, data?: any) {
    const context = await makeRequest.newContext();
    const response = await context.post(this.baseURL + path, {
      headers: this.getHeaders(),
      data,
    });
    await context.dispose();
    return response;
  }

  /**
   * PUT request
   */
  async put(path: string, data?: any) {
    const context = await makeRequest.newContext();
    const response = await context.put(this.baseURL + path, {
      headers: this.getHeaders(),
      data,
    });
    await context.dispose();
    return response;
  }

  /**
   * DELETE request
   */
  async delete(path: string, params?: Record<string, any>) {
    const url = new URL(this.baseURL + path);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    const context = await makeRequest.newContext();
    const response = await context.delete(url.toString(), {
      headers: this.getHeaders(),
    });
    await context.dispose();
    return response;
  }

  /**
   * Helper to validate response status
   */
  async expectStatus(promise: Promise<any>, status: number) {
    const response = await promise;
    if (response.status() !== status) {
      const body = await response.text();
      throw new Error(
        `Expected status ${status}, got ${response.status()}. Body: ${body}`
      );
    }
    return response;
  }

  /**
   * Get JSON response
   */
  async getJSON(path: string, params?: Record<string, any>) {
    const response = await this.get(path, params);
    return response.json();
  }

  /**
   * Post JSON and get response
   */
  async postJSON(path: string, data?: any) {
    const response = await this.post(path, data);
    return response.json();
  }
}
