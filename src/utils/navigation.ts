// src/utils/navigation.ts - 360code.io (main site)
import { createClient } from '@supabase/supabase-js';
import { redirectToApp } from './auth-utils';

/**
 * Navigate to the app with authentication preservation
 */
export const goToApp = async () => {
  try {
    // Initialize Supabase client
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      // Fallback if env vars aren't available
      window.location.href = 'https://app.360code.io';
      return;
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Use the redirectToApp function to handle authentication
    await redirectToApp(supabase);
  } catch (error) {
    console.error('Error during app navigation:', error);
    // In case of any error, navigate to the app normally
    window.location.href = 'https://app.360code.io';
  }
};