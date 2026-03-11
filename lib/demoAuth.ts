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
  if (!normalized) return undefined;

  // For demo users, skip auth verification if service role key is missing
  // Demo users are for testing only and don't require strict auth validation
  const isDemoUser = normalized === "demo" || normalized.startsWith("demo-");
  
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    if (isDemoUser) {
      // For demo users, allow operation to proceed without auth verification
      console.warn(`Demo user "${normalized}" proceeding without auth verification (service role key missing)`);
      return undefined;
    }
    // For real users, authentication is required
    throw new EnsureAuthUserError(
      "Supabase service role key (SUPABASE_SERVICE_ROLE_KEY) is required. Add it to your environment variables."
    );
  }

  const lookup = await supabaseServer.auth.admin.getUserById(normalized);
  if (lookup.data?.user) return lookup.data.user;
  if (lookup.error && !/user not found/i.test(lookup.error.message)) {
    throw new EnsureAuthUserError(`Unable to verify Supabase auth user: ${lookup.error.message}`);
  }

  const alias = DEMO_LABELS[normalized] || `demo-${normalized.slice(0, 8)}`;
  const email = `${slugify(alias)}@fieldcost.demo`;

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
    throw new EnsureAuthUserError(`Unable to create demo auth user: ${created.error.message}`);
  }

  return created.data.user;
}
