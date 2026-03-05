"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

export default function DemoLoginPage() {
  const [demoUser, setDemoUser] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleDemoLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    // Simulate demo login by storing demoUser in localStorage/session
    if (!demoUser) {
      setError("Please select a demo user.");
      setLoading(false);
      return;
    }
    await supabase.auth.signOut();
    localStorage.setItem("demoUserId", demoUser);
    localStorage.setItem("demoSession", "true");
    setLoading(false);
    router.push("/dashboard");
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <form onSubmit={handleDemoLogin} className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-4">Demo Login</h1>
        <label className="block mb-2 font-semibold">Select Demo User</label>
        <select className="border p-2 rounded w-full mb-4" value={demoUser} onChange={e => setDemoUser(e.target.value)}>
          <option value="">Choose...</option>
          <option value="demo-admin">Demo Admin</option>
          <option value="demo-subcontractor">Demo Subcontractor</option>
        </select>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded w-full font-semibold"
          type="submit"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login as Demo"}
        </button>
        {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
      </form>
    </main>
  );
}
