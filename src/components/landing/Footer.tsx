import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Code2, Github, Twitter, Linkedin, X } from 'lucide-react';
import ContactPopup from './ContactPopup';

const Footer: React.FC = () => {
  const [isContactPopupOpen, setIsContactPopupOpen] = useState(false);

  return (
    <footer className="relative bg-background border-t border-border/50 py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6 lg:gap-12">
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="relative flex items-center justify-center w-8 h-8">
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
            <p className="mt-4 text-sm text-muted-foreground max-w-xs">
              Next-generation AI coding assistant that enhances developer productivity while maintaining complete privacy.
            </p>
            <div className="flex items-center gap-4 mt-6">
              <a
                href="https://x.com/360code_io"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="X"
              >
                <X size={16} />
              </a>            </div>
          </div>

          <div className="md:col-span-2 grid grid-cols-2 md:grid-cols-3 gap-10 md:gap-6 lg:gap-12">
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-3">
                <li>
                  <Link to="/features" className="text-sm text-muted-foreground hover:text-primary transition-colors">Features</Link>
                </li>
                <li>
                  <Link to="/pricing" className="text-sm text-muted-foreground hover:text-primary transition-colors">Pricing</Link>
                </li>
                <li>
                  <Link to="/roadmap" className="text-sm text-muted-foreground hover:text-primary transition-colors">Roadmap</Link>
                </li>
                <li>
                  <Link to="/documentation" className="text-sm text-muted-foreground hover:text-primary transition-colors">Documentation</Link>
                </li>
                <li>
                  <a href="https://app.360code.io" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Test the app!
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-3">
                <li>
                  <a href="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">About</a>
                </li>
                <li>
                  <button
                    onClick={() => setIsContactPopupOpen(true)}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors text-left w-auto bg-transparent"
                  >
                    Contact
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-3">
                <li>
                  <Link to="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy</Link>
                </li>
                <li>
                  <Link to="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">Terms</Link>
                </li>
                <li>
                  <Link to="/security" className="text-sm text-muted-foreground hover:text-primary transition-colors">Security</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-border/50 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} 360code.io. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Made with precision for developers worldwide
          </p>
        </div>
      </div>

      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsContactPopupOpen(true)}
          className="gradient-button p-3 rounded-full shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center"
          aria-label="Contact Us"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v5Z"></path><path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1"></path></svg>
        </button>
      </div>

      <ContactPopup
        isOpen={isContactPopupOpen}
        onClose={() => setIsContactPopupOpen(false)}
      />
    </footer>
  );
};

export default Footer;
