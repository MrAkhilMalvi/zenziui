import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Search,
  Book,
  Code,
  Palette,
  Copy,
  CheckCircle,
  Zap,
  Terminal,
  Settings,
  Monitor,
  Layers,
  GitBranch,
  Package,
  Play,
  Info,
  Eye,
  Database,
  Cloud,
  Cpu,
  Puzzle,
  Rocket,
  TrendingUp,
  Layout,
} from "lucide-react";

const navigationItems = [
  {
    title: "Getting Started",
    items: [
      {
        id: "introduction",
        title: "Introduction",
        icon: <Book className="h-4 w-4" />,
        badge: "New",
      },
      {
        id: "installation",
        title: "Quick Start",
        icon: <Package className="h-4 w-4" />,
        badge: "Essential",
      },
      {
        id: "first-component",
        title: "Your First Component",
        icon: <Play className="h-4 w-4" />,
      },
      {
        id: "configuration",
        title: "Configuration",
        icon: <Settings className="h-4 w-4" />,
      },
    ],
  },
  {
    title: "Core Concepts",
    items: [
      {
        id: "visual-editor",
        title: "Visual Editor",
        icon: <Eye className="h-4 w-4" />,
        badge: "Core",
      },
      {
        id: "component-system",
        title: "Component System",
        icon: <Layers className="h-4 w-4" />,
      },
      {
        id: "theming",
        title: "Theming & Styling",
        icon: <Palette className="h-4 w-4" />,
      },
      {
        id: "responsive-design",
        title: "Responsive Design",
        icon: <Monitor className="h-4 w-4" />,
      },
    ],
  },
  {
    title: "Advanced Features",
    items: [
      {
        id: "custom-components",
        title: "Custom Components",
        icon: <Puzzle className="h-4 w-4" />,
        badge: "Pro",
      },
      {
        id: "animations",
        title: "Animations & Effects",
        icon: <Zap className="h-4 w-4" />,
      },
      {
        id: "state-management",
        title: "State Management",
        icon: <Database className="h-4 w-4" />,
      },
      {
        id: "performance",
        title: "Performance",
        icon: <TrendingUp className="h-4 w-4" />,
      },
    ],
  },
  {
    title: "API Reference",
    items: [
      {
        id: "components-api",
        title: "Components API",
        icon: <Code className="h-4 w-4" />,
      },
      {
        id: "hooks-api",
        title: "Hooks API",
        icon: <GitBranch className="h-4 w-4" />,
      },
      {
        id: "utilities",
        title: "Utilities",
        icon: <Terminal className="h-4 w-4" />,
      },
    ],
  },
  {
    title: "Deployment",
    items: [
      {
        id: "build-process",
        title: "Build Process",
        icon: <Cpu className="h-4 w-4" />,
      },
      {
        id: "production",
        title: "Production Deploy",
        icon: <Cloud className="h-4 w-4" />,
      },
      {
        id: "optimization",
        title: "Optimization",
        icon: <Rocket className="h-4 w-4" />,
      },
    ],
  },
];

const codeExamples = {
  installation: `# Clone the ZenZiUI repository
git clone https://github.com/zenziui/zenziui.git

# Navigate to project directory
cd zenziui

# Install dependencies
npm install

# Start development server
npm run dev`,

  basicComponent: `import { Button } from '@/components/ui/button';

export function MyComponent() {
  return (
    <div className="p-4">
      <Button 
        variant="primary" 
        size="lg"
        onClick={() => console.log('Hello from ZenZiUI!')}
      >
        Get Started
      </Button>
    </div>
  );
}`,

  advancedComponent: `import { Card, Button, Badge } from '@/components/ui';
import { useState, useEffect } from 'react';

export function ProductCard({ product }) {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(product);

  return (
    <Card className="product-card" animations="hover:scale-105">
      <Card.Header>
        <Badge variant={product.featured ? "primary" : "secondary"}>
          {product.featured ? "Featured" : "Standard"}
        </Badge>
      </Card.Header>
      
      <Card.Content>
        <h3 className="text-lg font-semibold">{data.title}</h3>
        <p className="text-muted-foreground">{data.description}</p>
        
        <div className="mt-4 flex justify-between items-center">
          <span className="text-2xl font-bold">\${data.price}</span>
          <Button 
            variant="primary"
            loading={isLoading}
            onClick={() => addToCart(data.id)}
          >
            Add to Cart
          </Button>
        </div>
      </Card.Content>
    </Card>
  );
}`,

  customHook: `import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';

export function useDataFetcher(url, options = {}) {
  const [state, setState] = useState({
    data: null,
    loading: true,
    error: null
  });
  
  const { theme } = useTheme();
  const cache = new Map(); // Simple cache implementation
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check cache first
        const cached = cache.get(url);
        if (cached && !options.forceRefresh) {
          setState({ data: cached, loading: false, error: null });
          return;
        }
        
        setState(prev => ({ ...prev, loading: true }));
        
        const response = await fetch(url, {
          headers: {
            'Content-Type': 'application/json',
            'Theme-Preference': theme.mode,
            ...options.headers
          }
        });
        
        if (!response.ok) {
          throw new Error(\`HTTP error! status: \${response.status}\`);
        }
        
        const data = await response.json();
        
        // Cache the result
        cache.set(url, data, options.cacheTime || 300000); // 5 min default
        
        setState({ data, loading: false, error: null });
      } catch (error) {
        setState({ data: null, loading: false, error: error.message });
      }
    };
    
    fetchData();
  }, [url, options.forceRefresh]);
  
  return state;
}`,
};

