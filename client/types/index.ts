// Component Configuration Types
export interface ComponentConfig {
  width: string;
  height: string;
  padding: [number, number];
  margin: [number, number];
  fontSize: number;
  fontWeight: string;
  backgroundColor: string;
  textColor: string;
  borderWidth: number;
  borderRadius: number;
  boxShadow: string;
  opacity: number;
  scale: number;
  rotate: number;
  position: string;
  animation: string;
  hoverShadow: string;
}

// Component Item Types
export interface ComponentItem {
  id: string;
  name: string;
  category: string;
  tags: string[];
  description: string;
  complexity: "SIMPLE" | "INTERMEDIATE" | "ADVANCED" | "EXPERT";
  framework: "REACT" | "VUE" | "ANGULAR" | "SVELTE" | "VANILLA";
  code: string;
  preview?: string;
  isPublic: boolean;
  isFeatured: boolean;
  downloads: number;
  views: number;
  version: string;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    username: string;
    avatar?: string;
    isVerified: boolean;
  };
  _count: {
    likes: number;
    comments: number;
  };
  isLiked?: boolean;
}

// User Types
export interface User {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  bio?: string;
  website?: string;
  github?: string;
  twitter?: string;
  isVerified: boolean;
  role: "USER" | "MODERATOR" | "ADMIN";
  createdAt: string;
  updatedAt?: string;
  _count?: {
    components: number;
    likes: number;
    collections: number;
  };
}

// Collection Types
export interface Collection {
  id: string;
  name: string;
  description?: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    username: string;
    avatar?: string;
    isVerified: boolean;
  };
  _count: {
    components: number;
  };
  components?: {
    id: string;
    component: ComponentItem;
    addedAt: string;
  }[];
}

// Upload Types
export interface Upload {
  id: string;
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
  url: string;
  type: "IMAGE" | "VIDEO" | "DOCUMENT";
  createdAt: string;
}

// Form Types
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  email: string;
  username: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

// Utility Types
export type ViewportMode = "desktop" | "tablet" | "mobile";

export type PropertyTab = "layout" | "style" | "effects" | "advanced";

export type SortBy = "createdAt" | "popularity" | "downloads" | "views";

export type SortOrder = "asc" | "desc";

// Color Options
export interface ColorOption {
  name: string;
  value: string;
  preview: string;
}

// Shadow Options
export interface ShadowOption {
  name: string;
  value: string;
}

// API Response Types
export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Component Library Constants
export interface ComponentCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface Framework {
  id: string;
  name: string;
  icon: string;
  color: string;
}
