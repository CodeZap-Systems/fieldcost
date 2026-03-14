'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { readActiveCompanyId } from '@/lib/companySwitcher';

interface Project {
  id: number;
  name: string;
  status: string;
  start_date: string;
  end_date: string;
}

export function ProjectsClient() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const companyId = readActiveCompanyId() || '8';
        const res = await fetch(`/api/projects?company_id=${companyId}`);
        if (!res.ok) throw new Error('Failed to fetch projects');
        const data = await res.json();
        setProjects(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        setProjects([]);
      } finally {
        setLoading(false);
      }
    }
    
    fetchProjects();
  }, []);

  if (loading) {
    return <div className="text-center py-12 text-gray-500">Loading projects...</div>;
  }

  if (error) {
    return <div className="text-center py-12 text-red-500">Error: {error}</div>;
  }

  if (!projects.length) {
    return (
      <div className="bg-white rounded shadow-md p-6">
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No projects yet. Create your first project!</p>
          <Link href="/dashboard/projects/add" className="text-indigo-600 hover:underline">
            Create a project
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded shadow-md overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Project Name</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Start Date</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">End Date</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {projects.map((project) => (
            <tr key={project.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 font-medium text-gray-900">{project.name}</td>
              <td className="px-6 py-4">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                  {project.status || 'active'}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">{new Date(project.start_date).toLocaleDateString()}</td>
              <td className="px-6 py-4 text-sm text-gray-600">{new Date(project.end_date).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
