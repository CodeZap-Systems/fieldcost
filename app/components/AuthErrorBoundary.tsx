'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export function AuthErrorBoundary({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    // Set up global error handlers for auth errors
    const handleAuthError = async (error: any) => {
      if (!error) return;

      const errorMsg = error?.message?.toLowerCase() || '';

      // Handle refresh token errors
      if (
        errorMsg.includes('refresh token') ||
        errorMsg.includes('invalid refresh token') ||
        errorMsg.includes('session')
      ) {
        console.error('[AuthErrorBoundary] Caught auth error:', error.message);

        // Clear all auth storage
        try {
          localStorage.removeItem('supabase.auth.token');
          localStorage.removeItem('sb-mukaeylwmzztycajibhy-auth-token');
          sessionStorage.clear();

          // Sign out
          await supabase.auth.signOut().catch(() => {
            // Session already invalid - that's ok
          });

          // Redirect to login
          router.push('/auth/login?error=session_expired');
        } catch (err) {
          console.error('[AuthErrorBoundary] Cleanup failed:', err);
          router.push('/auth/login');
        }
      }
    };

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_OUT') {
          console.log('[AuthErrorBoundary] User signed out');
          router.push('/auth/login');
        }
      }
    );

    // Set up global error listener
    const originalConsoleError = console.error;
    console.error = (...args: any[]) => {
      originalConsoleError(...args);
      
      // Check if the error is auth-related
      const errorStr = JSON.stringify(args[0]);
      if (
        errorStr.includes('refresh token') ||
        errorStr.includes('Invalid Refresh Token')
      ) {
        handleAuthError(args[0]);
      }
    };

    return () => {
      subscription?.unsubscribe();
      console.error = originalConsoleError;
    };
  }, [router]);

  return <>{children}</>;
}
