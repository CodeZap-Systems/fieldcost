"use client";

import Link from "next/link";
import { useState, FormEvent } from "react";
import { supabase } from "../../../lib/supabaseClient";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<{ success: string; error: string; accountExists?: boolean }>({ success: "", error: "" });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus({ success: "", error: "" });
    
    if (!email) {
      setStatus({ success: "", error: "Please enter your email address." });
      return;
    }
    
    if (!email.includes("@")) {
      setStatus({ success: "", error: "Please enter a valid email address." });
      return;
    }

    setLoading(true);
    try {
      const redirectTo = typeof window !== "undefined" ? `${window.location.origin}/auth/reset-password` : undefined;
      const options = redirectTo ? { redirectTo } : undefined;
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, options);
      
      if (error) {
        console.error("Reset password error:", error);
        
        // Check if error indicates user doesn't exist
        if (
          error.message?.toLowerCase().includes("user not found") ||
          error.message?.toLowerCase().includes("not exist") ||
          error.message?.toLowerCase().includes("invalid email")
        ) {
          setStatus({ 
            success: "", 
            error: `No account found with email "${email}". Please create a new account instead.`,
            accountExists: false
          });
        } else if (error.message?.toLowerCase().includes("rate_limit")) {
          setStatus({ 
            success: "", 
            error: "Too many requests. Please try again in a few minutes.",
            accountExists: null
          });
        } else {
          setStatus({ 
            success: "", 
            error: error.message || "Failed to send reset email. Please try again.",
            accountExists: false
          });
        }
        return;
      }
      
      setStatus({ 
        success: "✓ Check your email inbox for the reset link. The link will expire in 1 hour.",
        error: "",
        accountExists: true
      });
      setEmail("");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to send reset email.";
      setStatus({ success: "", error: message, accountExists: false });
    } finally {
      setLoading(false);
    }
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
          <p className="text-indigo-100">Reset Your Password</p>
        </div>

        {/* Reset Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-xl p-8 mb-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Forgot Your Password?</h2>
          <p className="text-gray-600 text-sm mb-6">
            Enter the email address associated with your FieldCost account. We'll send you a secure link to reset your password.
          </p>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <input
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-gray-400"
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          
          <button 
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed" 
            type="submit" 
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
          
          {status.success && (
            <div className="mt-4 p-3 bg-green-100 border border-green-400 rounded text-green-700 text-sm">
              {status.success}
            </div>
          )}
          
          {status.error && (
            <div className="mt-4 p-3 bg-red-100 border border-red-400 rounded text-red-700 text-sm">
              <div>{status.error}</div>
              {status.accountExists === false && (
                <div className="mt-2 pt-2 border-t border-red-300">
                  <Link href="/auth/register" className="text-red-700 font-bold hover:underline">
                    ➜ Create a new account instead
                  </Link>
                </div>
              )}
            </div>
          )}
        </form>

        {/* Back to Login */}
        <div className="text-center">
          <p className="text-indigo-100 text-sm">
            Remember your password?{" "}
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
