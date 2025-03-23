import React from 'react';
import { Terminal, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const GetStarted: React.FC = () => {
  const handleRedirectToApp = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = 'https://app.360code.io/auth';
  };

  return (
    <section id="get-started" className="relative py-20 md:py-32 bg-primary/5">
      <div className="absolute inset-0 dot-pattern opacity-20"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 circle-pattern opacity-20"></div>
      <div className="absolute top-1/4 right-1/4 blue-glow opacity-30 animate-pulse-slow"></div>
      
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm mb-8 opacity-0 animate-fade-in">
          <Terminal className="w-4 h-4 text-primary mr-2" />
          <span className="text-sm font-medium text-primary">Early Access Coming Soon</span>
        </div>
        
        <h2 className="text-3xl md:text-5xl font-bold mb-6 max-w-4xl mx-auto leading-tight opacity-0 animate-fade-in animation-delay-300">
          Ready to Transform Your Development Experience?
        </h2>
        
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 opacity-0 animate-fade-in animation-delay-600">
          Join developers who are building the future with AI-enhanced productivity. Sign up for early access and be the first to experience 360code.io.
        </p>

        <div className="max-w-xl mx-auto glass-card p-10 rounded-lg border border-white/5 shadow-2xl opacity-0 animate-fade-in animation-delay-900">
          <form className="space-y-4" onSubmit={handleRedirectToApp}>
            <div className="flex flex-col sm:flex-row gap-4">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="flex h-12 w-full rounded-md border border-border/50 bg-background px-4 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
              <button
                type="submit"
                className={cn(
                  "gradient-button h-12 px-6 rounded-md font-medium text-white",
                  "flex items-center justify-center gap-2 shadow-glow hover:shadow-glow-lg transition-shadow min-w-[140px]"
                )}
              >
                Join Waitlist
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm text-muted-foreground">
              Be among the first developers to gain access in 2025.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};

export default GetStarted;