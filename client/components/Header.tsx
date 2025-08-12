import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import {
  Github,
  Moon,
  Sun,
  Menu,
  X,
  User,
  LogOut,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import Logo from "./Logo";

function Header() {
  const [isDark, setIsDark] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();


 
  useEffect(() => {
    const theme =
      localStorage.getItem("theme") ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light");
    const isDarkMode = theme === "dark";
    setIsDark(isDarkMode);
    document.documentElement.classList.toggle("dark", isDarkMode);
    localStorage.setItem("theme", theme);
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark ? "dark" : "light";
    setIsDark(!isDark);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    document.documentElement.style.setProperty(
      "--theme-updated",
      Date.now().toString()
    );
  };

  const handleLogout = async () => {
    try {
      await logout();       // Calls backend + clears auth state
      navigate("/login");   // Redirect after logout
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const navItems = [
    { href: "/explore", label: "Explore" },
    { href: "/gallery", label: "Gallery" },
    { href: "/upload", label: "Upload" },
    { href: "/docs", label: "Docs" },
  ];

  const isExplorePage = location.pathname === "/explore";

  return (
    <header
      className={`${isExplorePage ? "relative" : "fixed top-0 left-0 right-0"} z-50 transition-all duration-300 ${
        isScrolled && !isExplorePage
          ? "glass border-b border-white/10 py-2"
          : isExplorePage
          ? "border-b border-border bg-background py-3"
          : "bg-transparent py-4"
      }`}
    >
       <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Logo size="md" showBeta={true} animated={true} />

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`px-4 py-2 rounded-lg transition-all duration-200 relative overflow-hidden group ${
                    location.pathname === item.href
                      ? "text-primary bg-primary/10"
                      : "text-foreground/70 hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  <span className="relative z-10">{item.label}</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300"></div>
                </Link>
              ))}
            </nav>

            {/* Right side actions */}
            <div className="flex items-center space-x-2">
              {/* Theme toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="relative w-10 h-10 rounded-full hover:bg-muted/50 transition-all duration-200"
              >
                <div className="relative w-5 h-5">
                  <Sun
                    className={`absolute h-5 w-5 transition-all duration-300 ${
                      isDark ? "rotate-90 scale-0" : "rotate-0 scale-100"
                    }`}
                  />
                  <Moon
                    className={`absolute h-5 w-5 transition-all duration-300 ${
                      isDark ? "rotate-0 scale-100" : "-rotate-90 scale-0"
                    }`}
                  />
                </div>
              </Button>

              {/* GitHub */}
              <Button
                variant="ghost"
                size="icon"
                asChild
                className="rounded-full hover:bg-muted/50"
              >
                <a
                  href="https://github.com/MrAkhilMalvi/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="h-5 w-5" />
                </a>
              </Button>

              {/* Auth Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full hover:bg-muted/50"
                  >
                    <User className="h-5 w-5" />
                  </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 glass">
                {isAuthenticated ? (
                  <>
                    <div className="px-2 py-1.5 text-sm text-muted-foreground">
                      Signed in as {user?.firstName || user?.username}
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="w-full">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/settings" className="w-full">Settings</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/upload" className="w-full">
                        Upload Component
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/collections" className="w-full">
                        My Collections
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem asChild>
                      <Link to="/login" className="w-full">Sign In</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/signup" className="w-full">Create Account</Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden rounded-full"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`lg:hidden transition-all duration-300 overflow-hidden ${
          isMobileMenuOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="glass-strong m-4 rounded-2xl p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block px-4 py-3 rounded-xl transition-all duration-200 ${
                location.pathname === item.href
                  ? "text-primary bg-primary/10"
                  : "text-foreground/70 hover:text-foreground hover:bg-muted/50"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}

export default Header;


