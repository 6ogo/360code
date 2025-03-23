// src/api/stripe.ts
import { loadStripe } from '@stripe/stripe-js';

// Load the Stripe publishable key from environment variables
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export interface PriceData {
  priceId: string;
  productId: string;
  name: string;
  price: number;
  currency: string;
  interval?: string;
}

export interface SubscriptionTier {
  id: string;
  name: string;
  features: string[];
}

// These will be fetched from the backend in a real application
export const subscriptionTiers: Record<string, SubscriptionTier> = {
  'basic': {
    id: 'basic',
    name: 'Basic',
    features: [
      'Basic code completion',
      'Limited syntax suggestions',
      'Standard error detection',
      'Community support',
      'Single project support'
    ]
  },
  'pro': {
    id: 'pro',
    name: 'Pro',
    features: [
      'Everything in Basic',
      'Advanced code completion',
      'Context-aware suggestions',
      'Multi-project support',
      'Code refactoring assistance',
      'Email support',
      'Extended daily queries'
    ]
  },
  'pro_plus': {
    id: 'pro_plus',
    name: 'Pro+',
    features: [
      'Everything in Pro',
      'Advanced code generation',
      'Team collaboration features',
      'Custom integration options',
      'Priority email support',
      'Unlimited daily queries',
      'Advanced security features'
    ]
  }
};

/**
 * Redirects to Stripe Checkout for subscription purchase
 */
export async function createCheckoutSession(priceId: string, userId: string) {
  try {
    // Create a checkout session on the server
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId,
        userId,
        successUrl: `${window.location.origin}/account?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${window.location.origin}/pricing`,
      }),
    });

    const session = await response.json();
    
    // Redirect to Stripe Checkout
    const stripe = await stripePromise;
    if (!stripe) {
      throw new Error('Failed to load Stripe');
    }
    
    const { error } = await stripe.redirectToCheckout({
      sessionId: session.id,
    });

    if (error) {
      throw new Error(error.message);
    }
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
}

/**
 * Get active subscription for user
 */
export async function getUserSubscription(userId: string) {
  try {
    const response = await fetch(`/api/user-subscription?userId=${userId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch subscription');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching subscription:', error);
    return null;
  }
}

/**
 * Cancel a subscription
 */
export async function cancelSubscription(subscriptionId: string) {
  try {
    const response = await fetch('/api/cancel-subscription', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ subscriptionId }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to cancel subscription');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error cancelling subscription:', error);
    throw error;
  }
}