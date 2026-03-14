/**
 * Session Recovery Utility
 * Handles refresh token errors and session invalidations gracefully
 */

import { supabase } from '@/lib/supabaseClient';

export async function recoverSession(): Promise<boolean> {
  try {
    console.log('[Session Recovery] Attempting to recover session...');

    // Try to get current session
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      console.log('[Session Recovery] No active session found');
      // Clear stale data
      localStorage.removeItem('supabase.auth.token');
      sessionStorage.clear();
      return false;
    }

    // Try to refresh the session
    const { data, error } = await supabase.auth.refreshSession();

    if (error) {
      console.error('[Session Recovery] Refresh failed:', error.message);
      // Clear invalid session
      localStorage.removeItem('supabase.auth.token');
      await supabase.auth.signOut();
      return false;
    }

    if (data.session) {
      console.log('[Session Recovery] Session recovered successfully');
      return true;
    }

    return false;
  } catch (err) {
    console.error('[Session Recovery] Error:', err);
    return false;
  }
}

/**
 * Handle refresh token errors
 * Call this when you get "Refresh Token Not Found" error
 */
export async function handleRefreshTokenError(): Promise<void> {
  console.warn('[Auth Error] Refresh Token Not Found - clearing session');

  // Clear all auth-related storage
  localStorage.removeItem('supabase.auth.token');
  localStorage.removeItem('sb-mukaeylwmzztycajibhy-auth-token');
  sessionStorage.clear();

  // Sign out to be safe
  try {
    await supabase.auth.signOut();
  } catch (e) {
    console.log('[Auth Error] Sign out failed (session already invalid)');
  }

  // Redirect to login
  if (typeof window !== 'undefined') {
    window.location.href = '/auth/login';
  }
}

/**
 * Setup global auth error handler
 */
export function setupAuthErrorHandler(): (() => void) | undefined {
  // Monitor auth state changes
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    async (event, session) => {
      console.log('[Auth State]', event, session ? 'logged in' : 'logged out');

      if (event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
        // Update UI state if needed
      }
    }
  );

  return () => subscription?.unsubscribe();
}
