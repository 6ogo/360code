// src/utils/auth-utils.ts - 360code.io (main site)
import { SupabaseClient } from '@supabase/supabase-js';

/**
 * Redirect to the app with authentication preservation
 * @param supabase The initialized Supabase client
 */
export const redirectToApp = async (supabase: SupabaseClient) => {
  try {
    // Get the current session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      console.log('No active session found, redirecting to app login');
      window.location.href = 'https://app.360code.io/login';
      return;
    }
    
    // For simple approach without Edge Functions, pass the session tokens directly
    // NOTE: This approach works but has security implications - use in development only
    if (process.env.NODE_ENV === 'development') {
      const accessToken = session.access_token;
      const refreshToken = session.refresh_token;
      
      window.location.href = `https://app.360code.io/auth-exchange?access_token=${encodeURIComponent(accessToken)}&refresh_token=${encodeURIComponent(refreshToken)}`;
      return;
    }
    
    // For production, use Edge Functions to securely create a token
    try {
      // Call the Supabase Edge Function to create a secure token
      const { data, error } = await supabase.functions.invoke('create-cross-domain-token', {
        body: { 
          userId: session.user.id,
          sessionId: session.access_token
        }
      });
      
      if (error) throw error;
      
      // Redirect to app with the secure token
      window.location.href = `https://app.360code.io/auth-exchange?token=${data.token}`;
    } catch (functionError) {
      console.error('Error invoking Edge Function:', functionError);
      // Fallback to direct app URL if Edge Function fails
      window.location.href = 'https://app.360code.io/login';
    }
  } catch (error) {
    console.error('Error during cross-domain redirect:', error);
    // Fallback to regular app redirect
    window.location.href = 'https://app.360code.io/login';
  }
};

/**
 * Check if the user is authenticated
 * @param supabase The initialized Supabase client
 * @returns Promise<boolean> True if authenticated
 */
export const isAuthenticated = async (supabase: SupabaseClient): Promise<boolean> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    return !!session;
  } catch (error) {
    console.error('Error checking authentication:', error);
    return false;
  }
};