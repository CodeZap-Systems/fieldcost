/**
 * Supabase OAuth Callback Route
 *
 * Handles the redirect from Supabase Auth after a user completes an
 * OAuth flow (e.g. "Sign in with Microsoft / Azure AD").
 *
 * Supabase redirects here with a `code` query parameter. We exchange it
 * for a session, then redirect the user to the dashboard (or the `next`
 * query param if provided).
 *
 * Configure the redirect URI in:
 *   - Supabase Dashboard → Auth → URL Configuration → Redirect URLs
 *     Add: https://<your-domain>/auth/callback
 *   - Microsoft Entra app registration → Redirect URIs
 *     Add: https://<your-supabase-project>.supabase.co/auth/v1/callback
 *
 * See BETA_ACCESS.md and .env.example for required environment variables.
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (!code) {
    // No auth code — redirect to login with an error indicator
    return NextResponse.redirect(
      new URL("/auth/login?error=missing_code", origin)
    );
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.redirect(
      new URL("/auth/login?error=configuration", origin)
    );
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false },
  });

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("[auth/callback] Code exchange failed:", error.message);
    return NextResponse.redirect(
      new URL(`/auth/login?error=${encodeURIComponent(error.message)}`, origin)
    );
  }

  // Redirect to the intended destination (strip leading slash for safety)
  const safeNext = next.startsWith("/") ? next : "/dashboard";
  return NextResponse.redirect(new URL(safeNext, origin));
}
