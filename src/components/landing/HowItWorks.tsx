
import React from 'react';
import { Terminal, GitPullRequest, Workflow, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StepProps {
  number: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  delay: string;
}

const Step: React.FC<StepProps> = ({ number, title, description, icon, delay }) => {
  return (
    <div className={cn(
      "relative flex items-start gap-6",
      "opacity-0 animate-fade-in",
      delay
    )}>
      <div className="relative">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 border border-primary/30">
          {icon}
        </div>
        {number < 4 && (
          <div className="absolute left-1/2 top-12 w-px h-16 bg-gradient-to-b from-primary/30 to-transparent -translate-x-1/2 hidden md:block"></div>
        )}
      </div>
      
      <div className="flex-1 pt-1">
        <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
          <span className="text-primary">{number}.</span> {title}
        </h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  );
};

const HowItWorks: React.FC = () => {
  const steps = [
    {
      number: 1,
      title: "Connect to Your Environment",
      description: "Install the 360code.io extension in your preferred code editor or IDE. The setup takes less than a minute and requires no configuration.",
      icon: <Terminal className="w-5 h-5 text-primary" />
    },
    {
      number: 2,
      title: "Let AI Analyze Your Codebase",
      description: "360code.io scans your project structure and code patterns locally to understand context and architectural decisions without sending data externally.",
      icon: <Search className="w-5 h-5 text-primary" />
    },
    {
      number: 3,
      title: "Code with AI Assistance",
      description: "As you work, receive intelligent suggestions, code completions, and optimization recommendations that align with your project's style and best practices.",
      icon: <GitPullRequest className="w-5 h-5 text-primary" />
    },
    {
      number: 4,
      title: "Accelerate Your Workflow",
      description: "Leverage AI-powered refactoring, bug detection, and documentation generation to maintain high-quality code while moving faster than ever before.",
      icon: <Workflow className="w-5 h-5 text-primary" />
    }
  ];

  const delays = [
    "animation-delay-300",
    "animation-delay-600",
    "animation-delay-900",
    "animation-delay-1200"
  ];

  return (
    <section id="how-it-works" className="relative py-20 md:py-32 bg-secondary/30">
      <div className="absolute inset-0 dot-pattern opacity-10"></div>
      <div className="absolute bottom-0 left-1/3 blue-glow opacity-20 animate-pulse-slow"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 md:mb-24">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 opacity-0 animate-fade-in">
            How 360code.io Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto opacity-0 animate-fade-in animation-delay-300">
            Experience a seamless AI-powered development workflow that respects your privacy and enhances your coding practices.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-12 md:space-y-16">
          {steps.map((step, index) => (
            <Step
              key={index}
              number={step.number}
              title={step.title}
              description={step.description}
              icon={step.icon}
              delay={delays[index]}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
