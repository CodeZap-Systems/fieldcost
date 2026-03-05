"use client";
import { useState, useRef } from "react";

export default function Timer() {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  function start() {
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
    if (intervalRef.current) clearInterval(intervalRef.current);
  }

  return (
    <div className="mb-4">
      <div className="text-lg font-mono">{Math.floor(seconds / 60)}:{(seconds % 60).toString().padStart(2, "0")}</div>
      <button className="bg-green-600 text-white px-3 py-1 rounded mr-2" onClick={start} disabled={running}>Start</button>
      <button className="bg-yellow-500 text-white px-3 py-1 rounded mr-2" onClick={stop} disabled={!running}>Stop</button>
      <button className="bg-gray-500 text-white px-3 py-1 rounded" onClick={reset}>Reset</button>
    </div>
  );
}