export default function Docs() {
  const [activeSection, setActiveSection] = useState("introduction");
  const [searchQuery, setSearchQuery] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(id);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const filteredNavigation = navigationItems
    .map((section) => ({
      ...section,
      items: section.items.filter((item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    }))
    .filter((section) => section.items.length > 0);

  useEffect(() => {
    // Smooth scroll to section when activeSection changes
    const element = document.getElementById(activeSection);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  }, [activeSection]);

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-b from-background to-muted/20">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-4xl mx-auto">
              <Badge variant="outline" className="mb-4">
                <Book className="h-3 w-3 mr-1" />
                Documentation v2.0
              </Badge>

              <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gradient">
                ZenZiUI Documentation
              </h1>

              <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
                Comprehensive guides, API references, and examples to help you
                build amazing UIs with ZenZiUI's visual component editor.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  onClick={() => setActiveSection("installation")}
                >
                  <Rocket className="h-5 w-5 mr-2" />
                  Get Started
                </Button>
                <Button variant="outline" size="lg">
                  <Play className="h-5 w-5 mr-2" />
                  Watch Tutorial
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Main Documentation */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar Navigation */}
                <div className="lg:col-span-1">
                  <div className="sticky top-24">
                    {/* Search */}
                    <div className="mb-6">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          placeholder="Search documentation..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    {/* Navigation */}
                    <ScrollArea className="h-[600px]">
                      <nav className="space-y-6">
                        {filteredNavigation.map((section, sectionIndex) => (
                          <div key={sectionIndex}>
                            <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-3">
                              {section.title}
                            </h4>
                            <ul className="space-y-1">
                              {section.items.map((item) => (
                                <li key={item.id}>
                                  <button
                                    onClick={() => setActiveSection(item.id)}
                                    className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-all hover:bg-muted/50 group ${
                                      activeSection === item.id
                                        ? "bg-primary/10 text-primary border-l-2 border-primary"
                                        : "text-muted-foreground hover:text-foreground"
                                    }`}
                                  >
                                    <div className="flex items-center gap-3">
                                      {item.icon}
                                      <span className="text-sm font-medium">
                                        {item.title}
                                      </span>
                                    </div>
                                    {item.badge && (
                                      <Badge
                                        variant={
                                          item.badge === "Pro"
                                            ? "default"
                                            : "secondary"
                                        }
                                        className="text-xs"
                                      >
                                        {item.badge}
                                      </Badge>
                                    )}
                                  </button>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </nav>
                    </ScrollArea>
                  </div>
                </div>

                {/* Main Content */}
                <div className="lg:col-span-3">
                  <div ref={contentRef} className="space-y-12">
                    {/* Introduction */}
                    <section id="introduction" className="scroll-mt-24">
                      <Card className="glass border-primary/20">
                        <CardHeader>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                              <Book className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <CardTitle className="text-2xl">
                                Welcome to ZenZiUI
                              </CardTitle>
                              <p className="text-muted-foreground">
                                The future of visual component development
                              </p>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          <div className="prose prose-gray dark:prose-invert max-w-none">
                            <p className="text-lg leading-relaxed">
                              ZenZiUI is a revolutionary visual component editor
                              that bridges the gap between design and
                              development. Build production-ready React
                              components with real-time visual editing, advanced
                              theming, and seamless code generation.
                            </p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                            <div className="text-center p-6 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50">
                              <Eye className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                              <h3 className="font-semibold mb-2">
                                Visual-First
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                Design components visually with real-time
                                preview and instant feedback.
                              </p>
                            </div>

                            <div className="text-center p-6 rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50">
                              <Code className="h-8 w-8 text-green-600 mx-auto mb-3" />
                              <h3 className="font-semibold mb-2">
                                Code Generation
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                Generate clean, production-ready React +
                                Tailwind CSS code automatically.
                              </p>
                            </div>

                            <div className="text-center p-6 rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50">
                              <Layers className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                              <h3 className="font-semibold mb-2">
                                Component System
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                Comprehensive library with 45+ pre-built,
                                customizable components.
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </section>

                    {/* Installation */}
                    <section id="installation" className="scroll-mt-24">
                      <Card className="glass">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Package className="h-6 w-6 text-primary" />
                              <CardTitle className="text-2xl">
                                Quick Start
                              </CardTitle>
                            </div>
                            <Badge variant="outline">Essential</Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          <div className="prose prose-gray dark:prose-invert max-w-none">
                            <p>
                              Get up and running with ZenZiUI in minutes. Follow
                              these simple steps:
                            </p>
                          </div>

                          <Tabs defaultValue="npm" className="w-full">
                            <TabsList className="grid w-full grid-cols-3">
                              <TabsTrigger value="npm">npm</TabsTrigger>
                              <TabsTrigger value="yarn">yarn</TabsTrigger>
                              <TabsTrigger value="pnpm">pnpm</TabsTrigger>
                            </TabsList>

                            <TabsContent value="npm" className="space-y-4">
                              <div className="relative">
                                <pre className="bg-muted/50 p-4 rounded-lg text-sm overflow-x-auto border">
                                  <code>
                                    {codeExamples.installation.replace(
                                      "npm",
                                      "npm",
                                    )}
                                  </code>
                                </pre>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="absolute top-2 right-2"
                                  onClick={() =>
                                    copyToClipboard(
                                      codeExamples.installation,
                                      "install-npm",
                                    )
                                  }
                                >
                                  {copied === "install-npm" ? (
                                    <CheckCircle className="h-4 w-4" />
                                  ) : (
                                    <Copy className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>
                            </TabsContent>

                            <TabsContent value="yarn" className="space-y-4">
                              <div className="relative">
                                <pre className="bg-muted/50 p-4 rounded-lg text-sm overflow-x-auto border">
                                  <code>
                                    {codeExamples.installation
                                      .replace("npm install", "yarn install")
                                      .replace("npm run dev", "yarn dev")}
                                  </code>
                                </pre>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="absolute top-2 right-2"
                                  onClick={() =>
                                    copyToClipboard(
                                      codeExamples.installation
                                        .replace("npm install", "yarn install")
                                        .replace("npm run dev", "yarn dev"),
                                      "install-yarn",
                                    )
                                  }
                                >
                                  {copied === "install-yarn" ? (
                                    <CheckCircle className="h-4 w-4" />
                                  ) : (
                                    <Copy className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>
                            </TabsContent>

                            <TabsContent value="pnpm" className="space-y-4">
                              <div className="relative">
                                <pre className="bg-muted/50 p-4 rounded-lg text-sm overflow-x-auto border">
                                  <code>
                                    {codeExamples.installation
                                      .replace("npm install", "pnpm install")
                                      .replace("npm run dev", "pnpm dev")}
                                  </code>
                                </pre>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="absolute top-2 right-2"
                                  onClick={() =>
                                    copyToClipboard(
                                      codeExamples.installation
                                        .replace("npm install", "pnpm install")
                                        .replace("npm run dev", "pnpm dev"),
                                      "install-pnpm",
                                    )
                                  }
                                >
                                  {copied === "install-pnpm" ? (
                                    <CheckCircle className="h-4 w-4" />
                                  ) : (
                                    <Copy className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>
                            </TabsContent>
                          </Tabs>

                          <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                            <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                            <div>
                              <h4 className="font-semibold text-blue-900 dark:text-blue-100">
                                Next Steps
                              </h4>
                              <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                                After installation, visit
                                http://localhost:3000/explore to start building
                                your first component with the visual editor.
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </section>

                    {/* First Component */}
                    <section id="first-component" className="scroll-mt-24">
                      <Card className="glass">
                        <CardHeader>
                          <div className="flex items-center gap-3">
                            <Play className="h-6 w-6 text-primary" />
                            <CardTitle className="text-2xl">
                              Your First Component
                            </CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          <p className="text-muted-foreground">
                            Let's create your first component using ZenZiUI.
                            We'll build a simple button component that showcases
                            the power of visual editing.
                          </p>

                          <div className="space-y-4">
                            <h4 className="font-semibold flex items-center gap-2">
                              <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm">
                                1
                              </span>
                              Basic Component
                            </h4>
                            <div className="relative">
                              <pre className="bg-muted/50 p-4 rounded-lg text-sm overflow-x-auto border">
                                <code>{codeExamples.basicComponent}</code>
                              </pre>
                              <Button
                                size="sm"
                                variant="outline"
                                className="absolute top-2 right-2"
                                onClick={() =>
                                  copyToClipboard(
                                    codeExamples.basicComponent,
                                    "basic-component",
                                  )
                                }
                              >
                                {copied === "basic-component" ? (
                                  <CheckCircle className="h-4 w-4" />
                                ) : (
                                  <Copy className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <h4 className="font-semibold flex items-center gap-2">
                              <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm">
                                2
                              </span>
                              Advanced Component with State
                            </h4>
                            <div className="relative">
                              <pre className="bg-muted/50 p-4 rounded-lg text-sm overflow-x-auto border max-h-80 overflow-y-auto">
                                <code>{codeExamples.advancedComponent}</code>
                              </pre>
                              <Button
                                size="sm"
                                variant="outline"
                                className="absolute top-2 right-2"
                                onClick={() =>
                                  copyToClipboard(
                                    codeExamples.advancedComponent,
                                    "advanced-component",
                                  )
                                }
                              >
                                {copied === "advanced-component" ? (
                                  <CheckCircle className="h-4 w-4" />
                                ) : (
                                  <Copy className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </section>

                    {/* Visual Editor */}
                    <section id="visual-editor" className="scroll-mt-24">
                      <Card className="glass border-green-200 dark:border-green-800">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Eye className="h-6 w-6 text-green-600" />
                              <CardTitle className="text-2xl">
                                Visual Editor
                              </CardTitle>
                            </div>
                            <Badge className="bg-green-500">Core Feature</Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          <p className="text-muted-foreground">
                            The Visual Editor is the heart of ZenZiUI. It
                            provides a powerful, intuitive interface for
                            building and customizing components without writing
                            code.
                          </p>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                              <h4 className="font-semibold">Key Features</h4>
                              <ul className="space-y-2">
                                <li className="flex items-center gap-2">
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                  <span className="text-sm">
                                    Real-time preview
                                  </span>
                                </li>
                                <li className="flex items-center gap-2">
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                  <span className="text-sm">
                                    Drag & drop interface
                                  </span>
                                </li>
                                <li className="flex items-center gap-2">
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                  <span className="text-sm">
                                    Advanced property panels
                                  </span>
                                </li>
                                <li className="flex items-center gap-2">
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                  <span className="text-sm">
                                    Component-specific controls
                                  </span>
                                </li>
                                <li className="flex items-center gap-2">
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                  <span className="text-sm">
                                    Live code generation
                                  </span>
                                </li>
                              </ul>
                            </div>

                            <div className="space-y-4">
                              <h4 className="font-semibold">
                                Property Categories
                              </h4>
                              <div className="grid grid-cols-2 gap-2">
                                <div className="p-3 bg-muted/50 rounded-lg text-center">
                                  <Layout className="h-5 w-5 mx-auto mb-1 text-blue-500" />
                                  <span className="text-xs font-medium">
                                    Layout
                                  </span>
                                </div>
                                <div className="p-3 bg-muted/50 rounded-lg text-center">
                                  <Palette className="h-5 w-5 mx-auto mb-1 text-purple-500" />
                                  <span className="text-xs font-medium">
                                    Style
                                  </span>
                                </div>
                                <div className="p-3 bg-muted/50 rounded-lg text-center">
                                  <Zap className="h-5 w-5 mx-auto mb-1 text-yellow-500" />
                                  <span className="text-xs font-medium">
                                    Effects
                                  </span>
                                </div>
                                <div className="p-3 bg-muted/50 rounded-lg text-center">
                                  <Settings className="h-5 w-5 mx-auto mb-1 text-gray-500" />
                                  <span className="text-xs font-medium">
                                    Advanced
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </section>

                    {/* Custom Components */}
                    <section id="custom-components" className="scroll-mt-24">
                      <Card className="glass border-purple-200 dark:border-purple-800">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Puzzle className="h-6 w-6 text-purple-600" />
                              <CardTitle className="text-2xl">
                                Custom Components
                              </CardTitle>
                            </div>
                            <Badge variant="default">Pro Feature</Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          <p className="text-muted-foreground">
                            Create your own custom components and hooks to
                            extend ZenZiUI's functionality.
                          </p>

                          <div className="space-y-4">
                            <h4 className="font-semibold">
                              Custom Hook Example
                            </h4>
                            <div className="relative">
                              <pre className="bg-muted/50 p-4 rounded-lg text-sm overflow-x-auto border max-h-80 overflow-y-auto">
                                <code>{codeExamples.customHook}</code>
                              </pre>
                              <Button
                                size="sm"
                                variant="outline"
                                className="absolute top-2 right-2"
                                onClick={() =>
                                  copyToClipboard(
                                    codeExamples.customHook,
                                    "custom-hook",
                                  )
                                }
                              >
                                {copied === "custom-hook" ? (
                                  <CheckCircle className="h-4 w-4" />
                                ) : (
                                  <Copy className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </section>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-primary/10 to-secondary/10">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Start Building?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of developers who are already building amazing UIs
              with ZenZiUI.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <a href="/explore">
                  <Rocket className="h-5 w-5 mr-2" />
                  Start Building
                </a>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a href="/gallery">
                  <Eye className="h-5 w-5 mr-2" />
                  View Examples
                </a>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
