/**
 * Next.js Edge Middleware — Beta Access Gate + Auth Guard
 *
 * Runs on every request BEFORE rendering. Responsibilities:
 *   1. Check that the user has an active Supabase session.
 *   2. If the app is running in BETA_GATING mode, verify the user is in the
 *      beta_access allowlist (by user_id or email).
 *   3. Redirect unauthenticated/unauthorised users appropriately.
 *
 * Protected routes: everything under /dashboard and /api (except auth routes).
 * Public routes: /auth/*, /api/registrations (sign-up), root.
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Routes that are always public (no auth or beta check required)
const PUBLIC_PREFIXES = [
  "/auth/",
  "/api/registrations",
  "/_next/",
  "/favicon",
];

function isPublic(pathname: string): boolean {
  return PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public paths through without any checks
  if (isPublic(pathname) || pathname === "/") {
    return NextResponse.next();
  }

  // --- 1. Auth check via Supabase session cookie ---
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    // If env vars are missing in middleware context, fail open to avoid
    // a hard crash loop — the individual API routes will throw properly.
    return NextResponse.next();
  }

  // Read the access token from the Authorization header or the Supabase
  // cookie. Supabase stores the session in a cookie named
  // `sb-<project-ref>-auth-token`.
  const authHeader = request.headers.get("authorization") ?? "";
  const accessToken = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : null;

  // Use the service role client to validate the JWT without needing cookies
  const adminClient = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { persistSession: false },
  });

  let userId: string | null = null;
  let userEmail: string | null = null;

  if (accessToken) {
    const { data } = await adminClient.auth.getUser(accessToken);
    if (data?.user) {
      userId = data.user.id;
      userEmail = data.user.email ?? null;
    }
  } else {
    // Try reading from the Supabase auth cookie
    const cookieHeader = request.headers.get("cookie") ?? "";
    const cookieMatch = cookieHeader.match(/sb-[a-z0-9]+-auth-token=([^;]+)/);
    if (cookieMatch) {
      try {
        const tokenData = JSON.parse(decodeURIComponent(cookieMatch[1]));
        const token = tokenData?.access_token;
        if (token) {
          const { data } = await adminClient.auth.getUser(token);
          if (data?.user) {
            userId = data.user.id;
            userEmail = data.user.email ?? null;
          }
        }
      } catch {
        // Malformed cookie — treat as unauthenticated
      }
    }
  }

  // Unauthenticated — redirect to login (only for non-API routes)
  if (!userId) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
    }
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // --- 2. Beta access gate ---
  // Only enforced when BETA_GATING=true is set in the environment.
  const betaGating = process.env.BETA_GATING === "true";
  if (betaGating) {
    // Check by user_id first (most reliable), then fall back to email match.
    // Use separate queries to avoid string interpolation in filter expressions.
    let hasAccess = false;

    const { data: byUserId } = await adminClient
      .from("beta_access")
      .select("id")
      .eq("user_id", userId)
      .is("revoked_at", null)
      .limit(1)
      .maybeSingle();

    if (byUserId) {
      hasAccess = true;
    } else if (userEmail) {
      const { data: byEmail } = await adminClient
        .from("beta_access")
        .select("id")
        .ilike("email", userEmail)
        .is("revoked_at", null)
        .limit(1)
        .maybeSingle();
      if (byEmail) hasAccess = true;
    }

    if (!hasAccess) {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json(
          { error: "Beta access required. Contact your administrator." },
          { status: 403 }
        );
      }
      return NextResponse.redirect(new URL("/auth/beta-waitlist", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT static files and Next.js internals.
     * We want to gate /dashboard/*, /api/*, etc. but not /_next/* or /favicon.
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
