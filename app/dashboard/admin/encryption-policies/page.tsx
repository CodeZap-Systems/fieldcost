/**
 * Encryption Policy Dashboard
 * Admin view for managing document encryption policies across companies
 */

'use client';

import { useEffect, useState } from 'react';
import { ensureClientUserId } from '@/lib/clientUser';
import { BackButton } from '@/app/components/BackButton';

interface CompanyEncryptionPolicy {
  id: number;
  name: string;
  encryptionEnabled: boolean;
  documentTypes: string[];
  lastUpdated: string;
  exportCount: number;
}

interface EncryptionAuditLog {
  id: number;
  companyName: string;
  documentType: string;
  encrypted: boolean;
  exportedAt: string;
  filename: string;
}

export default function EncryptionPolicyDashboard() {
  const [policies, setPolicies] = useState<CompanyEncryptionPolicy[]>([]);
  const [auditLogs, setAuditLogs] = useState<EncryptionAuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'encrypted' | 'unencrypted'>('all');

  useEffect(() => {
    let active = true;
    ensureClientUserId()
      .then(id => {
        if (active) setUserId(id);
      })
      .catch(err => {
        console.error(err);
        if (active) setError('Unable to resolve workspace user.');
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!userId) return;
    loadPolicies();
  }, [userId]);

  const loadPolicies = async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/admin/encryption-policies?user_id=${userId}`);
      if (!res.ok) throw new Error('Failed to load policies');

      const data = await res.json();
      setPolicies(data.policies || []);
      setAuditLogs(data.auditLogs || []);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Failed to load policies');
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = auditLogs.filter(log => {
    if (selectedCompanyId && log.companyName !== policies[selectedCompanyId]?.name) return false;
    if (filterType === 'encrypted') return log.encrypted;
    if (filterType === 'unencrypted') return !log.encrypted;
    return true;
  });

  const encryptionStats = {
    totalPolicies: policies.length,
    enabledCount: policies.filter(p => p.encryptionEnabled).length,
    disabledCount: policies.filter(p => !p.encryptionEnabled).length,
    totalExports: policies.reduce((sum, p) => sum + p.exportCount, 0),
  };

  if (loading) {
    return (
      <main className="p-8">
        <div className="text-gray-600">Loading encryption policies...</div>
      </main>
    );
  }

  return (
    <main className="p-8 space-y-8 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Encryption Policy Dashboard</h1>
          <p className="text-gray-600">Manage and monitor PDF encryption across all companies.</p>
        </div>
        <BackButton />
      </div>

      {error && (
        <div className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-600">Total Companies</p>
          <p className="text-3xl font-bold text-indigo-600 mt-2">{encryptionStats.totalPolicies}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-600">Encryption Enabled</p>
          <p className="text-3xl font-bold text-green-600 mt-2">{encryptionStats.enabledCount}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-600">Encryption Disabled</p>
          <p className="text-3xl font-bold text-gray-600 mt-2">{encryptionStats.disabledCount}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-600">Total Exports</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">{encryptionStats.totalExports}</p>
        </div>
      </div>

      {/* Policies Table */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">Company Encryption Policies</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Company Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Encryption Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Document Types</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Total Exports</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Last Updated</th>
              </tr>
            </thead>
            <tbody>
              {policies.map(policy => (
                <tr key={policy.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{policy.name}</td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        policy.encryptionEnabled
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {policy.encryptionEnabled ? '🔒 Enabled' : 'Disabled'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{policy.documentTypes.join(', ')}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{policy.exportCount}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{new Date(policy.lastUpdated).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit Log */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">Export Audit Log</h2>
          <div className="flex gap-2">
            <select
              value={filterType}
              onChange={e => setFilterType(e.target.value as typeof filterType)}
              className="px-3 py-1 rounded-lg border border-gray-300 text-sm"
            >
              <option value="all">All Exports</option>
              <option value="encrypted">Encrypted Only</option>
              <option value="unencrypted">Unencrypted Only</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Company</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Document Type</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Encryption</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Filename</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.slice(0, 50).map((log, idx) => (
                <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{log.companyName}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 capitalize">{log.documentType}</td>
                  <td className="px-6 py-4 text-sm">
                    {log.encrypted ? (
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                        🔒 Encrypted
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                        Unencrypted
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 truncate">{log.filename}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{new Date(log.exportedAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredLogs.length > 50 && (
          <div className="border-t border-gray-200 px-6 py-4 text-sm text-gray-600">
            Showing 50 of {filteredLogs.length} exports
          </div>
        )}
      </div>
    </main>
  );
}
