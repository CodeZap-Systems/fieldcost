"use client";

/**
 * OAuth Callback Page
 *
 * Handles the redirect from Supabase after Microsoft Azure SSO.
 * Supabase appends `code` and `state` query params; this page exchanges
 * the authorisation code for a user session, then navigates to the dashboard.
 *
 * Redirect URI to register in:
 *   1. Azure Portal → App registrations → <FieldCost app> → Authentication →
 *      Redirect URIs:  https://<your-domain>/auth/callback
 *   2. Supabase Dashboard → Authentication → URL Configuration →
 *      Redirect URLs:  https://<your-domain>/auth/callback
 */

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "../../../lib/supabaseClient";

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Derive OAuth provider errors directly from URL – no setState needed
  const oauthError = searchParams.get("error");
  const oauthErrorDescription = searchParams.get("error_description");
  const next = searchParams.get("next") ?? "/dashboard";

  // Only used for errors that happen during the code-exchange (async)
  const [exchangeError, setExchangeError] = useState<string | null>(null);

  useEffect(() => {
    // If Microsoft returned an OAuth error there is nothing to exchange
    if (oauthError) return;

    const code = searchParams.get("code");

    if (!code) {
      // Supabase may use a hash fragment (#access_token=…) for the implicit flow.
      // Listen for the SIGNED_IN event as a fallback.
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
        if (event === "SIGNED_IN") {
          subscription.unsubscribe();
          router.replace(next);
        }
      });
      return () => subscription.unsubscribe();
    }

    // Exchange the authorization code for a session (async – no rule violation)
    supabase.auth
      .exchangeCodeForSession(code)
      .then(({ error }) => {
        if (error) {
          console.error("[auth/callback] exchangeCodeForSession:", error);
          setExchangeError("Failed to complete Microsoft sign-in. Please try again.");
        } else {
          router.replace(next);
        }
      });
  }, [router, searchParams, oauthError, next]);

  // Determine what error message to show (if any)
  const errorMessage = oauthError
    ? (oauthErrorDescription ?? "Microsoft sign-in was cancelled or failed. Please try again.")
    : exchangeError;

  if (errorMessage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Sign-in failed</h2>
          <p className="text-gray-600 text-sm mb-6">{errorMessage}</p>
          <a
            href="/auth/login"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
          >
            Back to Sign In
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="inline-block w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-gray-600 text-sm">Completing Microsoft sign-in…</p>
      </div>
    </div>
  );
}

export default function CallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="inline-block w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <CallbackContent />
    </Suspense>
  );
}
