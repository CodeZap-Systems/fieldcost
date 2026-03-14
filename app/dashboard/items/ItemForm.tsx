"use client";
import { useState } from "react";

type ItemPayload = { 
  name: string; 
  price: number; 
  cost?: number;
  item_type: "physical" | "service";
  photos?: string[];
};

export default function ItemForm({ onAdd }: { onAdd: (item: ItemPayload) => Promise<boolean> }) {
  const [name, setName] = useState("");
  const [cost, setCost] = useState(0);
  const [price, setPrice] = useState(0);
  const [itemType, setItemType] = useState<ItemPayload["item_type"]>("physical");
  const [photos, setPhotos] = useState<string[]>([]);
  const [photoPreview, setPhotoPreview] = useState<string[]>([]);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSuccess("");
    setError("");
    if (!name) {
      setError("Please enter an item name.");
      return;
    }
    if (price <= 0) {
      setError("Please enter a selling price greater than 0.");
      return;
    }
    const ok = await onAdd({ 
      name, 
      cost: cost > 0 ? cost : undefined,
      price, 
      item_type: itemType,
      photos: photos.length > 0 ? photos : undefined
    });
    if (ok) {
      setSuccess("Item added!");
      setName("");
      setCost(0);
      setPrice(0);
      setItemType("physical");
      setPhotos([]);
      setPhotoPreview([]);
    } else {
      setError("Failed to add item.");
    }
  }

  const margin = price - cost;
  const marginPercent = price > 0 ? ((margin / price) * 100).toFixed(1) : 0;

  return (
    <form onSubmit={handleSubmit} className="mb-4 space-y-4 w-full max-w-2xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          className="border p-2 rounded"
          placeholder="Item Name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
        <select
          className="border p-2 rounded"
          value={itemType}
          onChange={e => setItemType(e.target.value as ItemPayload["item_type"])}
        >
          <option value="physical">Physical item</option>
          <option value="service">Service</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cost Price (R)</label>
          <input
            className="w-full border p-2 rounded"
            placeholder="0.00"
            type="number"
            min="0"
            step="0.01"
            value={cost}
            onChange={e => setCost(Number(e.target.value))}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Selling Price (R)*</label>
          <input
            className="w-full border p-2 rounded"
            placeholder="0.00"
            type="number"
            min="0"
            step="0.01"
            value={price}
            onChange={e => setPrice(Number(e.target.value))}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Margin</label>
          <div className="w-full p-2 rounded bg-gray-50 border border-gray-300 flex items-center">
            <span className="font-semibold">
              R{margin.toFixed(2)} ({marginPercent}%)
            </span>
          </div>
        </div>
      </div>

      {/* Photo Upload Section */}
      <div className="border-t pt-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Photos ({photos.length}/2)
        </label>
        
        {/* Photo Previews */}
        {photoPreview.length > 0 && (
          <div className="grid grid-cols-2 gap-4 mb-4">
            {photoPreview.map((preview, index) => (
              <div key={index} className="relative">
                <img
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-32 object-cover rounded border border-gray-300"
                />
                <button
                  type="button"
                  onClick={() => removePhoto(index)}
                  className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-700"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Upload Input */}
        {photos.length < 2 && (
          <label className="flex items-center justify-center w-full border-2 border-dashed border-gray-300 rounded p-4 cursor-pointer hover:border-blue-400 bg-gray-50">
            <div className="text-center">
              <p className="text-sm text-gray-600">Click to upload photo</p>
              <p className="text-xs text-gray-500">PNG, JPG up to {2 - photos.length} remaining</p>
            </div>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handlePhotoSelect}
              className="hidden"
            />
          </label>
        )}
      </div>

      <button className="bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700 w-full md:w-auto" type="submit">
        Add Item
      </button>
      {success && <div className="text-green-600 text-sm">{success}</div>}
      {error && <div className="text-red-600 text-sm">{error}</div>}
    </form>
  );
}
