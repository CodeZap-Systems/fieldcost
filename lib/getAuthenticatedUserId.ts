/**
 * Server-side utility to get authenticated user ID from request
 * Replaces the insecure pattern of using query parameters
 */

import { supabaseServer } from "./supabaseServer";

export async function getAuthenticatedUserId() {
  try {
    const { data: { user }, error } = await supabaseServer.auth.getUser();
    
    if (error || !user) {
      console.warn("[getAuthenticatedUserId] Failed to get authenticated user", error?.message);
      return null;
    }
    
    return user.id;
  } catch (err) {
    console.error("[getAuthenticatedUserId] Error:", err);
    return null;
  }
}
