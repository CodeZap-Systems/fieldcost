"use client";
import { Suspense } from "react";

function InvoicesPageContent() {
  return <div className="p-8 text-gray-600">Invoices page placeholder</div>;
}

export default function InvoicesPage() {
  return (
    <Suspense fallback={<div className="p-8 text-gray-600">Loading invoice workspace…</div>}>
      <InvoicesPageContent />
    </Suspense>
  );
}