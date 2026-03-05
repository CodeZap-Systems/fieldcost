"use client";

import { useEffect, useState } from 'react';
import AppNav from './AppNav';
import { supabase } from '../../lib/supabaseClient';

export default function Sidebar() {
  const [tier, setTier] = useState<'starter' | 'growth'>('starter');

  useEffect(() => {
    let active = true;
    supabase.auth.getUser().then(async ({ data }) => {
      const userId = data?.user?.id;
      if (!userId || !active) return;
      const { data: profile } = await supabase
        .from('profiles')
        .select('subscription_tier')
        .eq('id', userId)
        .maybeSingle();
      if (!active) return;
      setTier(profile?.subscription_tier === 'growth' ? 'growth' : 'starter');
    });
    return () => {
      active = false;
    };
  }, []);

  return <AppNav initialTier={tier} />;
}
