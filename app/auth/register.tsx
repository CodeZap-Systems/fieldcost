"use client";
import { useState, type FormEvent } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useRouter } from "next/navigation";
import { Button } from "../../components/Button";
import { FormField } from "../../components/FormField";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleRegister(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { role } }
    });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      router.push("/dashboard");
    }
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <form onSubmit={handleRegister} className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-4">Register</h1>
        <FormField label="Email" htmlFor="register-email" error={error && error.toLowerCase().includes('email') ? error : undefined}>
          <input
            id="register-email"
            className="border p-2 rounded w-full mb-2"
            placeholder="Email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </FormField>
        <FormField label="Password" htmlFor="register-password" error={error && error.toLowerCase().includes('password') ? error : undefined}>
          <input
            id="register-password"
            className="border p-2 rounded w-full mb-2"
            placeholder="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            autoComplete="new-password"
          />
        </FormField>
        <FormField label="Role" htmlFor="register-role">
          <select id="register-role" className="border p-2 rounded w-full mb-2" value={role} onChange={e => setRole(e.target.value)}>
            <option value="admin">Admin</option>
            <option value="subcontractor">Subcontractor</option>
          </select>
        </FormField>
        <Button className="w-full" type="submit" loading={loading} disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </Button>
        {error && !error.toLowerCase().includes('email') && !error.toLowerCase().includes('password') && (
          <div className="text-red-600 text-sm mt-2" role="alert">{error}</div>
        )}
      </form>
    </main>
  );
}
