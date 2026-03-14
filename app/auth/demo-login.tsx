"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";
import { persistActiveCompanyId } from "../../lib/companySwitcher";

const DEMO_USERS = [
  {
    id: "demo-admin",
    label: "Admin - Operations Manager",
    description: "Full access to all features, pre-populated with demo data",
    badge: "FULL ACCESS",
  },
  {
    id: "demo-subcontractor",
    label: "Field Crew - Crew Member",
    description: "Limited access focused on projects and tasks",
    badge: "LIMITED ACCESS",
  },
];

export default function DemoLoginPage() {
  const [demoUser, setDemoUser] = useState("demo-admin");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleDemoLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!demoUser) {
      setError("Please select a demo user.");
      setLoading(false);
      return;
    }

    try {
      await supabase.auth.signOut();
      localStorage.setItem("demoUserId", demoUser);
      localStorage.setItem("demoSession", "true");
      persistActiveCompanyId("8"); // Auto-select Demo Company
      router.push("/dashboard");
    } catch (err) {
      setError("Failed to start demo session. Please try again.");
      console.error("Demo login error:", err);
      setLoading(false);
    }
  }

  const selectedUser = DEMO_USERS.find(u => u.id === demoUser);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-blue-700 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-2xl font-bold text-indigo-600">FC</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Try FieldCost Demo</h1>
          <p className="text-indigo-100">Explore all features with pre-loaded sample data</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Demo Selection */}
          <form onSubmit={handleDemoLogin} className="bg-white rounded-lg shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Select Demo Role</h2>

            {/* User Selection */}
            <div className="space-y-3 mb-6">
              {DEMO_USERS.map(user => (
                <label
                  key={user.id}
                  className={`block p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    demoUser === user.id
                      ? "bg-indigo-50 border-indigo-600"
                      : "bg-gray-50 border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="demoUser"
                      value={user.id}
                      checked={demoUser === user.id}
                      onChange={e => setDemoUser(e.target.value)}
                      className="mt-1"
                      disabled={loading}
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-900">{user.label}</span>
                        <span className="text-xs font-bold bg-indigo-100 text-indigo-700 px-2 py-1 rounded">
                          {user.badge}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{user.description}</p>
                    </div>
                  </div>
                </label>
              ))}
            </div>

            {/* Error Message */}
            {error && <div className="mb-4 p-3 bg-red-100 border border-red-400 rounded text-red-700 text-sm">{error}</div>}

            {/* Launch Button */}
            <button
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              type="submit"
              disabled={loading}
            >
              {loading ? "Launching Demo..." : "Launch Demo"}
            </button>

            {/* Sign In Link */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-center text-sm text-gray-600 mb-4">Want to use your own company data?</p>
              <Link
                href="/auth/login"
                className="block text-center w-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                Sign In with Real Company
              </Link>
            </div>
          </form>

          {/* Info Panel */}
          <div className="space-y-6">
            {/* What's Included */}
            <div className="bg-white rounded-lg shadow-xl p-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4">📦 What's Included</h3>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex gap-3">
                  <span>✓</span>
                  <span>
                    <strong>Sample Projects:</strong> Mining, construction, and field operations
                  </span>
                </li>
                <li className="flex gap-3">
                  <span>✓</span>
                  <span>
                    <strong>Test Data:</strong> Invoices, quotes, and payment history
                  </span>
                </li>
                <li className="flex gap-3">
                  <span>✓</span>
                  <span>
                    <strong>Mock Customers:</strong> Various company types
                  </span>
                </li>
                <li className="flex gap-3">
                  <span>✓</span>
                  <span>
                    <strong>Reports:</strong> Pre-generated reports and dashboards
                  </span>
                </li>
              </ul>
            </div>

            {/* Demo vs Live */}
            <div className="bg-indigo-50 border-2 border-indigo-200 rounded-lg p-6">
              <h3 className="text-lg font-bold text-indigo-900 mb-4">🔑 Key Differences</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-semibold text-indigo-900">Demo Account:</p>
                  <p className="text-indigo-800">Pre-populated data for exploration. Changes are not preserved.</p>
                </div>
                <div>
                  <p className="font-semibold text-indigo-900">Real Account:</p>
                  <p className="text-indigo-800">Your company data stays private and secure. ERP integration ready.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-indigo-200 text-xs">
          <p>© 2026 FieldCost MVP. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
