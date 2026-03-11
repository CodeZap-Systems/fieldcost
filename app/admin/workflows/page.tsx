/**
 * ADMIN CMS - Workflow Builder Page
 * 
 * Create and manage custom mining/construction workflows
 */

"use client";

import React, { useState, useEffect } from "react";
import { DemoModeBanner } from "@/app/components/DemoModeBanner";
import { useCompanySwitcher } from "@/lib/useCompanySwitcher";
import { isDemoCompany } from "@/lib/demoConstants";

interface WorkflowStage {
  id: string;
  name: string;
  order: number;
  requiresPhotoEvidence: boolean;
  requiresGPSVerification: boolean;
  estimatedDurationHours: number;
}

interface CustomWorkflow {
  id: string;
  companyId: string;
  name: string;
  description: string;
  applicableTo: 'mining' | 'construction' | 'general';
  stages: WorkflowStage[];
  requiresApproval: boolean;
  approvalChain: string[];
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

export default function WorkflowsPage() {
  const { activeCompanyId } = useCompanySwitcher();
  const isDemo = isDemoCompany(activeCompanyId);
  const [workflows, setWorkflows] = useState<CustomWorkflow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingWorkflow, setEditingWorkflow] = useState<CustomWorkflow | null>(null);
  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    applicableTo: 'mining' | 'construction' | 'general';
    requiresApproval: boolean;
  }>({
    name: '',
    description: '',
    applicableTo: 'general',
    requiresApproval: true,
  });

  useEffect(() => {
    fetchWorkflows();
  }, [activeCompanyId]);

  async function fetchWorkflows() {
    try {
      const res = await fetch(`/api/admin/workflows?companyId=${activeCompanyId}`);
      const data = await res.json();
      setWorkflows(data.workflows || []);
    } catch (err) {
      console.error("Failed to fetch workflows:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    try {
      const method = editingWorkflow ? "PATCH" : "POST";
      const url = editingWorkflow ? "/api/admin/workflows" : "/api/admin/workflows";
      const body = editingWorkflow
        ? { ...formData, workflowId: editingWorkflow.id }
        : { ...formData, companyId: activeCompanyId, stages: [] };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        await fetchWorkflows();
        setShowForm(false);
        setEditingWorkflow(null);
        setFormData({
          name: '',
          description: '',
          applicableTo: 'general',
          requiresApproval: true,
        });
      }
    } catch (err) {
      console.error("Failed to save workflow:", err);
    }
  }

  async function deleteWorkflow(id: string) {
    if (confirm("Are you sure? This will deactivate the workflow.")) {
      try {
        const res = await fetch(`/api/admin/workflows?id=${id}`, {
          method: "DELETE",
        });
        if (res.ok) {
          await fetchWorkflows();
        }
      } catch (err) {
        console.error("Failed to delete workflow:", err);
      }
    }
  }

  const typeColors = {
    mining: 'bg-yellow-900 text-yellow-200',
    construction: 'bg-orange-900 text-orange-200',
    general: 'bg-blue-900 text-blue-200',
  };

  return (
    <>
      <DemoModeBanner companyId={activeCompanyId} />
      
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <div className="max-w-6xl mx-auto">
          {isDemo && (
            <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <p className="text-sm text-orange-800">
                💡 <strong>Demo Mode:</strong> Workflow changes are for testing only.
              </p>
            </div>
          )}

          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Custom Workflows</h1>
            <p className="text-gray-400">
              Create and manage mining/construction workflows for your team
            </p>
          </div>

          {/* New Workflow Button */}
          <button
            onClick={() => {
              setEditingWorkflow(null);
              setShowForm(true);
            }}
            className="mb-8 px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition"
          >
            + New Workflow
          </button>

          {/* Workflow Form */}
          {showForm && (
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 mb-8">
              <h2 className="text-xl font-bold mb-6">
                {editingWorkflow ? "Edit Workflow" : "Create New Workflow"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Workflow Name</label>
                    <input
                      type="text"
                      placeholder="e.g., Open Pit Daily Cycle"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full bg-gray-700 border border-gray-600 px-4 py-2 rounded text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Type</label>
                    <select
                      value={formData.applicableTo}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          applicableTo: e.target.value as any,
                        })
                      }
                      className="w-full bg-gray-700 border border-gray-600 px-4 py-2 rounded text-white"
                    >
                      <option value="mining">Mining</option>
                      <option value="construction">Construction</option>
                      <option value="general">General</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Description</label>
                  <textarea
                    placeholder="Describe the workflow..."
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full bg-gray-700 border border-gray-600 px-4 py-2 rounded text-white"
                    rows={3}
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="requiresApproval"
                    checked={formData.requiresApproval}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        requiresApproval: e.target.checked,
                      })
                    }
                    className="w-4 h-4 mr-3"
                  />
                  <label htmlFor="requiresApproval" className="text-sm font-semibold">
                    Requires Approval Chain
                  </label>
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="flex-1 bg-green-600 hover:bg-green-700 px-6 py-2 rounded-lg transition"
                  >
                    {editingWorkflow ? "Update Workflow" : "Create Workflow"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 bg-gray-700 hover:bg-gray-800 px-6 py-2 rounded-lg transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Workflows List */}
          {loading ? (
            <div className="text-center py-12">Loading workflows...</div>
          ) : workflows.length === 0 ? (
            <div className="text-center py-12 bg-gray-800 rounded-lg border border-gray-700">
              <p className="text-gray-400">No workflows configured yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {workflows.filter(w => w.isActive).map((workflow) => (
                <div key={workflow.id} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                  <div className="mb-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-bold">{workflow.name}</h3>
                      <span className={`px-3 py-1 text-xs rounded-full font-semibold ${
                        typeColors[workflow.applicableTo]
                      }`}>
                        {workflow.applicableTo?.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400">{workflow.description}</p>
                  </div>

                  <div className="bg-gray-900 rounded p-4 mb-4 space-y-2">
                    <p className="text-sm">
                      <strong>Stages:</strong> {workflow.stages.length}
                    </p>
                    <p className="text-sm">
                      <strong>Approval Required:</strong> {workflow.requiresApproval ? '✓ Yes' : '✗ No'}
                    </p>
                    <p className="text-xs text-gray-400">
                      Created: {new Date(workflow.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Stages Preview */}
                  <div className="mb-4">
                    <p className="text-sm font-semibold mb-2">Stages:</p>
                    <div className="space-y-2">
                      {workflow.stages.slice(0, 3).map((stage, idx) => (
                        <div key={stage.id} className="text-xs bg-gray-700 px-2 py-1 rounded flex items-center">
                          <span className="mr-2 font-bold">{idx + 1}.</span>
                          <span className="flex-1">{stage.name}</span>
                          {stage.requiresPhotoEvidence && <span className="mr-1">📸</span>}
                          {stage.requiresGPSVerification && <span>📍</span>}
                        </div>
                      ))}
                      {workflow.stages.length > 3 && (
                        <p className="text-xs text-gray-400">
                          +{workflow.stages.length - 3} more stages
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingWorkflow(workflow);
                        setFormData({
                          name: workflow.name,
                          description: workflow.description,
                          applicableTo: workflow.applicableTo,
                          requiresApproval: workflow.requiresApproval,
                        });
                        setShowForm(true);
                      }}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded text-sm transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteWorkflow(workflow.id)}
                      className="flex-1 bg-red-600 hover:bg-red-700 px-3 py-2 rounded text-sm transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
