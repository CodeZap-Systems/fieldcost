"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabaseClient";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<{ success: string; error: string }>({ success: "", error: "" });
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    async function hydrateSession() {
      if (typeof window === "undefined") return;
      const url = new URL(window.location.href);
      const hasCodeInHash = url.hash.includes("code=");
      if (hasCodeInHash) {
        const fullUrl = `${url.origin}${url.pathname}${url.search}${url.hash}`;
        const { error } = await supabase.auth.exchangeCodeForSession(fullUrl);
        if (error) {
          if (active) setStatus({ success: "", error: error.message });
          return;
        }
      }
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        if (active) setStatus({ success: "", error: "Recovery link is invalid or expired." });
        return;
      }
      if (active) setReady(true);
    }
    hydrateSession();
    return () => {
      active = false;
    };
  }, []);

  async function handleUpdate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!ready) return;
    if (password.length < 8) {
      setStatus({ success: "", error: "Password must be at least 8 characters." });
      return;
    }
    if (password !== confirmPassword) {
      setStatus({ success: "", error: "Passwords do not match." });
      return;
    }
    setLoading(true);
    setStatus({ success: "", error: "" });
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      setStatus({ success: "", error: error.message });
      return;
    }
    setStatus({ success: "Password updated. You can now log in.", error: "" });
    setPassword("");
    setConfirmPassword("");
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4">
      <form onSubmit={handleUpdate} className="bg-white p-8 rounded shadow-md w-full max-w-sm space-y-4">
        <div>
          <h1 className="text-2xl font-bold">Set a new password</h1>
          <p className="text-sm text-gray-500 mt-1">Choose a strong password to secure your FieldCost account.</p>
        </div>
        <input
          className="border p-2 rounded w-full"
          type="password"
          placeholder="New password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          disabled={!ready || loading}
          required
        />
        <input
          className="border p-2 rounded w-full"
          type="password"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          disabled={!ready || loading}
          required
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded w-full" type="submit" disabled={!ready || loading}>
          {loading ? "Updating..." : "Update password"}
        </button>
        {status.success && <div className="text-green-600 text-sm">{status.success} <Link href="/auth/login" className="underline">Return to login</Link>.</div>}
        {status.error && <div className="text-red-600 text-sm">{status.error}</div>}
      </form>
    </main>
  );
}
