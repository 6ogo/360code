
import React from 'react';
import { Code, Shield, Zap, Brain, Server, Command } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: string;
}

const Feature: React.FC<FeatureProps> = ({ icon, title, description, delay }) => {
  return (
    <div className={cn(
      "relative p-6 rounded-lg border border-border/50 bg-card/50 backdrop-blur-sm",
      "opacity-0 animate-fade-in",
      delay
    )}>
      <div className="absolute -inset-0.5 bg-gradient-to-br from-primary/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-lg -z-10"></div>
      <div className="p-3 mb-4 rounded-lg bg-primary/10 w-fit">
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

const Features: React.FC = () => {
  const features = [
    {
      icon: <Brain className="w-5 h-5 text-primary" />,
      title: "Contextual Understanding",
      description: "Comprehends your codebase and development goals, providing suggestions that align with your project's architecture and style."
    },
    {
      icon: <Code className="w-5 h-5 text-primary" />,
      title: "Multi-Language Support",
      description: "Works seamlessly across JavaScript, Python, Java, Go, Rust, and more, with specialized understanding of frameworks and libraries."
    },
    {
      icon: <Zap className="w-5 h-5 text-primary" />,
      title: "Accelerated Development",
      description: "Generates optimized code snippets, refactors complex functions, and automates repetitive tasks to boost your productivity."
    },
    {
      icon: <Shield className="w-5 h-5 text-primary" />,
      title: "Privacy-Focused",
      description: "Runs locally on your machine, ensuring your code never leaves your environment. Full privacy with no data sent to external servers."
    },
    {
      icon: <Server className="w-5 h-5 text-primary" />,
      title: "Adaptive Learning",
      description: "Learns from your coding patterns and preferences to provide increasingly personalized assistance over time."
    },
    {
      icon: <Command className="w-5 h-5 text-primary" />,
      title: "Seamless Integration",
      description: "Integrates with popular IDEs and development environments through plugins and extensions for a frictionless workflow."
    }
  ];

  const delays = [
    "animation-delay-300",
    "animation-delay-600",
    "animation-delay-900",
    "animation-delay-1200",
    "animation-delay-1500",
    "animation-delay-1500"
  ];

  return (
    <section id="features" className="relative py-20 md:py-32">
      <div className="absolute inset-0 grid-pattern opacity-20"></div>
      <div className="absolute top-1/4 right-0 blue-glow opacity-30 animate-pulse-slow"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 md:mb-24">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 opacity-0 animate-fade-in">
            Intelligent Features for Modern Development
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto opacity-0 animate-fade-in animation-delay-300">
            360code.io combines advanced AI capabilities with developer-centric design to enhance your coding experience without compromising on speed or privacy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <Feature
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={delays[index]}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
