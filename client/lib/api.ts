// API Configuration
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3001/api";

// Types
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

export interface Component {
  id: string;
  name: string;
  description?: string;
  code: string;
  preview?: string;
  category: string;
  tags: string[];
  complexity: "SIMPLE" | "INTERMEDIATE" | "ADVANCED" | "EXPERT";
  isPublic: boolean;
  isFeatured: boolean;
  downloads: number;
  views: number;
  framework: "REACT" | "VUE" | "ANGULAR" | "SVELTE" | "VANILLA";
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
  comments?: Comment[];
}

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
    component: Component;
    addedAt: string;
  }[];
}

export interface Upload {
  id: string;
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
  url: string;
  type: "IMAGE" | "DOCUMENT";
  createdAt: string;
}

export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    username: string;
    avatar?: string;
  };
}

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

// API Client Class
class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
    this.token = localStorage.getItem("token");
  }

 private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${this.baseURL}${endpoint}`;
  
  const isFormData = options.body instanceof FormData;

  const headers: HeadersInit = {
    ...(this.token && { Authorization: `Bearer ${this.token}` }),
    ...(isFormData ? {} : { "Content-Type": "application/json" }), // only set for JSON
    ...options.headers,
  };

  const config: RequestInit = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || data.error || "API request failed");
    }
    return data;
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
}


  // Auth methods
  setToken(token: string) {
    this.token = token;
    localStorage.setItem("token", token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem("token");
  }

  async register(userData: {
    email: string;
    username: string;
    password: string;
    firstName?: string;
    lastName?: string;
  }) {
    const response = await this.request<{
      user: User;
      token: string;
      message: string;
    }>("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });

    if (response.token) {
      this.setToken(response.token);
    }

    return response;
  }

  async login(credentials: { email: string; password: string }) {
    const response = await this.request<{
      user: User;
      token: string;
      message: string;
    }>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
    console.log(response);

    if (response.token) {
      this.setToken(response.token);
    }

    return response;
  }

  async logout() {
    try {
      await this.request("/auth/logout", { method: "POST" });
    } finally {
      this.clearToken();
    }
  }

  async getCurrentUser() {
    return this.request<{ user: User }>("/auth/me");
  }

  async updateProfile(userData: {
    firstName?: string;
    lastName?: string;
    bio?: string;
    website?: string;
    github?: string;
    twitter?: string;
    avatar?:string;
  }) {
    return this.request<{ user: User; message: string }>("/auth/profile", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  async uploadAvatar(file: File) {
  const formData = new FormData();
  formData.append("avatar", file);

  return this.request<{ avatarUrl: string; message: string; user: User;  }>(
    "/uploads/avatar",
    {
      method: "POST",
      body: formData,
    }
  );
}


  // Component methods
  async getComponents(
    params: {
      page?: number;
      limit?: number;
      category?: string;
      tags?: string[];
      complexity?: string;
      framework?: string;
      search?: string;
      sortBy?: string;
      sortOrder?: "asc" | "desc";
    } = {},
  ) {
    const queryParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          value.forEach((v) => queryParams.append(key, v));
        } else {
          queryParams.append(key, value.toString());
        }
      }
    });

    return this.request<{ components: Component[]; pagination: any }>(
      `/components?${queryParams}`,
    );
  }

  async getComponent(id: string) {
    return this.request<{ component: Component }>(`/components/${id}`);
  }

  async createComponent(componentData: {
    name: string;
    description?: string;
    code: string;
    preview?: string;
    category: string;
    tags?: string[];
    complexity?: "SIMPLE" | "INTERMEDIATE" | "ADVANCED" | "EXPERT";
    isPublic?: boolean;
    framework?: "REACT" | "VUE" | "ANGULAR" | "SVELTE" | "VANILLA";
    version?: string;
  }) {
    return this.request<{ component: Component; message: string }>(
      "/components",
      {
        method: "POST",
        body: JSON.stringify(componentData),
      },
    );
  }

  async updateComponent(id: string, componentData: Partial<Component>) {
    return this.request<{ component: Component; message: string }>(
      `/components/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(componentData),
      },
    );
  }

  async deleteComponent(id: string) {
    return this.request<{ message: string }>(`/components/${id}`, {
      method: "DELETE",
    });
  }

  async likeComponent(id: string) {
    return this.request<{ message: string; isLiked: boolean }>(
      `/components/${id}/like`,
      {
        method: "POST",
      },
    );
  }

  async getUserComponents(
    userId: string,
    params: { page?: number; limit?: number; includePrivate?: boolean } = {},
  ) {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });

    return this.request<{ components: Component[]; pagination: any }>(
      `/components/user/${userId}?${queryParams}`,
    );
  }

  // Collection methods
  async getCollections(
    params: { page?: number; limit?: number; search?: string } = {},
  ) {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });

    return this.request<{ collections: Collection[]; pagination: any }>(
      `/collections?${queryParams}`,
    );
  }

  async getCollection(id: string) {
    return this.request<{ collection: Collection }>(`/collections/${id}`);
  }

  async createCollection(collectionData: {
    name: string;
    description?: string;
    isPublic?: boolean;
  }) {
    return this.request<{ collection: Collection; message: string }>(
      "/collections",
      {
        method: "POST",
        body: JSON.stringify(collectionData),
      },
    );
  }

  async updateCollection(id: string, collectionData: Partial<Collection>) {
    return this.request<{ collection: Collection; message: string }>(
      `/collections/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(collectionData),
      },
    );
  }

async deleteCollection(id: string) {
  const token = localStorage.getItem("token"); // or wherever you store it
  return this.request<{ message: string }>(`/collections/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
}


  async addComponentToCollection(collectionId: string, componentId: string) {
    return this.request<{ message: string }>(
      `/collections/${collectionId}/components`,
      {
        method: "POST",
        body: JSON.stringify({ componentId }),
      },
    );
  }

  async removeComponentFromCollection(
    collectionId: string,
    componentId: string,
  ) {
    return this.request<{ message: string }>(
      `/collections/${collectionId}/components/${componentId}`,
      {
        method: "DELETE",
      },
    );
  }

  // Upload methods
  async uploadFile(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    return this.request<{ upload: Upload; message: string }>("/uploads", {
      method: "POST",
      headers: {
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
      },
      body: formData,
    });
  }

  async uploadFiles(files: File[]) {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    return this.request<{ uploads: Upload[]; message: string }>(
      "/uploads/multiple",
      {
        method: "POST",
        headers: {
          ...(this.token && { Authorization: `Bearer ${this.token}` }),
        },
        body: formData,
      },
    );
  }

  async getUploads(
    params: { page?: number; limit?: number; type?: "IMAGE" | "DOCUMENT" } = {},
  ) {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });

    return this.request<{ uploads: Upload[]; pagination: any }>(
      `/uploads?${queryParams}`,
    );
  }

  async deleteUpload(id: string) {
    return this.request<{ message: string }>(`/uploads/${id}`, {
      method: "DELETE",
    });
  }

  // User methods
  async getUser(username: string) {
    return this.request<{ user: User }>(`/users/${username}`);
  }

  async searchUsers(
    params: { q?: string; page?: number; limit?: number } = {},
  ) {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });

    return this.request<{ users: User[]; pagination: any }>(
      `/users?${queryParams}`,
    );
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Export individual methods for convenience
export const auth = {
  register: apiClient.register.bind(apiClient),
  login: apiClient.login.bind(apiClient),
  logout: apiClient.logout.bind(apiClient),
  getCurrentUser: apiClient.getCurrentUser.bind(apiClient),
  updateProfile: apiClient.updateProfile.bind(apiClient),
};

