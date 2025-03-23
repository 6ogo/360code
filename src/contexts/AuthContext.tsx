// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { getUserSubscription } from '@/api/stripe';

interface AuthContextType {
  user: User | null;
  subscription: any | null; // The user's subscription data
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
  subscriptionTier: 'basic' | 'pro' | 'pro_plus' | null;
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
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
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
            const subscription = await getUserSubscription(user.id);
            setSubscription(subscription);
            
            // Set subscription tier
            if (subscription?.subscription_tier) {
              setSubscriptionTier(subscription.subscription_tier);
            } else {
              setSubscriptionTier('basic'); // Default to basic
            }
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
              const userSubscription = await getUserSubscription(session.user.id);
              setSubscription(userSubscription);
              
              // Set subscription tier
              if (userSubscription?.subscription_tier) {
                setSubscriptionTier(userSubscription.subscription_tier);
              } else {
                setSubscriptionTier('basic'); // Default to basic
              }
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

  const signIn = async (email: string, password: string) => {
    if (!supabase) return;
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
    if (!supabase) return;
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

  const signOut = async () => {
    if (!supabase) return;
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
    signOut,
    isAuthenticated: !!user,
    subscriptionTier,
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