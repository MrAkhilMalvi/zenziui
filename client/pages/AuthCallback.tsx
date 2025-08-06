import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

export default function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setToken } = useAuth();
  
  useEffect(() => {
  const token = searchParams.get("token");
  const error = searchParams.get("error");

  async function handleAuth() {
    if (error) {
      navigate("/login?error=oauth_failed");
      return;
    }
    if (!token) {
      navigate("/login?error=no_token");
      return;
    }

    // Wait for setToken to finish fetching user profile
    await setToken(token);

    // Redirect only after user is loaded
    navigate("/explore");
  }

  handleAuth();
}, [searchParams, navigate, setToken]);


  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">Completing sign in...</h2>
        <p className="text-muted-foreground">Please wait while we sign you in.</p>
      </div>
    </div>
  );
}
