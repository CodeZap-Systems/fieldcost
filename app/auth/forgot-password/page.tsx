"use client";

import Link from "next/link";
import { useState } from "react";
import { supabase } from "../../../lib/supabaseClient";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<{ success: string; error: string }>({ success: "", error: "" });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus({ success: "", error: "" });
    setLoading(true);
    try {
      const redirectTo = typeof window !== "undefined" ? `${window.location.origin}/auth/reset-password` : undefined;
      const options = redirectTo ? { redirectTo } : undefined;
      const { error } = await supabase.auth.resetPasswordForEmail(email, options);
      if (error) {
        setStatus({ success: "", error: error.message });
        return;
      }
      setStatus({ success: "Check your inbox for the reset link.", error: "" });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to send reset email.";
      setStatus({ success: "", error: message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-sm space-y-4">
        <div>
          <h1 className="text-2xl font-bold">Forgot password</h1>
          <p className="text-sm text-gray-500 mt-1">Enter the email you registered with and we'll send a reset link.</p>
        </div>
        <input
          className="border p-2 rounded w-full"
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded w-full" type="submit" disabled={loading}>
          {loading ? "Sending..." : "Send reset link"}
        </button>
        {status.success && <div className="text-green-600 text-sm">{status.success}</div>}
        {status.error && <div className="text-red-600 text-sm">{status.error}</div>}
        <div className="text-center text-sm">
          <Link href="/auth/login" className="text-indigo-600 hover:underline">
            Back to login
          </Link>
        </div>
      </form>
    </main>
  );
}
