import crypto from 'crypto';

export const PAYFAST_URL = process.env.PAYFAST_SANDBOX === 'true'
  ? 'https://sandbox.payfast.co.za/eng/process'
  : 'https://www.payfast.co.za/eng/process';

export const PAYFAST_VALIDATE_URL = process.env.PAYFAST_SANDBOX === 'true'
  ? 'https://sandbox.payfast.co.za/eng/query/validate'
  : 'https://www.payfast.co.za/eng/query/validate';

export interface PayFastSubscriptionData {
  merchant_id: string;
  merchant_key: string;
  return_url: string;
  cancel_url: string;
  notify_url: string;
  name_first: string;
  name_last: string;
  email_address: string;
  m_payment_id: string;
  amount: string;
  item_name: string;
  item_description: string;
  subscription_type: '1';
  billing_date: string;
  recurring_amount: string;
  frequency: '3';
  cycles: '0';
  subscription_notify_email: 'true';
  subscription_notify_webhook: 'true';
  subscription_notify_buyer: 'true';
}

export function generatePayFastSignature(
  data: Record<string, string>,
  passphrase: string
): string {
  const filteredData = Object.fromEntries(
    Object.entries(data).filter(([key]) => key !== 'signature')
  );

  const sortedKeys = Object.keys(filteredData).sort();

  const queryString = sortedKeys
    .map(key => `${key}=${encodeURIComponent(filteredData[key]).replace(/%20/g, '+')}`)
    .join('&');

  const stringWithPassphrase = `${queryString}&passphrase=${encodeURIComponent(passphrase).replace(/%20/g, '+')}`;

  return crypto.createHash('md5').update(stringWithPassphrase).digest('hex');
}

export function buildPayFastFormData(
  userEmail: string,
  userName: string,
  internalPaymentId: string
): PayFastSubscriptionData & { signature: string } {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL!;
  const today = new Date().toISOString().split('T')[0];

  const data: Record<string, string> = {
    merchant_id: process.env.PAYFAST_MERCHANT_ID!,
    merchant_key: process.env.PAYFAST_MERCHANT_KEY!,
    return_url: `${appUrl}/billing/success`,
    cancel_url: `${appUrl}/billing/cancelled`,
    notify_url: `${appUrl}/api/billing/notify`,
    name_first: userName.split(' ')[0] || userName,
    name_last: userName.split(' ').slice(1).join(' ') || '',
    email_address: userEmail,
    m_payment_id: internalPaymentId,
    amount: '899.00',
    item_name: 'FieldCost Growth Monthly',
    item_description: 'FieldCost Growth tier — monthly subscription (R899/month)',
    subscription_type: '1',
    billing_date: today,
    recurring_amount: '899.00',
    frequency: '3',
    cycles: '0',
    subscription_notify_email: 'true',
    subscription_notify_webhook: 'true',
    subscription_notify_buyer: 'true',
  };

  const signature = generatePayFastSignature(data, process.env.PAYFAST_PASSPHRASE!);

  return { ...data, signature } as PayFastSubscriptionData & { signature: string };
}

export async function verifyPayFastITN(
  body: string,
  headers: Record<string, string>
): Promise<boolean> {
  const response = await fetch(PAYFAST_VALIDATE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': 'FieldCost/1.0',
      ...headers,
    },
    body,
  });

  const result = await response.text();
  return result.trim() === 'VALID';
}
