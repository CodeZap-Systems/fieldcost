// components/WorkflowBuilder.tsx
import React, { useEffect, useState } from "react";
import { WorkflowDefinition, WorkflowStep } from "@/lib/WorkflowDefinition";
import { v4 as uuidv4 } from "uuid";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { Button } from "./Button";
import { FormField } from "./FormField";
import { ConfirmDialog } from "./ConfirmDialog";

const stepTypes = ["approval", "notification", "condition", "action"];

export default function WorkflowBuilder({ companyId = "demo-company" }: { companyId?: string }) {
  const [workflows, setWorkflows] = useState<WorkflowDefinition[]>([]);
  const [selected, setSelected] = useState<WorkflowDefinition | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [confirmOpen, setConfirmOpen] = useState(false);
    const handleDeleteWorkflow = async () => {
      if (!selected) return;
      setSaving(true);
      setError(null);
      try {
        const res = await fetch(`/api/workflows?companyId=${selected.companyId}&id=${selected.id}`, {
          method: "DELETE",
        });
        if (!res.ok) throw new Error("Failed to delete workflow");
        setWorkflows(ws => ws.filter(w => w.id !== selected.id));
        setSelected(null);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setSaving(false);
        setConfirmOpen(false);
      }
    };
  useEffect(() => {
    setLoading(true);
    fetch(`/api/workflows?companyId=${companyId}`)
      .then(res => res.json())
      .then(setWorkflows)
      .catch(() => setWorkflows([]))
      .finally(() => setLoading(false));
  }, [companyId]);

  const handleSelect = (id: string) => {
    setSelected(workflows.find(w => w.id === id) || null);
  };

  const handleAddWorkflow = () => {
    const wf: WorkflowDefinition = {
      id: uuidv4(),
      companyId,
      name: `Workflow ${workflows.length + 1}`,
      steps: [],
      triggers: [],
      isActive: true,
    };
    setWorkflows([...workflows, wf]);
    setSelected(wf);
  };

  const handleAddStep = () => {
    if (!selected) return;
    const step: WorkflowStep = {
      id: uuidv4(),
      name: `Step ${selected.steps.length + 1}`,
      type: "approval",
      assignedRole: "",
      actions: [],
      nextStepIds: [],
    };
    setSelected({ ...selected, steps: [...selected.steps, step] });
  };

  const handleStepChange = (idx: number, key: keyof WorkflowStep, value: any) => {
    if (!selected) return;
    const steps = [...selected.steps];
    steps[idx] = { ...steps[idx], [key]: value };
    setSelected({ ...selected, steps });
  };


  const handleReorder = (from: number, to: number) => {
    if (!selected) return;
    const steps = [...selected.steps];
    const [moved] = steps.splice(from, 1);
    steps.splice(to, 0, moved);
    setSelected({ ...selected, steps });
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination || !selected) return;
    handleReorder(result.source.index, result.destination.index);
  };

  const handleSave = async () => {
    if (!selected) return;
    setSaving(true);
    setError(null);
    try {
      await fetch("/api/workflows", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selected),
      });
      setWorkflows(ws => ws.map(w => (w.id === selected.id ? selected : w)));
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div aria-busy={loading || saving} aria-live="polite">
      <h2 className="text-xl font-semibold mb-2">Workflow Builder (No-Code)</h2>
      <div className="flex gap-6">
        <div className="w-1/3">
          <Button variant="primary" className="mb-2" onClick={handleAddWorkflow} aria-label="Add new workflow">+ New Workflow</Button>
          {loading ? (
            <div className="text-gray-400">Loading workflows...</div>
          ) : (
            <ul>
              {workflows.map(w => (
                <li key={w.id}>
                  <Button
                    variant={selected?.id === w.id ? "secondary" : "icon"}
                    className={`block w-full text-left px-2 py-1 rounded ${selected?.id === w.id ? 'bg-blue-100' : ''}`}
                    onClick={() => handleSelect(w.id)}
                    aria-label={`Select workflow ${w.name}`}
                  >
                    {w.name}
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="flex-1">
          {selected ? (
            <div>
              <FormField label="Workflow Name" htmlFor="workflowName">
                <input
                  id="workflowName"
                  className="input mb-2"
                  value={selected.name}
                  onChange={e => setSelected({ ...selected, name: e.target.value })}
                  aria-required="true"
                />
              </FormField>
              <div className="flex gap-2 mb-2">
                <Button variant="secondary" onClick={handleAddStep} aria-label="Add workflow step">+ Add Step</Button>
                <Button
                  variant="danger"
                  onClick={() => setConfirmOpen(true)}
                  disabled={saving}
                  aria-label="Delete workflow"
                >
                  Delete Workflow
                </Button>
              </div>
                            <ConfirmDialog
                              open={confirmOpen}
                              title="Delete Workflow"
                              message="Are you sure you want to delete this workflow? This cannot be undone."
                              confirmLabel="Delete"
                              cancelLabel="Cancel"
                              onConfirm={handleDeleteWorkflow}
                              onCancel={() => setConfirmOpen(false)}
                            />
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="steps">
                  {(provided) => (
                    <ul ref={provided.innerRef} {...provided.droppableProps}>
                      {selected.steps.map((step, idx) => (
                        <Draggable key={step.id} draggableId={step.id} index={idx}>
                          {(provided) => (
                            <li
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="flex items-center gap-2 mb-2"
                              tabIndex={0}
                              aria-label={`Step ${idx + 1}: ${step.name}`}
                            >
                              <span className="cursor-move" title="Drag to reorder" aria-label="Drag to reorder">☰</span>
                              <input
                                className="input w-32"
                                value={step.name}
                                onChange={e => handleStepChange(idx, "name", e.target.value)}
                                aria-label="Step name"
                              />
                              <select
                                className="input w-28"
                                value={step.type}
                                onChange={e => handleStepChange(idx, "type", e.target.value)}
                                aria-label="Step type"
                              >
                                {stepTypes.map(t => <option key={t} value={t}>{t}</option>)}
                              </select>
                              <input
                                className="input w-24"
                                placeholder="Role"
                                value={step.assignedRole || ""}
                                onChange={e => handleStepChange(idx, "assignedRole", e.target.value)}
                                aria-label="Assigned role"
                              />
                              <Button
                                variant="icon"
                                className="btn-xs"
                                disabled={idx === 0}
                                onClick={() => handleReorder(idx, idx - 1)}
                                aria-label="Move step up"
                              >↑</Button>
                              <Button
                                variant="icon"
                                className="btn-xs"
                                disabled={idx === selected.steps.length - 1}
                                onClick={() => handleReorder(idx, idx + 1)}
                                aria-label="Move step down"
                              >↓</Button>
                            </li>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </ul>
                  )}
                </Droppable>
              </DragDropContext>
              {error && <div className="text-red-600 text-sm" role="alert">{error}</div>}
              <Button
                variant="primary"
                className="mt-2"
                onClick={handleSave}
                loading={saving}
                disabled={saving}
                aria-label="Save workflow"
              >
                {saving ? "Saving..." : "Save Workflow"}
              </Button>
            </div>
          ) : (
            <div className="text-gray-500">Select a workflow to edit or create a new one.</div>
          )}
        </div>
      </div>
    </div>
  );
}
