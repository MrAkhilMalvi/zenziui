import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  collections as collectionsAPI,
  components as componentsAPI,
} from "@/lib/api";
import { Collection } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import {
  Plus,
  Search,
  FolderOpen,
  Edit3,
  Trash2,
  Grid,
  List,
  Eye,
  Lock,
  Globe,
  Calendar,
} from "lucide-react";
import Header from "@/components/Header";

export default function Collections() {
  const { isAuthenticated } = useAuth();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(
    null
  );
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    isPublic: true,
  });
  const [newCollection, setNewCollection] = useState({
    name: "",
    description: "",
    isPublic: true,
  });

  useEffect(() => {
    if (isAuthenticated) {
      loadCollections();
      loadAvailableComponents();
    }
  }, [isAuthenticated]);

  const loadCollections = async () => {
    setLoading(true);
    try {
      const response = await collectionsAPI.getAll({ limit: 50 });
      setCollections(response.collections || []);
    } catch (error: any) {
      toast.error(
        "Failed to load collections: " + (error.message || "Unknown error")
      );
    } finally {
      setLoading(false);
    }
  };

  const loadAvailableComponents = async () => {
    try {
      await componentsAPI.getAll({ limit: 100 });
    } catch (error: any) {
      console.error("Failed to load components:", error);
    }
  };

  const handleCreateCollection = async () => {
    if (!newCollection.name.trim()) {
      toast.error("Collection name is required");
      return;
    }

    try {
      const response = await collectionsAPI.create(newCollection);
      setCollections((prev) => [response.collection, ...prev]);
      setNewCollection({ name: "", description: "", isPublic: true });
      setIsCreateDialogOpen(false);
      toast.success("Collection created successfully!");
    } catch (error: any) {
      toast.error(
        "Failed to create collection: " + (error.message || "Unknown error")
      );
    }
  };

  const handleDeleteCollection = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this collection?")) {
      return;
    }

    try {
      await collectionsAPI.delete(id);
      setCollections((prev) => prev.filter((c) => c.id !== id));
      toast.success("Collection deleted successfully!");
    } catch (error: any) {
      toast.error(
        "Failed to delete collection: " + (error.message || "Unknown error")
      );
    }
  };

  const handleEditCollection = (collection: Collection) => {
    setEditingCollection(collection);
    setEditForm({
      name: collection.name,
      description: collection.description || "",
      isPublic: collection.isPublic,
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateCollection = async () => {
    if (!editingCollection || !editForm.name.trim()) {
      toast.error("Collection name is required");
      return;
    }

    try {
      const response = await collectionsAPI.update(
        editingCollection.id,
        editForm
      );
      setCollections((prev) =>
        prev.map((c) =>
          c.id === editingCollection.id ? response.collection : c
        )
      );
      setEditForm({ name: "", description: "", isPublic: true });
      setEditingCollection(null);
      setIsEditDialogOpen(false);
      toast.success("Collection updated successfully!");
    } catch (error: any) {
      toast.error(
        "Failed to update collection: " + (error.message || "Unknown error")
      );
    }
  };

  const filteredCollections = collections.filter(
    (collection) =>
      collection.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      collection.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <FolderOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">
              Sign in to manage collections
            </h3>
            <p className="text-muted-foreground mb-4">
              Create and organize your favorite components into collections
            </p>
            <Button asChild>
              <Link to="/login">Sign In</Link>
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
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                <FolderOpen className="h-8 w-8" />
                My Collections
              </h1>
              <p className="text-muted-foreground">
                Organize your favorite components into collections
              </p>
            </div>

            <Dialog
              open={isCreateDialogOpen}
              onOpenChange={setIsCreateDialogOpen}
            >
              <DialogTrigger asChild>
                <Button className="mt-4 md:mt-0">
                  <Plus className="h-4 w-4 mr-2" />
                  New Collection
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Collection</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="collectionName">Collection Name</Label>
                    <Input
                      id="collectionName"
                      value={newCollection.name}
                      onChange={(e) =>
                        setNewCollection((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      placeholder="My Awesome Collection"
                    />
                  </div>
                  <div>
                    <Label htmlFor="collectionDescription">
                      Description (optional)
                    </Label>
                    <Textarea
                      id="collectionDescription"
                      value={newCollection.description}
                      onChange={(e) =>
                        setNewCollection((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      placeholder="Describe your collection..."
                      rows={3}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Public Collection</Label>
                      <p className="text-sm text-muted-foreground">
                        Make this collection visible to others
                      </p>
                    </div>
                    <Switch
                      checked={newCollection.isPublic}
                      onCheckedChange={(checked) =>
                        setNewCollection((prev) => ({
                          ...prev,
                          isPublic: checked,
                        }))
                      }
                    />
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button onClick={handleCreateCollection} className="flex-1">
                      Create Collection
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setIsCreateDialogOpen(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Edit Collection Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Collection</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="editCollectionName">Collection Name</Label>
                  <Input
                    id="editCollectionName"
                    value={editForm.name}
                    onChange={(e) =>
                      setEditForm((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="My Awesome Collection"
                  />
                </div>
                <div>
                  <Label htmlFor="editCollectionDescription">
                    Description (optional)
                  </Label>
                  <Textarea
                    id="editCollectionDescription"
                    value={editForm.description}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Describe your collection..."
                    rows={3}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Public Collection</Label>
                    <p className="text-sm text-muted-foreground">
                      Make this collection visible to others
                    </p>
                  </div>
                  <Switch
                    checked={editForm.isPublic}
                    onCheckedChange={(checked) =>
                      setEditForm((prev) => ({ ...prev, isPublic: checked }))
                    }
                  />
                </div>
                <div className="flex gap-2 pt-4">
                  <Button onClick={handleUpdateCollection} className="flex-1">
                    Update Collection
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsEditDialogOpen(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Search and View Controls */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search collections..."
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

          {/* Loading State */}
          {loading && (
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
          )}

          {/* Collections Grid/List */}
          {!loading && (
            <>
              {viewMode === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCollections.map((collection) => (
                    <Card
                      key={collection.id}
                      className="group hover:shadow-lg transition-all duration-300"
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg group-hover:text-primary transition-colors">
                              {collection.name}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground mt-1">
                              {collection.description || "No description"}
                            </p>
                          </div>
                          <div className="flex items-center gap-1 ml-2">
                            {collection.isPublic ? (
                              <Globe className="h-4 w-4 text-green-500" />
                            ) : (
                              <Lock className="h-4 w-4 text-muted-foreground" />
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                          <span className="flex items-center gap-1">
                            <Grid className="h-3 w-3" />
                            {collection._count.components} components
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(
                              collection.createdAt
                            ).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="flex gap-2">
                          <Button asChild size="sm" className="flex-1">
                            <Link to={`/collections/${collection.id}`}>
                              <Eye className="h-3 w-3 mr-1" />
                              View
                            </Link>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditCollection(collection)}
                          >
                            <Edit3 className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleDeleteCollection(collection.id)
                            }
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredCollections.map((collection) => (
                    <Card
                      key={collection.id}
                      className="group hover:shadow-md transition-all duration-300"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 flex-1">
                            <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center">
                              <FolderOpen className="h-6 w-6 text-primary" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                                {collection.name}
                              </h3>
                              <p className="text-muted-foreground text-sm">
                                {collection.description || "No description"}
                              </p>
                              <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Grid className="h-3 w-3" />
                                  {collection._count.components} components
                                </span>
                                <span className="flex items-center gap-1">
                                  {collection.isPublic ? (
                                    <>
                                      <Globe className="h-3 w-3 text-green-500" />
                                      Public
                                    </>
                                  ) : (
                                    <>
                                      <Lock className="h-3 w-3" />
                                      Private
                                    </>
                                  )}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {new Date(
                                    collection.createdAt
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Button asChild size="sm">
                              <Link to={`/collections/${collection.id}`}>
                                <Eye className="h-3 w-3 mr-1" />
                                View
                              </Link>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditCollection(collection)}
                            >
                              <Edit3 className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleDeleteCollection(collection.id)
                              }
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Empty State */}
          {!loading && filteredCollections.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <FolderOpen className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                {searchQuery ? "No collections found" : "No collections yet"}
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery
                  ? "Try adjusting your search terms"
                  : "Create your first collection to organize your favorite components"}
              </p>
              {!searchQuery && (
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Collection
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
