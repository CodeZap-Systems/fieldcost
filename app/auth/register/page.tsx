"use client";

import Link from "next/link";
import { useState, useEffect, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabaseClient";

export default function RegisterPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("admin");
  const [error, setError] = useState("");
  const [sessionError, setSessionError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const router = useRouter();

  // Check for existing session on mount
  useEffect(() => {
    const checkExistingSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (data?.session?.user) {
          // User is already logged in, redirect to dashboard
          router.push("/dashboard");
        }
      } catch (err) {
        console.warn("Session check failed:", err);
      } finally {
        setIsCheckingSession(false);
      }
    };
    checkExistingSession();
  }, [router]);

  async function handleRegister(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSessionError("");
    setSuccess("");

    // Validation
    if (!firstName || !lastName || !companyName || !email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          companyName,
          email,
          password,
          role,
        }),
      });
      const payload = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(payload?.error || "Registration failed");
      }
      localStorage.removeItem("demoSession");
      localStorage.removeItem("demoUserId");
      setSuccess(payload?.message || "Registration successful! Please check your email to verify your account.");
      setTimeout(() => router.push("/auth/login"), 3000);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Registration failed";
      if (errorMsg.includes("already exists")) {
        setError("This email is already registered. Please sign in or use a different email.");
      } else {
        setError(errorMsg);
      }
    } finally {
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
          <p className="text-indigo-100">Create your workspace</p>
        </div>

        {/* Session Error Alert */}
        {sessionError && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 rounded text-red-700 text-sm">
            {sessionError}
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleRegister} className="bg-white rounded-lg shadow-xl p-8 mb-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Create Account</h2>

          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
              <input
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                type="text"
                placeholder="John"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
              <input
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                type="text"
                placeholder="Doe"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                required
                disabled={loading}
              />
            </div>
          </div>

          {/* Company Name */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
            <input
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-gray-400"
              type="text"
              placeholder="Your Company"
              value={companyName}
              onChange={e => setCompanyName(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Work Email</label>
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

          {/* Password */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
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
            <p className="text-xs text-gray-500 mt-1">At least 8 characters</p>
          </div>

          {/* Confirm Password */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
            <input
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-gray-400"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          {/* Role */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Your Role</label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
              value={role}
              onChange={e => setRole(e.target.value)}
              required
              disabled={loading}
            >
              <option value="admin">Admin (Full Access)</option>
              <option value="subcontractor">Field Crew (Limited Access)</option>
            </select>
          </div>

          {/* Error Message */}
          {error && <div className="mb-4 p-3 bg-red-100 border border-red-400 rounded text-red-700 text-sm">{error}</div>}

          {/* Success Message */}
          {success && (
            <div className="mb-4 p-3 bg-green-100 border border-green-400 rounded text-green-700 text-sm">{success}</div>
          )}

          {/* Register Button */}
          <button
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            type="submit"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create My Workspace"}
          </button>

          {/* Terms */}
          <p className="text-xs text-gray-500 mt-4 text-center">
            By registering, you agree to our Terms of Service and Privacy Policy
          </p>
        </form>

        {/* Sign In Link */}
        <div className="text-center">
          <p className="text-indigo-100 text-sm">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-white font-bold hover:underline">
              Sign in
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
