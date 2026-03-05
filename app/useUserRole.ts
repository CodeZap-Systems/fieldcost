"use client";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export function useUserRole() {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRole() {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      setRole(user?.user_metadata?.role || null);
      setLoading(false);
    }
    fetchRole();
  }, []);

  return { role, loading };
}
