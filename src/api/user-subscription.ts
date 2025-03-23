// api/user-subscription.ts
// This would be a serverless function in Vercel

import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { userId } = req.query;

    if (!userId || typeof userId !== 'string') {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    // Get the user's active subscription
    const { data, error } = await supabase
      .from('user_subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single();

    if (error) {
      // If no subscription is found, return a default "basic" tier
      if (error.code === 'PGRST116') {
        return res.status(200).json({
          subscription_tier: 'basic',
          status: 'inactive'
        });
      }
      
      return res.status(500).json({ error: 'Database error' });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching user subscription:', error);
    res.status(500).json({ error: 'Failed to fetch subscription' });
  }
}