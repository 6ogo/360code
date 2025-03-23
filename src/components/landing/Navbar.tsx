import React, { useState, useEffect } from 'react';
import { Menu, X, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link, useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleGoToApp = () => {
    // Direct redirect to app auth page
    window.location.href = 'https://app.360code.io/auth';
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4 px-4 md:px-8",
        isScrolled
          ? "bg-background/95 backdrop-blur-md border-b border-border/50"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="relative flex items-center justify-center w-10 h-10">
            <div className="absolute inset-0 bg-primary/20 rounded-md group-hover:bg-primary/30 transition-colors duration-300"></div>
            <img
              src="/logo.svg"
              alt="360code logo"
              width={30}
              height={30}
              className="z-10 group-hover:scale-110 transition-transform duration-300"
            />
          </div>
          <span className="text-xl font-semibold tracking-tight">360code.io</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-8">
          <Link
            to="/features"
            className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
          >
            Features
          </Link>
          <Link
            to="/pricing"
            className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
          >
            Pricing
          </Link>
          <Link
            to="/roadmap"
            className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
          >
            Roadmap
          </Link>
          <Link
            to="/documentation"
            className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
          >
            Documentation
          </Link>

          <button
            onClick={handleGoToApp}
            className="flex items-center gap-1.5 gradient-button px-4 py-1.5 rounded-md font-medium text-white text-sm"
          >
            Go to App
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </nav>

        <div className="flex items-center gap-4 md:hidden">
          <button
            onClick={handleGoToApp}
            className="flex items-center gap-1.5 gradient-button px-3 py-1.5 rounded-md font-medium text-white text-sm"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </button>

          <button
            className="text-foreground"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 bg-background/95 backdrop-blur-md z-40 p-4">
          <nav className="flex flex-col space-y-6 pt-6">
            <Link
              to="/features"
              className="text-lg font-medium text-foreground/80 hover:text-primary transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Features
            </Link>
            <Link
              to="/pricing"
              className="text-lg font-medium text-foreground/80 hover:text-primary transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link
              to="/roadmap"
              className="text-lg font-medium text-foreground/80 hover:text-primary transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Roadmap
            </Link>
            <Link
              to="/documentation"
              className="text-lg font-medium text-foreground/80 hover:text-primary transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Documentation
            </Link>

            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                handleGoToApp();
              }}
              className="gradient-button px-5 py-2 rounded-md font-medium text-white shadow-md hover:shadow-lg transition-shadow inline-block text-center mt-4"
            >
              Go to App
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;