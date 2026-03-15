import React from "react";

/**
 * Feedback component for status, error, and success messages
 * Uses ARIA live region for accessibility
 *
 * Props:
 * - type: "status" | "error" | "success"
 * - message: string
 * - className?: string
 */
export function Feedback({ type = "status", message, className = "" }: { type?: "status" | "error" | "success"; message: string; className?: string }) {
  if (!message) return null;
  let color = "";
  if (type === "error") color = "text-red-700 bg-red-100 border border-red-300";
  else if (type === "success") color = "text-green-700 bg-green-100 border border-green-300";
  else color = "text-blue-700 bg-blue-100 border border-blue-300";
  return (
    <div
      className={`rounded px-4 py-2 my-2 ${color} ${className}`}
      role={type === "error" ? "alert" : "status"}
      aria-live={type === "error" ? "assertive" : "polite"}
    >
      {message}
    </div>
  );
}