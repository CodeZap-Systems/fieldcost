/**
 * ADMIN CMS - Admin Users Management Page
 * 
 * Create and manage admin user accounts with role-based permissions
 */

"use client";

import React, { useState, useEffect } from "react";

interface AdminUser {
  id: string;
  email: string;
  role: string;
  can_manage_plans: boolean;
  can_manage_subscriptions: boolean;
  can_manage_billing: boolean;
  can_manage_payments: boolean;
  can_manage_users: boolean;
  can_manage_settings: boolean;
  can_view_analytics: boolean;
  is_active: boolean;
  created_at: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    role: "admin",
  });

  useEffect(() => {
    fetchAdminUsers();
  }, []);

  async function fetchAdminUsers() {
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      setUsers(data.users || []);
    } catch (err) {
      console.error("Failed to fetch admin users:", err);
    } finally {
      setLoading(false);
    }
  }

  async function createAdminUser(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        await fetchAdminUsers();
        setFormData({ email: "", role: "admin" });
        setShowCreateForm(false);
        alert("Admin user created successfully");
      }
    } catch (err) {
      console.error("Failed to create admin user:", err);
      alert("Failed to create admin user");
    }
  }

  async function updateUserPermissions(userId: string, role: string) {
    try {
      const res = await fetch(`/api/admin/users?id=${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });

      if (res.ok) {
        await fetchAdminUsers();
      }
    } catch (err) {
      console.error("Failed to update user:", err);
    }
  }

  async function deactivateUser(userId: string) {
    if (!confirm("Deactivate this admin user?")) return;

    try {
      const res = await fetch(`/api/admin/users?id=${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: false }),
      });

      if (res.ok) {
        await fetchAdminUsers();
      }
    } catch (err) {
      console.error("Failed to deactivate user:", err);
    }
  }

  const roleDescriptions: Record<string, string> = {
    superadmin: "Full access to all features",
    admin: "Manage plans, subscriptions, and users",
    billing_admin: "Manage billing, invoices, and payments",
    support: "View-only access to subscriptions and invoices",
    analyst: "View analytics and reports only",
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Admin Users</h1>
          <p className="text-gray-400">Manage admin roles and permissions</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <p className="text-gray-400 text-sm mb-2">Total Admins</p>
            <p className="text-3xl font-bold">{users.length}</p>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <p className="text-gray-400 text-sm mb-2">Active</p>
            <p className="text-3xl font-bold text-green-400">
              {users.filter((u) => u.is_active).length}
            </p>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <p className="text-gray-400 text-sm mb-2">Billing Admins</p>
            <p className="text-3xl font-bold text-blue-400">
              {users.filter((u) => u.can_manage_billing).length}
            </p>
          </div>
        </div>

        {/* Create Button */}
        <div className="mb-8">
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg transition"
          >
            + Add Admin User
          </button>
        </div>

        {/* Create Form Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-lg p-8 border border-gray-700 w-full max-w-md">
              <h2 className="text-2xl font-bold mb-6">Add Admin User</h2>

              <form onSubmit={createAdminUser}>
                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-2">Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full bg-gray-700 border border-gray-600 px-4 py-2 rounded text-white"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-2">Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value })
                    }
                    className="w-full bg-gray-700 border border-gray-600 px-4 py-2 rounded text-white"
                  >
                    <option value="superadmin">Super Admin</option>
                    <option value="admin">Admin</option>
                    <option value="billing_admin">Billing Admin</option>
                    <option value="support">Support</option>
                    <option value="analyst">Analyst</option>
                  </select>
                  <p className="text-xs text-gray-400 mt-1">
                    {roleDescriptions[formData.role]}
                  </p>
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="flex-1 bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
                  >
                    Create User
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Users List */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">Loading admin users...</div>
          ) : users.length === 0 ? (
            <div className="p-12 text-center text-gray-400">
              No admin users yet. Create one to get started.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-900 border-b border-gray-700">
                  <tr>
                    <th className="text-left px-6 py-4 text-sm font-semibold">
                      Email
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold">
                      Role
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold">
                      Permissions
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold">
                      Status
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {users.map((user) => {
                    const permissions = [
                      user.can_manage_plans && "Plans",
                      user.can_manage_subscriptions && "Subscriptions",
                      user.can_manage_billing && "Billing",
                      user.can_manage_payments && "Payments",
                      user.can_view_analytics && "Analytics",
                    ].filter(Boolean);

                    return (
                      <tr
                        key={user.id}
                        className="hover:bg-gray-700/50 transition"
                      >
                        <td className="px-6 py-4 text-sm">{user.email}</td>
                        <td className="px-6 py-4 text-sm">
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-900 text-blue-200">
                            {user.role.replace("_", " ").toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <div className="flex flex-wrap gap-1">
                            {permissions.slice(0, 2).map((perm) => (
                              <span
                                key={perm}
                                className="px-2 py-1 rounded bg-gray-700 text-xs"
                              >
                                {perm}
                              </span>
                            ))}
                            {permissions.length > 2 && (
                              <span className="px-2 py-1 rounded bg-gray-700 text-xs">
                                +{permissions.length - 2}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              user.is_active
                                ? "bg-green-900 text-green-200"
                                : "bg-gray-700 text-gray-400"
                            }`}
                          >
                            {user.is_active ? "ACTIVE" : "INACTIVE"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <div className="flex gap-2">
                            <button
                              onClick={() => setSelectedUser(user)}
                              className="text-blue-400 hover:text-blue-300"
                            >
                              Edit
                            </button>
                            {user.is_active && (
                              <button
                                onClick={() => deactivateUser(user.id)}
                                className="text-red-400 hover:text-red-300"
                              >
                                Deactivate
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Details Panel */}
        {selectedUser && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-lg p-8 border border-gray-700 w-full max-w-md">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">{selectedUser.email}</h2>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2">Role</label>
                <select
                  value={selectedUser.role}
                  onChange={(e) =>
                    updateUserPermissions(selectedUser.id, e.target.value)
                  }
                  className="w-full bg-gray-700 border border-gray-600 px-4 py-2 rounded text-white"
                >
                  <option value="superadmin">Super Admin</option>
                  <option value="admin">Admin</option>
                  <option value="billing_admin">Billing Admin</option>
                  <option value="support">Support</option>
                  <option value="analyst">Analyst</option>
                </select>
              </div>

              <div className="bg-gray-900 rounded p-4 mb-6">
                <p className="text-xs font-semibold text-gray-400 mb-3">
                  PERMISSIONS
                </p>
                <div className="space-y-2 text-sm">
                  <p>
                    {selectedUser.can_manage_plans ? "✓" : "✗"} Manage Plans
                  </p>
                  <p>
                    {selectedUser.can_manage_subscriptions ? "✓" : "✗"}{" "}
                    Manage Subscriptions
                  </p>
                  <p>
                    {selectedUser.can_manage_billing ? "✓" : "✗"} Manage
                    Billing
                  </p>
                  <p>
                    {selectedUser.can_manage_payments ? "✓" : "✗"} Manage
                    Payments
                  </p>
                  <p>
                    {selectedUser.can_view_analytics ? "✓" : "✗"} View
                    Analytics
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setSelectedUser(null)}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
