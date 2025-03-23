// src/components/AuthPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import { Mail, KeyRound, Github, AlertTriangle } from 'lucide-react';

const AuthPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, signUp, signInWithProvider, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the return URL from query params or default to home
  const searchParams = new URLSearchParams(location.search);
  const returnUrl = searchParams.get('returnUrl') || '/';

  // Check if user is already logged in
  useEffect(() => {
    if (user) {
      navigate(returnUrl, { replace: true });
    }
  }, [user, navigate, returnUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    try {
      if (isSignUp) {
        await signUp(email, password);
        alert('Check your email for the confirmation link!');
      } else {
        await signIn(email, password);
        navigate(returnUrl, { replace: true });
      }
    } catch (error: any) {
      setError(error.message || 'An error occurred during authentication');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProviderSignIn = async (provider: 'github' | 'google') => {
    setError(null);
    setIsLoading(true);
    
    try {
      await signInWithProvider(provider);
      // The redirect happens automatically with provider auth
      // We'll be redirected back after successful auth
    } catch (error: any) {
      setError(error.message || `Failed to sign in with ${provider}`);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8 rounded-lg border border-border/50 bg-card/50 backdrop-blur-sm p-6 shadow-lg">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground">
              {isSignUp ? 'Create an account' : 'Sign in to your account'}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {isSignUp
                ? 'Already have an account?'
                : "Don't have an account yet?"}
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="ml-1 font-medium text-primary hover:underline"
              >
                {isSignUp ? 'Sign in' : 'Sign up'}
              </button>
            </p>
          </div>

          {error && (
            <div className="rounded-md bg-red-500/10 p-4 text-sm text-red-500 border border-red-500/20 flex items-start">
              <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-foreground mb-1"
              >
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 mt-1 block w-full rounded-md border border-border bg-background px-3 py-2 text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-foreground mb-1"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <KeyRound className="h-5 w-5 text-muted-foreground" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 mt-1 block w-full rounded-md border border-border bg-background px-3 py-2 text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="gradient-button flex w-full justify-center items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-white shadow-sm hover:shadow-lg transition-all disabled:opacity-50"
              >
                {isLoading && (
                  <div className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full"></div>
                )}
                {isLoading
                  ? 'Processing...'
                  : isSignUp
                  ? 'Create account'
                  : 'Sign in'}
              </button>
            </div>
          </form>

          <div className="relative mt-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-card px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              onClick={() => handleProviderSignIn('github')}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-foreground shadow-sm hover:bg-muted transition-colors"
            >
              <Github className="h-5 w-5" />
              GitHub
            </button>
            <button
              onClick={() => handleProviderSignIn('google')}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-foreground shadow-sm hover:bg-muted transition-colors"
            >
              <svg
                className="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12.545 10.239v3.821h5.445c-.712 2.315-2.647 3.972-5.445 3.972a6.033 6.033 0 110-12.064c1.498 0 2.866.549 3.921 1.453l2.814-2.814A9.969 9.969 0 0012.545 2C7.021 2 2.543 6.477 2.543 12s4.478 10 10.002 10c8.396 0 10.249-7.85 9.426-11.748l-9.426-.013z" />
              </svg>
              Google
            </button>
          </div>

          <div className="mt-6 text-center text-xs text-muted-foreground">
            By signing in, you agree to our{' '}
            <a href="/terms" className="text-primary hover:underline">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </a>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AuthPage;