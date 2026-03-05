"use client";
import { useState, useEffect } from "react";

type BudgetActualProps = {
  projectId: number;
  userId: string | null;
};

export default function BudgetActual({ projectId, userId }: BudgetActualProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [planned, setPlanned] = useState(0);
  const [actual, setActual] = useState(0);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    setError("");
    fetch(`/api/budgets?projectId=${projectId}&user_id=${userId}`)
      .then(res => res.json())
      .then(data => {
        setPlanned(data?.planned_amount || 0);
        setActual(data?.actual_amount || 0);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load budget");
        setLoading(false);
      });
  }, [projectId, userId]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!userId) {
      setError("Resolving user context...");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/budgets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ project_id: projectId, planned_amount: planned, actual_amount: actual, user_id: userId }),
      });
      if (!res.ok) throw new Error();
      await res.json();
      setLoading(false);
    } catch {
      setError("Failed to save budget");
      setLoading(false);
    }
  }

  return (
    <div className="bg-white rounded shadow p-4 mb-4 max-w-xl">
      <h2 className="font-bold mb-2 text-lg">Budget vs Actual</h2>
      {!userId && <div className="text-sm text-gray-600">Preparing user workspace…</div>}
      {loading && <div className="text-blue-600">Loading...</div>}
      {error && <div className="text-red-600">{error}</div>}
      <form onSubmit={handleSave} className="flex flex-col gap-2">
        <label className="font-semibold">Planned Budget (R):
          <input className="border p-2 rounded w-full" type="number" min="0" value={planned} onChange={e => setPlanned(Number(e.target.value))} required />
        </label>
        <label className="font-semibold">Actual Spend (R):
          <input className="border p-2 rounded w-full" type="number" min="0" value={actual} onChange={e => setActual(Number(e.target.value))} required />
        </label>
        <button className="bg-blue-600 text-white px-4 py-2 rounded mt-2 self-end" type="submit">Save</button>
      </form>
      <div className="mt-2 text-sm text-gray-700">Difference: <span className={actual > planned ? 'text-red-600' : 'text-green-600'}>R{(planned - actual).toFixed(2)}</span></div>
    </div>
  );
}
