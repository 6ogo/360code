import React from 'react';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import { Sparkles, Clock, Calendar, Star, Rocket, Clock3, Activity, Share2, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

type TimelineStatus = 'completed' | 'in-progress' | 'upcoming';

interface RoadmapItemProps {
  title: string;
  description: string;
  timeline: string;
  status: TimelineStatus;
  features: string[];
  icon: React.ReactNode;
  delay: string;
}

const statusColors = {
  'completed': 'bg-green-500',
  'in-progress': 'bg-blue-500',
  'upcoming': 'bg-amber-500'
};

const statusLabels = {
  'completed': 'Completed',
  'in-progress': 'In Progress',
  'upcoming': 'Upcoming'
};

const RoadmapItem: React.FC<RoadmapItemProps> = ({ 
  title, 
  description, 
  timeline, 
  status, 
  features,
  icon,
  delay
}) => {
  return (
    <div className={cn(
      "relative p-6 rounded-lg border border-border/50 bg-card/50 backdrop-blur-sm",
      "opacity-0 animate-fade-in",
      delay
    )}>
      <div className="absolute -inset-0.5 bg-gradient-to-br from-primary/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-lg -z-10"></div>
      
      <div className="flex items-center gap-4 mb-4">
        <div className="p-3 rounded-lg bg-primary/10 w-fit">
          {icon}
        </div>
        <div>
          <h3 className="text-xl font-semibold">{title}</h3>
          <div className="flex items-center gap-2 mt-1">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{timeline}</span>
          </div>
        </div>
        <div className="ml-auto">
          <span className={cn(
            "px-3 py-1 rounded-full text-xs font-medium text-white",
            statusColors[status]
          )}>
            {statusLabels[status]}
          </span>
        </div>
      </div>
      
      <p className="text-muted-foreground mb-4">{description}</p>
      
      <div className="mb-2 font-medium">Key Features:</div>
      <ul className="space-y-2">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start text-sm">
            <Star className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <span className="ml-2">{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const RoadmapPage: React.FC = () => {
  const roadmapItems = [
    {
      title: "Foundation Release",
      timeline: "Q1 2025",
      status: 'completed' as TimelineStatus,
      description: "Our initial release with core functionality and essential features.",
      icon: <Rocket className="w-5 h-5 text-primary" />,
      features: [
        "Basic code completion and suggestions",
        "Multi-language support for major programming languages",
        "Privacy-focused architecture with local processing",
        "IDE integrations for VS Code and JetBrains"
      ]
    },
    {
      title: "Advanced Features Update",
      timeline: "Q2 2025",
      status: 'in-progress' as TimelineStatus,
      description: "Expanding capabilities with advanced AI features and deeper integrations.",
      icon: <Sparkles className="w-5 h-5 text-primary" />,
      features: [
        "Context-aware code generation",
        "Intelligent refactoring suggestions",
        "Code review and quality analysis",
        "Team collaboration features",
        "Advanced security scanning"
      ]
    },
    {
      title: "Enterprise Expansion",
      timeline: "Q3 2025",
      status: 'upcoming' as TimelineStatus,
      description: "Tailored solutions for larger teams and enterprise environments.",
      icon: <Activity className="w-5 h-5 text-primary" />,
      features: [
        "Custom AI model fine-tuning",
        "Team performance analytics",
        "Enterprise security enhancements",
        "Advanced permission controls",
        "Custom integration APIs"
      ]
    },
    {
      title: "Ecosystem Growth",
      timeline: "Q4 2025",
      status: 'upcoming' as TimelineStatus,
      description: "Building a broader ecosystem around our core technology.",
      icon: <Share2 className="w-5 h-5 text-primary" />,
      features: [
        "Plugin marketplace for extensions",
        "Developer community platform",
        "Integration with CI/CD pipelines",
        "Custom workflow automation",
        "Additional language support"
      ]
    },
    {
      title: "Next-Gen Intelligence",
      timeline: "Q1 2026",
      status: 'upcoming' as TimelineStatus,
      description: "Pushing the boundaries with next-generation AI capabilities.",
      icon: <Zap className="w-5 h-5 text-primary" />,
      features: [
        "Predictive development recommendations",
        "Project-wide architecture suggestions",
        "Natural language programming interfaces",
        "Autonomous code optimization",
        "Advanced learning from your coding style"
      ]
    }
  ];

  const delays = [
    "animation-delay-300",
    "animation-delay-600",
    "animation-delay-900",
    "animation-delay-1200",
    "animation-delay-1500",
  ];

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
                Product Roadmap
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto opacity-0 animate-fade-in animation-delay-300">
                Our vision for the future of 360code.io and the exciting features we're working on
              </p>
            </div>

            <div className="space-y-8">
              {roadmapItems.map((item, index) => (
                <RoadmapItem
                  key={index}
                  title={item.title}
                  timeline={item.timeline}
                  status={item.status}
                  description={item.description}
                  features={item.features}
                  icon={item.icon}
                  delay={delays[index % delays.length]}
                />
              ))}
            </div>

            <div className="mt-16 text-center">
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto opacity-0 animate-fade-in animation-delay-1200">
                Have a feature request or suggestion for our roadmap? We'd love to hear from you!
              </p>
              <button className="gradient-button px-6 py-2 rounded-md font-medium text-white shadow-md hover:shadow-lg transition-shadow opacity-0 animate-fade-in animation-delay-1500">
                Submit Feedback
              </button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default RoadmapPage;
