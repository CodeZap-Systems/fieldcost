/**
 * Payment Providers Integration
 * Paystack (primary) + PayFast (fallback)
 */

export interface PaymentProvider {
  name: string;
  publicKey: string;
  enabled: boolean;
  currency: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: 'monthly' | 'yearly';
  trialDays: number;
  features: string[];
}

export interface PaymentSession {
  provider: 'paystack' | 'payfast';
  reference: string;
  amount: number;
  email: string;
  userId: string;
  planId: string;
  metadata: Record<string, any>;
}

// Paystack Configuration
export const paystackConfig = {
  publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || '',
  apiUrl: 'https://api.paystack.co',
  enabled: !!process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
  currency: 'NGN',
};

// PayFast Configuration (South African fallback)
export const payfastConfig = {
  merchantId: process.env.PAYFAST_MERCHANT_ID || '',
  merchantKey: process.env.PAYFAST_MERCHANT_KEY || '',
  passPhrase: process.env.PAYFAST_PASS_PHRASE || '',
  apiUrl: process.env.NODE_ENV === 'production'
    ? 'https://api.payfast.co.za'
    : 'https://sandbox.payfast.co.za',
  enabled: !!process.env.PAYFAST_MERCHANT_ID,
  currency: 'ZAR',
};

// Subscription Plans
export const subscriptionPlans: Record<string, SubscriptionPlan> = {
  starter: {
    id: 'starter',
    name: 'Starter',
    price: 2999, // NGN for Paystack, ZAR for PayFast
    currency: 'ZAR',
    interval: 'monthly',
    trialDays: 14,
    features: [
      'Up to 5 projects',
      'Basic invoicing',
      'Up to 3 team members',
      'Document storage (2GB)',
      'Email support',
    ],
  },
  professional: {
    id: 'professional',
    name: 'Professional',
    price: 7999,
    currency: 'ZAR',
    interval: 'monthly',
    trialDays: 14,
    features: [
      'Unlimited projects',
      'Advanced invoicing',
      'Up to 10 team members',
      'Document storage (50GB)',
      'Priority email support',
      'Custom workflows',
      'Xero integration',
    ],
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise',
    price: 19999,
    currency: 'ZAR',
    interval: 'monthly',
    trialDays: 14,
    features: [
      'Unlimited everything',
      'All Professional features',
      'Unlimited team members',
      'Dedicated support',
      'API access',
      'Custom integrations',
      'SLA guarantee',
    ],
  },
};

// Helper to get primary provider
export function getPrimaryPaymentProvider(): PaymentProvider {
  if (paystackConfig.enabled) {
    return {
      name: 'paystack',
      publicKey: paystackConfig.publicKey,
      enabled: true,
      currency: paystackConfig.currency,
    };
  }

  if (payfastConfig.enabled) {
    return {
      name: 'payfast',
      publicKey: payfastConfig.merchantId,
      enabled: true,
      currency: payfastConfig.currency,
    };
  }

  // Fallback to PayFast for local testing
  return {
    name: 'payfast',
    publicKey: 'sandbox',
    enabled: true,
    currency: 'ZAR',
  };
}

// Helper to get fallback provider
export function getFallbackPaymentProvider(): PaymentProvider | null {
  const primary = getPrimaryPaymentProvider();

  if (primary.name === 'paystack' && payfastConfig.enabled) {
    return {
      name: 'payfast',
      publicKey: payfastConfig.merchantId,
      enabled: true,
      currency: payfastConfig.currency,
    };
  }

  if (primary.name === 'payfast' && paystackConfig.enabled) {
    return {
      name: 'paystack',
      publicKey: paystackConfig.publicKey,
      enabled: true,
      currency: paystackConfig.currency,
    };
  }

  return null;
}
