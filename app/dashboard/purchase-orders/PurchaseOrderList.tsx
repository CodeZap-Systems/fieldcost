"use client";

import { useState, useEffect } from "react";
import { ensureClientUserId } from "../../../lib/clientUser";

interface PurchaseOrder {
  id: number;
  po_reference: string;
  supplier?: { id: number; vendor_name: string; email?: string };
  project?: { id: number; name: string };
  total_amount: number;
  status: string;
  required_by_date?: string | null;
  created_at: string;
  line_items?: any[];
}

interface POListProps {
  companyId?: string | null;
  onSelectPO?: (po: PurchaseOrder) => void;
  onCreateNew?: () => void;
}

export function PurchaseOrderList({ companyId = "1", onSelectPO, onCreateNew }: POListProps) {
  const userId = ensureClientUserId();
  const [pos, setPos] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("");

  // Fetch POs
  useEffect(() => {
    const fetchPOs = async () => {
      try {
        setLoading(true);
        let url = `/api/purchase-orders?company_id=${companyId}&user_id=${userId}`;
        if (filterStatus) {
          url += `&status=${filterStatus}`;
        }

        const res = await fetch(url);
        if (res.ok) {
          setPos(await res.json());
        } else {
          setError("Failed to fetch purchase orders");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchPOs();
  }, [userId, companyId, filterStatus]);

  const handleSendPO = async (poId: number) => {
    try {
      const res = await fetch(`/api/purchase-orders/${poId}/send?user_id=${userId}`, {
        method: "POST",
      });

      if (res.ok) {
        // Refresh list
        const updatedRes = await fetch(`/api/purchase-orders?company_id=${companyId}&user_id=${userId}`);
        if (updatedRes.ok) {
          setPos(await updatedRes.json());
        }
      } else {
        setError("Failed to send purchase order");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const handleConfirmPO = async (poId: number) => {
    try {
      const res = await fetch(`/api/purchase-orders/${poId}/confirm?user_id=${userId}`, {
        method: "POST",
      });

      if (res.ok) {
        // Refresh list
        const updatedRes = await fetch(`/api/purchase-orders?company_id=${companyId}&user_id=${userId}`);
        if (updatedRes.ok) {
          setPos(await updatedRes.json());
        }
        setError("");
      } else {
        const errorData = await res.json();
        setError(errorData.error || "Failed to confirm purchase order");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const handleDownloadPDF = async (poId: number, reference: string) => {
    try {
      const res = await fetch(`/api/purchase-orders/${poId}/export/pdf?company_id=${companyId}`);
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `PO-${reference || poId}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        setError("Failed to download PDF");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to download PDF");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-gray-100 text-gray-800";
      case "sent_to_supplier":
        return "bg-blue-100 text-blue-800";
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "partially_received":
        return "bg-yellow-100 text-yellow-800";
      case "fully_received":
        return "bg-green-200 text-green-900";
      case "invoiced":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-ZA");
  };

  const formatStatus = (status: string) => {
    return status
      .split("_")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  if (loading) {
    return <div className="p-6 text-center">Loading purchase orders...</div>;
  }

  return (
    <div className="w-full">
      {/* Header with create button */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Supplier Purchase Orders</h2>
        {onCreateNew && (
          <button
            onClick={onCreateNew}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            + Create New PO
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Filter by status */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Filter by Status:</label>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg"
        >
          <option value="">All Statuses</option>
          <option value="draft">Draft</option>
          <option value="sent_to_supplier">Sent to Supplier</option>
          <option value="confirmed">Confirmed</option>
          <option value="partially_received">Partially Received</option>
          <option value="fully_received">Fully Received</option>
          <option value="invoiced">Invoiced</option>
        </select>
      </div>

      {/* POs Table */}
      {pos.length === 0 ? (
        <div className="text-center p-8 text-gray-500">
          No purchase orders found. {onCreateNew && "Click 'Create New PO' to get started."}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-300">
                <th className="px-4 py-3 text-left font-semibold">PO Reference</th>
                <th className="px-4 py-3 text-left font-semibold">Supplier</th>
                <th className="px-4 py-3 text-left font-semibold">Project</th>
                <th className="px-4 py-3 text-right font-semibold">Amount (ZAR)</th>
                <th className="px-4 py-3 text-left font-semibold">Status</th>
                <th className="px-4 py-3 text-left font-semibold">Required By</th>
                <th className="px-4 py-3 text-left font-semibold">Created</th>
                <th className="px-4 py-3 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pos.map((po) => (
                <tr key={po.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-blue-600">{po.po_reference}</td>
                  <td className="px-4 py-3">{po.supplier?.vendor_name || "N/A"}</td>
                  <td className="px-4 py-3">{po.project?.name || "-"}</td>
                  <td className="px-4 py-3 text-right">R {po.total_amount.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(po.status)}`}>
                      {formatStatus(po.status)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {po.required_by_date ? formatDate(po.required_by_date) : "-"}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {formatDate(po.created_at)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2 flex-wrap">
                      {po.status === "draft" && (
                        <>
                          <button
                            onClick={() => onSelectPO?.(po)}
                            className="text-blue-600 hover:text-blue-800 text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleSendPO(po.id)}
                            className="text-green-600 hover:text-green-800 text-sm"
                          >
                            Send
                          </button>
                        </>
                      )}
                      {po.status === "sent_to_supplier" && (
                        <button
                          onClick={() => handleConfirmPO(po.id)}
                          className="text-purple-600 hover:text-purple-800 text-sm"
                        >
                          Confirm
                        </button>
                      )}
                      {["confirmed", "partially_received"].includes(po.status) && (
                        <button
                          onClick={() => onSelectPO?.(po)}
                          className="text-orange-600 hover:text-orange-800 text-sm"
                        >
                          Log Receipt
                        </button>
                      )}
                      <button
                        onClick={() => handleDownloadPDF(po.id, po.po_reference)}
                        className="text-orange-600 hover:text-orange-800 text-sm"
                      >
                        📥 PDF
                      </button>
                      <button
                        onClick={() => onSelectPO?.(po)}
                        className="text-gray-600 hover:text-gray-800 text-sm"
                      >
                        View
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
