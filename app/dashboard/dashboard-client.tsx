"use client";

import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { readActiveCompanyId, persistActiveCompanyId } from "@/lib/companySwitcher";
import { isDemoCompany, DEMO_COMPANY_ID } from "@/lib/demoConstants";
import { DemoModeBanner } from "@/app/components/DemoModeBanner";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

interface DashboardWithBannerProps {
  children: ReactNode;
}

/**
 * DashboardWithBanner
 * Client-side wrapper for dashboard that displays demo mode banner
 * and manages redirect to live workspace
 * 
 * CRITICAL: Only show DemoModeBanner for actual demo users (not authenticated users)
 */
export function DashboardWithBanner({ children }: DashboardWithBannerProps) {
  const router = useRouter();
  const [activeCompanyId, setActiveCompanyId] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    supabase.auth.getUser().then(({ data }) => {
      setIsAuthenticated(!!data?.user);
    });
    
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

  // For authenticated users, never show DemoModeBanner even if they somehow access demo company
  // The company API should prevent this, but this is a safety net
  const shouldShowDemoBanner = !isAuthenticated && isDemoCompany(activeCompanyId);

  return (
    <>
      {shouldShowDemoBanner && (
        <DemoModeBanner
          companyId={activeCompanyId}
          onGotoLiveWorkspace={handleGotoLiveWorkspace}
        />
      )}
      {children}
    </>
  );
}
