// src/components/AuthCallback.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Parse the return URL from query params
    const searchParams = new URLSearchParams(location.search);
    const returnUrl = searchParams.get('returnUrl') || '/';
    
    // Handle authentication callback
    const handleCallback = async () => {
      try {
        // If we're already authenticated, redirect to return URL
        if (isAuthenticated) {
          navigate(returnUrl, { replace: true });
          return;
        }
        
        // If we're not authenticated, there may have been an error
        // Check for error in URL params
        const errorParam = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');
        
        if (errorParam) {
          setError(errorDescription || 'Authentication failed');
          // Redirect to login page after a delay
          setTimeout(() => {
            navigate('/login', { replace: true });
          }, 3000);
          return;
        }
        
        // If there's no error and we're not authenticated yet, wait briefly
        // The auth state might still be updating
        setTimeout(() => {
          if (isAuthenticated) {
            navigate(returnUrl, { replace: true });
          } else {
            // If we're still not authenticated after waiting, redirect to login
            navigate('/login', { 
              replace: true,
              state: { error: 'Authentication failed. Please try again.' }
            });
          }
        }, 2000);
      } catch (err) {
        console.error('Error in auth callback:', err);
        setError('An unexpected error occurred during authentication');
        // Redirect to login page after a delay
        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 3000);
      }
    };

    handleCallback();
  }, [isAuthenticated, navigate, location]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background text-foreground">
      <div className="text-center max-w-md w-full space-y-6">
        {error ? (
          <>
            <div className="rounded-md bg-red-500/10 p-4 text-sm text-red-500 border border-red-500/20">
              {error}
            </div>
            <p className="text-muted-foreground">Redirecting to login...</p>
          </>
        ) : (
          <>
            <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mb-4 mx-auto"></div>
            <h3 className="text-xl font-medium">Completing authentication...</h3>
            <p className="text-muted-foreground">Please wait while we finish setting up your account.</p>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthCallback;