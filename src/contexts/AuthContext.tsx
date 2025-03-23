// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { createClient, SupabaseClient, User, Provider } from '@supabase/supabase-js';
import { getUserSubscription } from '@/api/stripe';

interface AuthContextType {
  user: User | null;
  subscription: any | null; // The user's subscription data
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signInWithProvider: (provider: Provider) => Promise<void>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
  subscriptionTier: 'basic' | 'pro' | 'pro_plus' | null;
  refreshSubscription: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [subscription, setSubscription] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [subscriptionTier, setSubscriptionTier] = useState<'basic' | 'pro' | 'pro_plus' | null>(null);

  useEffect(() => {
    // Initialize Supabase client
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('Supabase credentials not found in environment variables');
      setIsLoading(false);
      return;
    }
    
    const client = createClient(supabaseUrl, supabaseKey);
    setSupabase(client);

    // Check for existing session
    const initializeAuth = async () => {
      setIsLoading(true);
      try {
        const { data: { session } } = await client.auth.getSession();
        if (session) {
          const { data: { user } } = await client.auth.getUser();
          setUser(user);
          
          // Fetch user's subscription
          if (user) {
            await fetchUserSubscription(user.id);
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Set up auth state change listener
    if (client) {
      const { data: { subscription } } = client.auth.onAuthStateChange(
        async (event, session) => {
          if (event === 'SIGNED_IN' && session) {
            setUser(session.user);
            
            // Fetch user's subscription
            if (session.user) {
              await fetchUserSubscription(session.user.id);
            }
          } else if (event === 'SIGNED_OUT') {
            setUser(null);
            setSubscription(null);
            setSubscriptionTier(null);
          }
        }
      );

      return () => {
        subscription.unsubscribe();
      };
    }
  }, []);

  const fetchUserSubscription = async (userId: string) => {
    try {
      const userSubscription = await getUserSubscription(userId);
      setSubscription(userSubscription);
      
      // Set subscription tier
      if (userSubscription?.subscription_tier) {
        setSubscriptionTier(userSubscription.subscription_tier);
      } else {
        setSubscriptionTier('basic'); // Default to basic
      }
    } catch (error) {
      console.error('Error fetching user subscription:', error);
      setSubscriptionTier('basic'); // Default to basic on error
    }
  };

  const refreshSubscription = async () => {
    if (user) {
      await fetchUserSubscription(user.id);
    }
  };

  const signIn = async (email: string, password: string) => {
    if (!supabase) throw new Error('Supabase client not initialized');
    
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    if (!supabase) throw new Error('Supabase client not initialized');
    
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithProvider = async (provider: Provider) => {
    if (!supabase) throw new Error('Supabase client not initialized');
    
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth-callback`
        }
      });
      if (error) throw error;
    } catch (error) {
      console.error(`Error signing in with ${provider}:`, error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    if (!supabase) throw new Error('Supabase client not initialized');
    
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    subscription,
    isLoading,
    signIn,
    signUp,
    signInWithProvider,
    signOut,
    isAuthenticated: !!user,
    subscriptionTier,
    refreshSubscription
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}