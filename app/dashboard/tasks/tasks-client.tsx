'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { readActiveCompanyId } from '@/lib/companySwitcher';

interface Task {
  id: number;
  title: string;
  project_id: number;
  status: string;
  due_date: string;
}

export function TasksClient() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTasks() {
      try {
        const companyId = readActiveCompanyId() || '8';
        const res = await fetch(`/api/tasks?company_id=${companyId}`);
        if (!res.ok) throw new Error('Failed to fetch tasks');
        const data = await res.json();
        setTasks(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        setTasks([]);
      } finally {
        setLoading(false);
      }
    }
    
    fetchTasks();
  }, []);

  if (loading) {
    return <div className="text-center py-12 text-gray-500">Loading tasks...</div>;
  }

  if (error) {
    return <div className="text-center py-12 text-red-500">Error: {error}</div>;
  }

  if (!tasks.length) {
    return (
      <div className="bg-white rounded shadow-md p-6">
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No tasks yet. Create your first task!</p>
          <Link href="/dashboard/tasks/add" className="text-indigo-600 hover:underline">
            Create a task
          </Link>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-gray-100 text-gray-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded shadow-md overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Title</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Due Date</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {tasks.map((task) => (
            <tr key={task.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 font-medium text-gray-900">{task.title}</td>
              <td className="px-6 py-4">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(task.status)}`}>
                  {task.status}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">
                {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'N/A'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
