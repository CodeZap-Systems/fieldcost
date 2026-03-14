"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ensureClientUserId } from "../../../../lib/clientUser";
import { readActiveCompanyId } from "../../../../lib/companySwitcher";
import { BackButton } from "../../../components/BackButton";

interface ItemMargin {
  itemId: number;
  itemName: string;
  itemType: string;
  cost: number;
  sellingPrice: number;
  margin: number;
  marginPercent: number;
  usageCount: number;
}

interface TierData {
  items: ItemMargin[];
  totalCost: number;
  totalSellingPrice: number;
  totalMargin: number;
  avgMarginPercent: number;
}

export default function ItemMarginReportPage() {
  const [data, setData] = useState<TierData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function fetchReport() {
      setLoading(true);
      setError(null);

      try {
        const userId = await ensureClientUserId();
        const companyId = readActiveCompanyId();

        if (!companyId) {
          setError("Company context not available");
          return;
        }

        const params = new URLSearchParams({ user_id: userId, company_id: companyId });
        const response = await fetch(`/api/reports/item-margin?${params.toString()}`);

        if (!response.ok) {
          throw new Error("Failed to load margin report");
        }

        const reportData: TierData = await response.json();
        if (active) setData(reportData);
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        if (active) setLoading(false);
      }
    }

    fetchReport();
    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Item Margin Report</h1>
        <BackButton />
      </div>

      {/* Summary Cards */}
      {data && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <p className="text-gray-600 text-sm font-medium">Total Selling Price</p>
            <p className="text-3xl font-bold text-blue-600">R{data.totalSellingPrice.toFixed(2)}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <p className="text-gray-600 text-sm font-medium">Total Cost</p>
            <p className="text-3xl font-bold text-orange-600">R{data.totalCost.toFixed(2)}</p>
          </div>
          <div className={`bg-white rounded-lg border border-gray-200 p-6 ${data.totalMargin >= 0 ? "border-green-200" : "border-red-200"}`}>
            <p className="text-gray-600 text-sm font-medium">Total Margin</p>
            <p className={`text-3xl font-bold ${data.totalMargin >= 0 ? "text-green-600" : "text-red-600"}`}>
              R{data.totalMargin.toFixed(2)}
            </p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <p className="text-gray-600 text-sm font-medium">Avg Margin %</p>
            <p className="text-3xl font-bold text-purple-600">{data.avgMarginPercent.toFixed(1)}%</p>
          </div>
        </div>
      )}

      {/* Items Details Table */}
      {loading && <div className="py-8 text-center text-gray-600">Loading report...</div>}

      {error && <div className="py-8 px-6 bg-red-50 border border-red-200 rounded text-red-700">{error}</div>}

      {data && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Item Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Type</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Cost</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Selling Price</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Margin</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Margin %</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">Used</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data.items.map((item) => (
                <tr key={item.itemId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.itemName}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 capitalize">{item.itemType}</td>
                  <td className="px-6 py-4 text-right text-sm font-medium text-orange-600">
                    R{item.cost.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium text-blue-600">
                    R{item.sellingPrice.toFixed(2)}
                  </td>
                  <td
                    className={`px-6 py-4 text-right text-sm font-bold ${
                      item.margin >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    R{item.margin.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                    {item.marginPercent.toFixed(1)}%
                  </td>
                  <td className="px-6 py-4 text-center text-sm text-gray-600">{item.usageCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
