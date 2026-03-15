"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabaseClient";
import { useRouter } from "next/navigation";
import { persistActiveCompanyId } from "../../../lib/companySwitcher";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [sessionError, setSessionError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const router = useRouter();

  // Check for existing session on mount
  useEffect(() => {
    const checkExistingSession = async () => {
      try {
        // First, clear any stale token data
        const storedToken = localStorage.getItem('sb-mukaeylwmzztycajibhy-auth-token');
        if (storedToken) {
          try {
            const tokenData = JSON.parse(storedToken);
            // If token exists but no refresh token, it's stale
            if (!tokenData?.refresh_token) {
              localStorage.removeItem('sb-mukaeylwmzztycajibhy-auth-token');
            }
          } catch (e) {
            // Invalid token data, clear it
            localStorage.removeItem('sb-mukaeylwmzztycajibhy-auth-token');
          }
        }

        const { data, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          const errorMsg = sessionError.message?.toLowerCase() || '';
          if (errorMsg.includes('refresh token') || errorMsg.includes('invalid')) {
            // Refresh token is invalid, clear all auth data
            localStorage.removeItem('sb-mukaeylwmzztycajibhy-auth-token');
            sessionStorage.clear();
            setSessionError(null);
          } else {
            setSessionError("Session error: Unable to verify login status. Please try again.");
            console.warn("Session check error:", sessionError);
          }
        } else if (data?.session?.user) {
          // User is already logged in, redirect to dashboard
          router.push("/dashboard");
        }
      } catch (err) {
        console.error("Session check failed:", err);
        // Don't show error to user, just let them login
      } finally {
        setIsCheckingSession(false);
      }
    };
    checkExistingSession();
  }, [router]);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSessionError("");
    
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        // Provide user-friendly error messages
        if (error.message.includes("Invalid login credentials")) {
          setError("Incorrect email or password. Please try again.");
        } else if (error.message.includes("Email not confirmed")) {
          setError("Please verify your email address before logging in.");
        } else {
          setError(error.message || "Login failed. Please try again.");
        }
        setLoading(false);
        return;
      }

      if (!data?.user) {
        setError("Login successful but session not established. Please try again.");
        setLoading(false);
        return;
      }

      // Clear demo settings on real login
      localStorage.removeItem("demoSession");
      localStorage.removeItem("demoUserId");
      
      // Fetch user's first company and set it as active
      try {
        const companyRes = await fetch("/api/company");
        if (companyRes.ok) {
          const companies = await companyRes.json();
          if (Array.isArray(companies) && companies.length > 0) {
            // Set the first company as active
            persistActiveCompanyId(String(companies[0].id));
          }
        }
      } catch (err) {
        console.warn("Failed to load companies:", err);
      }
      
      // Track login
      try {
        await fetch("/api/registrations", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
      } catch (err) {
        console.warn("Failed to track login:", err);
      }

      // Redirect based on onboarding status
      const onboarded = data.user.user_metadata?.companyOnboarded;
      router.push(onboarded ? "/dashboard" : "/dashboard/setup-company");
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      console.error("Login error:", err);
      setLoading(false);
    }
  }

  if (isCheckingSession) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-blue-700 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-blue-700 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-2xl font-bold text-indigo-600">FC</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">FieldCost</h1>
          <p className="text-indigo-100">Field Operations & Invoicing Platform</p>
        </div>

        {/* Session Error Alert */}
        {sessionError && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 rounded text-red-700 text-sm">
            {sessionError}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="bg-white rounded-lg shadow-xl p-8 mb-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Sign In</h2>

          {/* Email Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <input
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-gray-400"
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          {/* Password Input */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <Link
                href="/auth/forgot-password"
                className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <input
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-gray-400"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                disabled={loading}
              />
              <button
                type="button"
                className="absolute right-3 top-2.5 text-sm font-medium text-gray-600 hover:text-gray-900"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && <div className="mb-4 p-3 bg-red-100 border border-red-400 rounded text-red-700 text-sm">{error}</div>}

          {/* Forgot Password Link */}
          <div className="mb-6 text-right">
            <Link href="/auth/forgot-password" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
              Forgot your password?
            </Link>
          </div>

          {/* Sign In and Sign Up Buttons */}
          <div className="flex gap-3">
            <button
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              type="submit"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
            <Link
              href="/auth/register"
              className="flex-1 text-center bg-indigo-100 hover:bg-indigo-200 text-indigo-600 font-bold py-2 px-4 rounded-lg transition-colors border border-indigo-300"
            >
              Sign Up
            </Link>
          </div>
        </form>

        {/* Demo Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-2">Try Demo</h3>
          <p className="text-gray-600 text-sm mb-4">
            Explore FieldCost with pre-loaded demo data. No account needed.
          </p>
          <Link
            href="/auth/demo-login"
            className="block w-full text-center bg-indigo-100 hover:bg-indigo-200 text-indigo-700 font-bold py-2 px-4 rounded-lg transition-colors border border-indigo-300"
          >
            Launch Demo
          </Link>
        </div>

        {/* Sign Up */}
        <div className="text-center">
          <p className="text-indigo-100 text-sm">
            Don't have an account?{" "}
            <Link href="/auth/register" className="text-white font-bold hover:underline">
              Create one
            </Link>
          </p>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-indigo-400 text-center text-indigo-200 text-xs">
          <p>© 2026 FieldCost MVP. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}

