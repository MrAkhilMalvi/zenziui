import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { components } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import {
  Code,
  Eye,
  Check,
  AlertCircle,
  Image,
  FileText,
  Zap,
} from "lucide-react";

const categories = [
  "Buttons",
  "Cards",
  "Navigation",
  "Forms",
  "Layout",
  "Data Display",
  "Feedback",
  "Overlay",
  "Typography",
  "Media",
];

const frameworks = [
  { id: "REACT", name: "React", icon: "⚛️" },
  { id: "VUE", name: "Vue.js", icon: "🟢" },
  { id: "ANGULAR", name: "Angular", icon: "��️" },
  { id: "SVELTE", name: "Svelte", icon: "🧡" },
  { id: "VANILLA", name: "Vanilla JS", icon: "🟨" },
];

const complexityLevels = [
  { value: "SIMPLE", label: "Simple", color: "bg-green-500" },
  { value: "INTERMEDIATE", label: "Intermediate", color: "bg-yellow-500" },
  { value: "ADVANCED", label: "Advanced", color: "bg-orange-500" },
  { value: "EXPERT", label: "Expert", color: "bg-red-500" },
];

export default function Upload() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    framework: "",
    complexity: "",
    tags: "",
    code: "",
    isPublic: true,
    allowComments: true,
  });
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Check if user is authenticated
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Authentication Required</h1>
          <p className="text-muted-foreground mb-8">
            You need to be logged in to upload components.
          </p>
          <div className="flex gap-4 justify-center">
            <Button onClick={() => navigate('/login')}>
              Sign In
            </Button>
            <Button variant="outline" onClick={() => navigate('/signup')}>
              Create Account
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const generatePreviewFromCode = (code: string, name: string) => {
    // Generate a simple preview based on the component name and code
    const canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 200;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      // Set background
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(0, 0, 300, 200);

      // Add border
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1;
      ctx.strokeRect(0, 0, 300, 200);

      // Add component name
      ctx.fillStyle = '#1e293b';
      ctx.font = '16px system-ui';
      ctx.textAlign = 'center';
      ctx.fillText(name || 'Component', 150, 100);

      // Add preview indicator
      ctx.fillStyle = '#6366f1';
      ctx.font = '12px system-ui';
      ctx.fillText('Preview', 150, 120);

      return canvas.toDataURL();
    }
    return null;
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Generate preview if none provided
      let preview = previewImage;
      if (!preview) {
        preview = generatePreviewFromCode(formData.code, formData.name);
      }

      // Prepare component data
      const componentData = {
        name: formData.name,
        description: formData.description,
        code: formData.code,
        preview: preview || undefined,
        category: formData.category,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        complexity: formData.complexity as "SIMPLE" | "INTERMEDIATE" | "ADVANCED" | "EXPERT",
        isPublic: formData.isPublic,
        framework: formData.framework as "REACT" | "VUE" | "ANGULAR" | "SVELTE" | "VANILLA",
        version: "1.0.0",
      };

      // Submit to API
      await components.create(componentData);
      setUploadSuccess(true);
    } catch (err: any) {
      setError(err.message || "Failed to upload component");
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceedToStep2 =
    formData.name && formData.description && formData.category;
  const canProceedToStep3 =
    formData.framework && formData.complexity && formData.code;

  if (uploadSuccess) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-4">
            Component Uploaded Successfully!
          </h1>
          <p className="text-muted-foreground mb-8">
            Your component "{formData.name}" has been uploaded to the gallery.
          </p>
          <div className="flex gap-4 justify-center">
            <Button onClick={() => window.location.reload()}>
              Upload Another
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/gallery")}
            >
              View in Gallery
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-4">
          Share with Community
        </div>
        <h1 className="text-4xl font-bold mb-4">Upload Your Component</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Share your amazing components with the ZenZiUI community and help
          others build better UIs
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="max-w-4xl mx-auto mb-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      )}

      {/* Progress Steps */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="flex items-center justify-center space-x-8">
          {[1, 2, 3].map((stepNumber) => (
            <div key={stepNumber} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                  step >= stepNumber
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {stepNumber}
              </div>
              <span
                className={`ml-2 font-medium transition-colors ${
                  step >= stepNumber
                    ? "text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                {stepNumber === 1
                  ? "Basic Info"
                  : stepNumber === 2
                    ? "Technical Details"
                    : "Preview & Submit"}
              </span>
              {stepNumber < 3 && (
                <div
                  className={`w-16 h-0.5 ml-8 transition-colors ${
                    step > stepNumber ? "bg-primary" : "bg-muted"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Step 1: Basic Information */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Component Name *</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Animated Button"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      handleInputChange("category", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what your component does and how it can be used..."
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  placeholder="e.g., button, animation, hover, interactive"
                  value={formData.tags}
                  onChange={(e) => handleInputChange("tags", e.target.value)}
                />
              </div>

              <div className="space-y-4">
                <Label>Preview Image (Optional)</Label>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
                  <div className="text-center">
                    {previewImage ? (
                      <div className="relative">
                        <img
                          src={previewImage}
                          alt="Preview"
                          className="mx-auto max-h-48 rounded-lg"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2"
                          onClick={() => setPreviewImage(null)}
                        >
                          Remove
                        </Button>
                      </div>
                    ) : (
                      <div>
                        <Image className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <p className="text-muted-foreground mb-2">
                          Upload a preview image of your component
                        </p>
                        <Label
                          htmlFor="image-upload"
                          className="cursor-pointer"
                        >
                          <Button variant="outline" asChild>
                            <span>Choose Image</span>
                          </Button>
                        </Label>
                        <Input
                          id="image-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageUpload}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={() => setStep(2)}
                  disabled={!canProceedToStep2}
                >
                  Continue to Technical Details
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Technical Details */}
        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Technical Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Framework *</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {frameworks.map((framework) => (
                      <div
                        key={framework.id}
                        className={`p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                          formData.framework === framework.id
                            ? "border-primary bg-primary/5"
                            : "border-muted hover:border-muted-foreground/50"
                        }`}
                        onClick={() =>
                          handleInputChange("framework", framework.id)
                        }
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{framework.icon}</span>
                          <span className="font-medium">{framework.name}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Complexity Level *</Label>
                  <div className="space-y-2">
                    {complexityLevels.map((level) => (
                      <div
                        key={level.value}
                        className={`p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                          formData.complexity === level.value
                            ? "border-primary bg-primary/5"
                            : "border-muted hover:border-muted-foreground/50"
                        }`}
                        onClick={() =>
                          handleInputChange("complexity", level.value)
                        }
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-3 h-3 rounded-full ${level.color}`}
                          />
                          <span className="font-medium">{level.label}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="code">Component Code *</Label>
                <Textarea
                  id="code"
                  placeholder="Paste your component code here..."
                  value={formData.code}
                  onChange={(e) => handleInputChange("code", e.target.value)}
                  rows={12}
                  className="font-mono text-sm"
                />
              </div>

              <div className="flex items-center justify-between">
                <Button variant="outline" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button
                  onClick={() => setStep(3)}
                  disabled={!canProceedToStep3}
                >
                  Continue to Preview
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Preview & Submit */}
        {step === 3 && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Preview & Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Component Preview */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Component Preview</h3>
                  <div className="border rounded-lg p-6 bg-muted/5">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="text-xl font-semibold">
                          {formData.name}
                        </h4>
                        <p className="text-muted-foreground">
                          {formData.description}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Badge>{formData.category}</Badge>
                        <Badge variant="outline">{formData.framework}</Badge>
                      </div>
                    </div>

                    {formData.tags && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {formData.tags.split(",").map((tag, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs"
                          >
                            {tag.trim()}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <div className="bg-white dark:bg-slate-950 rounded-lg p-4 border">
                      <div className="text-center text-muted-foreground">
                        <Code className="h-12 w-12 mx-auto mb-2" />
                        <p>
                          Component preview will be generated from your code
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Settings */}
                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Component Settings</h3>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">Public Component</Label>
                      <p className="text-sm text-muted-foreground">
                        Make this component visible to all users
                      </p>
                    </div>
                    <Switch
                      checked={formData.isPublic}
                      onCheckedChange={(checked) =>
                        handleInputChange("isPublic", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base">Allow Comments</Label>
                      <p className="text-sm text-muted-foreground">
                        Let users comment on your component
                      </p>
                    </div>
                    <Switch
                      checked={formData.allowComments}
                      onCheckedChange={(checked) =>
                        handleInputChange("allowComments", checked)
                      }
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6">
                  <Button variant="outline" onClick={() => setStep(2)}>
                    Back
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="min-w-32"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Uploading...
                      </div>
                    ) : (
                      <>
                        <Zap className="h-4 w-4 mr-1" />
                        Upload Component
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
