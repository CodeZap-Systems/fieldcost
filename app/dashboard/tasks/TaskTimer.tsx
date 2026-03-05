"use client";
import { useState, useRef } from "react";

export default function TaskTimer({ onSave }: { onSave: (task: { name: string; seconds: number }) => Promise<boolean> }) {
  const [taskName, setTaskName] = useState("");
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  function start() {
    setSuccess("");
    setError("");
    if (!running) {
      setRunning(true);
      intervalRef.current = setInterval(() => setSeconds(s => s + 1), 1000);
    }
  }
  function stop() {
    setRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }
  function reset() {
    setSeconds(0);
    setRunning(false);
    setSuccess("");
    setError("");
    if (intervalRef.current) clearInterval(intervalRef.current);
  }
  async function saveTask() {
    setSuccess("");
    setError("");
    if (!taskName) {
      setError("Please enter a task name.");
      return;
    }
    if (seconds === 0) {
      setError("Please track some time before saving.");
      return;
    }
    const ok = await onSave({ name: taskName, seconds });
    if (ok) {
      setSuccess("Task saved!");
      setTaskName("");
      setSeconds(0);
      setRunning(false);
      if (intervalRef.current) clearInterval(intervalRef.current);
    } else {
      setError("Failed to save task.");
    }
  }

  return (
    <div className="mb-4 flex flex-col sm:flex-row items-center gap-2 w-full max-w-xl">
      <input
        className="border p-2 rounded flex-1"
        placeholder="Task Name"
        value={taskName}
        onChange={e => setTaskName(e.target.value)}
      />
      <span className="text-lg font-mono mr-2">{Math.floor(seconds / 60)}:{(seconds % 60).toString().padStart(2, "0")}</span>
      <button className="bg-green-600 text-white px-3 py-1 rounded mr-2" onClick={start} disabled={running}>Start</button>
      <button className="bg-yellow-500 text-white px-3 py-1 rounded mr-2" onClick={stop} disabled={!running}>Stop</button>
      <button className="bg-gray-500 text-white px-3 py-1 rounded mr-2" onClick={reset}>Reset</button>
      <button className="bg-blue-600 text-white px-3 py-1 rounded" onClick={saveTask} disabled={!taskName || seconds === 0}>Save</button>
      {success && <div className="text-green-600 text-sm mt-1">{success}</div>}
      {error && <div className="text-red-600 text-sm mt-1">{error}</div>}
    </div>
  );
}
