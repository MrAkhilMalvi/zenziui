import {
  ComponentCategory,
  Framework,
  ColorOption,
  ShadowOption,
} from "@/types";

export const COMPONENT_CATEGORIES: ComponentCategory[] = [
  {
    id: "buttons",
    name: "Buttons",
    description: "Interactive button components",
    icon: "MousePointer",
  },
  {
    id: "cards",
    name: "Cards",
    description: "Content container components",
    icon: "Square",
  },
  {
    id: "navigation",
    name: "Navigation",
    description: "Navigation and menu components",
    icon: "Menu",
  },
  {
    id: "forms",
    name: "Forms",
    description: "Form input components",
    icon: "FileText",
  },
  {
    id: "feedback",
    name: "Feedback",
    description: "Loading and status components",
    icon: "Bell",
  },
  {
    id: "data-display",
    name: "Data Display",
    description: "Data visualization components",
    icon: "BarChart",
  },
  {
    id: "layout",
    name: "Layout",
    description: "Layout and structure components",
    icon: "Layout",
  },
  {
    id: "overlay",
    name: "Overlay",
    description: "Modal and popup components",
    icon: "Layers",
  },
];

export const FRAMEWORKS: Framework[] = [
  { id: "react", name: "React", icon: "React", color: "text-blue-500" },
  { id: "vue", name: "Vue", icon: "Vue", color: "text-green-500" },
  { id: "angular", name: "Angular", icon: "Angular", color: "text-red-500" },
  { id: "svelte", name: "Svelte", icon: "Svelte", color: "text-orange-500" },
  {
    id: "vanilla",
    name: "Vanilla JS",
    icon: "Javascript",
    color: "text-yellow-500",
  },
];

export const COLOR_OPTIONS: ColorOption[] = [
  { name: "Slate", value: "bg-slate-500", preview: "bg-slate-500" },
  { name: "Red", value: "bg-red-500", preview: "bg-red-500" },
  { name: "Orange", value: "bg-orange-500", preview: "bg-orange-500" },
  { name: "Yellow", value: "bg-yellow-500", preview: "bg-yellow-500" },
  { name: "Green", value: "bg-green-500", preview: "bg-green-500" },
  { name: "Blue", value: "bg-blue-500", preview: "bg-blue-500" },
  { name: "Indigo", value: "bg-indigo-500", preview: "bg-indigo-500" },
  { name: "Purple", value: "bg-purple-500", preview: "bg-purple-500" },
  { name: "Pink", value: "bg-pink-500", preview: "bg-pink-500" },
  { name: "Cyan", value: "bg-cyan-500", preview: "bg-cyan-500" },
];

export const SHADOW_OPTIONS: ShadowOption[] = [
  { name: "None", value: "shadow-none" },
  { name: "Small", value: "shadow-sm" },
  { name: "Medium", value: "shadow-md" },
  { name: "Large", value: "shadow-lg" },
  { name: "Extra Large", value: "shadow-xl" },
  { name: "2XL", value: "shadow-2xl" },
  { name: "Inner", value: "shadow-inner" },
];

export const COMPLEXITY_LEVELS = {
  SIMPLE: { label: "Simple", color: "bg-green-500" },
  INTERMEDIATE: { label: "Intermediate", color: "bg-yellow-500" },
  ADVANCED: { label: "Advanced", color: "bg-orange-500" },
  EXPERT: { label: "Expert", color: "bg-red-500" },
} as const;

export const DEFAULT_COMPONENT_CONFIG = {
  width: "w-fit",
  height: "h-fit",
  padding: [16, 16] as [number, number],
  margin: [0, 0] as [number, number],
  fontSize: 16,
  fontWeight: "font-medium",
  backgroundColor: "bg-primary",
  textColor: "text-primary-foreground",
  borderWidth: 0,
  borderRadius: 8,
  boxShadow: "shadow-sm",
  opacity: 100,
  scale: 100,
  rotate: 0,
  position: "relative",
  animation: "",
  hoverShadow: "",
};
