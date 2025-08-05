import { ComponentItem, ComponentConfig, ViewportMode } from "@/types";

interface ComponentPreviewProps {
  config: ComponentConfig;
  selectedComponent: string;
  components: ComponentItem[];
  viewportMode: ViewportMode;
}

export function ComponentPreview({
  config,
  selectedComponent,
  viewportMode,
}: ComponentPreviewProps) {
  const generateClassName = () => {
    const spacing = `px-${config.padding[0] / 4} py-${config.padding[1] / 4} mx-${config.margin[0] / 4} my-${config.margin[1] / 4}`;
    const sizing = `${config.width} ${config.height}`;
    const styling = `${config.backgroundColor} ${config.textColor} ${config.fontWeight} ${config.boxShadow}`;
    const borders =
      config.borderWidth > 0 ? `border-${config.borderWidth}` : "";
    const radius = `rounded-${Math.round(config.borderRadius / 4)}`;
    const effects = `opacity-${config.opacity} ${config.animation} ${config.hoverShadow}`;
    const transform = `scale-${config.scale} rotate-${config.rotate}`;

    return `${spacing} ${sizing} ${styling} ${borders} ${radius} ${effects} ${transform} ${config.position} transition-all duration-200`.trim();
  };

  const generateStyle = () => ({
    fontSize: `${config.fontSize}px`,
    borderRadius: `${config.borderRadius}px`,
    borderWidth: `${config.borderWidth}px`,
    opacity: config.opacity / 100,
    transform: `scale(${config.scale / 100}) rotate(${config.rotate}deg)`,
  });

  const getViewportClass = () => {
    switch (viewportMode) {
      case "mobile":
        return "w-[375px] h-[667px]";
      case "tablet":
        return "w-[768px] h-[1024px]";
      default:
        return "w-full h-full";
    }
  };

  const renderPreview = () => {
    const className = generateClassName();
    const style = generateStyle();

    switch (selectedComponent) {
      case "button":
        return (
          <button className={className} style={style}>
            Click me
          </button>
        );
      case "card":
        return (
          <div className={`${className} border`} style={style}>
            <div className="space-y-2">
              <h3 className="font-semibold">Card Title</h3>
              <p className="text-sm opacity-70">Card description goes here</p>
            </div>
          </div>
        );
      case "badge":
        return (
          <span className={className} style={style}>
            Badge
          </span>
        );
      case "input":
        return (
          <input
            type="text"
            placeholder="Enter text..."
            className={`${className} border`}
            style={style}
          />
        );
      case "avatar":
        return (
          <div
            className={`${className} rounded-full flex items-center justify-center`}
            style={style}
          >
            <span className="text-white font-bold">A</span>
          </div>
        );
      case "progress":
        return (
          <div
            className={`${className} bg-gray-200 rounded-full overflow-hidden`}
            style={style}
          >
            <div className="bg-primary h-full w-3/4 transition-all duration-500"></div>
          </div>
        );
      case "toggle":
        return (
          <label className="flex items-center space-x-2">
            <div className={`${className} rounded-full`} style={style}>
              <div className="w-4 h-4 bg-white rounded-full shadow transform transition-transform"></div>
            </div>
            <span>Toggle</span>
          </label>
        );
      case "alert":
        return (
          <div
            className={`${className} border-l-4 border-yellow-500`}
            style={style}
          >
            <div className="flex items-center">
              <div className="flex-1">
                <p className="font-medium">Alert Title</p>
                <p className="text-sm opacity-70">This is an alert message</p>
              </div>
            </div>
          </div>
        );
      case "skeleton":
        return (
          <div className={`${className} animate-pulse`} style={style}>
            <div className="space-y-2">
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            </div>
          </div>
        );
      default:
        return (
          <div
            className={`${className} w-12 h-12 flex items-center justify-center`}
            style={style}
          >
            <span className="text-sm">Preview</span>
          </div>
        );
    }
  };

  return (
    <div
      className={`bg-white dark:bg-slate-950 border-2 border-dashed border-gray-300 dark:border-gray-600 ${getViewportClass()} mx-auto flex items-center justify-center p-8 transition-all duration-300`}
    >
      {renderPreview()}
    </div>
  );
}
