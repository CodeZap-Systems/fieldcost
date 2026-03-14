"use client";
import { useState } from "react";

interface TaskPhotoUploadProps {
  taskId: number;
  onUploaded: (url: string) => void;
}

export default function TaskPhotoUpload({ taskId, onUploaded }: TaskPhotoUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [photos, setPhotos] = useState<string[]>([]);
  const [photoPreview, setPhotoPreview] = useState<string[]>([]);

  function handlePhotoSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;

    // Allow up to 2 photos
    const remainingSlots = 2 - photos.length;
    const filesToAdd = Array.from(files).slice(0, remainingSlots);

    for (const file of filesToAdd) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setPhotos(prev => [...prev, result]);
        setPhotoPreview(prev => [...prev, result]);
      };
      reader.readAsDataURL(file);
    }

    e.target.value = "";
  }

  function removePhoto(index: number) {
    setPhotos(prev => prev.filter((_, i) => i !== index));
    setPhotoPreview(prev => prev.filter((_, i) => i !== index));
  }

  async function uploadPhoto(photoData: string, index: number) {
    setUploading(true);
    setMessage(null);
    try {
      // Convert base64 to blob
      const response = await fetch(photoData);
      const blob = await response.blob();
      const file = new File([blob], `photo-${index}.jpg`, { type: "image/jpeg" });

      const payload = new FormData();
      payload.append("taskId", String(taskId));
      payload.append("file", file);

      const uploadResponse = await fetch("/api/task-photos", {
        method: "POST",
        body: payload,
      });

      type UploadResponse = { publicUrl?: string; error?: string };
      const result = (await uploadResponse.json().catch(() => ({}))) as UploadResponse;

      if (!uploadResponse.ok || !result?.publicUrl) {
        throw new Error(result?.error || "Unable to upload photo");
      }

      onUploaded(result.publicUrl);
      setMessage("Photo attached ✓");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setMessage(`Upload failed: ${err.message}`);
      } else {
        setMessage("Upload failed");
      }
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-indigo-600">
        Photos ({photos.length}/2)
      </p>

      {/* Photo Previews */}
      {photoPreview.length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          {photoPreview.map((preview, index) => (
            <div key={index} className="relative">
              <img
                src={preview}
                alt={`Preview ${index + 1}`}
                className="w-full h-24 object-cover rounded border border-gray-300"
              />
              <button
                type="button"
                onClick={() => removePhoto(index)}
                className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-700"
              >
                ×
              </button>
              <button
                type="button"
                onClick={() => uploadPhoto(preview, index)}
                disabled={uploading}
                className="absolute bottom-1 left-1 right-1 bg-blue-600 text-white text-xs px-2 py-1 rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {uploading ? "Uploading..." : "Upload"}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload Input */}
      {photos.length < 2 && (
        <label className="flex items-center justify-center w-full border-2 border-dashed border-indigo-300 rounded p-3 cursor-pointer hover:border-indigo-500 bg-indigo-50">
          <div className="text-center">
            <p className="text-sm font-medium text-indigo-600">Click to upload</p>
            <p className="text-xs text-indigo-500">{2 - photos.length} remaining</p>
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoSelect}
            disabled={uploading}
            className="hidden"
          />
        </label>
      )}

      {message && (
        <div className={`text-xs ${message.includes("failed") ? "text-red-600" : "text-green-600"}`}>
          {message}
        </div>
      )}
    </div>
  );
}
