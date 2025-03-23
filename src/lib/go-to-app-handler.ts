import { SupabaseClient } from '@supabase/supabase-js'

/**
 * Navigate to the app with authentication preservation.
 * This function attempts to maintain the user's authentication state
 * when navigating from the main site to the app.
 * 
 * @param supabase Initialized Supabase client
 */
export async function goToApp(supabase: SupabaseClient) {
  try {
    // Check if user is authenticated
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      // Not logged in, redirect to app login page
      window.location.href = 'https://app.360code.io/auth'
      return
    }
    
    // Choose the approach based on environment
    if (process.env.NODE_ENV === 'development') {
      // Approach 1: Direct token transfer (simpler but less secure)
      // Only use this in development
      window.location.href = `https://app.360code.io/auth/exchange?access_token=${encodeURIComponent(session.access_token)}&refresh_token=${encodeURIComponent(session.refresh_token)}`
    } else {
      // Approach 2: Using a JWT token (more secure, requires Edge Function)
      // For now, this is placeholder code until the Edge Function is created
      // In a real implementation, you would call your Edge Function here
      
      // Temporary fallback - direct navigation to app
      // In production, you would replace this with a call to your Edge Function
      window.location.href = 'https://app.360code.io'
    }
  } catch (error) {
    console.error('Error during app navigation:', error)
    // In case of any error, navigate to the app normally
    window.location.href = 'https://app.360code.io'
  }
}