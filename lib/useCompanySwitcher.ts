"use client";

import { useState, useCallback, useEffect } from "react";
import {
  persistActiveCompanyId,
  readActiveCompanyId,
} from "@/lib/companySwitcher";
import { isDemoCompany, DEMO_COMPANY_ID } from "@/lib/demoConstants";
import { isDemoUserId } from "@/lib/userIdentity";
import { supabase } from "@/lib/supabaseClient";

export interface Company {
  id: string;
  name: string;
}

interface UseCompanySwitcherOptions {
  onSwitchSuccess?: () => void;
  onSwitchError?: (error: Error) => void;
}

/**
 * useCompanySwitcher
 * Hook for managing company switching logic.
 * Handles:
 * - Loading companies
 * - Switching between demo and live companies
 * - Persisting active company to localStorage
 * - Validating company access
 */
export function useCompanySwitcher(options?: UseCompanySwitcherOptions) {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [activeCompanyId, setActiveCompanyId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Load active company from localStorage on mount
  useEffect(() => {
    const stored = readActiveCompanyId();
    setActiveCompanyId(stored);
  }, []);

  // Load companies on mount
  useEffect(() => {
    const loadCompanies = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Get current user ID to check if demo or real user
        const { data } = await supabase.auth.getUser();
        const currentUserId = data?.user?.id;
        const isDemo = isDemoUserId(currentUserId);

        const params = new URLSearchParams();
        const targetId = activeCompanyId || readActiveCompanyId();
        if (targetId) params.set("company_id", targetId);

        const query = params.toString();
        const response = await fetch(
          `/api/company${query ? `?${query}` : ""}`
        );

        if (!response.ok) {
          throw new Error("Failed to load companies");
        }

        const payload = await response.json();
        const companyList = Array.isArray(payload?.companies)
          ? payload.companies
          : payload?.company
            ? [payload.company]
            : [];

        // For real users: show real companies, but allow adding demo as sandbox option
        // For demo users: show everything including demo
        const normalized = companyList
          .map((entry: any) => ({
            id: entry?.id ? String(entry.id) : "",
            name: entry?.name || "Untitled company",
            isDemoCompany: entry?.id === DEMO_COMPANY_ID,
          }))
          .filter((entry: any) => entry.id);

        setCompanies(normalized);

        const payloadCompany = payload?.company;
        const payloadCompanyId = payloadCompany?.id ? String(payloadCompany.id) : null;
        const resolvedId = payloadCompanyId || normalized[0]?.id || null;

        if (resolvedId && resolvedId !== activeCompanyId) {
          setActiveCompanyId(resolvedId);
          persistActiveCompanyId(resolvedId);
        } else if (!resolvedId && activeCompanyId) {
          setActiveCompanyId(null);
          persistActiveCompanyId(null);
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Unknown error");
        setError(error);
        options?.onSwitchError?.(error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCompanies();
  }, [activeCompanyId, options]);

  // Switch to a different company
  const switchCompany = useCallback(
    async (companyId: string) => {
      try {
        setIsLoading(true);
        setError(null);

        // For demo company, just update localStorage
        if (isDemoCompany(companyId)) {
          setActiveCompanyId(companyId);
          persistActiveCompanyId(companyId);
          options?.onSwitchSuccess?.();
          return;
        }

        // For live companies, validate with server
        const response = await fetch("/api/company/switch", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ companyId }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "Failed to switch company");
        }

        const data = await response.json();

        setActiveCompanyId(data.companyId);
        persistActiveCompanyId(data.companyId);

        options?.onSwitchSuccess?.();
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Unknown error");
        setError(error);
        options?.onSwitchError?.(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [options]
  );

  // Get active company details
  const activeCompany = companies.find((c) => c.id === activeCompanyId);
  const isActiveDemoCompany = isDemoCompany(activeCompanyId);

  return {
    companies,
    activeCompanyId,
    activeCompany,
    isActiveDemoCompany,
    isLoading,
    error,
    switchCompany,
  };
}

export default useCompanySwitcher;
