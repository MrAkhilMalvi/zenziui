import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { components as componentsAPI } from "@/lib/api";
import { Component } from "@/lib/api";
import { toast } from "sonner";
import {
  Search,
  Heart,
  Download,
  Eye,
  Code,
  ExternalLink,
  Layers,
} from "lucide-react";
import Header from "@/components/Header";

const categories = ["All", "Buttons", "Cards", "Navigation", "Forms", "Layout"];
const complexityLevels = [
  "All",
  "SIMPLE",
  "INTERMEDIATE",
  "ADVANCED",
  "EXPERT",
];
// const frameworks = ["All", "REACT", "VUE", "ANGULAR", "SVELTE"];

export default function Gallery() {
  const [components, setComponents] = useState<Component[]>([]);
  const [, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedComplexity, setSelectedComplexity] = useState("All");
  const [selectedFramework, setSelectedFramework] = useState("All");
  const [sortBy, setSortBy] = useState("popular");
  const [likedItems, setLikedItems] = useState<Set<string>>(new Set());

  // Load components from API
  useEffect(() => {
    loadComponents();
  }, [
    searchQuery,
    selectedCategory,
    selectedComplexity,
    selectedFramework,
    sortBy,
    pagination.page,
  ]);

  const loadComponents = async () => {
    setLoading(true);
    try {
      const params: any = {
        page: pagination.page,
        limit: pagination.limit,
        sortBy:
          sortBy === "popular"
            ? "likes"
            : sortBy === "downloads"
              ? "downloads"
              : "updatedAt",
        sortOrder: "desc" as const,
      };

      if (searchQuery) params.search = searchQuery;
      if (selectedCategory !== "All") params.category = selectedCategory;
      if (selectedComplexity !== "All") params.complexity = selectedComplexity;
      if (selectedFramework !== "All") params.framework = selectedFramework;

      const response = await componentsAPI.getAll(params);
      console.log("Loaded components:", response);
      console.log(response);
      setComponents(response.components || []);
      if (response.pagination) {
        setPagination((prev) => ({ ...prev, ...response.pagination }));
      }
    } catch (error: any) {
      console.error("Failed to load components:", error);

      if (
        error.message.includes("Cannot connect to server") ||
        error.message.includes("Network error")
      ) {
        toast.error("Server unavailable: Using demo data", {
          description:
            "The backend server needs to be started to load real components.",
          duration: 5000,
        });
        // Use demo data when server is unavailable
        setComponents([]);
      } else {
        toast.error(
          "Failed to load components: " + (error.message || "Unknown error")
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort items
  const filteredItems = components
    .filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ??
          false) ||
        item.tags.some((tag: string) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        );

      const matchesCategory =
        selectedCategory === "All" || item.category === selectedCategory;

      const matchesComplexity =
        selectedComplexity === "All" || item.complexity === selectedComplexity;

      const matchesFramework =
        selectedFramework === "All" || item.framework === selectedFramework;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesComplexity &&
        matchesFramework
      );
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "popular":
          return b._count.likes - a._count.likes;
        case "downloads":
          return b.downloads - a.downloads;
        case "recent":
          return (
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          );
        default:
          return 0;
      }
    });

  const handleLike = (id: string) => {
    setLikedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Header />
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center mt-14 gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-4">
          <Layers className="h-4 w-4" />
          Community Gallery
        </div>
        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
          Discover Amazing Components
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Explore thousands of beautifully crafted components created by our
          community
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search components..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={selectedComplexity}
            onValueChange={setSelectedComplexity}
          >
            <SelectTrigger>
              <SelectValue placeholder="Complexity" />
            </SelectTrigger>
            <SelectContent>
              {complexityLevels.map((level) => (
                <SelectItem key={level} value={level}>
                  {level}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="downloads">Most Downloaded</SelectItem>
              <SelectItem value="recent">Recently Updated</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-slate-900 rounded-lg border p-4 text-center">
          <div className="text-2xl font-bold text-primary">
            {filteredItems.length}
          </div>
          <div className="text-sm text-muted-foreground">Components</div>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-lg border p-4 text-center">
          <div className="text-2xl font-bold text-green-600">
            {filteredItems.reduce((sum, item) => sum + item.downloads, 0)}
          </div>
          <div className="text-sm text-muted-foreground">Downloads</div>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-lg border p-4 text-center">
          <div className="text-2xl font-bold text-orange-600">
            {filteredItems.reduce((sum, item) => sum + item._count.likes, 0)}
          </div>
          <div className="text-sm text-muted-foreground">Likes</div>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-lg border p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">
            {new Set(filteredItems.map((item) => item.author.username)).size}
          </div>
          <div className="text-sm text-muted-foreground">Contributors</div>
        </div>
      </div>

      {/* Component Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <Card
            key={item.id}
            className="group hover:shadow-lg transition-all duration-300 overflow-hidden"
          >
            <div className="aspect-video bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-primary/20 rounded-xl flex items-center justify-center">
                  <Code className="h-8 w-8 text-primary" />
                </div>
              </div>
              <div className="absolute top-3 right-3 flex gap-2">
                <Badge
                  variant={
                    item.complexity === "SIMPLE"
                      ? "default"
                      : item.complexity === "INTERMEDIATE"
                        ? "secondary"
                        : "destructive"
                  }
                >
                  {item.complexity}
                </Badge>
              </div>
              <div className="absolute bottom-3 left-3">
                <Badge
                  variant="outline"
                  className="bg-white/90 dark:bg-slate-900/90"
                >
                  {item.framework}
                </Badge>
              </div>
            </div>

            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                  {item.name}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleLike(item.id)}
                  className="p-1"
                >
                  <Heart
                    className={`h-4 w-4 ${likedItems.has(item.id) ? "fill-red-500 text-red-500" : ""}`}
                  />
                </Button>
              </div>

              <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                {item.description}
              </p>

              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
                <span className="text-sm font-medium">
                  {item.author.username}
                </span>
                {item.author.isVerified && (
                  <Badge variant="secondary" className="text-xs px-1">
                    ✓
                  </Badge>
                )}
              </div>

              <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Heart className="h-3 w-3" />
                    {item._count.likes}
                  </span>
                  <span className="flex items-center gap-1">
                    <Download className="h-3 w-3" />
                    {item.downloads}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {item.views}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button asChild size="sm" className="flex-1">
                  <Link to={`/explore?component=${item.id}`}>
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Preview
                  </Link>
                </Button>
                <Button variant="outline" size="sm">
                  <Code className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No components found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your search criteria or filters
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("All");
              setSelectedComplexity("All");
              setSelectedFramework("All");
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
}
