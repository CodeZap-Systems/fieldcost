"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { ensureClientUserId } from "../../../lib/clientUser";
import { PurchaseOrderForm } from "./PurchaseOrderForm";
import { PurchaseOrderList } from "./PurchaseOrderList";

export default function PurchaseOrdersPage() {
  const userId = ensureClientUserId();
  const searchParams = useSearchParams();
  const companyId = searchParams.get("company_id") || "1";

  const [view, setView] = useState<"list" | "create" | "edit">("list");
  const [selectedPO, setSelectedPO] = useState<any>(null);
  const [successMessage, setSuccessMessage] = useState<string>("");

  const handleCreatePO = async (data: any) => {
    try {
      const res = await fetch("/api/purchase-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, user_id: userId }),
      });

      if (res.ok) {
        setSuccessMessage("Purchase order created successfully!");
        setView("list");
        setTimeout(() => setSuccessMessage(""), 3000);
        return true;
      } else {
        const error = await res.json();
        console.error("Error creating PO:", error);
        return false;
      }
    } catch (err) {
      console.error("Exception creating PO:", err);
      return false;
    }
  };

  const handleUpdatePO = async (data: any) => {
    if (!selectedPO) return false;

    try {
      const res = await fetch(`/api/purchase-orders?id=${selectedPO.id}&user_id=${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setSuccessMessage("Purchase order updated successfully!");
        setView("list");
        setTimeout(() => setSuccessMessage(""), 3000);
        return true;
      } else {
        const error = await res.json();
        console.error("Error updating PO:", error);
        return false;
      }
    } catch (err) {
      console.error("Exception updating PO:", err);
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
        <PurchaseOrderList
          companyId={companyId}
          onCreateNew={() => {
            setSelectedPO(null);
            setView("create");
          }}
          onSelectPO={(po) => {
            setSelectedPO(po);
            setView("edit");
          }}
        />
      )}

      {view === "create" && (
        <PurchaseOrderForm
          companyId={companyId}
          onSubmit={handleCreatePO}
          onCancel={() => setView("list")}
        />
      )}

      {view === "edit" && selectedPO && (
        <PurchaseOrderForm
          existingPO={selectedPO}
          companyId={companyId}
          onSubmit={handleUpdatePO}
          onCancel={() => setView("list")}
        />
      )}
    </div>
  );
}
