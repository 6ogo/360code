import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Features from "./pages/Features";
import PricingPage from "./pages/Pricing";
const Pricing = PricingPage;
import Roadmap from "./pages/Roadmap";
import Documentation from "./pages/Documentation";
import SubscriptionSuccess from "./pages/SubscriptionSuccess";
import NotFound from "./pages/NotFound";

// Create a new query client
const queryClient = new QueryClient();

// Simple redirect component to app
const RedirectToApp = () => {
  useEffect(() => {
    window.location.href = 'https://app.360code.io/auth';
  }, []);
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center">
        <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mb-4 mx-auto"></div>
        <h3 className="text-xl font-medium">Redirecting to app...</h3>
      </div>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <HashRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/features" element={<Features />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/roadmap" element={<Roadmap />} />
          <Route path="/documentation" element={<Documentation />} />
          <Route path="/subscription-success" element={<SubscriptionSuccess />} />
          
          {/* Auth routes - direct redirect */}
          <Route path="/login" element={<RedirectToApp />} />
          <Route path="/signup" element={<RedirectToApp />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </HashRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;