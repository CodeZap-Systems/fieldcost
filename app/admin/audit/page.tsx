/**
 * ADMIN CMS - Audit Logs Page
 * 
 * View all admin actions for compliance and troubleshooting
 */

"use client";

import React, { useState, useEffect } from "react";

interface AuditLog {
  id: string;
  admin_id: string;
  action: string;
  resource_type: string;
  resource_id: string;
  changes: Record<string, any>;
  timestamp: string;
}

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterAction, setFilterAction] = useState("all");
  const [filterResourceType, setFilterResourceType] = useState("all");
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  useEffect(() => {
    fetchAuditLogs();
  }, [filterAction, filterResourceType]);

  async function fetchAuditLogs() {
    try {
      const params = new URLSearchParams();
      if (filterAction !== "all") params.append("action", filterAction);
      if (filterResourceType !== "all") params.append("resource_type", filterResourceType);

      const url = `/api/admin/audit?${params.toString()}`;
      const res = await fetch(url);
      const data = await res.json();
      setLogs(data.logs || []);
    } catch (err) {
      console.error("Failed to fetch audit logs:", err);
    } finally {
      setLoading(false);
    }
  }

  const actionColors: Record<string, string> = {
    create: "bg-green-900 text-green-200",
    update: "bg-blue-900 text-blue-200",
    delete: "bg-red-900 text-red-200",
    create_admin_user: "bg-purple-900 text-purple-200",
    update_admin_user: "bg-purple-900 text-purple-200",
    create_subscription: "bg-cyan-900 text-cyan-200",
    update_subscription: "bg-cyan-900 text-cyan-200",
    create_invoice: "bg-orange-900 text-orange-200",
    create_plan: "bg-indigo-900 text-indigo-200",
    update_plan: "bg-indigo-900 text-indigo-200",
  };

  const uniqueActions = Array.from(new Set(logs.map((log) => log.action)));
  const uniqueResourceTypes = Array.from(
    new Set(logs.map((log) => log.resource_type))
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Audit Logs</h1>
          <p className="text-gray-400">Track all admin actions and system changes</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <p className="text-gray-400 text-sm mb-2">Total Actions</p>
            <p className="text-3xl font-bold">{logs.length}</p>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <p className="text-gray-400 text-sm mb-2">Last 24 Hours</p>
            <p className="text-3xl font-bold">
              {logs.filter((log) => {
                const now = new Date();
                const logTime = new Date(log.timestamp);
                return now.getTime() - logTime.getTime() < 86400000;
              }).length}
            </p>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <p className="text-gray-400 text-sm mb-2">Resource Types</p>
            <p className="text-3xl font-bold">{uniqueResourceTypes.length}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8 flex gap-4">
          <select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            className="bg-gray-800 border border-gray-700 px-4 py-2 rounded text-white"
          >
            <option value="all">All Actions</option>
            {uniqueActions.map((action) => (
              <option key={action} value={action}>
                {action.replace(/_/g, " ").toUpperCase()}
              </option>
            ))}
          </select>

          <select
            value={filterResourceType}
            onChange={(e) => setFilterResourceType(e.target.value)}
            className="bg-gray-800 border border-gray-700 px-4 py-2 rounded text-white"
          >
            <option value="all">All Resources</option>
            {uniqueResourceTypes.map((type) => (
              <option key={type} value={type}>
                {type.replace(/_/g, " ").toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        {/* Logs Table */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">Loading audit logs...</div>
          ) : logs.length === 0 ? (
            <div className="p-12 text-center text-gray-400">
              No audit logs found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-900 border-b border-gray-700">
                  <tr>
                    <th className="text-left px-6 py-4 text-sm font-semibold">
                      Timestamp
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold">
                      Action
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold">
                      Resource
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold">
                      Resource ID
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold">
                      Details
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-700/50 transition">
                      <td className="px-6 py-4 text-sm whitespace-nowrap">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            actionColors[log.action] ||
                            "bg-gray-700 text-gray-300"
                          }`}
                        >
                          {log.action.replace(/_/g, " ").toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm lowercase">
                        {log.resource_type.replace(/_/g, " ")}
                      </td>
                      <td className="px-6 py-4 text-sm font-mono text-gray-400">
                        {log.resource_id.length > 20
                          ? log.resource_id.substring(0, 20) + "..."
                          : log.resource_id}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <button
                          onClick={() => setSelectedLog(log)}
                          className="text-blue-400 hover:text-blue-300"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Details Panel */}
        {selectedLog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-lg p-8 border border-gray-700 w-full max-w-2xl max-h-96 overflow-y-auto">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">
                    {selectedLog.action.replace(/_/g, " ").toUpperCase()}
                  </h2>
                  <p className="text-gray-400 text-sm">
                    {new Date(selectedLog.timestamp).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedLog(null)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4 mb-6">
                <div className="bg-gray-900 rounded p-4">
                  <p className="text-xs font-semibold text-gray-400 mb-2">
                    RESOURCE
                  </p>
                  <p className="text-sm">{selectedLog.resource_type}</p>
                </div>

                <div className="bg-gray-900 rounded p-4">
                  <p className="text-xs font-semibold text-gray-400 mb-2">
                    RESOURCE ID
                  </p>
                  <p className="text-sm font-mono break-all">
                    {selectedLog.resource_id}
                  </p>
                </div>

                {Object.keys(selectedLog.changes).length > 0 && (
                  <div className="bg-gray-900 rounded p-4">
                    <p className="text-xs font-semibold text-gray-400 mb-2">
                      CHANGES
                    </p>
                    <pre className="text-xs overflow-auto max-h-32 text-gray-300">
                      {JSON.stringify(selectedLog.changes, null, 2)}
                    </pre>
                  </div>
                )}
              </div>

              <button
                onClick={() => setSelectedLog(null)}
                className="w-full bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
