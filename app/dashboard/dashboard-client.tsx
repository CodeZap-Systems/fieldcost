"use client";

import { ReactNode, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { readActiveCompanyId, persistActiveCompanyId } from "@/lib/companySwitcher";
import { isDemoCompany } from "@/lib/demoConstants";
import { DemoModeBanner } from "@/app/components/DemoModeBanner";
import { supabase } from "@/lib/supabaseClient";

interface DashboardWithBannerProps {
  children?: ReactNode;
}

interface ClientState {
  mounted: boolean;
  activeCompanyId: string | null;
  isAuthenticated: boolean;
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
  const [clientState, setClientState] = useState<ClientState>({
    mounted: false,
    activeCompanyId: null,
    isAuthenticated: false,
  });

  useEffect(() => {
    const companyId = readActiveCompanyId();
    supabase.auth.getUser().then(({ data }) => {
      setClientState({
        mounted: true,
        activeCompanyId: companyId,
        isAuthenticated: !!data?.user,
      });
    });
  }, []);

  const handleGotoLiveWorkspace = () => {
    // Clear demo company ID and redirect
    persistActiveCompanyId(null);
    router.push("/dashboard");
  };

  // Prevent hydration mismatch
  if (!clientState.mounted) {
    return <>{children}</>;
  }

  // For authenticated users, never show DemoModeBanner even if they somehow access demo company
  // The company API should prevent this, but this is a safety net
  const shouldShowDemoBanner = !clientState.isAuthenticated && isDemoCompany(clientState.activeCompanyId);

  return (
    <>
      {shouldShowDemoBanner && (
        <DemoModeBanner
          companyId={clientState.activeCompanyId}
          onGotoLiveWorkspace={handleGotoLiveWorkspace}
        />
      )}
      {children}
    </>
  );
}
