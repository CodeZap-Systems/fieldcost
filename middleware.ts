import { NextRequest, NextResponse } from 'next/server';

const LOCKED_PATTERNS = [
  /^\/projects\/[^/]+\/wip$/,
  /^\/projects\/[^/]+\/approvals$/,
  /^\/projects\/[^/]+\/gantt$/,
  /^\/settings\/erp$/,
];

function isLockedPath(pathname: string) {
  return LOCKED_PATTERNS.some(pattern => pattern.test(pathname));
}

function decodeJwtSub(token: string): string | null {
  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(atob(base64));
    return payload?.sub || null;
  } catch {
    return null;
  }
}

function extractSupabaseAccessToken(request: NextRequest): string | null {
  const cookies = request.cookies.getAll();
  for (const cookie of cookies) {
    if (cookie.name.endsWith('-auth-token')) {
      try {
        const parsed = JSON.parse(cookie.value);
        if (Array.isArray(parsed) && typeof parsed[0] === 'string') return parsed[0];
        if (typeof parsed?.access_token === 'string') return parsed.access_token;
      } catch {
        continue;
      }
    }
  }
  return null;
}

async function getSubscriptionTier(accessToken: string, userId: string): Promise<string | null> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnonKey) return null;

  const response = await fetch(`${supabaseUrl}/rest/v1/profiles?select=subscription_tier&id=eq.${userId}&limit=1`, {
    headers: {
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${accessToken}`,
    },
    cache: 'no-store',
  });

  if (!response.ok) return null;
  const payload = await response.json();
  if (!Array.isArray(payload) || !payload.length) return null;
  return payload[0]?.subscription_tier || null;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (!isLockedPath(pathname)) return NextResponse.next();

  const accessToken = extractSupabaseAccessToken(request);
  const userId = accessToken ? decodeJwtSub(accessToken) : null;
  if (!accessToken || !userId) {
    return NextResponse.redirect(new URL('/billing?locked=true', request.url));
  }

  const tier = await getSubscriptionTier(accessToken, userId);
  if ((tier || 'starter') === 'starter') {
    return NextResponse.redirect(new URL('/billing?locked=true', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/projects/:path*', '/settings/:path*'],
};
