import { randomUUID } from "crypto";
import type { User } from "@supabase/supabase-js";
import { supabaseServer } from "./supabaseServer";
import { DEMO_ADMIN_USER_ID, DEMO_SUBCONTRACTOR_USER_ID } from "./userIdentity";

const DEMO_LABELS: Record<string, string> = {
  [DEMO_ADMIN_USER_ID]: "demo-admin",
  [DEMO_SUBCONTRACTOR_USER_ID]: "demo-subcontractor",
};

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "demo";
}

export class EnsureAuthUserError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.name = "EnsureAuthUserError";
  }
}

export async function ensureAuthUser(userId?: string | null): Promise<User | undefined> {
  const normalized = userId?.trim();
  if (!normalized) {
    console.log('[ensureAuthUser] No user ID provided, returning undefined');
    return undefined;
  }

  // For demo users, skip auth verification if service role key is missing
  // Demo users are for testing only and don't require strict auth validation
  const isDemoUser = normalized === "demo" || normalized.startsWith("demo-");
  console.log(`[ensureAuthUser] Processing user: "${normalized}" (isDemoUser: ${isDemoUser})`);
  
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.warn(`[ensureAuthUser] Missing SUPABASE_SERVICE_ROLE_KEY (isDemoUser: ${isDemoUser})`);
    if (isDemoUser) {
      // For demo users, allow operation to proceed without auth verification
      console.warn(`[ensureAuthUser] Demo user "${normalized}" proceeding without auth verification`);
      return undefined;
    }
    // For real users, authentication is required
    const err = "Supabase service role key (SUPABASE_SERVICE_ROLE_KEY) is required. Add it to your environment variables.";
    console.error(`[ensureAuthUser] Error for non-demo user: ${err}`);
    throw new EnsureAuthUserError(err);
  }

  console.log(`[ensureAuthUser] Looking up auth user: "${normalized}"`);
  const lookup = await supabaseServer.auth.admin.getUserById(normalized);
  
  if (lookup.data?.user) {
    console.log(`[ensureAuthUser] Found existing user: "${normalized}"`);
    return lookup.data.user;
  }
  
  if (lookup.error) {
    console.log(`[ensureAuthUser] Lookup error: ${lookup.error.message}`);
    if (!/user not found/i.test(lookup.error.message)) {
      const errMsg = `Unable to verify Supabase auth user: ${lookup.error.message}`;
      console.error(`[ensureAuthUser] ${errMsg}`);
      throw new EnsureAuthUserError(errMsg);
    }
  }

  const alias = DEMO_LABELS[normalized] || `demo-${normalized.slice(0, 8)}`;
  const email = `${slugify(alias)}@fieldcost.demo`;
  console.log(`[ensureAuthUser] Creating new demo user: "${normalized}" (alias: "${alias}", email: "${email}")`);

  const created = await supabaseServer.auth.admin.createUser({
    id: normalized,
    email,
    email_confirm: true,
    password: randomUUID(),
    user_metadata: {
      label: alias,
      isDemo: true,
    },
    app_metadata: {
      provider: "demo-seed",
    },
  });

  if (created.error) {
    const errMsg = `Unable to create demo auth user: ${created.error.message}`;
    console.error(`[ensureAuthUser] ${errMsg}`);
    throw new EnsureAuthUserError(errMsg);
  }

  console.log(`[ensureAuthUser] Successfully created user: "${normalized}"`);
  return created.data.user;
}
