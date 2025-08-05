import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Palette,
  Code,
  Users,
  Download,
  Zap,
  Heart,
  Star,
  Copy,
  Sparkles,
  Play,
  ChevronRight,
  Globe,
  Shield,
  Layers,
  Workflow,
  MousePointer,
  Eye,
  Beaker,
} from "lucide-react";
import Footer from "@/components/Footer";

// import Footer from "@/components/Footer";

export default function Index() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        setMousePosition({
          x: ((e.clientX - rect.left) / rect.width) * 100,
          y: ((e.clientY - rect.top) / rect.height) * 100,
        });
      }
    };

    const heroElement = heroRef.current;
    if (heroElement) {
      heroElement.addEventListener("mousemove", handleMouseMove);
      return () =>
        heroElement.removeEventListener("mousemove", handleMouseMove);
    }
  }, []);

  const featuredComponents = [
    {
      id: 1,
      name: "Gradient Button",
      description:
        "Beautifully crafted buttons with animated gradients and hover effects",
      likes: 1247,
      author: "shadcn",
      category: "Button",
      preview: (
        <div className="space-y-2">
          <Button className="bg-gradient-to-r from-primary via-purple-500 to-secondary text-white hover:scale-105 transition-all duration-300 shadow-glow">
            Primary Action
          </Button>
          <Button
            variant="outline"
            className="hover:bg-primary/10 hover:border-primary transition-all duration-300"
          >
            Secondary
          </Button>
        </div>
      ),
    },
    {
      id: 2,
      name: "Glassmorphism Card",
      description:
        "Modern cards with backdrop blur and subtle transparency effects",
      likes: 892,
      author: "vercel",
      category: "Layout",
      preview: (
        <Card className="glass hover:glass-strong transition-all duration-500 transform hover:scale-105 shadow-glow">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">Live Preview</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Hover to see the glass effect
            </p>
          </CardContent>
        </Card>
      ),
    },
    {
      id: 3,
      name: "Animated Badge",
      description:
        "Status indicators with smooth transitions and micro-interactions",
      likes: 567,
      author: "radix",
      category: "Display",
      preview: (
        <div className="flex gap-2 flex-wrap">
          <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white animate-pulse">
            <div className="w-2 h-2 bg-white rounded-full mr-1 animate-bounce"></div>
            Online
          </Badge>
          <Badge
            variant="secondary"
            className="hover:scale-110 transition-transform duration-200"
          >
            <Sparkles className="w-3 h-3 mr-1" />
            Premium
          </Badge>
          <Badge
            variant="outline"
            className="hover:bg-primary/10 border-primary/20"
          >
            Beta
          </Badge>
        </div>
      ),
    },
  ];

  const features = [
    {
      icon: <MousePointer className="h-6 w-6" />,
      title: "Visual Canvas Editor",
      description:
        "Drag, resize, and customize components with pixel-perfect precision using our intuitive visual editor",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: <Code className="h-6 w-6" />,
      title: "Production Ready Code",
      description:
        "Generate clean, optimized React + Tailwind CSS code that follows industry best practices",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Community Driven",
      description:
        "Join thousands of developers sharing and discovering components in our thriving ecosystem",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Lightning Performance",
      description:
        "Optimized rendering and real-time updates ensure smooth interactions at 60fps",
      gradient: "from-yellow-500 to-orange-500",
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Type Safety",
      description:
        "Full TypeScript support with intelligent autocompletion and error detection",
      gradient: "from-indigo-500 to-purple-500",
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: "Universal Export",
      description:
        "Export to multiple frameworks including React, Vue, Svelte, and plain HTML/CSS",
      gradient: "from-rose-500 to-pink-500",
    },
  ];

  const stats = [
    {
      label: "Components",
      value: "2,500+",
      icon: <Layers className="h-5 w-5" />,
    },
    {
      label: "Developers",
      value: "150K+",
      icon: <Users className="h-5 w-5" />,
    },
    {
      label: "Downloads",
      value: "1M+",
      icon: <Download className="h-5 w-5" />,
    },
    {
      label: "GitHub Stars",
      value: "45K+",
      icon: <Star className="h-5 w-5" />,
    },
  ];

  return (
    <div className="min-h-screen">
  

      <main>
        {/* Hero Section */}
        <section
          ref={heroRef}
          className="relative min-h-screen flex items-center justify-center overflow-hidden gradient-mesh pt-20"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(99, 102, 241, 0.15) 0%, transparent 50%)`,
          }}
        >
          {/* Background Effects */}
          <div className="absolute inset-0 grid-pattern opacity-30"></div>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full blur-3xl animate-float"></div>
          <div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-secondary/20 to-primary/20 rounded-full blur-3xl animate-float"
            style={{ animationDelay: "2s" }}
          ></div>

          <div className="container mx-auto px-4 text-center relative z-10">
            <div className="max-w-6xl mx-auto">
              {/* Beta Badge */}
              <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-8 animate-fade-in">
                <Beaker className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Now in Public Beta</span>
                <Badge variant="secondary" className="text-xs">
                  v1.0
                </Badge>
              </div>

              {/* Main Heading */}
              <h1 className="text-4xl md:text-6xl lg:text-8xl font-bold mb-8 animate-slide-up">
                <span className="block text-gradient">Build Beautiful</span>
                <span className="block">
                  UI Components
                  <span className="text-gradient"> Visually</span>
                </span>
              </h1>

              {/* Subheading */}
              <p
                className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-4xl mx-auto leading-relaxed animate-fade-in"
                style={{ animationDelay: "0.2s" }}
              >
                The most advanced visual component editor for React developers.
                Design, customize, and export production-ready components with
                our
                <span className="text-foreground font-semibold">
                  {" "}
                  Canvas-like interface
                </span>
                .
              </p>

              {/* CTA Buttons */}
              <div
                className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16 animate-fade-in"
                style={{ animationDelay: "0.4s" }}
              >
                <Button
                  size="lg"
                  asChild
                  className="text-lg px-8 py-4 h-14 bg-gradient-to-r from-primary via-purple-500 to-secondary hover:scale-105 transition-all duration-300 shadow-glow group"
                >
                  <Link to="/explore">
                    <Play className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform" />
                    Start Building
                    <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="text-lg px-8 py-4 h-14 glass hover:glass-strong group"
                >
                  <Link to="/gallery">
                    <Eye className="mr-3 h-5 w-5" />
                    Explore Gallery
                    <ChevronRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>

              {/* Stats */}
              <div
                className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20 animate-fade-in"
                style={{ animationDelay: "0.6s" }}
              >
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className="glass p-6 rounded-2xl hover:glass-strong transition-all duration-300 group"
                  >
                    <div className="flex items-center justify-center mb-2 text-primary group-hover:scale-110 transition-transform">
                      {stat.icon}
                    </div>
                    <div className="text-2xl md:text-3xl font-bold text-gradient mb-1">
                      {stat.value}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-32 relative overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="text-center mb-20">
              <Badge variant="outline" className="mb-4">
                <Workflow className="h-3 w-3 mr-1" />
                Features
              </Badge>
              <h2 className="text-4xl md:text-6xl font-bold mb-6 text-gradient">
                Everything you need
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Built for developers, designed for creativity. Our platform
                combines powerful tools with an intuitive interface to
                accelerate your development workflow.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {features.map((feature, index) => (
                <Card
                  key={index}
                  className="glass hover:glass-strong transition-all duration-500 border-0 group hover:scale-105 hover:shadow-glow"
                >
                  <CardContent className="p-8">
                    <div
                      className={`w-14 h-14 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform duration-300 shadow-glow`}
                    >
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-3 group-hover:text-gradient transition-all duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Components Section */}
        <section className="py-32 relative overflow-hidden">
          <div className="absolute inset-0 dot-pattern opacity-30"></div>
          <div className="container mx-auto px-4 relative">
            <div className="text-center mb-20">
              <Badge variant="outline" className="mb-4">
                <Star className="h-3 w-3 mr-1" />
                Showcase
              </Badge>
              <h2 className="text-4xl md:text-6xl font-bold mb-6 text-gradient">
                Community Favorites
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Discover the most loved components created by our community of
                talented developers. Each component is carefully crafted and
                battle-tested in production.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
              {featuredComponents.map((component) => (
                <Card
                  key={component.id}
                  className="glass hover:glass-strong transition-all duration-500 group hover:scale-105 border-0 overflow-hidden"
                >
                  <CardContent className="p-0">
                    {/* Preview Area */}
                    <div className="p-8 pb-6 bg-gradient-to-br from-muted/30 to-muted/10 flex justify-center items-center min-h-[200px] relative overflow-hidden">
                      <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
                      <div className="relative z-10 scale-90 group-hover:scale-100 transition-transform duration-500">
                        {component.preview}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <Badge variant="secondary" className="text-xs">
                          {component.category}
                        </Badge>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Heart className="h-4 w-4" />
                          <span className="text-sm font-medium">
                            {component.likes.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      <h3 className="text-xl font-bold mb-2 group-hover:text-gradient transition-all duration-300">
                        {component.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                        {component.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">
                              {component.author[0].toUpperCase()}
                            </span>
                          </div>
                          <span className="text-sm font-medium">
                            {component.author}
                          </span>
                        </div>

                        <Button
                          size="sm"
                          variant="ghost"
                          className="opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-primary/10"
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Copy
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center">
              <Button
                size="lg"
                variant="outline"
                asChild
                className="glass hover:glass-strong"
              >
                <Link to="/gallery">
                  View All Components
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 relative overflow-hidden">
          <div className="absolute inset-0 gradient-mesh"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center glass p-16 rounded-3xl">
              <h2 className="text-4xl md:text-6xl font-bold mb-6 text-gradient">
                Ready to create something amazing?
              </h2>
              <p className="text-xl text-muted-foreground mb-12 leading-relaxed">
                Join thousands of developers who are already building the next
                generation of user interfaces with ZenZiUI.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <Button
                  size="lg"
                  asChild
                  className="text-lg px-8 py-4 h-14 bg-gradient-to-r from-primary via-purple-500 to-secondary hover:scale-105 transition-all duration-300 shadow-glow group"
                >
                  <Link to="/explore">
                    <Palette className="mr-3 h-5 w-5" />
                    Start Creating
                    <Sparkles className="ml-3 h-5 w-5 group-hover:rotate-12 transition-transform" />
                  </Link>
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="text-lg px-8 py-4 h-14 glass hover:glass-strong group"
                >
                  <Link to="/upload">
                    <Users className="mr-3 h-5 w-5" />
                    Share Your Work
                    <ChevronRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* <Footer /> */}
      <Footer />
    </div>
  );
}
