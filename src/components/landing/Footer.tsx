import React from 'react';
import { Code2, Github, Twitter, Linkedin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="relative bg-background border-t border-border/50 py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6 lg:gap-12">
          <div className="md:col-span-1">
            <a href="#" className="flex items-center gap-2 group">
              <div className="relative flex items-center justify-center w-8 h-8">
                <div className="absolute inset-0 bg-primary/20 rounded-md group-hover:bg-primary/30 transition-colors duration-300"></div>
                <Code2 className="w-5 h-5 text-primary z-10 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <span className="text-xl font-semibold tracking-tight">360code.io</span>
            </a>
            <p className="mt-4 text-sm text-muted-foreground max-w-xs">
              Next-generation AI coding assistant that enhances developer productivity while maintaining complete privacy.
            </p>
            <div className="flex items-center gap-4 mt-6">
              <a 
                href="https://x.com/360code_io" 
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a 
                href="https://x.com/360code_io" 
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a 
                href="https://x.com/360code_io" 
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div className="md:col-span-2 grid grid-cols-2 md:grid-cols-3 gap-10 md:gap-6 lg:gap-12">
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-3">
                <li>
                  <a href="/features" className="text-sm text-muted-foreground hover:text-primary transition-colors">Features</a>
                </li>
                <li>
                  <a href="/pricing" className="text-sm text-muted-foreground hover:text-primary transition-colors">Pricing</a>
                </li>
                <li>
                  <a href="/roadmap" className="text-sm text-muted-foreground hover:text-primary transition-colors">Roadmap</a>
                </li>
                <li>
                  <a href="/documentation" className="text-sm text-muted-foreground hover:text-primary transition-colors">Documentation</a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-3">
                <li>
                  <a href="#about" className="text-sm text-muted-foreground hover:text-primary transition-colors">About</a>
                </li>
                <li>
                  <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Contact</a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy</a>
                </li>
                <li>
                  <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Terms</a>
                </li>
                <li>
                  <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Security</a>
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
    </footer>
  );
};

export default Footer;
