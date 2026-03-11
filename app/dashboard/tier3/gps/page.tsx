'use client';

import { useState } from 'react';
import Link from 'next/link';

interface GPSLocation {
  id: string;
  taskId: string;
  crewMemberId: string;
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: string;
}

export default function Tier3GPS() {
  const [locations, setLocations] = useState<GPSLocation[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    taskId: '',
    crewMemberId: '',
    latitude: '',
    longitude: '',
    accuracy: '5',
  });
  const [validationError, setValidationError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');
    setLoading(true);

    const lat = parseFloat(formData.latitude);
    const lon = parseFloat(formData.longitude);
    const acc = parseFloat(formData.accuracy);

    // Validate GPS coordinates
    if (lat < -90 || lat > 90) {
      setValidationError('Latitude must be between -90 and 90');
      setLoading(false);
      return;
    }

    if (lon < -180 || lon > 180) {
      setValidationError('Longitude must be between -180 and 180');
      setLoading(false);
      return;
    }

    if (acc > 10) {
      setValidationError('GPS accuracy must be ≤10m for legal defensibility');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/tier3/gps-tracking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskId: formData.taskId,
          crewMemberId: formData.crewMemberId,
          latitude: lat,
          longitude: lon,
          accuracy: acc,
        }),
      });

      if (response.ok) {
        const newLocation = await response.json();
        setLocations([newLocation, ...locations]);
        setFormData({
          taskId: '',
          crewMemberId: '',
          latitude: '',
          longitude: '',
          accuracy: '5',
        });
      } else {
        const error = await response.json();
        setValidationError(error.error || 'Failed to record GPS location');
      }
    } catch (error) {
      setValidationError(error instanceof Error ? error.message : 'Error recording GPS location');
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
          <h1 className="text-4xl font-bold text-white">GPS Tracking</h1>
          <p className="text-gray-400 mt-2">Sub-10m accuracy crew location verification with offline support</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* GPS Input Form */}
          <div className="lg:col-span-1">
            <form onSubmit={handleSubmit} className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <h2 className="text-xl font-bold text-white mb-6">Record Location</h2>

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
                  <label className="block text-sm font-medium text-gray-300 mb-2">Crew Member ID</label>
                  <input
                    type="text"
                    value={formData.crewMemberId}
                    onChange={(e) => setFormData({ ...formData, crewMemberId: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500"
                    placeholder="Crew ID"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Latitude</label>
                    <input
                      type="number"
                      step="any"
                      value={formData.latitude}
                      onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500"
                      placeholder="-90 to 90"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Longitude</label>
                    <input
                      type="number"
                      step="any"
                      value={formData.longitude}
                      onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500"
                      placeholder="-180 to 180"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    GPS Accuracy (meters, max 10)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    max="10"
                    value={formData.accuracy}
                    onChange={(e) => setFormData({ ...formData, accuracy: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500"
                    placeholder="5 (meters)"
                    required
                  />
                  <p className="text-xs text-gray-400 mt-1">Must be ≤10m for legal defensibility</p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2 px-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold rounded hover:shadow-lg disabled:opacity-50 transition"
                >
                  {loading ? 'Recording...' : 'Record Location'}
                </button>
              </div>
            </form>

            {/* GPS Standards */}
            <div className="mt-6 bg-slate-800 rounded-lg p-6 border border-slate-700">
              <h3 className="text-sm font-bold text-gray-300 mb-4 uppercase">Legal Standards</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <div className="font-semibold text-emerald-400">✓ Legal Grade (≤10m)</div>
                  <div className="text-gray-400">Court-admissible evidence</div>
                </div>
                <div>
                  <div className="font-semibold text-yellow-400">⚠ Standard (10-50m)</div>
                  <div className="text-gray-400">General verification only</div>
                </div>
                <div>
                  <div className="font-semibold text-red-400">✗ Low Accuracy ({`>`}50m)</div>
                  <div className="text-gray-400">Not suitable for disputes</div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Locations */}
          <div className="lg:col-span-2">
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 h-full">
              <h2 className="text-xl font-bold text-white mb-6">Recent Locations</h2>

              {locations.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-4xl mb-2">🛰️</div>
                  <p className="text-gray-400">No GPS locations recorded yet</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {locations.map((loc) => (
                    <div
                      key={loc.id}
                      className="bg-slate-700 rounded-lg p-4 border border-slate-600 hover:border-emerald-500 transition"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="text-sm font-semibold text-white">Task: {loc.taskId}</div>
                          <div className="text-xs text-gray-400">Crew: {loc.crewMemberId}</div>
                        </div>
                        <div className={`text-xs font-semibold px-2 py-1 rounded ${
                          loc.accuracy <= 10
                            ? 'bg-emerald-500 bg-opacity-20 text-emerald-400'
                            : loc.accuracy <= 50
                            ? 'bg-yellow-500 bg-opacity-20 text-yellow-400'
                            : 'bg-red-500 bg-opacity-20 text-red-400'
                        }`}>
                          {loc.accuracy}m ± 
                        </div>
                      </div>

                      <div className="text-xs text-gray-400 font-mono">
                        {loc.latitude.toFixed(6)}, {loc.longitude.toFixed(6)}
                      </div>

                      <div className="text-xs text-gray-500 mt-2">
                        {new Date(loc.timestamp).toLocaleString()}
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
