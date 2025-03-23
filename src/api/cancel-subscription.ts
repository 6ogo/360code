// api/cancel-subscription.ts
// This would be a serverless function in Vercel

import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-02-24.acacia',
});

// Initialize Supabase
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { subscriptionId } = req.body;

    if (!subscriptionId) {
      return res.status(400).json({ error: 'Subscription ID is required' });
    }

    // Cancel the subscription in Stripe (at period end)
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    });

    // Update the subscription in Supabase
    const { error } = await supabase
      .from('user_subscriptions')
      .update({
        status: 'canceling',
        cancel_at_period_end: true,
      })
      .eq('subscription_id', subscriptionId);

    if (error) {
      console.error('Error updating subscription in Supabase:', error);
      return res.status(500).json({ error: 'Database error' });
    }

    res.status(200).json({ success: true, subscription });
  } catch (error) {
    console.error('Error cancelling subscription:', error);
    res.status(500).json({ error: 'Failed to cancel subscription' });
  }
}