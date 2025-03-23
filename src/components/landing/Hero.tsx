
import React from 'react';
import { ArrowRight, Terminal, Code } from 'lucide-react';
import { cn } from '@/lib/utils';
import CodeSnippet from './CodeSnippet';

const Hero: React.FC = () => {
  return (
    <section className="relative pt-28 pb-20 md:pt-36 md:pb-32 overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 dot-pattern opacity-20"></div>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-1/2 circle-pattern opacity-30"></div>
      <div className="absolute top-40 left-20 blue-glow opacity-70 animate-pulse-slow"></div>
      <div className="absolute bottom-40 right-20 blue-glow opacity-70 animate-pulse-slow animation-delay-1200"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-8 mb-12 md:mb-16">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm">
            <span className="inline-block w-2 h-2 rounded-full bg-primary mr-2 animate-pulse"></span>
            <span className="text-sm font-medium text-primary">Launching 2025</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight max-w-4xl mx-auto leading-tight opacity-0 animate-fade-in">
            Code Smarter, Build Faster with
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600 px-1">AI-Powered</span>
            Assistance
          </h1>
          
          <p className="text-lg md:text-xl text-foreground/70 max-w-2xl mx-auto opacity-0 animate-fade-in-delay-1">
            360code.io is your intelligent coding companion that understands context, solves problems, and accelerates development—all while keeping your code private and secure.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 opacity-0 animate-fade-in-delay-2">
            <a 
              href="#get-started" 
              className={cn(
                "gradient-button px-7 py-3 rounded-md font-medium text-white",
                "flex items-center gap-2 shadow-glow hover:shadow-glow-lg transition-shadow"
              )}
            >
              Experience 360
              <ArrowRight className="w-4 h-4" />
            </a>
            <a 
              href="#how-it-works"
              className="group px-7 py-3 rounded-md font-medium border border-border/50 hover:bg-secondary/30 transition-colors flex items-center gap-2"
            >
              How It Works
              <Terminal className="w-4 h-4 group-hover:text-primary transition-colors" />
            </a>
          </div>
        </div>

        {/* Code preview */}
        <div className="max-w-3xl mx-auto opacity-0 animate-fade-in-delay-3">
          <div className="relative rounded-lg overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/90 z-10 pointer-events-none"></div>
            
            <div className="relative bg-code-dark rounded-lg overflow-hidden border border-white/10">
              <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/10 bg-black/30">
                <div className="w-3 h-3 rounded-full bg-red-500/70"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/70"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/70"></div>
                <div className="ml-4 text-xs text-white/50 font-mono">360code.io</div>
              </div>
              
              <div className="px-4 py-4 max-h-[340px] overflow-y-auto">
                <CodeSnippet />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
