// components/VerticalsAdmin.tsx
import React, { useEffect, useState } from 'react';

interface Vertical {
  id: string;
  name: string;
  description: string;
  customFields?: Record<string, unknown>;
  terminology?: Record<string, string>;
  [key: string]: unknown;
}

export default function VerticalsAdmin({ companyId }: { companyId: string }) {
  const [verticals, setVerticals] = useState<Vertical[]>([]);
  const [active, setActive] = useState<string[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [editConfig, setEditConfig] = useState<Vertical | null>(null);
  const [mergeMsg, setMergeMsg] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/verticals?companyId=${companyId}`)
      .then(res => res.json())
      .then(data => {
        setVerticals(data.verticals);
        setActive(data.active);
      });
  }, [companyId]);

  const toggleVertical = async (verticalId: string) => {
    if (active.includes(verticalId)) {
      await fetch(`/api/verticals?companyId=${companyId}&verticalId=${verticalId}`, { method: 'DELETE' });
    } else {
      await fetch('/api/verticals', { method: 'POST', body: JSON.stringify({ companyId, verticalId }), headers: { 'Content-Type': 'application/json' } });
    }
    // Refresh
    const data = await fetch(`/api/verticals?companyId=${companyId}`).then(res => res.json());
    setActive(data.active);
  };

  const handleEdit = (verticalId: string) => {
    const v = verticals.find(v => v.id === verticalId);
    setEditing(verticalId);
    setEditConfig(JSON.parse(JSON.stringify(v)));
    setMergeMsg(null);
  };

  const handleConfigChange = (key: string, value: unknown) => {
    if (!editConfig) return;
    setEditConfig({ ...editConfig, [key]: value });
  };

  const handleMerge = async () => {
    // Simulate merging config into company settings (in real app, call backend)
    setMergeMsg('Merged config into company settings!');
    setEditing(null);
  };

  return (
    <div>
      <h2>Industry Verticals</h2>
      <ul>
        {verticals.map((v) => (
          <li key={v.id} className="mb-2">
            <label>
              <input type="checkbox" checked={active.includes(v.id)} onChange={() => toggleVertical(v.id)} />
              <b>{v.name}</b>: {v.description}
            </label>
            {active.includes(v.id) && (
              <button className="ml-2 text-xs text-blue-600 underline" onClick={() => handleEdit(v.id)}>Edit Config</button>
            )}
          </li>
        ))}
      </ul>
      {editing && editConfig && (
        <div className="mt-4 p-4 border rounded bg-gray-50">
          <h3 className="font-semibold mb-2">Edit {editConfig.name} Config</h3>
          <div className="mb-2">
            <label className="block text-xs font-semibold">Custom Fields (JSON)</label>
            <textarea className="w-full text-xs border rounded p-1" rows={3} value={JSON.stringify(editConfig.customFields, null, 2)} onChange={e => handleConfigChange('customFields', JSON.parse(e.target.value))} />
          </div>
          <div className="mb-2">
            <label className="block text-xs font-semibold">Terminology (JSON)</label>
            <textarea className="w-full text-xs border rounded p-1" rows={2} value={JSON.stringify(editConfig.terminology, null, 2)} onChange={e => handleConfigChange('terminology', JSON.parse(e.target.value))} />
          </div>
          <button className="btn btn-primary btn-xs mr-2" onClick={handleMerge}>Merge to Company</button>
          <button className="btn btn-secondary btn-xs" onClick={() => setEditing(null)}>Cancel</button>
          {mergeMsg && <div className="text-green-600 text-xs mt-2">{mergeMsg}</div>}
        </div>
      )}
    </div>
  );
}
