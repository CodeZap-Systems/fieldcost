/**
 * API Test Helper Functions
 * Utilities for making API calls in tests (using Supertest)
 */

import request from 'supertest';
import type { Test } from 'supertest';
import { TEST_CONFIG, getCompanyHeaders } from './tier2-setup';

const API_BASE = 'http://localhost:3000';

export interface ApiResponse<T = any> {
  status: number;
  body: T;
  headers: Record<string, any>;
  text?: string;
  error?: string;
}

/**
 * Create Supertest request instance
 */
function createRequest(method: string, endpoint: string): Test {
  const req = request(API_BASE)[method.toLowerCase() as keyof typeof request](endpoint);
  return req;
}

/**
 * Make authenticated API call with Supertest
 */
export async function apiCall<T = any>(
  method: string,
  endpoint: string,
  body?: any,
  userId?: string,
  companyId?: number
): Promise<ApiResponse<T>> {
  const finalUserId = userId || TEST_CONFIG.TEST_USER_ID;
  const finalCompanyId = companyId || TEST_CONFIG.TEST_COMPANY_ID;
  
  // Add query parameters for user_id and company_id
  const separator = endpoint.includes('?') ? '&' : '?';
  const url = `${endpoint.startsWith('/') ? '' : '/'}${endpoint}${separator}user_id=${encodeURIComponent(finalUserId)}&company_id=${finalCompanyId}`;
  
  try {
    let req = createRequest(method, url);
    
    // Add headers
    const headers = getCompanyHeaders(finalCompanyId, finalUserId);
    
    for (const [key, value] of Object.entries(headers)) {
      req = req.set(key, value);
    }
    
    // Add body for POST/PATCH/PUT
    if (body && ['POST', 'PATCH', 'PUT'].includes(method.toUpperCase())) {
      req = req.send(body);
    }
    
    // Log if enabled
    if (TEST_CONFIG.LOG_API_CALLS) {
      console.log(`[API] ${method} ${url}`, body ? `body: ${JSON.stringify(body).substring(0, 100)}...` : '');
    }
    
    const response = await req;
    
    return {
      status: response.status,
      body: response.body,
      headers: response.headers,
      text: response.text,
    };
  } catch (error) {
    if (TEST_CONFIG.LOG_API_CALLS) {
      console.error(`[API Error] ${method} ${url}:`, error instanceof Error ? error.message : error);
    }
    
    // For Supertest, we can still get status/body even on error
    const superTestError = error as any;
    return {
      status: superTestError?.status || 500,
      body: superTestError?.response?.body || null as T,
      headers: superTestError?.response?.headers || {},
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * GET request helper
 */
export async function GET<T = any>(
  endpoint: string,
  userId?: string,
  companyId?: number
): Promise<ApiResponse<T>> {
  return apiCall<T>('GET', endpoint, undefined, userId, companyId);
}

/**
 * POST request helper
 */
export async function POST<T = any>(
  endpoint: string,
  body?: any,
  userId?: string,
  companyId?: number
): Promise<ApiResponse<T>> {
  return apiCall<T>('POST', endpoint, body, userId, companyId);
}

/**
 * PATCH request helper
 */
export async function PATCH<T = any>(
  endpoint: string,
  body?: any,
  userId?: string,
  companyId?: number
): Promise<ApiResponse<T>> {
  return apiCall<T>('PATCH', endpoint, body, userId, companyId);
}

/**
 * PUT request helper
 */
export async function PUT<T = any>(
  endpoint: string,
  body?: any,
  userId?: string,
  companyId?: number
): Promise<ApiResponse<T>> {
  return apiCall<T>('PUT', endpoint, body, userId, companyId);
}

/**
 * DELETE request helper
 */
export async function DELETE<T = any>(
  endpoint: string,
  userId?: string,
  companyId?: number
): Promise<ApiResponse<T>> {
  return apiCall<T>('DELETE', endpoint, undefined, userId, companyId);
}

/**
 * Create a request builder for chainable API calls
 * Useful for more complex requests
 */
export function createApiBuilder() {
  return {
    post(endpoint: string, body?: any, userId?: string, companyId?: number) {
      return POST(endpoint, body, userId, companyId);
    },
    get(endpoint: string, userId?: string, companyId?: number) {
      return GET(endpoint, userId, companyId);
    },
    patch(endpoint: string, body?: any, userId?: string, companyId?: number) {
      return PATCH(endpoint, body, userId, companyId);
    },
    delete(endpoint: string, userId?: string, companyId?: number) {
      return DELETE(endpoint, userId, companyId);
    },
    // For direct Supertest access when needed
    raw(method: string, endpoint: string) {
      return createRequest(method, endpoint);
    },
  };
}
