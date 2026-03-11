'use client';

import { useState } from 'react';
import Link from 'next/link';

interface FieldRole {
  id: string;
  userId: string;
  role: string;
  assignedAt: string;
}

const ROLES = [
  { id: 'crew_member', label: 'Crew Member', color: 'bg-blue-600' },
  { id: 'supervisor', label: 'Supervisor', color: 'bg-green-600' },
  { id: 'site_manager', label: 'Site Manager', color: 'bg-purple-600' },
  { id: 'project_manager', label: 'Project Manager', color: 'bg-orange-600' },
  { id: 'finance', label: 'Finance', color: 'bg-yellow-600' },
  { id: 'admin', label: 'Admin', color: 'bg-red-600' },
];

const PERMISSIONS_BY_ROLE = {
  crew_member: ['Create Tasks', 'View GPS', 'Upload Photos'],
  supervisor: ['Create Tasks', 'Approve Tasks', 'Manage Crew', 'View GPS', 'Upload Photos'],
  site_manager: ['Create Tasks', 'Approve Tasks', 'Manage Crew', 'View GPS', 'Upload Photos', 'Manage Workflows'],
  project_manager: ['All Permissions', 'Export Data', 'Access Reports', 'Sync to ERP'],
  finance: ['View All Data', 'Export Data', 'Access Reports', 'Sync to ERP'],
  admin: ['All Permissions', 'Manage Users', 'Manage Company'],
};

export default function Tier3Crew() {
  const [roles, setRoles] = useState<FieldRole[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    userId: '',
    role: 'crew_member',
  });

  const handleAssignRole = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/tier3/crew', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyId: 'current-company-id', // Would come from auth context
          ...formData,
        }),
      });

      if (response.ok) {
        const newRole = await response.json();
        setRoles([...roles, newRole]);
        setFormData({ userId: '', role: 'crew_member' });
      }
    } catch (error) {
      console.error('Error assigning role:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRoleColor = (role: string) => {
    return ROLES.find(r => r.id === role)?.color || 'bg-gray-600';
  };

  const getRoleLabel = (role: string) => {
    return ROLES.find(r => r.id === role)?.label || role;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Link href="/dashboard/tier3" className="text-emerald-400 hover:text-emerald-300 mb-2 inline-block">
              ← Back to Tier 3 Setup
            </Link>
            <h1 className="text-4xl font-bold text-white">Field Role RBAC</h1>
            <p className="text-gray-400 mt-2">6 roles × 30+ permissions matrix</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Assign Role Form */}
          <div className="lg:col-span-1">
            <form onSubmit={handleAssignRole} className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <h2 className="text-xl font-bold text-white mb-6">Assign Role</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">User ID</label>
                  <input
                    type="text"
                    value={formData.userId}
                    onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500"
                    placeholder="Enter user ID"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white focus:outline-none focus:border-emerald-500"
                  >
                    {ROLES.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.label}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2 px-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold rounded hover:shadow-lg disabled:opacity-50 transition"
                >
                  {loading ? 'Assigning...' : 'Assign Role'}
                </button>
              </div>

              {/* Roles Summary */}
              <div className="mt-8 pt-6 border-t border-slate-700">
                <h3 className="text-sm font-bold text-gray-300 mb-3 uppercase">Assigned Roles</h3>
                <div className="space-y-2">
                  {roles.length === 0 ? (
                    <p className="text-gray-400 text-sm">No roles assigned yet</p>
                  ) : (
                    roles.map((role) => (
                      <div key={role.id} className="flex items-center justify-between bg-slate-700 px-3 py-2 rounded">
                        <span className="text-sm text-white">{role.userId}</span>
                        <span className={`text-xs font-semibold px-2 py-1 rounded text-white ${getRoleColor(role.role)}`}>
                          {getRoleLabel(role.role)}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </form>
          </div>

          {/* Permissions Matrix */}
          <div className="lg:col-span-2">
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <h2 className="text-xl font-bold text-white mb-6">Permission Matrix</h2>

              <div className="space-y-4">
                {ROLES.map((role) => (
                  <div key={role.id} className={`${role.color} bg-opacity-10 border border-opacity-20 border-current rounded-lg p-4`}>
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`inline-block w-3 h-3 rounded-full ${role.color}`}></span>
                      <span className="font-bold text-white">{role.label}</span>
                      <span className="text-xs text-gray-400 ml-auto">{PERMISSIONS_BY_ROLE[role.id as keyof typeof PERMISSIONS_BY_ROLE].length} permissions</span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {PERMISSIONS_BY_ROLE[role.id as keyof typeof PERMISSIONS_BY_ROLE].map((perm, idx) => (
                        <span key={idx} className="text-xs bg-slate-700 text-gray-300 px-2 py-1 rounded">
                          {perm}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Role Hierarchy */}
              <div className="mt-8 pt-6 border-t border-slate-700">
                <h3 className="text-sm font-bold text-gray-300 mb-4 uppercase">Role Hierarchy</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-32 px-3 py-1 bg-gray-700 rounded text-gray-300">Crew Member</div>
                    <div className="text-gray-500">→</div>
                    <span className="text-gray-400">Basic field operations</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-32 px-3 py-1 bg-gray-700 rounded text-gray-300">Supervisor</div>
                    <div className="text-gray-500">→</div>
                    <span className="text-gray-400">Team + approval authority</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-32 px-3 py-1 bg-gray-700 rounded text-gray-300">Site Manager</div>
                    <div className="text-gray-500">→</div>
                    <span className="text-gray-400">Site-level management</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-32 px-3 py-1 bg-gray-700 rounded text-gray-300">Project Manager</div>
                    <div className="text-gray-500">→</div>
                    <span className="text-gray-400">Full project oversight</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-32 px-3 py-1 bg-gray-700 rounded text-gray-300">Finance</div>
                    <div className="text-gray-500">→</div>
                    <span className="text-gray-400">Financial data access</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-32 px-3 py-1 bg-gray-700 rounded text-gray-300">Admin</div>
                    <div className="text-gray-500">→</div>
                    <span className="text-gray-400">Complete system control</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
