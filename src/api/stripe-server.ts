// src/api/stripe-server.ts
// This file contains the server-side API handlers for Stripe
// These would typically be implemented in a serverless function or API route

import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

// Initialize Stripe with the secret key
// In production, this would be in a server environment
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-02-24.acacia', // Specify the Stripe API version
});

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Create a Stripe Checkout session
 */
export async function createCheckoutSession(req, res) {
  try {
    const { priceId, userId, successUrl, cancelUrl } = req.body;

    // Create a Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      client_reference_id: userId,
      metadata: {
        userId,
      },
    });

    // Return the session ID to the client
    res.json({ id: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
}

/**
 * Handle Stripe webhook events
 */
export async function handleStripeWebhook(req, res) {
  const signature = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  try {
    // Verify the webhook signature
    const event = stripe.webhooks.constructEvent(
      req.rawBody, // This requires raw body parsing
      signature,
      endpointSecret
    );

    // Handle specific events
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const userId = session.metadata.userId;
        const subscriptionId = session.subscription;

        // Fetch the subscription to get the price ID and product
        const subscription = await stripe.subscriptions.retrieve(subscriptionId as string);
        const priceId = subscription.items.data[0].price.id;

        // Determine subscription tier based on price ID
        let tier = 'basic';
        if (priceId === process.env.STRIPE_PRO_PRICE_ID) {
          tier = 'pro';
        } else if (priceId === process.env.STRIPE_PRO_PLUS_PRICE_ID) {
          tier = 'pro_plus';
        }

        // Update user's subscription status in Supabase
        const { error } = await supabase
          .from('user_subscriptions')
          .upsert({
            user_id: userId,
            subscription_id: subscriptionId,
            subscription_tier: tier,
            price_id: priceId,
            status: 'active',
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          });

        if (error) {
          console.error('Error updating user subscription in Supabase:', error);
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        const subscriptionId = subscription.id;
        
        // Get the user ID from the subscription metadata
        // In a real app, you might need to query your database to find the associated user
        // Here we'll query Supabase to find the user
        const { data, error } = await supabase
          .from('user_subscriptions')
          .select('user_id')
          .eq('subscription_id', subscriptionId)
          .single();

        if (error || !data) {
          console.error('Error finding user for subscription:', error);
          break;
        }

        const userId = data.user_id;
        const priceId = subscription.items.data[0].price.id;

        // Determine subscription tier based on price ID
        let tier = 'basic';
        if (priceId === process.env.STRIPE_PRO_PRICE_ID) {
          tier = 'pro';
        } else if (priceId === process.env.STRIPE_PRO_PLUS_PRICE_ID) {
          tier = 'pro_plus';
        }

        // Update the user's subscription in Supabase
        const { error: updateError } = await supabase
          .from('user_subscriptions')
          .update({
            subscription_tier: tier,
            price_id: priceId,
            status: subscription.status,
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          })
          .eq('subscription_id', subscriptionId);

        if (updateError) {
          console.error('Error updating subscription in Supabase:', updateError);
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const subscriptionId = subscription.id;
        
        // Update the user's subscription status in Supabase
        const { error } = await supabase
          .from('user_subscriptions')
          .update({
            status: 'canceled',
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          })
          .eq('subscription_id', subscriptionId);

        if (error) {
          console.error('Error updating subscription status in Supabase:', error);
        }
        break;
      }
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Error handling webhook:', error);
    res.status(400).json({ error: 'Webhook error' });
  }
}

/**
 * Get user's active subscription
 */
export async function getUserSubscription(req, res) {
  try {
    const { userId } = req.query;

    // Query Supabase for the user's subscription
    const { data, error } = await supabase
      .from('user_subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single();

    if (error) {
      console.error('Error fetching subscription from Supabase:', error);
      return res.status(404).json({ error: 'Subscription not found' });
    }

    res.json(data);
  } catch (error) {
    console.error('Error getting user subscription:', error);
    res.status(500).json({ error: 'Failed to get subscription' });
  }
}

/**
 * Cancel a subscription
 */
export async function cancelSubscription(req, res) {
  try {
    const { subscriptionId } = req.body;

    // Cancel the subscription in Stripe
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    });

    // Update the subscription status in Supabase
    const { error } = await supabase
      .from('user_subscriptions')
      .update({
        status: 'canceling',
        cancel_at_period_end: true,
      })
      .eq('subscription_id', subscriptionId);

    if (error) {
      console.error('Error updating subscription in Supabase:', error);
    }

    res.json({ success: true, subscription });
  } catch (error) {
    console.error('Error cancelling subscription:', error);
    res.status(500).json({ error: 'Failed to cancel subscription' });
  }
}