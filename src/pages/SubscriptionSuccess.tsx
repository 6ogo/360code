// src/pages/SubscriptionSuccess.tsx
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import { Check, ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const SubscriptionSuccess: React.FC = () => {
  const { search } = useLocation();
  const navigate = useNavigate();
  const { user, subscriptionTier } = useAuth();
  const [countdown, setCountdown] = useState(5);
  
  useEffect(() => {
    // This would typically verify the checkout session with Stripe
    // For this example, we're just using the presence of the session_id parameter
    
    if (!search.includes('session_id=')) {
      navigate('/pricing');
    }
    
    // Auto-redirect after countdown
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [search, navigate]);
  
  const tierName = subscriptionTier === 'pro_plus' 
    ? 'Pro+' 
    : subscriptionTier === 'pro'
      ? 'Pro'
      : 'Basic';
  
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="flex-grow py-20 px-4">
        <div className="max-w-md mx-auto text-center">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-8 h-8 text-green-500" />
          </div>
          
          <h1 className="text-3xl font-bold mb-2">Subscription Successful!</h1>
          <p className="text-xl text-muted-foreground mb-4">
            Thank you for subscribing to 360code.io {tierName}
          </p>
          
          <div className="bg-card/50 border border-border/50 rounded-lg p-6 mb-8">
            <p className="mb-2">
              <strong>Account:</strong> {user?.email}
            </p>
            <p className="mb-2">
              <strong>Plan:</strong> {tierName}
            </p>
            <p>
              <strong>Status:</strong> <span className="text-green-500">Active</span>
            </p>
          </div>
          
          <p className="text-sm text-muted-foreground mb-6">
            Redirecting to homepage in {countdown} seconds...
          </p>
          
          <button 
            onClick={() => navigate('/')}
            className="gradient-button px-6 py-2 rounded-md font-medium text-white shadow-md hover:shadow-lg transition-shadow inline-flex items-center"
          >
            Go to Homepage
            <ArrowRight className="ml-2 w-4 h-4" />
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SubscriptionSuccess;