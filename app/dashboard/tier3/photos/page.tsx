'use client';

import { useState } from 'react';
import Link from 'next/link';

interface PhotoEvidence {
  id: string;
  taskId: string;
  projectId: string;
  photoUrl: string;
  photoHash: string;
  capturedAt: string;
  legalGradeVerified: boolean;
  capturedByCrewMemberId: string;
}

export default function Tier3Photos() {
  const [photos, setPhotos] = useState<PhotoEvidence[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    taskId: '',
    projectId: '',
    photoUrl: '',
    photoHash: '',
    capturedByCrewMemberId: '',
    legalGradeVerified: false,
  });
  const [validationError, setValidationError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');
    setLoading(true);

    // Validate SHA-256 hash format (64 hex characters)
    const hash256Regex = /^[a-f0-9]{64}$/i;
    if (!hash256Regex.test(formData.photoHash)) {
      setValidationError('Invalid SHA-256 hash. Must be 64 hex characters.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/tier3/photo-evidence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        setPhotos([result.photoEvidence, ...photos]);
        setFormData({
          taskId: '',
          projectId: '',
          photoUrl: '',
          photoHash: '',
          capturedByCrewMemberId: '',
          legalGradeVerified: false,
        });
      } else {
        const error = await response.json();
        setValidationError(error.error || 'Failed to upload photo');
      }
    } catch (error) {
      setValidationError(error instanceof Error ? error.message : 'Error uploading photo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard/tier3" className="text-emerald-400 hover:text-emerald-300 mb-2 inline-block">
            ← Back to Tier 3 Setup
          </Link>
          <h1 className="text-4xl font-bold text-white">Photo Evidence</h1>
          <p className="text-gray-400 mt-2">Legal chain of custody with SHA-256 integrity verification</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Photo Upload Form */}
          <div className="lg:col-span-1">
            <form onSubmit={handleSubmit} className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <h2 className="text-xl font-bold text-white mb-6">Upload Photo</h2>

              {validationError && (
                <div className="mb-4 p-3 bg-red-500 bg-opacity-10 border border-red-500 rounded text-red-400 text-sm">
                  {validationError}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Task ID</label>
                  <input
                    type="text"
                    value={formData.taskId}
                    onChange={(e) => setFormData({ ...formData, taskId: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500"
                    placeholder="Task ID"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Project ID</label>
                  <input
                    type="text"
                    value={formData.projectId}
                    onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500"
                    placeholder="Project ID"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Photo URL</label>
                  <input
                    type="url"
                    value={formData.photoUrl}
                    onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500"
                    placeholder="https://storage.example.com/photo.jpg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">SHA-256 Hash</label>
                  <input
                    type="text"
                    value={formData.photoHash}
                    onChange={(e) => setFormData({ ...formData, photoHash: e.target.value.toLowerCase() })}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 font-mono text-xs"
                    placeholder="64 hex characters"
                    required
                  />
                  <p className="text-xs text-gray-400 mt-1">64 character hexadecimal hash</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Captured By (Crew ID)</label>
                  <input
                    type="text"
                    value={formData.capturedByCrewMemberId}
                    onChange={(e) => setFormData({ ...formData, capturedByCrewMemberId: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500"
                    placeholder="Crew member ID"
                  />
                </div>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.legalGradeVerified}
                    onChange={(e) => setFormData({ ...formData, legalGradeVerified: e.target.checked })}
                    className="w-4 h-4 accent-emerald-500"
                  />
                  <span className="text-sm text-gray-300">Legal grade verified (≤10m GPS + hash)</span>
                </label>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2 px-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold rounded hover:shadow-lg disabled:opacity-50 transition"
                >
                  {loading ? 'Uploading...' : 'Upload Photo'}
                </button>
              </div>
            </form>

            {/* Chain of Custody Info */}
            <div className="mt-6 bg-slate-800 rounded-lg p-6 border border-slate-700">
              <h3 className="text-sm font-bold text-gray-300 mb-4 uppercase">Legal Requirements</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-0.5">✓</span>
                  <div>
                    <div className="font-semibold text-white">SHA-256 Hash</div>
                    <div className="text-gray-400 text-xs">Integrity verification</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-0.5">✓</span>
                  <div>
                    <div className="font-semibold text-white">GPS Coordinates</div>
                    <div className="text-gray-400 text-xs">Location proof</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-0.5">✓</span>
                  <div>
                    <div className="font-semibold text-white">Timestamp</div>
                    <div className="text-gray-400 text-xs">Proof of timing</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-0.5">✓</span>
                  <div>
                    <div className="font-semibold text-white">Chain of Custody</div>
                    <div className="text-gray-400 text-xs">Who accessed when</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Photo Gallery */}
          <div className="lg:col-span-2">
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 h-full">
              <h2 className="text-xl font-bold text-white mb-6">Photo Gallery</h2>

              {photos.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-4xl mb-2">📸</div>
                  <p className="text-gray-400">No photos uploaded yet</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                  {photos.map((photo) => (
                    <div
                      key={photo.id}
                      className="bg-slate-700 rounded-lg overflow-hidden border border-slate-600 hover:border-emerald-500 transition"
                    >
                      <div className="aspect-square bg-slate-600 flex items-center justify-center overflow-hidden">
                        <img
                          src={photo.photoUrl}
                          alt={`Photo from task ${photo.taskId}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"%3E%3Crect fill="%23374151" width="200" height="200"/%3E%3Ctext x="50%" y="50%" font-size="40" fill="%23999" text-anchor="middle" dominant-baseline="middle"%3E📸%3C/text%3E%3C/svg%3E';
                          }}
                        />
                      </div>

                      <div className="p-3">
                        <div className="text-xs font-semibold text-white mb-2">Task: {photo.taskId}</div>
                        <div className="space-y-1">
                          <div className="text-xs text-gray-400">
                            <span className="font-semibold">By:</span> {photo.capturedByCrewMemberId || 'Unknown'}
                          </div>
                          {photo.legalGradeVerified && (
                            <div className="inline-block text-xs font-semibold px-2 py-1 bg-emerald-500 bg-opacity-20 text-emerald-400 rounded">
                              ✓ Legal Grade
                            </div>
                          )}
                        </div>
                        <div className="text-xs text-gray-500 font-mono mt-2 truncate" title={photo.photoHash}>
                          {photo.photoHash.substring(0, 16)}...
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {new Date(photo.capturedAt).toLocaleString('en-ZA', {
                            timeZone: 'Africa/Johannesburg'
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
