"use client";
import { useState } from "react";
import { supabase } from "../../../lib/supabaseClient";

export default function PhotoUpload({ projectId, onUpload }: { projectId: number, onUpload: (url: string) => void }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    const filePath = `projects/${projectId}/${Date.now()}_${file.name}`;
    const { error: uploadError } = await supabase.storage.from("photos").upload(filePath, file);
    if (uploadError) {
      setError("Upload failed: " + uploadError.message);
      setUploading(false);
      return;
    }
    const { data } = supabase.storage.from("photos").getPublicUrl(filePath);
    onUpload(data.publicUrl);
    setUploading(false);
  }

  return (
    <div className="my-2">
      <input type="file" accept="image/*" onChange={handleFileChange} disabled={uploading} />
      {uploading && <span className="ml-2 text-blue-600">Uploading...</span>}
      {error && <div className="text-red-600 text-sm mt-1">{error}</div>}
    </div>
  );
}
