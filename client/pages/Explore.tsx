import { useState } from "react";
import {

  components,
} from "@/types";
import { DEFAULT_COMPONENT_CONFIG } from "@/constants/components";
import {
  generateComponentCode,
  downloadComponentAsFile,
} from "@/utils/componentGenerator";
import { ExploreHeader } from "@/components/explore/ExploreHeader";
import { ComponentPreview } from "@/components/explore/ComponentPreview";
import { PropertyPanel } from "@/components/explore/PropertyPanel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { Copy, Check } from "lucide-react";
import Header from "@/components/Header";

// Sample components data


export default function Explore() {
  // State management
  const [config, setConfig] = useState<any>(
    DEFAULT_COMPONENT_CONFIG,
  );
  const [selectedComponent, setSelectedComponent] = useState("button");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewportMode, setViewportMode] = useState<any>("desktop");
  const [canvasScale, setCanvasScale] = useState(100);
  const [activePropertyTab, setActivePropertyTab] =
    useState<any>("layout");
  const [isPropertiesPanelOpen, setIsPropertiesPanelOpen] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // Filter components based on search
  // const filteredComponents = components.filter(
  //   (component) =>
  //     component.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //     component.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //     component.tags.some((tag) =>
  //       tag.toLowerCase().includes(searchQuery.toLowerCase()),
  //     ),
  // );

  // Update configuration
  const updateConfig = (key: keyof any, value: any) => {
    setConfig((prev:any) => ({ ...prev, [key]: value }));
  };

  // Generate and copy code
  const handleCopyCode = async () => {
    const componentCode = generateComponentCode(selectedComponent, config);

    try {
      await navigator.clipboard.writeText(componentCode);
      setCopied(true);
      setCopySuccess(true);
      setTimeout(() => {
        setCopied(false);
        setCopySuccess(false);
      }, 2000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = componentCode;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setCopySuccess(true);
      setTimeout(() => {
        setCopied(false);
        setCopySuccess(false);
      }, 2000);
    }
  };

  // Download component
  const handleDownloadComponent = () => {
    const componentCode = generateComponentCode(selectedComponent, config);
    const selectedComp = components.find((c:any) => c.id === selectedComponent);
    const filename = `${selectedComp?.name || selectedComponent}.tsx`;
    downloadComponentAsFile(filename, componentCode);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Header />
      <div
        className={`h-screen ${isFullscreen ? "fixed inset-0 z-50 pt-0" : ""} flex flex-col`}
      >
        {/* Header */}
        <ExploreHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedComponent={selectedComponent}
          onComponentChange={setSelectedComponent}
          viewportMode={viewportMode}
          onViewportChange={setViewportMode}
          canvasScale={canvasScale}
          onScaleChange={setCanvasScale}
          isPropertiesPanelOpen={isPropertiesPanelOpen}
          onTogglePropertiesPanel={() =>
            setIsPropertiesPanelOpen(!isPropertiesPanelOpen)
          }
          isFullscreen={isFullscreen}
          onToggleFullscreen={() => setIsFullscreen(!isFullscreen)}
          onCopyCode={handleCopyCode}
          onDownloadComponent={handleDownloadComponent}
          copied={copied}
          components={components}
        />

        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Canvas Area */}
          <div className="flex-1 flex flex-col">
            <div className="flex-1 p-8 overflow-auto">
              <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Component Playground
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                      Customize and preview{" "}
                      {components.find((c:any) => c.id === selectedComponent)?.name}{" "}
                      component
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm"
                    >
                      {viewportMode.charAt(0).toUpperCase() +
                        viewportMode.slice(1)}{" "}
                      View
                    </Badge>

                    <Badge
                      variant="outline"
                      className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm"
                    >
                      Scale: {canvasScale}%
                    </Badge>
                  </div>
                </div>

                {/* Preview Area */}
                <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-2xl border border-white/20 shadow-2xl p-8">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="font-medium text-sm">Generated Code</span>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCopyCode}
                        className={`h-8 ${copied ? "bg-green-500 text-white" : ""}`}
                      >
                        {copied ? (
                          <Check className="h-3 w-3 mr-1" />
                        ) : (
                          <Copy className="h-3 w-3 mr-1" />
                        )}
                        {copied ? "Copied!" : "Copy"}
                      </Button>
                    </div>
                  </div>

                  <div
                    className="bg-gray-50 dark:bg-slate-900 rounded-xl overflow-hidden"
                    style={{
                      transform: `scale(${canvasScale / 100})`,
                      transformOrigin: "top center",
                    }}
                  >
                    <ComponentPreview
                      config={config}
                      selectedComponent={selectedComponent}
                      components={components}
                      viewportMode={viewportMode}
                    />
                  </div>
                </div>

                {/* Component Info */}
                <div className="mt-6 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-xl border border-white/20 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">
                        {
                          components.find((c:any) => c.id === selectedComponent)
                            ?.name
                        }
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Complexity:{" "}
                        {
                          components.find((c:any) => c.id === selectedComponent)
                            ?.complexity
                        }
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">
                        {
                          components.find((c:any) => c.id === selectedComponent)
                            ?.category
                        }
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Properties Panel */}
          {isPropertiesPanelOpen && (
            <PropertyPanel
              config={config}
              activeTab={activePropertyTab}
              onTabChange={setActivePropertyTab}
              onConfigUpdate={updateConfig}
            />
          )}
        </div>

        {/* Copy Success Notification */}
        {copySuccess && (
          <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom-2 duration-300">
            <div className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
              <Check className="h-4 w-4" />
              Code copied to clipboard!
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
