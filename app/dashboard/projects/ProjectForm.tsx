"use client";
import { useState } from "react";

interface ProjectFormProps {
  onAdd: (project: { name: string; description: string; planned_budget?: number; actual_budget?: number }) => Promise<boolean>;
  disabled?: boolean;
  limit?: number;
}

export default function ProjectForm({ onAdd, disabled, limit = 3 }: ProjectFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [plannedBudget, setPlannedBudget] = useState<number | "">("");
  const [actualBudget, setActualBudget] = useState<number | "">("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSuccess("");
    setError("");
    if (!name) {
      setError("Project name is required.");
      return;
    }
    const ok = await onAdd({ name, description, planned_budget: plannedBudget === "" ? undefined : Number(plannedBudget), actual_budget: actualBudget === "" ? undefined : Number(actualBudget) });
    if (ok) {
      setSuccess("Project added!");
      setName("");
      setDescription("");
      setPlannedBudget("");
      setActualBudget("");
    } else {
      setError("Failed to add project.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-4 flex flex-col gap-2 w-full max-w-xl">
      <input
        className="border p-2 rounded"
        placeholder="Project Name"
        value={name}
        onChange={e => setName(e.target.value)}
        required
        disabled={disabled}
      />
      <input
        className="border p-2 rounded"
        placeholder="Description"
        value={description}
        onChange={e => setDescription(e.target.value)}
        disabled={disabled}
      />
      <input
        className="border p-2 rounded"
        type="number"
        min="0"
        placeholder="Planned Budget (R)"
        value={plannedBudget}
        onChange={e => setPlannedBudget(e.target.value === "" ? "" : Number(e.target.value))}
        disabled={disabled}
      />
      <input
        className="border p-2 rounded"
        type="number"
        min="0"
        placeholder="Actual Budget (R)"
        value={actualBudget}
        onChange={e => setActualBudget(e.target.value === "" ? "" : Number(e.target.value))}
        disabled={disabled}
      />
      <button className="bg-blue-600 text-white px-3 py-1 rounded" type="submit" disabled={disabled}>Add</button>
      {success && <div className="text-green-600 text-sm mt-1">{success}</div>}
      {error && <div className="text-red-600 text-sm mt-1">{error}</div>}
      {disabled && <div className="text-yellow-600 text-sm mt-1">Project limit reached ({limit})</div>}
    </form>
  );
}
