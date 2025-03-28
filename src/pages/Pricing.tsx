// src/pages/Pricing.tsx
import React, { useState } from 'react';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import { Check, Zap, Diamond, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';
import ContactPopup from '@/components/landing/ContactPopup';

interface PricingTierProps {
  title: string;
  price: string;
  description: string;
  features: string[];
  highlighted: boolean;
  icon: React.ReactNode;
  delay: string;
  buttonText: string;
  onButtonClick: () => void;
}

const PricingTier: React.FC<PricingTierProps> = ({ 
  title, 
  price, 
  description, 
  features, 
  highlighted, 
  icon,
  delay,
  buttonText,
  onButtonClick
}) => {
  return (
    <div className={cn(
      "relative p-6 rounded-lg border backdrop-blur-sm",
      "flex flex-col h-full",
      "opacity-0 animate-fade-in",
      delay,
      highlighted 
        ? "border-primary/50 bg-primary/5" 
        : "border-border/50 bg-card/50"
    )}>
      {highlighted && (
        <div className="absolute -inset-0.5 bg-gradient-to-br from-primary/30 to-primary/10 opacity-60 rounded-lg -z-10"></div>
      )}
      
      <div className="p-3 mb-4 rounded-lg bg-primary/10 w-fit">
        {icon}
      </div>
      
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <div className="mb-4">
        <span className="text-3xl font-bold">{price}</span>
        {price !== 'Free' && <span className="text-muted-foreground">/month</span>}
      </div>
      <p className="text-muted-foreground mb-6">{description}</p>
      
      <ul className="space-y-3 mb-8 flex-grow">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <span className="ml-2 text-sm">{feature}</span>
          </li>
        ))}
      </ul>
      
      <button 
        className={cn(
          "py-2 rounded-md font-medium w-full transition-all",
          highlighted
            ? "gradient-button text-white shadow-md hover:shadow-lg"
            : "bg-primary/10 text-primary hover:bg-primary/20"
        )}
        onClick={onButtonClick}
      >
        {buttonText}
      </button>
    </div>
  );
};

const PricingPage: React.FC = () => {
  const [isContactPopupOpen, setIsContactPopupOpen] = useState(false);

  // Direct redirect to app auth page
  const handleRedirectToApp = () => {
    window.location.href = 'https://app.360code.io/auth';
  };

  const handleContactUs = () => {
    setIsContactPopupOpen(true);
  };

  const pricingTiers = [
    {
      title: "Basic",
      price: "Free",
      description: "Perfect for personal projects and learning.",
      icon: <Zap className="w-5 h-5 text-primary" />,
      highlighted: false,
      features: [
        "Basic code completion",
        "Limited syntax suggestions",
        "Standard error detection",
        "Community support",
        "Single project support"
      ],
      buttonText: "Try it Free",
      onButtonClick: handleRedirectToApp
    },
    {
      title: "Pro",
      price: "$35",
      description: "Great for individual developers seeking enhanced productivity.",
      icon: <Diamond className="w-5 h-5 text-primary" />,
      highlighted: false,
      features: [
        "Everything in Basic",
        "Advanced code completion",
        "Context-aware suggestions",
        "Multi-project support",
        "Code refactoring assistance", 
        "Extended daily queries"
      ],
      buttonText: "Get Started",
      onButtonClick: handleRedirectToApp
    },
    {
      title: "Pro+",
      price: "$49",
      description: "Ideal for professional developers and small teams.",
      icon: <Crown className="w-5 h-5 text-primary" />,
      highlighted: true,
      features: [
        "Everything in Pro",
        "Advanced code generation",
        "Team collaboration features",
        "Custom integration options",
        "Priority email support",
        "Advanced security features"
      ],
      buttonText: "Get Started",
      onButtonClick: handleRedirectToApp
    },
    {
      title: "Enterprise",
      price: "Custom",
      description: "For teams and organizations with advanced needs.",
      icon: <Zap className="w-5 h-5 text-primary" />,
      highlighted: false,
      features: [
        "Everything in Pro+",
        "Custom AI model fine-tuning",
        "Advanced team collaboration",
        "Advanced security features",
        "Dedicated account manager",
        "24/7 priority support",
        "Training and onboarding",
        "Custom integration development"
      ],
      buttonText: "Contact Sales",
      onButtonClick: handleContactSales
    }
  ];

  const delays = [
    "animation-delay-300",
    "animation-delay-600",
    "animation-delay-900",
    "animation-delay-1200"
  ];

  function handleContactSales() {
    setIsContactPopupOpen(true);
  }

  React.useEffect(() => {
    // Initialize animation observers
    const animatedElements = document.querySelectorAll('.animate-fade-in, .animate-fade-in-delay-1, .animate-fade-in-delay-2, .animate-fade-in-delay-3, .animate-fade-in-delay-4');
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const element = entry.target as HTMLElement;
            element.style.opacity = ''; // Let the animation handle opacity
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        threshold: 0.1,
        rootMargin: '0px 0px -10% 0px'
      }
    );
    
    animatedElements.forEach(element => {
      observer.observe(element);
    });
    
    return () => {
      animatedElements.forEach(element => {
        observer.unobserve(element);
      });
    };
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground w-full overflow-hidden">
      <Navbar />
      <main>
        <section className="relative py-20 md:py-32 mt-16">
          <div className="absolute inset-0 grid-pattern opacity-20"></div>
          <div className="absolute top-1/4 right-0 blue-glow opacity-30 animate-pulse-slow"></div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 md:mb-24">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 opacity-0 animate-fade-in">
                Simple, Transparent Pricing
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto opacity-0 animate-fade-in animation-delay-300">
                Choose the plan that's right for you and start coding smarter with 360code.io
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
              {pricingTiers.map((tier, index) => (
                <PricingTier
                  key={index}
                  title={tier.title}
                  price={tier.price}
                  description={tier.description}
                  features={tier.features}
                  highlighted={tier.highlighted}
                  icon={tier.icon}
                  delay={delays[index % delays.length]}
                  buttonText={tier.buttonText}
                  onButtonClick={tier.onButtonClick}
                />
              ))}
            </div>

            <div className="mt-20 text-center p-8 border border-border/50 rounded-lg bg-card/30 backdrop-blur-sm opacity-0 animate-fade-in animation-delay-900">
              <h3 className="text-xl font-semibold mb-4">Need a custom solution?</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                We offer tailored solutions for larger teams and specialized requirements. 
                Contact our team to discuss how we can meet your specific needs.
              </p>
              <button 
                className="gradient-button px-6 py-2 rounded-md font-medium text-white shadow-md hover:shadow-lg transition-shadow"
                onClick={handleContactUs}
              >
                Contact Us
              </button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      
      <ContactPopup
        isOpen={isContactPopupOpen}
        onClose={() => setIsContactPopupOpen(false)}
      />
    </div>
  );
};

export default PricingPage;