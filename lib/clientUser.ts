"use client";

import { supabase } from "./supabaseClient";
import { DEFAULT_DEMO_USER_ID, isDemoUserId, normalizeUserId } from "./userIdentity";

export async function ensureClientUserId() {
  const hasWindow = typeof window !== "undefined";

  const cacheUserId = (value: string) => {
    if (hasWindow) {
      localStorage.setItem("demoUserId", value);
    }
  };

  const readCachedUserId = () => {
    if (!hasWindow) return undefined;
    return normalizeUserId(localStorage.getItem("demoUserId"), undefined);
  };

  if (hasWindow && localStorage.getItem("demoSession") === "true") {
    const demoCached = readCachedUserId();
    if (demoCached && isDemoUserId(demoCached)) {
      return demoCached;
    }
  }

  try {
    const { data, error } = await supabase.auth.getUser();
    if (!error) {
      const derived = data?.user?.user_metadata?.demoUserId || data?.user?.id;
      const resolved = normalizeUserId(derived, undefined);
      if (resolved) {
        if (hasWindow && !isDemoUserId(resolved)) {
          localStorage.removeItem("demoSession");
        }
        cacheUserId(resolved);
        return resolved;
      }
    }
  } catch (err) {
    console.warn("Unable to resolve Supabase user id", err);
  }

  const cached = readCachedUserId();
  if (cached) {
    return cached;
  }

  cacheUserId(DEFAULT_DEMO_USER_ID);
  return DEFAULT_DEMO_USER_ID;
}
