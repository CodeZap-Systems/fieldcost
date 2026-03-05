"use client";

import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { readActiveCompanyId, persistActiveCompanyId } from "@/lib/companySwitcher";
import { isDemoCompany, DEMO_COMPANY_ID } from "@/lib/demoConstants";
import { DemoModeBanner } from "@/app/components/DemoModeBanner";
import { useState, useEffect } from "react";

interface DashboardWithBannerProps {
  children: ReactNode;
}

/**
 * DashboardWithBanner
 * Client-side wrapper for dashboard that displays demo mode banner
 * and manages redirect to live workspace
 */
export function DashboardWithBanner({ children }: DashboardWithBannerProps) {
  const router = useRouter();
  const [activeCompanyId, setActiveCompanyId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const companyId = readActiveCompanyId();
    setActiveCompanyId(companyId);
  }, []);

  const handleGotoLiveWorkspace = () => {
    // Clear demo company ID and redirect
    persistActiveCompanyId(null);
    router.push("/dashboard");
  };

  // Prevent hydration mismatch
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <>
      <DemoModeBanner
        companyId={activeCompanyId}
        onGotoLiveWorkspace={handleGotoLiveWorkspace}
      />
      {children}
    </>
  );
}
