import { ViewportMode } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Search,
  Monitor,
  Smartphone,
  Tablet,
  Maximize2,
  Minimize2,
  Settings,
  Copy,
  Download,
  Check,
} from "lucide-react";

interface ExploreHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedComponent: string;
  onComponentChange: (component: string) => void;
  viewportMode: ViewportMode;
  onViewportChange: (mode: ViewportMode) => void;
  canvasScale: number;
  onScaleChange: (scale: number) => void;
  isPropertiesPanelOpen: boolean;
  onTogglePropertiesPanel: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onCopyCode: () => void;
  onDownloadComponent: () => void;
  copied: boolean;
  components: Array<{ id: string; name: string; category: string }>;
}

export function ExploreHeader({
  searchQuery,
  onSearchChange,
  selectedComponent,
  onComponentChange,
  viewportMode,
  onViewportChange,
  canvasScale,
  onScaleChange,
  onTogglePropertiesPanel,
  isFullscreen,
  onToggleFullscreen,
  onCopyCode,
  onDownloadComponent,
  copied,
  components,
}: ExploreHeaderProps) {
  const getViewportIcon = (mode: ViewportMode) => {
    switch (mode) {
      case "mobile":
        return <Smartphone className="h-4 w-4" />;
      case "tablet":
        return <Tablet className="h-4 w-4" />;
      default:
        return <Monitor className="h-4 w-4" />;
    }
  };

  return (
    <div className="border-b border-border/50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl">
      <div className="flex items-center justify-between p-4 gap-4">
        {/* Left Section - Search and Component Selector */}
        <div className="flex items-center gap-4 flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search components..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-64 pl-10 h-9"
            />
          </div>

          <Select value={selectedComponent} onValueChange={onComponentChange}>
            <SelectTrigger className="w-48 h-9">
              <SelectValue placeholder="Select component" />
            </SelectTrigger>
            <SelectContent>
              {components.map((comp) => (
                <SelectItem key={comp.id} value={comp.id}>
                  <div className="flex items-center gap-2">
                    <span>{comp.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {comp.category}
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Center Section - Viewport Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-muted/50 rounded-lg p-1">
            {(["desktop", "tablet", "mobile"] as ViewportMode[]).map((mode) => (
              <Button
                key={mode}
                variant={viewportMode === mode ? "default" : "ghost"}
                size="sm"
                onClick={() => onViewportChange(mode)}
                className="h-8 w-8 p-0"
              >
                {getViewportIcon(mode)}
              </Button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onScaleChange(Math.max(25, canvasScale - 25))}
              className="h-8 w-8 p-0"
            >
              -
            </Button>
            <span className="text-sm w-12 text-center">{canvasScale}%</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onScaleChange(Math.min(200, canvasScale + 25))}
              className="h-8 w-8 p-0"
            >
              +
            </Button>
          </div>
        </div>

        {/* Right Section - Action Buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onCopyCode}
            className={`h-9 ${copied ? "bg-green-500 text-white" : ""}`}
          >
            {copied ? (
              <Check className="h-4 w-4 mr-1" />
            ) : (
              <Copy className="h-4 w-4 mr-1" />
            )}
            Copy
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onDownloadComponent}
            className="h-9"
          >
            <Download className="h-4 w-4 mr-1" />
            Export
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onTogglePropertiesPanel}
            className="h-9"
          >
            <Settings className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onToggleFullscreen}
            className="h-9"
          >
            {isFullscreen ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
