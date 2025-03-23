// api/webhook.ts
// This would be a serverless function in Vercel
// This handles webhook events from Stripe

import { NextApiRequest, NextApiResponse } from 'next';
import { buffer } from 'micro';
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

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const signature = req.headers['stripe-signature'] as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return res.status(400).json({ error: 'Missing signature or webhook secret' });
  }

  try {
    const rawBody = await buffer(req);
    const event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      webhookSecret
    );

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const subscriptionId = session.subscription as string;

        if (!userId || !subscriptionId) {
          return res.status(400).json({ error: 'Missing user ID or subscription ID' });
        }

        // Fetch the subscription to determine tier
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const priceId = subscription.items.data[0].price.id;

        // Determine tier based on price ID
        let tier = 'basic';
        if (priceId === process.env.STRIPE_PRO_PRICE_ID) {
          tier = 'pro';
        } else if (priceId === process.env.STRIPE_PRO_PLUS_PRICE_ID) {
          tier = 'pro_plus';
        }

        // Update user subscription in Supabase
        const { error } = await supabase
          .from('user_subscriptions')
          .upsert({
            user_id: userId,
            subscription_id: subscriptionId,
            subscription_tier: tier,
            price_id: priceId,
            status: 'active',
            current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          });

        if (error) {
          console.error('Error updating subscription in Supabase:', error);
          return res.status(500).json({ error: 'Database error' });
        }

        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        
        // Find the subscription in Supabase
        const { data: subData, error: subError } = await supabase
          .from('user_subscriptions')
          .select('user_id')
          .eq('subscription_id', subscription.id)
          .single();

        if (subError || !subData) {
          console.error('Subscription not found in database:', subError);
          return res.status(404).json({ error: 'Subscription not found' });
        }

        const priceId = subscription.items.data[0].price.id;

        // Determine tier based on price ID
        let tier = 'basic';
        if (priceId === process.env.STRIPE_PRO_PRICE_ID) {
          tier = 'pro';
        } else if (priceId === process.env.STRIPE_PRO_PLUS_PRICE_ID) {
          tier = 'pro_plus';
        }

        // Update subscription in Supabase
        const { error } = await supabase
          .from('user_subscriptions')
          .update({
            subscription_tier: tier,
            price_id: priceId,
            status: subscription.status,
            current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            cancel_at_period_end: subscription.cancel_at_period_end,
          })
          .eq('subscription_id', subscription.id);

        if (error) {
          console.error('Error updating subscription in Supabase:', error);
          return res.status(500).json({ error: 'Database error' });
        }

        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        
        // Update subscription in Supabase to inactive
        const { error } = await supabase
          .from('user_subscriptions')
          .update({
            status: 'canceled',
          })
          .eq('subscription_id', subscription.id);

        if (error) {
          console.error('Error updating subscription in Supabase:', error);
          return res.status(500).json({ error: 'Database error' });
        }

        break;
      }
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Error handling webhook:', error);
    res.status(400).json({ error: 'Webhook error' });
  }
}