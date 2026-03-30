// lib/BrandingProvider.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { BrandingSettings } from './BrandingSettings';
import { supabase } from './supabaseClient';

const BrandingContext = createContext<BrandingSettings | null>(null);

export const BrandingProvider = ({ companyId, children }: { companyId: string, children: React.ReactNode }) => {
  const [branding, setBranding] = useState<BrandingSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBranding() {
      setLoading(true);
      setError(null);
      try {
        const user = (await supabase.auth.getUser()).data.user;
        if (!user) throw new Error('Not authenticated');
        const res = await fetch(`/api/branding?companyId=${companyId}&userId=${user.id}`);
        if (!res.ok) throw new Error('Failed to load branding');
        const data = await res.json();
        setBranding(data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        setBranding(null);
      } finally {
        setLoading(false);
      }
    }
    fetchBranding();
  }, [companyId]);

  if (loading) return <div aria-busy="true" className="text-gray-400">Loading branding...</div>;
  if (error) return <div className="text-red-600" role="alert">{error}</div>;
  if (!branding) return <div className="text-gray-400">No branding data found.</div>;
  return <BrandingContext.Provider value={branding}>{children}</BrandingContext.Provider>;
};

export const useBranding = () => useContext(BrandingContext);
