// Types for ZenZiUI platform
export enum ComponentCategory {
  BUTTON = "Button",
  LAYOUT = "Layout", 
  DISPLAY = "Display",
  FORM = "Form",
  NAVIGATION = "Navigation"
}

export enum ThemeMode {
  LIGHT = "light",
  DARK = "dark",
  SYSTEM = "system"
}

export enum ComponentStatus {
  BETA = "Beta",
  STABLE = "Stable",
  DEPRECATED = "Deprecated"
}

// Props types (data passed to components)
export interface User {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string;
  isVerified: boolean;
  joinedAt: string;
}

export interface FeaturedComponent {
  id: number;
  name: string;
  description: string;
  likes: number;
  author: string;
  category: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface PlatformStats {
  componentsCount: number;
  templatesCount: number;
  betaUsersCount: number;
  totalDownloads: number;
  activeUsers: number;
}

export interface NavigationItem {
  href: string;
  label: string;
}

export interface PropTypes {
  user: User;
  featuredComponents: FeaturedComponent[];
  platformStats: PlatformStats;
  navigationItems: NavigationItem[];
}

// Store types (global state data)
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface ThemeState {
  mode: 'light' | 'dark' | 'system';
  isDark: boolean;
}

export interface StoreTypes {
  auth: AuthState;
  theme: ThemeState;
}

// Query types (API response data)
export interface ComponentsResponse {
  components: FeaturedComponent[];
  total: number;
  page: number;
  hasMore: boolean;
}

export interface StatsResponse {
  stats: PlatformStats;
  lastUpdated: string;
}

export interface QueryTypes {
  components: ComponentsResponse;
  stats: StatsResponse;
}

export interface ComponentConfig {
  padding: [number, number];
  margin: [number, number];
  width: string;
  height: string;
  backgroundColor: string;
  textColor: string;
  fontWeight: string;
  boxShadow: string;
  borderWidth: number;
  borderRadius: number;
  opacity: number;
  animation: string;
  hoverShadow: string;
  scale: number;
  rotate: number;
  position: string;
  fontSize: number;
}

export const components: any = [
  {
    id: "button",
    name: "Button",
    category: "Interactive",
    tags: ["button", "click", "action"],
    description: "A customizable button component",
    complexity: "SIMPLE",
    framework: "REACT",
    code: "",
    isPublic: true,
    isFeatured: true,
    downloads: 1234,
    views: 5678,
    version: "1.0.0",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
    author: { id: "1", username: "admin", isVerified: true },
    _count: { likes: 45, comments: 12 },
  },
  {
    id: "card",
    name: "Card",
    category: "Layout",
    tags: ["card", "container", "content"],
    description: "A flexible content container",
    complexity: "SIMPLE",
    framework: "REACT",
    code: "",
    isPublic: true,
    isFeatured: true,
    downloads: 987,
    views: 3456,
    version: "1.0.0",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
    author: { id: "1", username: "admin", isVerified: true },
    _count: { likes: 32, comments: 8 },
  },
  {
    id: "badge",
    name: "Badge",
    category: "Display",
    tags: ["badge", "label", "status"],
    description: "A small status indicator",
    complexity: "SIMPLE",
    framework: "REACT",
    code: "",
    isPublic: true,
    isFeatured: false,
    downloads: 567,
    views: 1234,
    version: "1.0.0",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
    author: { id: "1", username: "admin", isVerified: true },
    _count: { likes: 18, comments: 5 },
  },
  {
    id: "input",
    name: "Input",
    category: "Forms",
    tags: ["input", "form", "text"],
    description: "A text input field",
    complexity: "SIMPLE",
    framework: "REACT",
    code: "",
    isPublic: true,
    isFeatured: false,
    downloads: 789,
    views: 2345,
    version: "1.0.0",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
    author: { id: "1", username: "admin", isVerified: true },
    _count: { likes: 25, comments: 7 },
  },
  {
    id: "avatar",
    name: "Avatar",
    category: "Display",
    tags: ["avatar", "profile", "user"],
    description: "A user profile picture placeholder",
    complexity: "SIMPLE",
    framework: "REACT",
    code: "",
    isPublic: true,
    isFeatured: false,
    downloads: 456,
    views: 987,
    version: "1.0.0",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
    author: { id: "1", username: "admin", isVerified: true },
    _count: { likes: 15, comments: 3 },
  },
];