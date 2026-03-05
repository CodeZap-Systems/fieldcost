"use client";

import { useState } from "react";

type WIPData = {
  projectName: string;
  customerId: string;
  contractValue: number;
  percentComplete: number;
  billedAmount: number;
  retentionPercent: number;
};

type PushResult = {
  success: boolean;
  erp: "sage" | "xero";
  invoiceId?: string;
  message: string;
  details?: {
    wipAmount: number;
    retentionAmount: number;
    netClaimable: number;
  };
  error?: string;
};

// Format number with commas (avoids hydration issues with toLocaleString)
function formatCurrency(value: number, decimals = 0): string {
  const fixed = value.toFixed(decimals);
  const parts = fixed.split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
}

export default function WIPPushWidget({ data }: { data: WIPData }) {
  const [erp, setErp] = useState<"sage" | "xero">("sage");
  const [pushing, setPushing] = useState(false);
  const [result, setResult] = useState<PushResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Calculate WIP
  const earnedValue = (data.contractValue * data.percentComplete) / 100;
  const wipAmount = earnedValue - data.billedAmount;
  const retentionAmount = (wipAmount * data.retentionPercent) / 100;
  const netClaimable = wipAmount - retentionAmount;

  const handlePush = async () => {
    if (!data.customerId) {
      setError("Customer ID required");
      return;
    }

    setPushing(true);
    setError(null);
    setResult(null);

    try {
      // Round amounts to 2 decimal places
      const roundedWip = parseFloat(wipAmount.toFixed(2));
      const roundedRetention = parseFloat(retentionAmount.toFixed(2));
      const roundedNet = parseFloat(netClaimable.toFixed(2));

      const response = await fetch("/api/invoices/push-to-erp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          erp,
          wipAmount: roundedWip,
          retentionAmount: roundedRetention,
          netClaimable: roundedNet,
          customerId: data.customerId,
          projectName: data.projectName,
          description: `WIP Invoice - ${data.projectName}`,
          // Use environment variables in production, demo mode for testing
          sageToken: "demo-mode",
          sageCookie: "demo-mode",
          xeroAccessToken: "demo-mode",
          xeroTenantId: "demo-mode",
        }),
      });

      const res = await response.json();
      setResult(res);

      if (!response.ok) {
        setError(res.error || "Failed to push invoice");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setPushing(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <h3 className="text-lg font-semibold mb-4">💼 WIP Invoice Push</h3>

      {/* WIP Summary */}
      <div className="grid grid-cols-2 gap-4 mb-6 bg-gray-50 p-4 rounded">
        <div>
          <p className="text-sm text-gray-600">Contract Value</p>
          <p className="text-xl font-bold text-gray-900" suppressHydrationWarning>
            R{formatCurrency(data.contractValue, 2)}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Progress</p>
          <p className="text-xl font-bold text-blue-600">{data.percentComplete}%</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Billed to Date</p>
          <p className="text-lg font-semibold text-gray-900" suppressHydrationWarning>
            R{formatCurrency(data.billedAmount, 2)}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Retention</p>
          <p className="text-lg font-semibold text-orange-600">{data.retentionPercent}%</p>
        </div>
      </div>

      {/* Calculations */}
      <div className="space-y-2 mb-6 p-4 bg-blue-50 rounded border border-blue-200">
        <div className="flex justify-between text-sm">
          <span className="text-gray-700">Earned Value (Contract × Progress)</span>
          <span className="font-mono font-semibold text-gray-900" suppressHydrationWarning>
            R{formatCurrency(earnedValue, 2)}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-700">WIP (Earned - Billed)</span>
          <span className="font-mono font-semibold text-blue-700" suppressHydrationWarning>
            R{formatCurrency(wipAmount, 2)}
          </span>
        </div>
        <hr className="my-2 border-blue-200" />
        <div className="flex justify-between text-sm">
          <span className="text-gray-700">Retention Amount</span>
          <span className="font-mono font-semibold text-orange-600" suppressHydrationWarning>
            R{formatCurrency(retentionAmount, 2)}
          </span>
        </div>
        <div className="flex justify-between text-lg font-bold bg-white p-2 rounded border-2 border-green-300">
          <span className="text-gray-900">Net Claimable</span>
          <span className="text-green-700" suppressHydrationWarning>
            R{formatCurrency(netClaimable, 2)}
          </span>
        </div>
      </div>

      {/* ERP Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select ERP System
        </label>
        <div className="flex gap-4">
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="erp"
              value="sage"
              checked={erp === "sage"}
              onChange={(e) => setErp(e.target.value as "sage" | "xero")}
              className="h-4 w-4 text-blue-600"
            />
            <span className="ml-2 text-gray-700">🧾 Sage One</span>
          </label>
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="erp"
              value="xero"
              checked={erp === "xero"}
              onChange={(e) => setErp(e.target.value as "sage" | "xero")}
              className="h-4 w-4 text-blue-600"
            />
            <span className="ml-2 text-gray-700">🔷 Xero</span>
          </label>
        </div>
      </div>

      {/* Push Button */}
      <div className="mb-6">
        <button
          onClick={handlePush}
          disabled={pushing || !data.customerId}
          className={`w-full py-3 px-4 rounded font-semibold flex items-center justify-center gap-2 transition ${
            pushing || !data.customerId
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700 text-white cursor-pointer"
          }`}
        >
          {pushing ? (
            <>
              <span className="inline-block animate-spin">⚙️</span>
              Pushing to {erp === "sage" ? "Sage" : "Xero"}...
            </>
          ) : (
            <>
              <span>📤</span>
              Push WIP Invoice to {erp === "sage" ? "Sage One" : "Xero"}
            </>
          )}
        </button>
        {!data.customerId && (
          <p className="text-xs text-red-600 mt-2">Customer ID required to push</p>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
          <p className="font-semibold">❌ Error</p>
          <p>{error}</p>
        </div>
      )}

      {/* Success Message */}
      {result?.success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded">
          <p className="font-semibold text-green-700 mb-2">✅ Success!</p>
          <p className="text-sm text-gray-700 mb-3">{result.message}</p>
          {result.invoiceId && (
            <div className="bg-white p-3 rounded border border-green-200 font-mono text-sm">
              <p className="text-gray-600">Invoice ID:</p>
              <p className="text-green-700 font-bold text-lg">{result.invoiceId}</p>
            </div>
          )}
          {result.details && (
            <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
              <div className="bg-white p-2 rounded border border-gray-200">
                <p className="text-gray-600">WIP Amount</p>
                <p className="font-semibold" suppressHydrationWarning>
                  R{formatCurrency(result.details.wipAmount, 2)}
                </p>
              </div>
              <div className="bg-white p-2 rounded border border-gray-200">
                <p className="text-gray-600">Retention</p>
                <p className="font-semibold" suppressHydrationWarning>
                  R{formatCurrency(result.details.retentionAmount, 2)}
                </p>
              </div>
              <div className="bg-white p-2 rounded border border-gray-200">
                <p className="text-gray-600">Net Claimable</p>
                <p className="font-semibold" suppressHydrationWarning>
                  R{formatCurrency(result.details.netClaimable, 2)}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Failed Message */}
      {result && !result.success && !error && (
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
          <p className="font-semibold text-yellow-700 mb-2">⚠️ Push Failed</p>
          <p className="text-sm text-gray-700">{result.message || result.error}</p>
        </div>
      )}
    </div>
  );
}
