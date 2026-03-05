"use client";
import { useState } from "react";

type TaskFormProps = {
  onAdd: (task: { name: string; description: string; assigned_to?: string; crew_member_id?: number | null; project_id?: number | null; billable: boolean }) => Promise<boolean>;
  crew?: { id: number; name: string; hourly_rate: number }[];
  projects?: { id: number; name: string }[];
};

export default function TaskForm({ onAdd, crew = [], projects = [] }: TaskFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [assigneeId, setAssigneeId] = useState("");
  const [projectId, setProjectId] = useState("");
  const [billable, setBillable] = useState(true);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSuccess("");
    setError("");
    if (!name) {
      setError("Task name is required.");
      return;
    }
    const selectedCrew = crew.find(member => member.id === Number(assigneeId));
    const ok = await onAdd({
      name,
      description,
      assigned_to: selectedCrew?.name,
      crew_member_id: selectedCrew?.id ?? null,
      project_id: projectId ? Number(projectId) : null,
      billable,
    });
    if (ok) {
      setSuccess("Task added!");
      setName("");
      setDescription("");
      setAssigneeId("");
      setProjectId("");
      setBillable(true);
    } else {
      setError("Failed to add task.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-4 flex flex-col gap-2 w-full max-w-xl">
      <input
        className="border p-2 rounded"
        placeholder="Task Name"
        value={name}
        onChange={e => setName(e.target.value)}
        required
      />
      <input
        className="border p-2 rounded"
        placeholder="Description"
        value={description}
        onChange={e => setDescription(e.target.value)}
      />
      {crew.length > 0 && (
        <select
          className="border p-2 rounded"
          value={assigneeId}
          onChange={e => setAssigneeId(e.target.value)}
        >
          <option value="">Select crew member</option>
          {crew.map(member => (
            <option key={member.id} value={member.id}>
              {member.name} — R{Number(member.hourly_rate || 0).toFixed(0)}/hr
            </option>
          ))}
        </select>
      )}
      {projects.length > 0 && (
        <select
          className="border p-2 rounded"
          value={projectId}
          onChange={e => setProjectId(e.target.value)}
        >
          <option value="">Select project</option>
          {projects.map(project => (
            <option key={project.id} value={project.id}>{project.name}</option>
          ))}
        </select>
      )}
      <div className="flex items-center gap-4 text-sm">
        <span className="font-semibold">Task type</span>
        <label className="inline-flex items-center gap-1">
          <input type="radio" name="billable" value="billable" checked={billable} onChange={() => setBillable(true)} />
          Billable
        </label>
        <label className="inline-flex items-center gap-1">
          <input type="radio" name="billable" value="non-billable" checked={!billable} onChange={() => setBillable(false)} />
          Non-billable
        </label>
      </div>
      <button className="bg-blue-600 text-white px-4 py-2 rounded min-w-[100px]" type="submit">Add</button>
      {success && <div className="text-green-600 text-sm mt-1">{success}</div>}
      {error && <div className="text-red-600 text-sm mt-1">{error}</div>}
    </form>
  );
}
