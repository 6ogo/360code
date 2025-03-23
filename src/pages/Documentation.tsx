import React, { useState } from 'react';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import { Book, Search, ChevronRight, File, Code, Server, Settings, Download, HelpCircle, Command, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DocSectionProps {
  title: string;
  content: string;
  id: string;
}

interface DocCategoryProps {
  title: string;
  icon: React.ReactNode;
  sections: DocSectionProps[];
  id: string;
}

const DocCategory: React.FC<DocCategoryProps> = ({ title, icon, sections, id }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="mb-8">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 rounded-lg border border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-colors"
      >
        <div className="flex items-center gap-3">
          {icon}
          <h3 className="font-semibold text-lg">{title}</h3>
        </div>
        <ChevronRight className={cn(
          "w-5 h-5 text-muted-foreground transition-transform duration-300",
          isExpanded && "rotate-90"
        )} />
      </button>

      {isExpanded && (
        <div className="pl-4 border-l border-border/50 mt-2 ml-4 space-y-4 py-2">
          {sections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className="block p-3 rounded-md hover:bg-primary/5 transition-colors text-sm"
            >
              <div className="font-medium">{section.title}</div>
              <p className="text-muted-foreground text-xs mt-1 line-clamp-2">
                {section.content.substring(0, 120)}...
              </p>
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

const DocumentationPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const docCategories: DocCategoryProps[] = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: <Zap className="w-5 h-5 text-primary" />,
      sections: [
        {
          id: 'installation',
          title: 'Installation',
          content: 'Learn how to install 360code.io on different platforms including Windows, macOS, and Linux. This guide covers system requirements, installation steps, and troubleshooting tips for common installation issues.'
        },
        {
          id: 'quick-start',
          title: 'Quick Start Guide',
          content: 'Get up and running with 360code.io in minutes. This quick start guide walks you through the initial setup, connecting to your first project, and using basic features to enhance your coding workflow.'
        },
        {
          id: 'ide-setup',
          title: 'IDE Integration',
          content: 'Set up 360code.io with your preferred development environment. We provide official plugins for VS Code, JetBrains IDEs, Sublime Text, and more. Follow our step-by-step integration guides.'
        }
      ]
    },
    {
      id: 'core-features',
      title: 'Core Features',
      icon: <Code className="w-5 h-5 text-primary" />,
      sections: [
        {
          id: 'code-completion',
          title: 'Intelligent Code Completion',
          content: 'Discover how our AI-powered code completion works and how to get the most out of it. Learn about context-aware suggestions, code pattern recognition, and personalized recommendations based on your coding style.'
        },
        {
          id: 'code-generation',
          title: 'Code Generation',
          content: 'Generate robust code snippets and entire functions with our advanced code generation capabilities. This guide explains prompt techniques, how to refine generated code, and best practices for integrating generated code into your projects.'
        },
        {
          id: 'refactoring',
          title: 'Smart Refactoring',
          content: 'Transform and improve your existing code with intelligent refactoring suggestions. Learn how to identify code that could benefit from refactoring and how to apply AI-recommended changes with confidence.'
        }
      ]
    },
    {
      id: 'advanced-usage',
      title: 'Advanced Usage',
      icon: <Command className="w-5 h-5 text-primary" />,
      sections: [
        {
          id: 'custom-prompts',
          title: 'Creating Custom Prompts',
          content: 'Master the art of crafting effective prompts to get precisely the code and assistance you need. This guide covers prompt engineering techniques specific to coding tasks and how to save and reuse your most effective prompts.'
        },
        {
          id: 'project-context',
          title: 'Managing Project Context',
          content: 'Learn how to help 360code.io understand your project structure and architecture for more relevant suggestions. This guide explains how to define project boundaries, prioritize important files, and maintain context across coding sessions.'
        },
        {
          id: 'team-workflows',
          title: 'Team Collaboration',
          content: 'Set up 360code.io for effective team use with shared settings, coding standards enforcement, and collaborative features. Discover how to maintain consistency across team members while allowing for personal preferences.'
        }
      ]
    },
    {
      id: 'configuration',
      title: 'Configuration & Settings',
      icon: <Settings className="w-5 h-5 text-primary" />,
      sections: [
        {
          id: 'performance',
          title: 'Performance Optimization',
          content: 'Tune 360code.io for optimal performance on your system. Learn about memory management, processing options, and how to balance speed with accuracy for your specific needs and hardware capabilities.'
        },
        {
          id: 'language-settings',
          title: 'Language Settings',
          content: 'Configure language-specific settings for each programming language you work with. This guide covers syntax preferences, framework-specific settings, and how to optimize suggestions for your tech stack.'
        },
        {
          id: 'privacy-security',
          title: 'Privacy & Security',
          content: 'Understand and configure the privacy and security features of 360code.io. Learn how to control what data is processed, stored, or shared, and how to set up secure environments for sensitive projects.'
        }
      ]
    },
    {
      id: 'api-integration',
      title: 'API & Integration',
      icon: <Server className="w-5 h-5 text-primary" />,
      sections: [
        {
          id: 'api-reference',
          title: 'API Reference',
          content: 'Complete reference documentation for the 360code.io API, allowing you to integrate our AI capabilities into your own tools and workflows. Includes authentication, endpoints, request/response formats, and rate limits.'
        },
        {
          id: 'webhooks',
          title: 'Webhooks',
          content: 'Set up and manage webhooks to connect 360code.io with your CI/CD pipeline, project management tools, or custom applications. This guide includes example implementations and best practices for reliable webhook handling.'
        },
        {
          id: 'custom-extensions',
          title: 'Building Extensions',
          content: 'Create custom extensions to enhance 360code.io with additional functionality specific to your needs. Our extension development guide walks through the architecture, APIs, and submission process for the extension marketplace.'
        }
      ]
    }
  ];

  // Filter categories and sections based on search query
  const filteredCategories = searchQuery
    ? docCategories.map(category => ({
      ...category,
      sections: category.sections.filter(section =>
        section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        section.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    })).filter(category => category.sections.length > 0)
    : docCategories;

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

  function handleContactUs(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
    event.preventDefault();
    window.location.href = '/contact-support';
  }
  return (
    <div className="min-h-screen bg-background text-foreground w-full overflow-hidden">
      <Navbar />
      <main>
        <section className="relative py-20 md:py-32 mt-16">
          <div className="absolute inset-0 grid-pattern opacity-20"></div>
          <div className="absolute top-1/4 right-0 blue-glow opacity-30 animate-pulse-slow"></div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 md:mb-16">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 opacity-0 animate-fade-in">
                Documentation
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto opacity-0 animate-fade-in animation-delay-300">
                Comprehensive guides and references to help you get the most out of 360code.io
              </p>

              <div className="relative max-w-xl mx-auto mt-10 opacity-0 animate-fade-in animation-delay-600">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-muted-foreground" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-3 border border-border/50 rounded-md bg-card/30 backdrop-blur-sm focus:ring-primary focus:border-primary focus:outline-none"
                  placeholder="Search documentation..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1 opacity-0 animate-fade-in animation-delay-900">
                <div className="sticky top-24">
                  <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <Book className="w-5 h-5 text-primary" />
                    Table of Contents
                  </h2>

                  <nav className="space-y-1">
                    {docCategories.map(category => (
                      <a
                        key={category.id}
                        href={`#${category.id}`}
                        className="block py-2 px-3 text-sm rounded-md hover:bg-primary/5 transition-colors"
                      >
                        {category.title}
                      </a>
                    ))}
                  </nav>

                  <div className="mt-8 p-4 border border-border/50 rounded-lg bg-card/30 backdrop-blur-sm">
                    <h3 className="font-medium flex items-center gap-2 mb-3">
                      <HelpCircle className="w-4 h-4 text-primary" />
                      Need Help?
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Can't find what you're looking for or need personalized assistance?
                    </p>
                    <button
                      className="gradient-button px-6 py-2 rounded-md font-medium text-white shadow-md hover:shadow-lg transition-shadow"
                      onClick={handleContactUs}
                    >
                      Contact Support
                    </button>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2 opacity-0 animate-fade-in animation-delay-1200">
                <div className="space-y-12">
                  {filteredCategories.map(category => (
                    <div key={category.id} id={category.id}>
                      <h2 className="text-2xl font-bold mb-6 pb-2 border-b border-border/50 flex items-center gap-3">
                        {category.icon}
                        {category.title}
                      </h2>

                      <div className="space-y-4">
                        {category.sections.map(section => (
                          <div key={section.id} id={section.id} className="p-5 rounded-lg border border-border/50 bg-card/30 backdrop-blur-sm">
                            <h3 className="text-lg font-semibold mb-3">{section.title}</h3>
                            <p className="text-muted-foreground">{section.content}</p>
                            <button className="mt-4 text-sm text-primary hover:underline flex items-center gap-1">
                              Read more
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default DocumentationPage;
