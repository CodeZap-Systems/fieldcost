"use client";

import { useState, useEffect } from "react";
import { ensureClientUserId } from "../../../lib/clientUser";

interface Quote {
  id: number;
  reference: string;
  customer?: { id: number; name: string; email?: string };
  project?: { id: number; name: string };
  amount: number;
  status: string;
  valid_until?: string | null;
  created_at: string;
  line_items?: any[];
}

interface QuoteListProps {
  companyId?: string | null;
  onSelectQuote?: (quote: Quote) => void;
  onCreateNew?: () => void;
}

export function QuoteList({ companyId = "1", onSelectQuote, onCreateNew }: QuoteListProps) {
  const userId = ensureClientUserId();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("");

  // Fetch quotes
  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        setLoading(true);
        let url = `/api/quotes?company_id=${companyId}&user_id=${userId}`;
        if (filterStatus) {
          url += `&status=${filterStatus}`;
        }

        const res = await fetch(url);
        if (res.ok) {
          setQuotes(await res.json());
        } else {
          setError("Failed to fetch quotes");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchQuotes();
  }, [userId, companyId, filterStatus]);

  const handleSendQuote = async (quoteId: number) => {
    try {
      const res = await fetch(`/api/quotes/${quoteId}/send?user_id=${userId}`, {
        method: "POST",
      });

      if (res.ok) {
        // Refresh quotes list
        const updatedRes = await fetch(`/api/quotes?company_id=${companyId}&user_id=${userId}`);
        if (updatedRes.ok) {
          setQuotes(await updatedRes.json());
        }
      } else {
        setError("Failed to send quote");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const handleConvertToInvoice = async (quoteId: number) => {
    try {
      const res = await fetch(`/api/quotes/${quoteId}/convert?user_id=${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      if (res.ok) {
        // Refresh quotes list
        const updatedRes = await fetch(`/api/quotes?company_id=${companyId}&user_id=${userId}`);
        if (updatedRes.ok) {
          setQuotes(await updatedRes.json());
        }
        setError(""); // Clear any previous errors
      } else {
        const errorData = await res.json();
        setError(errorData.error || "Failed to convert quote to invoice");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-gray-100 text-gray-800";
      case "sent":
        return "bg-blue-100 text-blue-800";
      case "accepted":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-ZA");
  };

  if (loading) {
    return <div className="p-6 text-center">Loading quotes...</div>;
  }

  return (
    <div className="w-full">
      {/* Header with create button */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Quotations</h2>
        {onCreateNew && (
          <button
            onClick={onCreateNew}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            + Create New Quote
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
          <option value="sent">Sent</option>
          <option value="accepted">Accepted</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Quotes Table */}
      {quotes.length === 0 ? (
        <div className="text-center p-8 text-gray-500">
          No quotes found. {onCreateNew && "Click 'Create New Quote' to get started."}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-300">
                <th className="px-4 py-3 text-left font-semibold">Reference</th>
                <th className="px-4 py-3 text-left font-semibold">Customer</th>
                <th className="px-4 py-3 text-left font-semibold">Project</th>
                <th className="px-4 py-3 text-right font-semibold">Amount (ZAR)</th>
                <th className="px-4 py-3 text-left font-semibold">Status</th>
                <th className="px-4 py-3 text-left font-semibold">Valid Until</th>
                <th className="px-4 py-3 text-left font-semibold">Created</th>
                <th className="px-4 py-3 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {quotes.map((quote) => (
                <tr key={quote.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-blue-600">{quote.reference}</td>
                  <td className="px-4 py-3">{quote.customer?.name || "N/A"}</td>
                  <td className="px-4 py-3">{quote.project?.name || "-"}</td>
                  <td className="px-4 py-3 text-right">R {quote.amount.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(quote.status)}`}>
                      {quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {quote.valid_until ? formatDate(quote.valid_until) : "-"}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {formatDate(quote.created_at)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      {quote.status === "draft" && (
                        <>
                          <button
                            onClick={() => onSelectQuote?.(quote)}
                            className="text-blue-600 hover:text-blue-800 text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleSendQuote(quote.id)}
                            className="text-green-600 hover:text-green-800 text-sm"
                          >
                            Send
                          </button>
                        </>
                      )}
                      {quote.status === "accepted" && (
                        <button
                          onClick={() => handleConvertToInvoice(quote.id)}
                          className="text-purple-600 hover:text-purple-800 text-sm"
                        >
                          Convert to Invoice
                        </button>
                      )}
                      <button
                        onClick={() => onSelectQuote?.(quote)}
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
