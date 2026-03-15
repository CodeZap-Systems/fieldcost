/**
 * Subscription Management API Route
 * Handle subscription creation, verification, and management
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';
import { paystackClient } from '@/lib/paystackClient';
import { payfastClient } from '@/lib/payfastClient';
import { getPrimaryPaymentProvider } from '@/lib/paymentProviders';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, userId, email, planId, provider } = body;

    if (!action || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    switch (action) {
      case 'initiate-payment': {
        return await initiatePayment({ userId, email, planId, provider });
      }

      case 'verify-payment': {
        const { reference, paymentId } = body;
        return await verifyPayment({
          userId,
          reference,
          paymentId,
          provider,
        });
      }

      case 'start-trial': {
        return await startTrial({ userId, planId });
      }

      case 'get-subscription': {
        return await getSubscription({ userId });
      }

      default:
        return NextResponse.json(
          { error: 'Unknown action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Subscription API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Initiate payment for subscription
 */
async function initiatePayment({
  userId,
  email,
  planId,
  provider,
}: {
  userId: string;
  email: string;
  planId: string;
  provider?: string;
}) {
  try {
    const primaryProvider = getPrimaryPaymentProvider();
    const paymentProvider = provider || primaryProvider.name;

    if (paymentProvider === 'paystack') {
      const amount = 29990; // Plans in kobo

      const response = await paystackClient.initializePayment({
        email,
        amount,
        metadata: {
          userId,
          planId,
          type: 'subscription',
        },
      });

      return NextResponse.json(response);
    } else if (paymentProvider === 'payfast') {
      const redirectUrl = payfastClient.buildRedirectUrl({
        amount: 299.9, // Plans in ZAR
        item_name: `FieldCost ${planId} Subscription`,
        item_description: `14-day trial + monthly subscription`,
        email_address: email,
        custom_str1: `${userId}-${planId}`,
        return_url: `${process.env.NEXT_PUBLIC_APP_URL}/subscription/success`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/subscription/cancel`,
        notify_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/payfast`,
      });

      return NextResponse.json({
        status: 'success',
        redirectUrl,
        provider: 'payfast',
      });
    }

    return NextResponse.json(
      { error: 'No payment provider available' },
      { status: 503 }
    );
  } catch (error) {
    console.error('Payment initiation error:', error);
    return NextResponse.json(
      { error: 'Failed to initiate payment' },
      { status: 500 }
    );
  }
}

/**
 * Verify payment and activate subscription
 */
async function verifyPayment({
  userId,
  reference,
  paymentId,
  provider,
}: {
  userId: string;
  reference?: string;
  paymentId?: string;
  provider?: string;
}) {
  try {
    const primaryProvider = getPrimaryPaymentProvider();
    const paymentProvider = provider || primaryProvider.name;

    let verified = false;
    let paymentData: any = null;

    if (paymentProvider === 'paystack' && reference) {
      const response = await paystackClient.verifyPayment(reference);
      verified = response.status === true;
      paymentData = response.data;
    } else if (paymentProvider === 'payfast' && paymentId) {
      const response = await payfastClient.verifyPayment({
        pf_payment_id: paymentId,
      });
      verified = response.verified;
      paymentData = response;
    }

    if (!verified) {
      return NextResponse.json(
        { error: 'Payment verification failed' },
        { status: 400 }
      );
    }

    // Create subscription in database
    const { error: subError } = await supabaseServer
      .from('subscriptions')
      .upsert({
        user_id: userId,
        plan_id: paymentData?.plan_id || 'professional',
        status: 'active',
        trial_until: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        current_period_start: new Date(),
        current_period_end: new Date(
          Date.now() + 30 * 24 * 60 * 60 * 1000
        ),
        payment_provider: paymentProvider,
        payment_reference: reference || paymentId,
        updated_at: new Date(),
      });

    if (subError) {
      throw subError;
    }

    return NextResponse.json({
      status: 'success',
      message: 'Subscription activated',
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { error: 'Verification failed' },
      { status: 500 }
    );
  }
}

/**
 * Start 14-day trial
 */
async function startTrial({
  userId,
  planId,
}: {
  userId: string;
  planId: string;
}) {
  try {
    const trialEndDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);

    const { error } = await supabaseServer
      .from('subscriptions')
      .upsert({
        user_id: userId,
        plan_id: planId,
        status: 'active',
        trial_until: trialEndDate,
        trial_started_at: new Date(),
        current_period_start: new Date(),
        current_period_end: trialEndDate,
        updated_at: new Date(),
      });

    if (error) {
      throw error;
    }

    return NextResponse.json({
      status: 'success',
      message: 'Trial started',
      trialUntil: trialEndDate.toISOString(),
    });
  } catch (error) {
    console.error('Start trial error:', error);
    return NextResponse.json(
      { error: 'Failed to start trial' },
      { status: 500 }
    );
  }
}

/**
 * Get subscription details
 */
async function getSubscription({ userId }: { userId: string }) {
  try {
    const { data, error } = await supabaseServer
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    if (!data) {
      return NextResponse.json({
        status: 'no_subscription',
        message: 'User has no active subscription',
      });
    }

    // Check if trial has expired
    const now = new Date();
    const isTrialActive =
      data.trial_until && new Date(data.trial_until) > now;
    const isSubscriptionActive =
      data.status === 'active' &&
      data.current_period_end &&
      new Date(data.current_period_end) > now;

    return NextResponse.json({
      status: 'success',
      subscription: data,
      isTrialActive,
      isSubscriptionActive,
      daysRemaining: isTrialActive
        ? Math.ceil(
            (new Date(data.trial_until).getTime() - now.getTime()) /
              (24 * 60 * 60 * 1000)
          )
        : null,
    });
  } catch (error) {
    console.error('Get subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to get subscription' },
      { status: 500 }
    );
  }
}
