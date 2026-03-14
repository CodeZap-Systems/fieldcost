/**
 * Tier 3 Dashboard (Enterprise)
 * Full ERP Integration: Xero & Sage Business Cloud Accounting
 */
export function Tier3Dashboard() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">⚙️ Tier 3: Enterprise Dashboard</h2>
      
      <div className="grid md:grid-cols-3 gap-6">
        {/* Tier 1 Features */}
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
          <h4 className="font-semibold text-indigo-900 mb-2 text-sm">Tier 1: Core</h4>
          <ul className="text-xs text-indigo-800 space-y-1">
            <li>✓ Project Management</li>
            <li>✓ Crew Scheduling</li>
            <li>✓ Basic Invoicing</li>
            <li>✓ Expense Tracking</li>
            <li>✓ Task Management</li>
          </ul>
        </div>

        {/* Tier 2 Features */}
        <div className="bg-indigo-100 border border-indigo-300 rounded-lg p-4">
          <h4 className="font-semibold text-indigo-900 mb-2 text-sm">Tier 2: Growth</h4>
          <ul className="text-xs text-indigo-800 space-y-1">
            <li>✓ Advanced Reporting</li>
            <li>✓ Budget Forecasting</li>
            <li>✓ Customer Analytics</li>
            <li>✓ Light ERP Sync</li>
            <li>✓ Custom Dashboards</li>
          </ul>
        </div>

        {/* Tier 3 Features */}
        <div className="bg-indigo-200 border border-indigo-500 rounded-lg p-4">
          <h4 className="font-semibold text-indigo-900 mb-2 text-sm">Tier 3: Enterprise 🆕</h4>
          <ul className="text-xs text-indigo-900 space-y-1 font-semibold">
            <li>✓ Full Xero Sync</li>
            <li>✓ Full Sage Sync</li>
            <li>✓ Real-time GL Sync</li>
            <li>✓ Auto Workflows</li>
            <li>✓ Multi-entity</li>
          </ul>
        </div>
      </div>

      {/* ERP Integration Status */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="font-semibold text-gray-900 mb-4">🔗 ERP Integration Status</h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Xero Integration */}
          <div className="border-2 border-indigo-300 rounded-lg p-6 bg-gradient-to-br from-indigo-50 to-transparent">
            <div className="flex items-center gap-3 mb-4">
              <div className="text-3xl">✓</div>
              <div>
                <h4 className="font-bold text-gray-900">Xero</h4>
                <p className="text-xs text-gray-600">Real-time accounting sync</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <StatusItem label="Connection Status" status="connected" />
              <StatusItem label="Last Sync" status="2 min ago" />
              <StatusItem label="Invoices Synced" status="47" />
              <StatusItem label="GL Accounts" status="Pulling live" />
              
              <div className="pt-3 space-y-2">
                <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded text-sm font-medium">
                  🔄 Sync Now
                </button>
                <button className="w-full bg-gray-200 hover:bg-gray-300 text-gray-900 px-4 py-2 rounded text-sm font-medium">
                  ⚙️ Configure
                </button>
              </div>
            </div>
          </div>

          {/* Sage Integration */}
          <div className="border-2 border-green-300 rounded-lg p-6 bg-gradient-to-br from-green-50 to-transparent">
            <div className="flex items-center gap-3 mb-4">
              <div className="text-3xl">✓</div>
              <div>
                <h4 className="font-bold text-gray-900">Sage Business Cloud</h4>
                <p className="text-xs text-gray-600">South Africa accounting integration</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <StatusItem label="Connection Status" status="connected" />
              <StatusItem label="Last Sync" status="5 min ago" />
              <StatusItem label="Invoices Synced" status="52" />
              <StatusItem label="GL Accounts" status="Pulling live" />
              
              <div className="pt-3 space-y-2">
                <button className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm font-medium">
                  🔄 Sync Now
                </button>
                <button className="w-full bg-gray-200 hover:bg-gray-300 text-gray-900 px-4 py-2 rounded text-sm font-medium">
                  ⚙️ Configure
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Data Flow Diagram */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="font-semibold text-gray-900 mb-4">📊 Data Synchronization Flow</h3>
        
        <div className="flex items-center justify-between mb-6 text-sm">
          <div className="flex-1 bg-indigo-100 rounded px-4 py-3 text-center font-medium">
            <div className="text-lg">🏗️</div>
            <div className="text-gray-900">FieldCost</div>
            <div className="text-xs text-gray-600">Project Data</div>
          </div>
          
          <div className="flex-1 flex justify-center">
            <div className="text-2xl">⇄</div>
          </div>
          
          <div className="flex-1 bg-blue-100 rounded px-4 py-3 text-center font-medium">
            <div className="text-lg">📊</div>
            <div className="text-gray-900">Xero</div>
            <div className="text-xs text-gray-600">Accounting Live</div>
          </div>
          
          <div className="flex-1 flex justify-center">
            <div className="text-2xl">⇄</div>
          </div>
          
          <div className="flex-1 bg-green-100 rounded px-4 py-3 text-center font-medium">
            <div className="text-lg">📈</div>
            <div className="text-gray-900">Sage</div>
            <div className="text-xs text-gray-600">GL Synced</div>
          </div>
        </div>

        {/* Synced Data Types */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Synced Data Types:</h4>
          <div className="grid md:grid-cols-3 gap-3">
            {[
              { label: "Invoices", count: "47 → Xero, 52 → Sage", icon: "📄" },
              { label: "Expenses", count: "156 entries", icon: "💳" },
              { label: "GL Accounts", count: "Real-time sync", icon: "📊" },
              { label: "Customers", count: "28 profiles", icon: "👥" },
              { label: "Projects", count: "6 active", icon: "🏗️" },
              { label: "Revenue", count: "ZAR 2.4M YTD", icon: "💰" },
            ].map((item, idx) => (
              <div key={idx} className="bg-gray-50 p-3 rounded border border-gray-200">
                <div className="text-2xl mb-1">{item.icon}</div>
                <div className="font-medium text-sm text-gray-900">{item.label}</div>
                <div className="text-xs text-gray-600">{item.count}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Automation Rules */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="font-semibold text-gray-900 mb-4">⚡ Automated Workflows</h3>
        
        <div className="space-y-3">
          {[
            { trigger: "Invoice created", action: "Auto-sync to Xero & Sage", status: "enabled" },
            { trigger: "Expense logged", action: "GL entry created", status: "enabled" },
            { trigger: "Project completed", action: "Final invoice + project closure", status: "enabled" },
            { trigger: "Payment received", action: "GL mark-up & reconciliation", status: "enabled" },
          ].map((rule, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 border border-gray-200 rounded">
              <div>
                <div className="font-medium text-gray-900">{rule.trigger}</div>
                <div className="text-sm text-gray-600">→ {rule.action}</div>
              </div>
              <span className={`text-xs px-3 py-1 rounded font-medium ${rule.status === 'enabled' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                {rule.status === 'enabled' ? '✓ Active' : '○ Inactive'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatusItem({ label, status }: { label: string; status: string }) {
  return (
    <div className="flex justify-between items-center text-sm">
      <span className="text-gray-600">{label}</span>
      <span className="font-medium text-gray-900">{status}</span>
    </div>
  );
}
