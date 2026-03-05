"use client";
import { useState } from "react";

interface TaskPhotoUploadProps {
  taskId: number;
  onUploaded: (url: string) => void;
}

export default function TaskPhotoUpload({ taskId, onUploaded }: TaskPhotoUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const input = e.target;
    const file = input.files?.[0];
    if (!file) return;
    setUploading(true);
    setMessage(null);
    try {
      const payload = new FormData();
      payload.append("taskId", String(taskId));
      payload.append("file", file);
      const response = await fetch("/api/task-photos", {
        method: "POST",
        body: payload,
      });
      type UploadResponse = { publicUrl?: string; error?: string };
      const result = (await response.json().catch(() => ({}))) as UploadResponse;
      if (!response.ok || !result?.publicUrl) {
        throw new Error(result?.error || "Unable to upload photo");
      }
      onUploaded(result.publicUrl);
      setMessage("Photo attached");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setMessage(`Upload failed: ${err.message}`);
      } else {
        setMessage("Upload failed");
      }
    } finally {
      setUploading(false);
      input.value = "";
    }
  }

  return (
    <label className="text-sm font-medium text-indigo-600 cursor-pointer">
      <span className="underline">Upload photo</span>
      <input
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
        disabled={uploading}
      />
      {uploading && <span className="ml-2 text-gray-500">Uploading...</span>}
      {message && <div className="text-xs text-gray-500 mt-1">{message}</div>}
    </label>
  );
}
