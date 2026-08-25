import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/api";
import { useFiles } from "../context/FileContext";
import { Cloud, Loader2, AlertCircle } from "lucide-react";

const OAuthCallback = () => {
  const navigate = useNavigate();
  const { setUser } = useFiles();
  const [errorMsg, setErrorMsg] = useState("");
  const processedRef = useRef(false);

  useEffect(() => {
    // Prevent duplicate executions in React 18 / StrictMode
    if (processedRef.current) return;
    processedRef.current = true;

    const handleOAuthCallback = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");

        // 1. If token is missing, redirect to login page
        if (!token) {
          console.warn("No token found in OAuth callback URL");
          navigate("/login", { replace: true });
          return;
        }

        // 2. Save token in localStorage immediately
        localStorage.setItem("cloudnest_token", token);

        // 3. Fetch user details from backend using the token
        let userObj = null;
        try {
          const userDto = await authService.getCurrentUser(token);
          if (userDto) {
            userObj = {
              id: userDto?.id,
              userName: userDto?.userName || userDto?.name,
              mail: userDto?.mail || userDto?.email,
              name: userDto?.userName || userDto?.name || userDto?.mail || "Cloud User",
              email: userDto?.mail || userDto?.email || "user@cloudnest.io",
            };
          }
        } catch (fetchErr) {
          console.warn("Could not fetch user profile from /me, using default context:", fetchErr);
        }

        if (!userObj) {
          userObj = {
            name: "Cloud User",
            email: "user@cloudnest.io",
          };
        }

        // 4. Save user information in localStorage & context
        localStorage.setItem("cloudnest_user", JSON.stringify(userObj));
        setUser(userObj);

        // 5. Clean URL and navigate immediately to dashboard
        window.history.replaceState({}, document.title, "/");
        navigate("/", { replace: true });
      } catch (err) {
        console.error("OAuth callback processing error:", err);
        setErrorMsg("Failed to authenticate with OAuth provider. Redirecting to login...");
        setTimeout(() => {
          localStorage.removeItem("cloudnest_token");
          localStorage.removeItem("cloudnest_user");
          navigate("/login", { replace: true });
        }, 1500);
      }
    };

    handleOAuthCallback();
  }, [navigate, setUser]);

  return (
    <div className="min-h-screen w-full bg-[#0b0c16] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-transparent to-blue-900/10 pointer-events-none" />

      <div className="glass-card w-full max-w-sm rounded-2xl p-8 text-center relative z-10 shadow-2xl border border-white/10 flex flex-col items-center">
        <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-6 shadow-inner border border-white/15">
          <Cloud className="w-8 h-8 text-blue-400 animate-pulse" />
        </div>

        {errorMsg ? (
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center mx-auto">
              <AlertCircle className="w-5 h-5" />
            </div>
            <p className="text-sm font-medium text-red-400">{errorMsg}</p>
          </div>
        ) : (
          <div className="space-y-4">
            <Loader2 className="w-8 h-8 text-blue-400 animate-spin mx-auto" />
            <h3 className="text-lg font-bold font-['Hanken_Grotesk'] text-white">
              Authenticating with CloudNest
            </h3>
            <p className="text-xs text-gray-400">
              Loading your dashboard and storage files...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OAuthCallback;
