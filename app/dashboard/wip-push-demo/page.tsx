"use client";

import WIPPushWidget from "../../components/WIPPushWidget";

export default function WIPPushDemoPage() {
  const demoProjects = [
    {
      projectName: "Foundation Works - Phase 2",
      customerId: "CUST-001",
      contractValue: 1200000,
      percentComplete: 62,
      billedAmount: 650000,
      retentionPercent: 10,
    },
    {
      projectName: "Electrical Installation",
      customerId: "CUST-002",
      contractValue: 450000,
      percentComplete: 45,
      billedAmount: 180000,
      retentionPercent: 10,
    },
    {
      projectName: "Plumbing & Fixtures",
      customerId: "CUST-003",
      contractValue: 320000,
      percentComplete: 85,
      billedAmount: 250000,
      retentionPercent: 10,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            📊 WIP Invoice Push Demo
          </h1>
          <p className="text-lg text-gray-600">
            Calculate and push Work-in-Progress invoices to Sage One or Xero
          </p>
        </div>

        {/* Instructions */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white rounded-lg border border-blue-200 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-blue-900 mb-3">ℹ️ How It Works</h2>
            <ol className="space-y-2 text-sm text-gray-700">
              <li className="flex gap-2">
                <span className="font-bold text-blue-600">1.</span>
                <span>View WIP calculations for your projects</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-blue-600">2.</span>
                <span>Select your ERP system (Sage or Xero)</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-blue-600">3.</span>
                <span>Click &quot;Push WIP Invoice&quot;</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-blue-600">4.</span>
                <span>Invoice automatically created in your ERP</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-blue-600">5.</span>
                <span>See success message with &quot;invoice ID&quot;</span>
              </li>
            </ol>
          </div>

          <div className="bg-white rounded-lg border border-green-200 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-green-900 mb-3">✨ Features</h2>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex gap-2">
                <span>✅</span>
                <span>Real-time WIP calculation</span>
              </li>
              <li className="flex gap-2">
                <span>✅</span>
                <span>Sage One & Xero integration</span>
              </li>
              <li className="flex gap-2">
                <span>✅</span>
                <span>Automatic invoice creation</span>
              </li>
              <li className="flex gap-2">
                <span>✅</span>
                <span>Retention tracking</span>
              </li>
              <li className="flex gap-2">
                <span>✅</span>
                <span>Real-time status feedback</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Demo Projects */}
        <div className="space-y-8">
          <h2 className="text-2xl font-bold text-gray-900">📋 Sample Projects</h2>

          {demoProjects.map((project, idx) => (
            <div key={idx} className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center font-bold text-blue-700">
                  {idx + 1}
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {project.projectName}
                </h3>
              </div>
              <WIPPushWidget data={project} />
            </div>
          ))}
        </div>

        {/* API Reference */}
        <div className="mt-16 bg-gray-900 rounded-lg p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">🔌 API Reference</h2>
          <div className="bg-gray-800 rounded p-4 overflow-x-auto mb-4">
            <pre className="text-sm text-gray-300">
{`POST /api/invoices/push-to-erp

Request Body:
{
  "erp": "sage" | "xero",
  "wipAmount": 94400,
  "retentionAmount": 9440,
  "netClaimable": 84960,
  "customerId": "CUST-001",
  "projectName": "Foundation Works - Phase 2",
  "description": "WIP Invoice - Monthly",
  "sageToken": "...",
  "sageCookie": "...",
  "xeroAccessToken": "...",
  "xeroTenantId": "..."
}

Response (Success):
{
  "success": true,
  "erp": "sage",
  "invoiceId": "INV-2024-001",
  "message": "WIP invoice pushed to Sage One",
  "details": {
    "wipAmount": 94400,
    "retentionAmount": 9440,
    "netClaimable": 84960
  }
}`}
            </pre>
          </div>
          <a
            href="/dashboard/invoices"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition"
          >
            View Real Invoices Dashboard →
          </a>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-gray-600">
          <p>FieldCost WIP Invoice Push • v1.0</p>
          <p className="mt-2">
            View documentation:{" "}
            <a
              href="/WIP_INVOICE_PUSH_GUIDE.md"
              className="text-blue-600 hover:underline"
            >
              WIP_INVOICE_PUSH_GUIDE.md
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
