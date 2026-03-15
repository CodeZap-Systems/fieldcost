/**
 * Paystack API Client
 * Handle payments and customer management via Paystack
 */

import { paystackConfig } from './paymentProviders';

export interface PaystackInitializePaymentParams {
  email: string;
  amount: number; // in kobo (multiply by 100)
  reference?: string;
  metadata?: Record<string, any>;
}

export interface PaystackVerifyPaymentResponse {
  status: boolean;
  message: string;
  data?: {
    reference: string;
    amount: number;
    status: string;
    customer: {
      id: number;
      email: string;
    };
    authorization: {
      authorization_code: string;
      card_type: string;
      last4: string;
    };
  };
}

export interface PaystackSubscriptionParams {
  customer: number; // Paystack customer ID
  plan: number; // Paystack plan ID
  authorization: string; // Authorization code
}

export class PaystackClient {
  private apiKey: string;
  private apiUrl = paystackConfig.apiUrl;

  constructor(secretKey?: string) {
    this.apiKey = secretKey || process.env.PAYSTACK_SECRET_KEY || '';
    if (!this.apiKey) {
      console.warn('Paystack secret key not configured');
    }
  }

  /**
   * Initialize payment
   */
  async initializePayment(params: PaystackInitializePaymentParams) {
    try {
      const response = await fetch(`${this.apiUrl}/transaction/initialize`, {
        method: 'POST',
        headers: {
          authorization: `Bearer ${this.apiKey}`,
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          email: params.email,
          amount: params.amount,
          reference: params.reference || `ref-${Date.now()}`,
          metadata: params.metadata || {},
        }),
      });

      if (!response.ok) {
        throw new Error(`Paystack API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Paystack initialize payment error:', error);
      throw error;
    }
  }

  /**
   * Verify payment
   */
  async verifyPayment(reference: string): Promise<PaystackVerifyPaymentResponse> {
    try {
      const response = await fetch(
        `${this.apiUrl}/transaction/verify/${reference}`,
        {
          headers: {
            authorization: `Bearer ${this.apiKey}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Paystack API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Paystack verify payment error:', error);
      throw error;
    }
  }

  /**
   * Create subscription plan
   */
  async createPlan(params: {
    name: string;
    description?: string;
    amount: number; // in kobo
    interval: 'monthly' | 'quarterly' | 'half-yearly' | 'yearly';
  }) {
    try {
      const response = await fetch(`${this.apiUrl}/plan`, {
        method: 'POST',
        headers: {
          authorization: `Bearer ${this.apiKey}`,
          'content-type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        throw new Error(`Paystack API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Paystack create plan error:', error);
      throw error;
    }
  }

  /**
   * Create subscription
   */
  async createSubscription(params: PaystackSubscriptionParams) {
    try {
      const response = await fetch(`${this.apiUrl}/subscription`, {
        method: 'POST',
        headers: {
          authorization: `Bearer ${this.apiKey}`,
          'content-type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        throw new Error(`Paystack API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Paystack create subscription error:', error);
      throw error;
    }
  }

  /**
   * Get transaction details
   */
  async getTransaction(id: number) {
    try {
      const response = await fetch(`${this.apiUrl}/transaction/${id}`, {
        headers: {
          authorization: `Bearer ${this.apiKey}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Paystack API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Paystack get transaction error:', error);
      throw error;
    }
  }
}

export const paystackClient = new PaystackClient();
