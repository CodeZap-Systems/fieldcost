import React from 'react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Navigation is wrapped in ClientNavWrapper in root layout */}
      {/* Main content area takes remaining space */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
