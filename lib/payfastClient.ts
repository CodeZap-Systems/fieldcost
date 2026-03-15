/**
 * PayFast API Client
 * South African payment gateway - primary for ZAR, fallback for NGN
 */

import crypto from 'crypto';
import { payfastConfig } from './paymentProviders';

export interface PayFastPaymentParams {
  amount: number;
  item_name: string;
  item_description?: string;
  custom_str1?: string; // Reference/Order ID
  email_address: string;
  return_url: string;
  cancel_url: string;
  notify_url: string;
}

export interface PayFastVerifyResponse {
  verified: boolean;
  paymentId?: string;
  amount?: number;
  status?: string;
}

export class PayFastClient {
  private merchantId: string;
  private merchantKey: string;
  private passPhrase: string;
  private apiUrl = payfastConfig.apiUrl;

  constructor(
    merchantId?: string,
    merchantKey?: string,
    passPhrase?: string
  ) {
    this.merchantId = merchantId || payfastConfig.merchantId;
    this.merchantKey = merchantKey || payfastConfig.merchantKey;
    this.passPhrase = passPhrase || payfastConfig.passPhrase;
  }

  /**
   * Generate PayFast signature
   */
  private generateSignature(
    data: Record<string, string | number>,
    passPhrase?: string
  ): string {
    const pfParamString = Object.entries(data)
      .filter(([, value]) => value !== '')
      .sort()
      .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
      .join('&');

    const finalString = passPhrase
      ? `${pfParamString}&passphrase=${encodeURIComponent(passPhrase)}`
      : pfParamString;

    return crypto
      .createHash('md5')
      .update(finalString)
      .digest('hex');
  }

  /**
   * Build payment form data
   */
  buildPaymentForm(params: PayFastPaymentParams): Record<string, string | number> {
    const data: Record<string, string | number> = {
      merchant_id: this.merchantId,
      merchant_key: this.merchantKey,
      return_url: params.return_url,
      cancel_url: params.cancel_url,
      notify_url: params.notify_url,
      name_first: 'FieldCost',
      name_last: 'User',
      email_address: params.email_address,
      item_name: params.item_name,
      item_description: params.item_description || '',
      custom_str1: params.custom_str1 || `ref-${Date.now()}`,
      amount: params.amount.toFixed(2),
    };

    data.signature = this.generateSignature(data, this.passPhrase);
    return data;
  }

  /**
   * Get payment form URL
   */
  getPaymentFormUrl(): string {
    return `${this.apiUrl}/eng/query/validate`;
  }

  /**
   * Verify payment callback
   */
  async verifyPayment(data: Record<string, string>): Promise<PayFastVerifyResponse> {
    try {
      // Verify signature locally
      const passphrase = this.passPhrase || '';
      const signature = this.generateSignature(data, passphrase);

      if (signature !== data.signature) {
        console.warn('PayFast signature verification failed');
        return { verified: false };
      }

      // Verify with PayFast server
      const response = await fetch(
        `${this.apiUrl}/eng/query/validate`,
        {
          method: 'POST',
          headers: {
            'content-type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams(data).toString(),
        }
      );

      const result = await response.text();

      if (result.toLowerCase() === 'valid') {
        return {
          verified: true,
          paymentId: data.pf_payment_id,
          amount: Number(data.amount_gross),
          status: data.payment_status === 'COMPLETE' ? 'success' : 'pending',
        };
      }

      return { verified: false };
    } catch (error) {
      console.error('PayFast verify payment error:', error);
      return { verified: false };
    }
  }

  /**
   * Build redirect URL for payment
   */
  buildRedirectUrl(params: PayFastPaymentParams): string {
    const formData = this.buildPaymentForm(params);
    const queryString = Object.entries(formData)
      .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
      .join('&');

    return `${this.getPaymentFormUrl()}?${queryString}`;
  }
}

export const payfastClient = new PayFastClient();
