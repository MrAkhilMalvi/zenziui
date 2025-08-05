import { ComponentConfig } from "@/types";

export function generateComponentCode(
  selectedComponent: string,
  config: ComponentConfig,
): string {
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

  const className = generateClassName();
  const style = generateStyle();

  switch (selectedComponent) {
    case "button":
      return `import { Button } from "@/components/ui/button"

export function CustomButton() {
  return (
    <Button 
      className="${className}"
      style={{
        fontSize: "${style.fontSize}",
        borderRadius: "${style.borderRadius}",
        borderWidth: "${style.borderWidth}",
        opacity: ${style.opacity},
        transform: "${style.transform}"
      }}
    >
      Click me
    </Button>
  )
}`;

    case "card":
      return `import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function CustomCard() {
  return (
    <Card 
      className="${className}"
      style={{
        fontSize: "${style.fontSize}",
        borderRadius: "${style.borderRadius}",
        borderWidth: "${style.borderWidth}",
        opacity: ${style.opacity},
        transform: "${style.transform}"
      }}
    >
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Card description goes here</p>
      </CardContent>
    </Card>
  )
}`;

    case "badge":
      return `import { Badge } from "@/components/ui/badge"

export function CustomBadge() {
  return (
    <Badge 
      className="${className}"
      style={{
        fontSize: "${style.fontSize}",
        borderRadius: "${style.borderRadius}",
        borderWidth: "${style.borderWidth}",
        opacity: ${style.opacity},
        transform: "${style.transform}"
      }}
    >
      Badge
    </Badge>
  )
}`;

    case "input":
      return `import { Input } from "@/components/ui/input"

export function CustomInput() {
  return (
    <Input 
      type="text"
      placeholder="Enter text..."
      className="${className}"
      style={{
        fontSize: "${style.fontSize}",
        borderRadius: "${style.borderRadius}",
        borderWidth: "${style.borderWidth}",
        opacity: ${style.opacity},
        transform: "${style.transform}"
      }}
    />
  )
}`;

    case "avatar":
      return `import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function CustomAvatar() {
  return (
    <Avatar 
      className="${className}"
      style={{
        fontSize: "${style.fontSize}",
        borderRadius: "${style.borderRadius}",
        borderWidth: "${style.borderWidth}",
        opacity: ${style.opacity},
        transform: "${style.transform}"
      }}
    >
      <AvatarFallback>A</AvatarFallback>
    </Avatar>
  )
}`;

    case "progress":
      return `import { Progress } from "@/components/ui/progress"

export function CustomProgress() {
  return (
    <Progress 
      value={75}
      className="${className}"
      style={{
        fontSize: "${style.fontSize}",
        borderRadius: "${style.borderRadius}",
        borderWidth: "${style.borderWidth}",
        opacity: ${style.opacity},
        transform: "${style.transform}"
      }}
    />
  )
}`;

    case "alert":
      return `import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function CustomAlert() {
  return (
    <Alert 
      className="${className}"
      style={{
        fontSize: "${style.fontSize}",
        borderRadius: "${style.borderRadius}",
        borderWidth: "${style.borderWidth}",
        opacity: ${style.opacity},
        transform: "${style.transform}"
      }}
    >
      <AlertTitle>Alert Title</AlertTitle>
      <AlertDescription>
        This is an alert message
      </AlertDescription>
    </Alert>
  )
}`;

    case "skeleton":
      return `import { Skeleton } from "@/components/ui/skeleton"

export function CustomSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton 
        className="${className} h-4 w-3/4"
        style={{
          fontSize: "${style.fontSize}",
          borderRadius: "${style.borderRadius}",
          borderWidth: "${style.borderWidth}",
          opacity: ${style.opacity},
          transform: "${style.transform}"
        }}
      />
      <Skeleton 
        className="${className} h-4 w-1/2"
        style={{
          fontSize: "${style.fontSize}",
          borderRadius: "${style.borderRadius}",
          borderWidth: "${style.borderWidth}",
          opacity: ${style.opacity},
          transform: "${style.transform}"
        }}
      />
    </div>
  )
}`;

    default:
      return `export function CustomComponent() {
  return (
    <div 
      className="${className}"
      style={{
        fontSize: "${style.fontSize}",
        borderRadius: "${style.borderRadius}",
        borderWidth: "${style.borderWidth}",
        opacity: ${style.opacity},
        transform: "${style.transform}"
      }}
    >
      Custom Component
    </div>
  )
}`;
  }
}

export function downloadComponentAsFile(filename: string, code: string) {
  const blob = new Blob([code], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
