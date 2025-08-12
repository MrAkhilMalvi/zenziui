import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import { components, auth, uploads } from "@/lib/api";
import { User, Mail, Edit3, Heart, Download, Component } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Profile() {
  const { user, isAuthenticated, setUser } = useAuth();
  const [userComponents, setUserComponents] = useState<any[]>([]);
  const [stats, setStats] = useState({ components: 0, likes: 0, downloads: 0 });
  const [isEditing, setIsEditing] = useState(false);
  const [cacheBuster, setCacheBuster] = useState(Date.now());
  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    bio: "",
    website: "",
    github: "",
    twitter: "",
    avatar: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setEditForm({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        bio: user.bio || "",
        website: user.website || "",
        github: user.github || "",
        twitter: user.twitter || "",
        avatar: user.avatar || "",
      });
      loadUserComponents();
    }
  }, [user]);

  const loadUserComponents = async () => {
    if (!user?.id) return;
    try {
      const response = await components.getByUser(user.id, { limit: 10 });
      setUserComponents(response.components || []);
      const totalLikes =
        response.components?.reduce(
          (acc: number, comp: any) => acc + (comp._count?.likes || 0),
          0
        ) || 0;
      const totalDownloads =
        response.components?.reduce(
          (acc: number, comp: any) => acc + (comp.downloads || 0),
          0
        ) || 0;
      setStats({
        components: response.components?.length || 0,
        likes: totalLikes,
        downloads: totalDownloads,
      });
    } catch (error) {
      console.error("Failed to load user components:", error);
    }
  };

  const handleUpdateProfile = async () => {
    setLoading(true);
    try {
      const response = await auth.updateProfile(editForm);
      setUser(response.user);
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  try {
    const { user: updatedUser } = await uploads.avatar(file); 
    setUser(updatedUser);
    setEditForm((prev) => ({
      ...prev,
      avatar: updatedUser.avatar ?? "",
    }));
    setCacheBuster(Date.now()); // <-- Update only on avatar change
    toast.success("Avatar updated!");
  } catch (error: any) {
    toast.error(error.message || "Failed to upload avatar");
  }
};



  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">
              Please sign in to view your profile.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Profile</h1>
            <p className="text-muted-foreground">
              Manage your account information and preferences
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-7">
            {/* Profile Card */}
            <Card className="lg:col-span-1">
              <CardContent className="p-6 text-center">
                <div className="relative w-24 h-24 mx-auto mb-4 group cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id="avatarInput"
                    onChange={handleAvatarChange}
                  />
                  <label htmlFor="avatarInput">
                    {user?.avatar ? (
                      <img
                        src={`${user.avatar}?t=${cacheBuster}`}
                        alt="Avatar"
                        className="w-24 h-24 rounded-full object-cover border-2 border-primary"
                      />
                    ) : (
                      <div className="w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                        <User className="h-12 w-12 text-white" />
                      </div>
                    )}
                    <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                      <Edit3 className="text-white h-6 w-6" />
                    </div>
                  </label>
                </div>

                <h2 className="text-xl font-semibold mb-1">
                  {user?.firstName} {user?.lastName}
                </h2>
                <p className="text-muted-foreground text-sm mb-4">
                  @{user?.username}
                </p>
                <Badge variant="secondary" className="mb-4">
                  {user?.role || "User"}
                </Badge>

                <Dialog open={isEditing} onOpenChange={setIsEditing}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full">
                      <Edit3 className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Edit Profile</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label htmlFor="editFirstName">First Name</Label>
                          <Input
                            id="editFirstName"
                            value={editForm.firstName}
                            onChange={(e) =>
                              setEditForm((p) => ({
                                ...p,
                                firstName: e.target.value,
                              }))
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor="editLastName">Last Name</Label>
                          <Input
                            id="editLastName"
                            value={editForm.lastName}
                            onChange={(e) =>
                              setEditForm((p) => ({
                                ...p,
                                lastName: e.target.value,
                              }))
                            }
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="editBio">Bio</Label>
                        <Input
                          id="editBio"
                          value={editForm.bio}
                          onChange={(e) =>
                            setEditForm((p) => ({ ...p, bio: e.target.value }))
                          }
                          placeholder="Tell us about yourself..."
                        />
                      </div>
                      <div>
                        <Label htmlFor="editWebsite">Website</Label>
                        <Input
                          id="editWebsite"
                          value={editForm.website}
                          onChange={(e) =>
                            setEditForm((p) => ({
                              ...p,
                              website: e.target.value,
                            }))
                          }
                          placeholder="https://yourwebsite.com"
                        />
                      </div>
                      <div>
                        <Label htmlFor="editGithub">GitHub</Label>
                        <Input
                          id="editGithub"
                          value={editForm.github}
                          onChange={(e) =>
                            setEditForm((p) => ({
                              ...p,
                              github: e.target.value,
                            }))
                          }
                          placeholder="your-github-username"
                        />
                      </div>
                      <div>
                        <Label htmlFor="editTwitter">Twitter</Label>
                        <Input
                          id="editTwitter"
                          value={editForm.twitter}
                          onChange={(e) =>
                            setEditForm((p) => ({
                              ...p,
                              twitter: e.target.value,
                            }))
                          }
                          placeholder="your-twitter-handle"
                        />
                      </div>
                      <div className="flex gap-2 pt-4">
                        <Button
                          onClick={handleUpdateProfile}
                          disabled={loading}
                          className="flex-1"
                        >
                          {loading ? "Saving..." : "Save Changes"}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setIsEditing(false)}
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>

            {/* Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={user?.firstName || ""}
                        readOnly
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={user?.lastName || ""}
                        readOnly
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={user?.username || ""}
                      readOnly
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <Input id="email" value={user?.email || ""} readOnly />
                    </div>
                  </div>
                  {user?.bio && (
                    <div>
                      <Label htmlFor="bio">Bio</Label>
                      <Input id="bio" value={user.bio} readOnly />
                    </div>
                  )}
                  {user?.website && (
                    <div>
                      <Label htmlFor="website">Website</Label>
                      <Input id="website" value={user.website} readOnly />
                    </div>
                  )}
                  {user?.github && (
                    <div>
                      <Label htmlFor="github">GitHub</Label>
                      <Input id="github" value={user.github} readOnly />
                    </div>
                  )}
                  {user?.twitter && (
                    <div>
                      <Label htmlFor="twitter">Twitter</Label>
                      <Input id="twitter" value={user.twitter} readOnly />
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Account Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Account Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-muted/30 rounded-lg">
                      <div className="text-2xl font-bold text-primary">
                        {stats.components}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Components
                      </div>
                    </div>
                    <div className="text-center p-4 bg-muted/30 rounded-lg">
                      <div className="text-2xl font-bold text-primary">
                        {stats.likes}
                      </div>
                      <div className="text-sm text-muted-foreground">Likes</div>
                    </div>
                    <div className="text-center p-4 bg-muted/30 rounded-lg">
                      <div className="text-2xl font-bold text-primary">
                        {stats.downloads}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Downloads
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Components */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Components</CardTitle>
                </CardHeader>
                <CardContent>
                  {userComponents.length > 0 ? (
                    <div className="space-y-3">
                      {userComponents.slice(0, 3).map((component: any) => (
                        <div
                          key={component.id}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div className="flex-1">
                            <h4 className="font-medium">{component.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {component.category}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Heart className="h-4 w-4" />
                            <span>{component._count?.likes || 0}</span>
                            <Download className="h-4 w-4 ml-2" />
                            <span>{component.downloads || 0}</span>
                          </div>
                        </div>
                      ))}
                      {userComponents.length > 3 && (
                        <Button variant="outline" className="w-full mt-4">
                          View All Components
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Component className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No components yet</p>
                      <Button variant="outline" className="mt-4">
                        Create Your First Component
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
