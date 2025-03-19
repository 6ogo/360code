
import React from 'react';
import { CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UseCaseProps {
  title: string;
  description: string;
  benefits: string[];
  image: string;
  imageAlt: string;
  reverse?: boolean;
  delay: string;
}

const UseCase: React.FC<UseCaseProps> = ({ 
  title, 
  description, 
  benefits, 
  image, 
  imageAlt,
  reverse = false,
  delay
}) => {
  return (
    <div className={cn(
      "relative flex flex-col md:flex-row items-center gap-8 md:gap-12",
      reverse ? "md:flex-row-reverse" : "",
      "opacity-0 animate-fade-in",
      delay
    )}>
      <div className="w-full md:w-1/2 order-2 md:order-none">
        <h3 className="text-2xl font-bold mb-4">{title}</h3>
        <p className="text-muted-foreground mb-6">{description}</p>
        
        <ul className="space-y-3">
          {benefits.map((benefit, index) => (
            <li key={index} className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <span>{benefit}</span>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="w-full md:w-1/2 order-1 md:order-none">
        <div className="relative rounded-lg overflow-hidden border border-border/50">
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent opacity-30 mix-blend-overlay"></div>
          <img 
            src={image} 
            alt={imageAlt}
            className="w-full h-auto"
            loading="lazy" 
          />
        </div>
      </div>
    </div>
  );
};

const UseCases: React.FC = () => {
  const useCases = [
    {
      title: "Rapid Prototyping & Development",
      description: "Accelerate from concept to functional prototype with AI-assisted code generation that understands your project requirements.",
      benefits: [
        "Generate boilerplate code in seconds instead of hours",
        "Quickly implement complex algorithms with intelligent suggestions",
        "Refactor prototype code into production-ready implementations"
      ],
      image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
      imageAlt: "Developer working on laptop with code"
    },
    {
      title: "Legacy Code Modernization",
      description: "Transform outdated codebases into modern, maintainable systems with AI-powered refactoring and best practice implementation.",
      benefits: [
        "Automatically identify and fix security vulnerabilities",
        "Convert legacy patterns to modern syntax and approaches",
        "Generate comprehensive documentation for existing code"
      ],
      image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7",
      imageAlt: "Colorful code on computer monitor"
    },
    {
      title: "Collaborative Development",
      description: "Enhance team productivity by standardizing code quality and enabling junior developers to work at a higher level.",
      benefits: [
        "Ensure consistent coding standards across the entire team",
        "Reduce code review cycles with pre-validated implementations",
        "Accelerate onboarding by explaining codebase context and patterns"
      ],
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
      imageAlt: "Development team collaborating on code"
    }
  ];

  const delays = [
    "animation-delay-300",
    "animation-delay-600",
    "animation-delay-900"
  ];

  return (
    <section id="use-cases" className="relative py-20 md:py-32">
      <div className="absolute inset-0 grid-pattern opacity-20"></div>
      <div className="absolute top-1/3 left-0 blue-glow opacity-30 animate-pulse-slow"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 md:mb-24">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 opacity-0 animate-fade-in">
            Real-World Applications
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto opacity-0 animate-fade-in animation-delay-300">
            Discover how 360code.io transforms development workflows across different scenarios and programming challenges.
          </p>
        </div>

        <div className="space-y-20 md:space-y-32">
          {useCases.map((useCase, index) => (
            <UseCase
              key={index}
              title={useCase.title}
              description={useCase.description}
              benefits={useCase.benefits}
              image={useCase.image}
              imageAlt={useCase.imageAlt}
              reverse={index % 2 !== 0}
              delay={delays[index % delays.length]}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default UseCases;
