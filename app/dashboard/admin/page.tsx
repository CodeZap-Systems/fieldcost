// app/dashboard/admin/page.tsx
"use client";
import { BrandingProvider, useBranding } from "@/lib/BrandingProvider";
import WorkflowBuilder from "@/components/WorkflowBuilder";
import VerticalsAdmin from "@/components/VerticalsAdmin";
import BrandingSettingsForm from "@/components/BrandingSettingsForm";
import React, { useState } from "react";

export default function AdminPage() {
  // In production, get companyId from auth/session
  const [companyId] = useState("demo-company");

  return (
    <BrandingProvider companyId={companyId}>
      <div className="max-w-4xl mx-auto p-8 space-y-8">
        <h1 className="text-3xl font-bold mb-6">Admin: Branding, Workflow, Verticals</h1>
        <section className="border rounded p-6 bg-white shadow">
          <h2 className="text-xl font-semibold mb-2">Branding Settings</h2>
          <BrandingSettingsSection companyId={companyId} />
        </section>
        <section className="border rounded p-6 bg-white shadow">
          <WorkflowBuilder />
        </section>
        <section className="border rounded p-6 bg-white shadow">
          <VerticalsAdmin companyId={companyId} />
        </section>
      </div>
    </BrandingProvider>
  );
}

function BrandingSettingsSection({ companyId }: { companyId: string }) {
  const branding = useBranding();
  if (!branding) return <div>Loading branding...</div>;
  return <BrandingSettingsForm companyId={companyId} initial={branding} />;
}
