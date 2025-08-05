import  {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { auth, User } from "../lib/api";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: {
    email: string;
    username: string;
    password: string;
    firstName?: string;
    lastName?: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (userData: {
    firstName?: string;
    lastName?: string;
    bio?: string;
    website?: string;
    github?: string;
    twitter?: string;
  }) => Promise<void>;
  refreshUser: () => Promise<void>;
  setToken: (token: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const response = await auth.getCurrentUser();
          setUser(response.user);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        // Clear invalid token
        localStorage.removeItem("token");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await auth.login({ email, password });
      setUser(response.user);
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: {
    email: string;
    username: string;
    password: string;
    firstName?: string;
    lastName?: string;
  }) => {
    try {
      setIsLoading(true);
      const response = await auth.register(userData);
      setUser(response.user);
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await auth.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
    }
  };

  const updateProfile = async (userData: {
    firstName?: string;
    lastName?: string;
    bio?: string;
    website?: string;
    github?: string;
    twitter?: string;
  }) => {
    try {
      const response = await auth.updateProfile(userData);
      setUser(response.user);
    } catch (error) {
      console.error("Profile update failed:", error);
      throw error;
    }
  };

  const refreshUser = async () => {
    try {
      const response = await auth.getCurrentUser();
      setUser(response.user);
    } catch (error) {
      console.error("Failed to refresh user:", error);
      setUser(null);
    }
  };

  const setToken = async (token: string) => {
    try {
      localStorage.setItem("token", token);
      // Set the token in the API client
      const { apiClient } = await import("@/lib/api");
      apiClient.setToken(token);
      // Refresh user data
      await refreshUser();
    } catch (error) {
      console.error("Failed to set token:", error);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile,
    refreshUser,
    setToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Convenience hook for protected routes
export function useRequireAuth() {
  const auth = useAuth();

  useEffect(() => {
    if (!auth.isLoading && !auth.isAuthenticated) {
      // You could redirect to login page here
      console.warn("Authentication required");
    }
  }, [auth.isLoading, auth.isAuthenticated]);

  return auth;
}
