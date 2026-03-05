"use client";
import KanbanBoard from "./tasks/KanbanBoard";
import React from "react";
import { ensureClientUserId } from "../../lib/clientUser";

export default function KanbanWidget() {
  // Load real user tasks for Kanban
  const [tasks, setTasks] = React.useState([]);
  React.useEffect(() => {
    let active = true;
    async function fetchTasks() {
      try {
        const userId = await ensureClientUserId();
        const res = await fetch(`/api/tasks?user_id=${userId}`);
        if (!res.ok || !active) return;
        const data = await res.json();
        if (active) setTasks(data || []);
      } catch (err) {
        console.error("Failed to load kanban tasks", err);
      }
    }
    fetchTasks();
    return () => {
      active = false;
    };
  }, []);
  return (
    <div className="bg-white rounded shadow p-4 h-full flex flex-col">
      <div className="font-semibold mb-2">Kanban Board</div>
      <KanbanBoard tasks={tasks} onStatusChange={() => {}} />
    </div>
  );
}