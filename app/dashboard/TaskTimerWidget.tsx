"use client";
import React, { useState } from "react";
import TaskTimer from "./tasks/TaskTimer";
import Timer from "../dashboard/customers/Timer";

export default function TaskTimerWidget() {
  const [mode, setMode] = useState<'stopwatch' | 'timer'>("stopwatch");

  return (
    <div className="bg-white rounded shadow p-4 h-full flex flex-col items-center">
      <div className="font-semibold mb-2">Time Tracking</div>
      <div className="flex gap-2 mb-4">
        <button
          className={`px-4 py-2 rounded-l font-bold ${mode === 'stopwatch' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          onClick={() => setMode('stopwatch')}
        >
          Stopwatch
        </button>
        <button
          className={`px-4 py-2 rounded-r font-bold ${mode === 'timer' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          onClick={() => setMode('timer')}
        >
          Timer
        </button>
      </div>
      {mode === 'stopwatch' ? (
        <TaskTimer onSave={async () => true} />
      ) : (
        <Timer />
      )}
    </div>
  );
}