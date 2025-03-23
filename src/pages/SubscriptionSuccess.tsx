// src/pages/SubscriptionSuccess.tsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SubscriptionSuccess: React.FC = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to app.360code.io/auth
    window.location.href = 'https://app.360code.io/auth';
    
    // Fallback redirect to home page after a short delay
    const timer = setTimeout(() => {
      navigate('/');
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [navigate]);
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background text-foreground">
      <div className="text-center">
        <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mb-4 mx-auto"></div>
        <h3 className="text-xl font-medium">Redirecting to application...</h3>
        <p className="text-muted-foreground">Please wait while we redirect you to the app.</p>
      </div>
    </div>
  );
};

export default SubscriptionSuccess;