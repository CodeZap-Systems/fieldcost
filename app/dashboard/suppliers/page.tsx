"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ensureClientUserId } from "../../../lib/clientUser";
import { SupplierForm, type SupplierFormData, type Supplier } from "./SupplierForm";
import { SupplierList } from "./SupplierList";

function SuppliersPageContent() {
  const userId = ensureClientUserId();
  const searchParams = useSearchParams();
  const companyId = searchParams.get("company_id") || "1";

  const [view, setView] = useState<"list" | "create" | "edit">("list");
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [successMessage, setSuccessMessage] = useState<string>("");

  const handleCreateSupplier = async (data: SupplierFormData): Promise<boolean> => {
    try {
      const res = await fetch("/api/suppliers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, user_id: userId }),
      });

      if (res.ok) {
        setSuccessMessage("Supplier added successfully!");
        setView("list");
        setTimeout(() => setSuccessMessage(""), 3000);
        return true;
      } else {
        const error = await res.json();
        console.error("Error creating supplier:", error);
        return false;
      }
    } catch (err) {
      console.error("Exception creating supplier:", err);
      return false;
    }
  };

  const handleUpdateSupplier = async (data: any) => {
    if (!selectedSupplier) return false;

    try {
      const res = await fetch(`/api/suppliers?id=${selectedSupplier.id}&user_id=${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setSuccessMessage("Supplier updated successfully!");
        setView("list");
        setTimeout(() => setSuccessMessage(""), 3000);
        return true;
      } else {
        const error = await res.json();
        console.error("Error updating supplier:", error);
        return false;
      }
    } catch (err) {
      console.error("Exception updating supplier:", err);
      return false;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {successMessage && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
          {successMessage}
        </div>
      )}

      {view === "list" && (
        <SupplierList
          companyId={companyId}
          onCreateNew={() => {
            setSelectedSupplier(null);
            setView("create");
          }}
          onSelectSupplier={(supplier) => {
            setSelectedSupplier(supplier);
            setView("edit");
          }}
        />
      )}

      {view === "create" && (
        <SupplierForm
          companyId={companyId}
          onSubmit={handleCreateSupplier}
          onCancel={() => setView("list")}
        />
      )}

      {view === "edit" && selectedSupplier && (
        <SupplierForm
          existingSupplier={selectedSupplier}
          companyId={companyId}
          onSubmit={handleUpdateSupplier}
          onCancel={() => setView("list")}
        />
      )}
    </div>
  );
}

export default function SuppliersPage() {
  return (
    <Suspense fallback={<div className="p-6 text-center">Loading...</div>}>
      <SuppliersPageContent />
    </Suspense>
  );
}
