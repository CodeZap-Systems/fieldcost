"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleRegister(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const res = await fetch("/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyName, email, password, role }),
      });
      const payload = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(payload?.error || "Registration failed");
      }
      localStorage.removeItem("demoSession");
      localStorage.removeItem("demoUserId");
      setSuccess(payload?.message || "Registration email sent. Please confirm to continue.");
      setTimeout(() => router.push("/auth/login"), 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <form onSubmit={handleRegister} className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-4">Register your workspace</h1>
        <input
          className="border p-2 rounded w-full mb-2"
          type="text"
          placeholder="Company name"
          value={companyName}
          onChange={e => setCompanyName(e.target.value)}
          required
        />
        <input
          className="border p-2 rounded w-full mb-2"
          type="email"
          placeholder="Work email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          className="border p-2 rounded w-full mb-4"
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Role</label>
          <select className="border p-2 rounded w-full" value={role} onChange={e => setRole(e.target.value)} required>
            <option value="admin">Admin</option>
            <option value="subcontractor">Subcontractor</option>
          </select>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded w-full" type="submit" disabled={loading}>
          {loading ? "Registering..." : "Send registration email"}
        </button>
        {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
        {success && <div className="text-green-600 text-sm mt-2">{success}</div>}
        <p className="text-xs text-gray-500 mt-4">
          We will email you a confirmation link. Once verified, you will be redirected to set up your company profile.
        </p>
      </form>
    </main>
  );
}
