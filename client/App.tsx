import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AnimatePresence } from "framer-motion";
import { AuthProvider } from "./hooks/useAuth";
import { FloatingShapes, CursorFollow, AnimatedPageWrapper } from "./components/3d";
import Index from "./pages/Index";
import Explore from "./pages/Explore";
import Gallery from "./pages/Gallery";
import Upload from "./pages/Upload";
import Docs from "./pages/Docs";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AuthCallback from "./pages/AuthCallback";
import NotFound from "./pages/NotFound";
import "./global.css";
import Profile from "./pages/Profile";
import Collections from "./pages/Collections";
import CollectionDetail from "./pages/CollectionDetail";
import Settings from "./pages/Settings";

const queryClient = new QueryClient();

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={
          <AnimatedPageWrapper>
            <Index />
          </AnimatedPageWrapper>
        } />
        <Route path="/explore" element={
          <AnimatedPageWrapper>
            <Explore />
          </AnimatedPageWrapper>
        } />
        <Route path="/gallery" element={
          <AnimatedPageWrapper>
            <Gallery />
          </AnimatedPageWrapper>
        } />
        <Route path="/upload" element={
          <AnimatedPageWrapper>
            <Upload />
          </AnimatedPageWrapper>
        } />
        <Route path="/docs" element={
          <AnimatedPageWrapper>
            <Docs />
          </AnimatedPageWrapper>
        } />
        <Route path="/login" element={
          <AnimatedPageWrapper>
            <Login />
          </AnimatedPageWrapper>
        } />
        <Route path="/signup" element={
          <AnimatedPageWrapper>
            <Signup />
          </AnimatedPageWrapper>
        } />
         <Route path="/profile" element={
          <AnimatedPageWrapper>
            <Profile />
          </AnimatedPageWrapper>
        } />
        <Route path="/auth/callback" element={
          <AnimatedPageWrapper>
            <AuthCallback />
          </AnimatedPageWrapper>
        } />
          <Route path="/collections" element={
          <AnimatedPageWrapper>
            <Collections />
          </AnimatedPageWrapper>
        } />
        <Route path="/collections/:id" element={
          <AnimatedPageWrapper>
            <CollectionDetail />
          </AnimatedPageWrapper>
        } />
         <Route path="/settings" element={
          <AnimatedPageWrapper>
            <Settings />
          </AnimatedPageWrapper>
        } />
        <Route path="*" element={
          <AnimatedPageWrapper>
            <NotFound />
          </AnimatedPageWrapper>
        } />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="min-h-screen bg-background relative overflow-hidden">
              {/* 3D Background Elements */}
              <FloatingShapes count={8} />

              {/* Custom Cursor */}
              <CursorFollow />

              {/* Main Content */}
              <div className="relative z-10">
               
                <main>
                  <AnimatedRoutes />
                </main>
               
              </div>
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
