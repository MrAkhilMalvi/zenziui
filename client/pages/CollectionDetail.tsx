import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  collections as collectionsAPI,
  components as componentsAPI,
} from "@/lib/api";
import { Collection, Component } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import {
  ArrowLeft,
  Search,
  Plus,
  Grid,
  List,
  Heart,
  Download,
  Eye,
  Code,
  Calendar,
  Globe,
  Lock,
  Trash2,
} from "lucide-react";
import Header from "@/components/Header";

export default function CollectionDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [collection, setCollection] = useState<Collection | null>(null);
  const [components, setComponents] = useState<Component[]>([]);
  const [availableComponents, setAvailableComponents] = useState<Component[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedComponentId, setSelectedComponentId] = useState("");

  useEffect(() => {
    if (id && isAuthenticated) {
      loadCollection();
      loadAvailableComponents();
    }
  }, [id, isAuthenticated]);

  const loadCollection = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const response = await collectionsAPI.getById(id);
      setCollection(response.collection);
      // Map the ComponentCollection objects to actual Component objects
      const componentsData =
        response.collection.components?.map((cc: any) => cc.component) || [];
      setComponents(componentsData);
    } catch (error: any) {
      toast.error(
        "Failed to load collection: " + (error.message || "Unknown error")
      );
      navigate("/collections");
    } finally {
      setLoading(false);
    }
  };

  const loadAvailableComponents = async () => {
    try {
      const response = await componentsAPI.getAll({ limit: 100 });
      setAvailableComponents(response.components || []);
    } catch (error: any) {
      console.error("Failed to load components:", error);
    }
  };

  const addComponentToCollection = async () => {
    if (!id || !selectedComponentId) return;

    try {
      await collectionsAPI.addComponent(id, selectedComponentId);
      toast.success("Component added to collection!");
      setIsAddDialogOpen(false);
      setSelectedComponentId("");
      loadCollection(); // Refresh the collection
    } catch (error: any) {
      toast.error(
        "Failed to add component: " + (error.message || "Unknown error")
      );
    }
  };

  const removeComponentFromCollection = async (componentId: string) => {
    if (!id) return;

    if (
      !window.confirm(
        "Are you sure you want to remove this component from the collection?"
      )
    ) {
      return;
    }

    try {
      await collectionsAPI.removeComponent(id, componentId);
      toast.success("Component removed from collection!");
      loadCollection(); // Refresh the collection
    } catch (error: any) {
      toast.error(
        "Failed to remove component: " + (error.message || "Unknown error")
      );
    }
  };

  const filteredComponents = components.filter(
    (component) =>
      component.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      component.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const availableComponentsFiltered = availableComponents.filter(
    (component) =>
      !components.some(
        (existingComponent) => existingComponent.id === component.id
      )
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">
              Please sign in to view collections.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 pt-20">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-7xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-muted rounded mb-4 w-1/3"></div>
              <div className="h-4 bg-muted rounded mb-8 w-1/2"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader>
                      <div className="h-4 bg-muted rounded"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="h-3 bg-muted rounded mb-2"></div>
                      <div className="h-3 bg-muted rounded"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">Collection not found.</p>
            <Button asChild className="mt-4">
              <Link to="/collections">Back to Collections</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 pt-20">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Button variant="outline" size="sm" asChild>
              <Link to="/collections">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Collections
              </Link>
            </Button>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">{collection.name}</h1>
                <div className="flex items-center gap-2">
                  {collection.isPublic ? (
                    <Badge variant="secondary" className="text-green-600">
                      <Globe className="h-3 w-3 mr-1" />
                      Public
                    </Badge>
                  ) : (
                    <Badge variant="secondary">
                      <Lock className="h-3 w-3 mr-1" />
                      Private
                    </Badge>
                  )}
                </div>
              </div>
              <p className="text-muted-foreground mb-2">
                {collection.description || "No description"}
              </p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Grid className="h-3 w-3" />
                  {components.length} components
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Created {new Date(collection.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Only show add button if user owns the collection */}
            {user?.id === collection.author.id && (
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="mt-4 md:mt-0">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Component
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Component to Collection</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Select
                      value={selectedComponentId}
                      onValueChange={setSelectedComponentId}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a component to add" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableComponentsFiltered.map((component) => (
                          <SelectItem key={component.id} value={component.id}>
                            {component.name} - {component.category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="flex gap-2 pt-4">
                      <Button
                        onClick={addComponentToCollection}
                        disabled={!selectedComponentId}
                        className="flex-1"
                      >
                        Add Component
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setIsAddDialogOpen(false)}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>

          {/* Search and View Controls */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search components..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Components Grid/List */}
          {filteredComponents.length > 0 ? (
            <>
              {viewMode === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredComponents.map((component) => (
                    <Card
                      key={component.id}
                      className="group hover:shadow-lg transition-all duration-300"
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg group-hover:text-primary transition-colors">
                              {component.name}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground mt-1">
                              {component.description || "No description"}
                            </p>
                          </div>
                          <Badge variant="outline" className="ml-2">
                            {component.category}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                          <span className="flex items-center gap-1">
                            <Heart className="h-3 w-3" />
                            {component._count?.likes || 0}
                          </span>
                          <span className="flex items-center gap-1">
                            <Download className="h-3 w-3" />
                            {component.downloads || 0}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(component.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="flex gap-2">
                          <Button asChild size="sm" className="flex-1">
                            <Link to={`/gallery?component=${component.id}`}>
                              <Eye className="h-3 w-3 mr-1" />
                              View
                            </Link>
                          </Button>
                          <Button asChild variant="outline" size="sm">
                            <Link to={`/gallery?component=${component.id}`}>
                              <Code className="h-3 w-3" />
                            </Link>
                          </Button>
                          {user?.id === collection.author.id && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                removeComponentFromCollection(component.id)
                              }
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredComponents.map((component) => (
                    <Card
                      key={component.id}
                      className="group hover:shadow-md transition-all duration-300"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 flex-1">
                            <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center">
                              <Code className="h-6 w-6 text-primary" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                                {component.name}
                              </h3>
                              <p className="text-muted-foreground text-sm">
                                {component.description || "No description"}
                              </p>
                              <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                                <Badge variant="outline" className="text-xs">
                                  {component.category}
                                </Badge>
                                <span className="flex items-center gap-1">
                                  <Heart className="h-3 w-3" />
                                  {component._count?.likes || 0}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Download className="h-3 w-3" />
                                  {component.downloads || 0}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {new Date(
                                    component.createdAt
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Button asChild size="sm">
                              <Link to={`/gallery?component=${component.id}`}>
                                <Eye className="h-3 w-3 mr-1" />
                                View
                              </Link>
                            </Button>
                            <Button asChild variant="outline" size="sm">
                              <Link to={`/gallery?component=${component.id}`}>
                                <Code className="h-3 w-3" />
                              </Link>
                            </Button>
                            {user?.id === collection.author.id && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  removeComponentFromCollection(component.id)
                                }
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </>
          ) : (
            /* Empty State */
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Grid className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                {searchQuery
                  ? "No components found"
                  : "No components in this collection"}
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery
                  ? "Try adjusting your search terms"
                  : "Add components to this collection to get started"}
              </p>
              {!searchQuery && user?.id === collection.author.id && (
                <Button onClick={() => setIsAddDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Component
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