export const components = {
  getAll: apiClient.getComponents.bind(apiClient),
  getById: apiClient.getComponent.bind(apiClient),
  create: apiClient.createComponent.bind(apiClient),
  update: apiClient.updateComponent.bind(apiClient),
  delete: apiClient.deleteComponent.bind(apiClient),
  like: apiClient.likeComponent.bind(apiClient),
  getByUser: apiClient.getUserComponents.bind(apiClient),
};

export const collections = {
  getAll: apiClient.getCollections.bind(apiClient),
  getById: apiClient.getCollection.bind(apiClient),
  create: apiClient.createCollection.bind(apiClient),
  update: apiClient.updateCollection.bind(apiClient),
  delete: apiClient.deleteCollection.bind(apiClient),
  addComponent: apiClient.addComponentToCollection.bind(apiClient),
  removeComponent: apiClient.removeComponentFromCollection.bind(apiClient),
};

export const uploads = {
  single: apiClient.uploadFile.bind(apiClient),
  multiple: apiClient.uploadFiles.bind(apiClient),
  avatar: apiClient.uploadAvatar.bind(apiClient), 
  getAll: apiClient.getUploads.bind(apiClient),
  delete: apiClient.deleteUpload.bind(apiClient),
};

export const users = {
  getByUsername: apiClient.getUser.bind(apiClient),
  search: apiClient.searchUsers.bind(apiClient),
};
