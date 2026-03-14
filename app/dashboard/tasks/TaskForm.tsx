"use client";
import { useState } from "react";
import { InlineCreateModal } from "../../components/InlineCreateModal";

type TaskFormProps = {
  onAdd: (task: { name: string; description: string; assigned_to?: string; crew_member_id?: number | null; project_id?: number | null; billable: boolean }) => Promise<boolean>;
  crew?: { id: number; name: string; hourly_rate: number }[];
  projects?: { id: number; name: string }[];
  userId?: string;
  companyId?: string;
  onProjectAdded?: (project: { id: number; name: string }) => void;
};

export default function TaskForm({ onAdd, crew = [], projects = [], userId, companyId, onProjectAdded }: TaskFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [assigneeId, setAssigneeId] = useState("");
  const [projectId, setProjectId] = useState("");
  const [billable, setBillable] = useState(true);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [projectsList, setProjectsList] = useState(projects);

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

  const handleAddProject = async (data: { name: string; description: string }) => {
    if (!userId || !companyId) {
      return false;
    }

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          user_id: userId,
          company_id: companyId,
        }),
      });

      if (!res.ok) return false;

      const newProject = await res.json();
      const projectWithId = { id: newProject.id, name: newProject.name };
      setProjectsList((prev) => [...prev, projectWithId]);
      setProjectId(String(newProject.id));
      if (onProjectAdded) onProjectAdded(projectWithId);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <div className="mb-4 flex flex-col gap-2 w-full max-w-xl">
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
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Crew Member</label>
          <select
            className="border p-2 rounded w-full"
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
        </div>
      )}
      {projectsList.length > 0 && (
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Project</label>
            <select
              className="border p-2 rounded w-full"
              value={projectId}
              onChange={e => setProjectId(e.target.value)}
            >
              <option value="">Select project</option>
              {projectsList.map(project => (
                <option key={project.id} value={project.id}>{project.name}</option>
              ))}
            </select>
          </div>
          <button
            type="button"
            onClick={() => setShowProjectModal(true)}
            className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded border border-gray-300 text-sm font-medium self-end"
            title="Add new project"
          >
            +
          </button>
        </div>
      )}
      {projectsList.length === 0 && (
        <button
          type="button"
          onClick={() => setShowProjectModal(true)}
          className="w-full p-2 border border-dashed border-blue-300 rounded text-blue-600 hover:bg-blue-50 font-medium"
        >
          + Add Project
        </button>
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
      <button 
        className="bg-blue-600 text-white px-4 py-2 rounded min-w-[100px] hover:bg-blue-700" 
        type="button"
        onClick={handleSubmit}
      >
        Add
      </button>
      {success && <div className="text-green-600 text-sm mt-1">{success}</div>}
      {error && <div className="text-red-600 text-sm mt-1">{error}</div>}

      <InlineCreateModal
        title="Add Project"
        isOpen={showProjectModal}
        onClose={() => setShowProjectModal(false)}
        onSubmit={handleAddProject}
        fields={[
          { name: "name", label: "Project Name", required: true, placeholder: "Enter project name" },
          { name: "description", label: "Description", type: "textarea", placeholder: "Project description (optional)" },
        ]}
        submitLabel="Create Project"
      />
    </div>
  );
}
