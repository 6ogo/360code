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
    // Create a checkout session via API route
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId,
        userId,
        successUrl: `${window.location.origin}/subscription-success?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${window.location.origin}/pricing`,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create checkout session');
    }

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
      throw error;
    }
  } catch (error) {
    console.error('Error creating checkout session:', error);
    // For development/demo purposes, let's simulate the checkout experience
    if (process.env.NODE_ENV === 'development') {
      console.log('In development mode - simulating successful checkout');
      window.location.href = `${window.location.origin}/subscription-success?session_id=dev_session_${Date.now()}`;
    } else {
      throw error;
    }
  }
}

/**
 * Get active subscription for user
 */
export async function getUserSubscription(userId: string) {
  try {
    // In a real app, this would call your backend API
    // For demo purposes, we'll simulate an API response
    if (process.env.NODE_ENV === 'development') {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Check local storage for simulation data
      const simulatedTier = localStorage.getItem('simulated_subscription_tier');
      
      if (simulatedTier) {
        return {
          subscription_tier: simulatedTier,
          status: 'active',
          current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        };
      }
      
      // Default response
      return {
        subscription_tier: 'basic',
        status: 'inactive'
      };
    }
    
    // For production, make the actual API call
    const response = await fetch(`/api/user-subscription?userId=${userId}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        // If no subscription is found, return basic tier
        return {
          subscription_tier: 'basic',
          status: 'inactive'
        };
      }
      throw new Error('Failed to fetch subscription');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching subscription:', error);
    // Default to basic tier on error
    return {
      subscription_tier: 'basic',
      status: 'inactive'
    };
  }
}

/**
 * Cancel a subscription
 */
export async function cancelSubscription(subscriptionId: string) {
  try {
    // For production, make the actual API call
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
    
    // For development, simulate success
    if (process.env.NODE_ENV === 'development') {
      localStorage.removeItem('simulated_subscription_tier');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error cancelling subscription:', error);
    throw error;
  }
}

// Helper function to simulate subscription upgrade in development
export async function simulateSubscriptionUpgrade(tier: 'basic' | 'pro' | 'pro_plus') {
  if (process.env.NODE_ENV === 'development') {
    localStorage.setItem('simulated_subscription_tier', tier);
    return {
      success: true,
      subscription_tier: tier,
      status: 'active',
      current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    };
  }
  return null;
}