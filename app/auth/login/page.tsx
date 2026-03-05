"use client";
import Link from "next/link";
import { useState } from "react";
import { supabase } from "../../../lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      localStorage.removeItem("demoSession");
      localStorage.removeItem("demoUserId");
      fetch("/api/registrations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      }).catch(() => undefined);
      const onboarded = data?.user?.user_metadata?.companyOnboarded;
      router.push(onboarded ? "/dashboard" : "/dashboard/setup-company");
    }
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-4">Login</h1>
        <input
          className="border p-2 rounded w-full mb-2"
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <div className="mb-4">
          <div className="relative">
            <input
              className="border p-2 rounded w-full pr-20"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="absolute inset-y-0 right-2 text-sm font-medium text-gray-600 hover:text-gray-900"
              onClick={() => setShowPassword(visible => !visible)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          <div className="text-right mt-2">
            <Link href="/auth/forgot-password" className="text-sm text-indigo-600 hover:underline">
              Forgot password?
            </Link>
          </div>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded w-full" type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
        {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
      </form>
    </main>
  );
}
