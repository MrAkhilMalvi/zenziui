import { ComponentConfig, PropertyTab } from "@/types";
import { COLOR_OPTIONS, SHADOW_OPTIONS } from "@/constants/components";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

interface PropertyPanelProps {
  config: ComponentConfig;
  activeTab: PropertyTab;
  onTabChange: (tab: any) => void;
  onConfigUpdate: (key: keyof ComponentConfig, value: any) => void;
}

export function PropertyPanel({
  config,
  activeTab,
  onTabChange,
  onConfigUpdate,
}: PropertyPanelProps) {
  return (
    <div className="w-80 border-l border-border/50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl overflow-hidden flex flex-col">
      <div className="p-4 border-b border-border/50">
        <h3 className="font-semibold text-lg">Properties</h3>
        <p className="text-sm text-muted-foreground">
          Customize your component
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
        <div className="px-4 pt-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="layout" className="text-xs">
              Layout
            </TabsTrigger>
            <TabsTrigger value="style" className="text-xs">
              Style
            </TabsTrigger>
            <TabsTrigger value="effects" className="text-xs">
              Effects
            </TabsTrigger>
            <TabsTrigger value="advanced" className="text-xs">
              Advanced
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="p-4 space-y-6 overflow-y-auto flex-1">
          <TabsContent value="layout" className="space-y-4 mt-0">
            <LayoutTab config={config} onUpdate={onConfigUpdate} />
          </TabsContent>

          <TabsContent value="style" className="space-y-4 mt-0">
            <StyleTab config={config} onUpdate={onConfigUpdate} />
          </TabsContent>

          <TabsContent value="effects" className="space-y-4 mt-0">
            <EffectsTab config={config} onUpdate={onConfigUpdate} />
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4 mt-0">
            <AdvancedTab config={config} onUpdate={onConfigUpdate} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

function LayoutTab({
  config,
  onUpdate,
}: {
  config: ComponentConfig;
  onUpdate: (key: keyof ComponentConfig, value: any) => void;
}) {
  return (
    <>
      <div className="space-y-3">
        <Label className="text-sm font-semibold">Dimensions</Label>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Width</Label>
            <Select
              value={config.width}
              onValueChange={(value) => onUpdate("width", value)}
            >
              <SelectTrigger className="h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="w-auto">Auto</SelectItem>
                <SelectItem value="w-fit">Fit Content</SelectItem>
                <SelectItem value="w-32">Fixed (128px)</SelectItem>
                <SelectItem value="w-48">Fixed (192px)</SelectItem>
                <SelectItem value="w-64">Fixed (256px)</SelectItem>
                <SelectItem value="w-full">Full Width</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Height</Label>
            <Select
              value={config.height}
              onValueChange={(value) => onUpdate("height", value)}
            >
              <SelectTrigger className="h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="h-auto">Auto</SelectItem>
                <SelectItem value="h-fit">Fit Content</SelectItem>
                <SelectItem value="h-32">Fixed (128px)</SelectItem>
                <SelectItem value="h-48">Fixed (192px)</SelectItem>
                <SelectItem value="h-64">Fixed (256px)</SelectItem>
                <SelectItem value="h-full">Full Height</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <Label className="text-sm font-semibold">Spacing</Label>
        <div className="space-y-3">
          <div>
            <Label className="text-xs">
              Padding: {config.padding[0]}px / {config.padding[1]}px
            </Label>
            <div className="grid grid-cols-2 gap-2 mt-1">
              <Slider
                value={[config.padding[0]]}
                onValueChange={(value) =>
                  onUpdate("padding", [value[0], config.padding[1]])
                }
                max={64}
                step={4}
                className="col-span-1"
              />
              <Slider
                value={[config.padding[1]]}
                onValueChange={(value) =>
                  onUpdate("padding", [config.padding[0], value[0]])
                }
                max={64}
                step={4}
                className="col-span-1"
              />
            </div>
          </div>

          <div>
            <Label className="text-xs">
              Margin: {config.margin[0]}px / {config.margin[1]}px
            </Label>
            <div className="grid grid-cols-2 gap-2 mt-1">
              <Slider
                value={[config.margin[0]]}
                onValueChange={(value) =>
                  onUpdate("margin", [value[0], config.margin[1]])
                }
                max={64}
                step={4}
                className="col-span-1"
              />
              <Slider
                value={[config.margin[1]]}
                onValueChange={(value) =>
                  onUpdate("margin", [config.margin[0], value[0]])
                }
                max={64}
                step={4}
                className="col-span-1"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function StyleTab({
  config,
  onUpdate,
}: {
  config: ComponentConfig;
  onUpdate: (key: keyof ComponentConfig, value: any) => void;
}) {
  return (
    <>
      <div className="space-y-3">
        <Label className="text-sm font-semibold">Typography</Label>
        <div className="space-y-3">
          <div>
            <Label className="text-xs">Font Size: {config.fontSize}px</Label>
            <Slider
              value={[config.fontSize]}
              onValueChange={(value) => onUpdate("fontSize", value[0])}
              min={8}
              max={72}
              step={1}
              className="mt-1"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Font Weight</Label>
            <Select
              value={config.fontWeight}
              onValueChange={(value) => onUpdate("fontWeight", value)}
            >
              <SelectTrigger className="h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="font-thin">Thin</SelectItem>
                <SelectItem value="font-light">Light</SelectItem>
                <SelectItem value="font-normal">Normal</SelectItem>
                <SelectItem value="font-medium">Medium</SelectItem>
                <SelectItem value="font-semibold">Semibold</SelectItem>
                <SelectItem value="font-bold">Bold</SelectItem>
                <SelectItem value="font-extrabold">Extra Bold</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <Label className="text-sm font-semibold">Colors</Label>
        <div className="space-y-3">
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Background</Label>
            <div className="grid grid-cols-5 gap-2">
              {COLOR_OPTIONS.map((color) => (
                <Button
                  key={color.value}
                  size="sm"
                  variant="outline"
                  className={`h-8 p-0 ${color.preview} ${config.backgroundColor === color.value ? "ring-2 ring-primary" : ""}`}
                  onClick={() => onUpdate("backgroundColor", color.value)}
                />
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Text Color</Label>
            <Select
              value={config.textColor}
              onValueChange={(value) => onUpdate("textColor", value)}
            >
              <SelectTrigger className="h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text-white">White</SelectItem>
                <SelectItem value="text-black">Black</SelectItem>
                <SelectItem value="text-primary">Primary</SelectItem>
                <SelectItem value="text-secondary">Secondary</SelectItem>
                <SelectItem value="text-muted-foreground">Muted</SelectItem>
                <SelectItem value="text-primary-foreground">
                  Primary Foreground
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </>
  );
}

function EffectsTab({
  config,
  onUpdate,
}: {
  config: ComponentConfig;
  onUpdate: (key: keyof ComponentConfig, value: any) => void;
}) {
  return (
    <>
      <div className="space-y-3">
        <Label className="text-sm font-semibold">Shadow & Effects</Label>
        <div className="space-y-3">
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Shadow</Label>
            <Select
              value={config.boxShadow}
              onValueChange={(value) => onUpdate("boxShadow", value)}
            >
              <SelectTrigger className="h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SHADOW_OPTIONS.map((shadow) => (
                  <SelectItem key={shadow.value} value={shadow.value}>
                    {shadow.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-xs">Opacity: {config.opacity}%</Label>
            <Slider
              value={[config.opacity]}
              onValueChange={(value) => onUpdate("opacity", value[0])}
              min={0}
              max={100}
              step={5}
              className="mt-1"
            />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <Label className="text-sm font-semibold">Hover Effects</Label>
        <div className="space-y-3">
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Animation</Label>
            <Select
              value={config.animation || "none"}
              onValueChange={(value) =>
                onUpdate("animation", value === "none" ? "" : value)
              }
            >
              <SelectTrigger className="h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="hover:scale-105">Scale (105%)</SelectItem>
                <SelectItem value="hover:scale-110">Scale (110%)</SelectItem>
                <SelectItem value="hover:shadow-xl">Shadow Lift</SelectItem>
                <SelectItem value="hover:-translate-y-1">Lift Up</SelectItem>
                <SelectItem value="hover:rotate-1">Tilt</SelectItem>
                <SelectItem value="animate-pulse">Pulse</SelectItem>
                <SelectItem value="animate-bounce">Bounce</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </>
  );
}

function AdvancedTab({
  config,
  onUpdate,
}: {
  config: ComponentConfig;
  onUpdate: (key: keyof ComponentConfig, value: any) => void;
}) {
  return (
    <>
      <div className="space-y-3">
        <Label className="text-sm font-semibold">Transform</Label>
        <div className="space-y-3">
          <div>
            <Label className="text-xs">Scale: {config.scale}%</Label>
            <Slider
              value={[config.scale]}
              onValueChange={(value) => onUpdate("scale", value[0])}
              min={50}
              max={200}
              step={5}
              className="mt-1"
            />
          </div>

          <div>
            <Label className="text-xs">Rotate: {config.rotate}°</Label>
            <Slider
              value={[config.rotate]}
              onValueChange={(value) => onUpdate("rotate", value[0])}
              min={-180}
              max={180}
              step={15}
              className="mt-1"
            />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <Label className="text-sm font-semibold">Position</Label>
        <Select
          value={config.position}
          onValueChange={(value) => onUpdate("position", value)}
        >
          <SelectTrigger className="h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="static">Static</SelectItem>
            <SelectItem value="relative">Relative</SelectItem>
            <SelectItem value="absolute">Absolute</SelectItem>
            <SelectItem value="fixed">Fixed</SelectItem>
            <SelectItem value="sticky">Sticky</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );
}
