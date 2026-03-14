import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabaseClient";
import { supabaseServer } from "../../../lib/supabaseServer";
import { resolveServerUserId } from "../../../lib/serverUser";
import { ensureAuthUser, EnsureAuthUserError } from "../../../lib/demoAuth";
import { isDemoUserId } from "../../../lib/userIdentity";
import { DEMO_COMPANY_ID } from "../../../lib/demoConstants";
import {
  getStoredCompanyProfile,
  getStoredCompanyProfiles,
  replaceStoredCompanyProfiles,
  saveStoredCompanyProfile,
  setActiveStoredCompanyProfile,
  type StoredCompanyProfile,
} from "../../../lib/companyProfileStore";

const TEMPLATE_OPTIONS = new Set(["standard", "detailed"]);
const ERP_OPTIONS = new Set(["sage-bca-sa", "xero", "quickbooks"]);

const sanitize = (value?: unknown) => {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length ? trimmed : null;
};

async function resolveUserContext(req: Request, provided?: string | null) {
  // Try to get user from Authorization header first
  const authHeader = req.headers.get("authorization");
  let authUserId: string | null = null;
  
  if (authHeader?.startsWith("Bearer ")) {
    try {
      const token = authHeader.slice(7);
      const { data } = await supabaseServer.auth.getUser(token);
      if (data?.user?.id) {
        authUserId = data.user.id;
        console.log(`[resolveUserContext] ✅ Got authenticated user: ${authUserId}`);
        return { userId: authUserId };
      }
    } catch (err) {
      console.warn("[resolveUserContext] ⚠️  Failed to get user from Authorization header:", err);
    }
  }

  // Fallback: Use provided or query parameter
  const { searchParams } = new URL(req.url);
  const fallback = provided ?? searchParams.get("user_id");
  const resolved = resolveServerUserId(fallback);
  console.warn(`[resolveUserContext] ⚠️  No auth header, using fallback user: ${resolved}`);
  return { userId: resolved };
}

function isMissingTableError(error: unknown) {
  return Boolean(
    error &&
      typeof error === "object" &&
      "code" in error &&
      (error as { code?: string }).code === "PGRST205"
  );
}

function coerceCompanyId(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (trimmed.length) return trimmed;
  }
  return null;
}

type ProfileInput = Partial<StoredCompanyProfile> | null | undefined;

function normalizeProfile(payload: ProfileInput, userId: string): StoredCompanyProfile {
  const id = coerceCompanyId((payload as { id?: unknown })?.id) ?? randomUUID();
  return {
    id,
    user_id: userId,
    name: payload?.name ?? "",
    email: payload?.email ?? null,
    phone: payload?.phone ?? null,
    address_line1: payload?.address_line1 ?? null,
    address_line2: payload?.address_line2 ?? null,
    city: payload?.city ?? null,
    province: payload?.province ?? null,
    postal_code: payload?.postal_code ?? null,
    country: payload?.country ?? null,
    logo_url: payload?.logo_url ?? null,
    logo_external_url: payload?.logo_external_url ?? null,
    invoice_template: payload?.invoice_template ?? "standard",
    default_currency: payload?.default_currency ?? "ZAR",
    erp_targets: Array.isArray(payload?.erp_targets) ? payload.erp_targets : [],
    updated_at: payload?.updated_at ?? new Date().toISOString(),
    is_demo: (payload as any)?.is_demo === true,
  };
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const requestedCompanyId = coerceCompanyId(url.searchParams.get("company_id"));
  let userId: string;
  try {
    ({ userId } = await resolveUserContext(req));
    
    const isDemo = isDemoUserId(userId);
    
    // Get user's own companies
    const { data, error } = await supabaseServer
      .from("company_profiles")
      .select("*")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false });
    if (error && !isMissingTableError(error)) {
      console.error("GET /api/company error", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    let list = Array.isArray(data) ? data : data ? [data] : [];
    
    // CRITICAL: Only fetch demo companies for demo users (not authenticated users)
    let demoCompaniesData = [];
    if (isDemo) {
      try {
        const { data: demoCompanies, error: demoError } = await supabaseServer
          .from("company_profiles")
          .select("*")
          .eq("is_demo", true)
          .order("name", { ascending: true });
        
        if (!demoError && Array.isArray(demoCompanies)) {
          demoCompaniesData = demoCompanies;
        }
      } catch (err) {
        console.warn("[GET /api/company] Could not fetch demo companies:", err);
      }
    }
    
    // If user has no companies, create a default one using registered company name
    if (!list.length && !isDemo) {
      console.log(`Auto-creating default company for user ${userId}`);
      
      // Try to get registered company name from auth user metadata
      let registeredCompanyName = "My Company"; // Default fallback
      try {
        const { data: authData } = await supabase.auth.getUser();
        if (authData?.user?.user_metadata?.companyName) {
          registeredCompanyName = authData.user.user_metadata.companyName;
        }
      } catch (err) {
        console.warn("Could not fetch auth metadata for company name:", err);
      }
      
      const defaultCompany = normalizeProfile({
        id: randomUUID(),
        user_id: userId,
        name: registeredCompanyName,  // Use registered name, not hardcoded
        email: null,
        invoice_template: "standard",
        default_currency: "ZAR",
      }, userId);
      
      const { data: created, error: createError } = await supabaseServer
        .from("company_profiles")
        .insert([defaultCompany])
        .select()
        .single();
      
      if (!createError && created) {
        const createdNormalized = normalizeProfile(created, userId);
        await replaceStoredCompanyProfiles(userId, [createdNormalized], createdNormalized.id);
        return NextResponse.json({ company: createdNormalized, companies: [createdNormalized] });
      }
    }
    
    // Combine user's companies with demo companies ONLY for demo users
    const allCompanies = isDemo ? [...list, ...demoCompaniesData] : list;
    
    if (allCompanies.length) {
      const normalized = allCompanies.map(entry => normalizeProfile(entry, userId));
      
      console.log(`[GET /api/company] userId=${userId}, isDemo=${isDemo}, allCompanies=${JSON.stringify(normalized.map(c => ({ id: c.id, name: c.name, is_demo: c.is_demo })))}`);
      
      // Separate owned companies from demo companies
      const ownedCompanies = normalized.filter(p => !p.is_demo);
      const demoCompanies = normalized.filter(p => p.is_demo === true);
      
      console.log(`[GET /api/company] ownedCompanies=${JSON.stringify(ownedCompanies.map(c => ({ id: c.id, name: c.name })))}, demoCompanies=${JSON.stringify(demoCompanies.map(c => ({ id: c.id, name: c.name })))}`);
      
      // CRITICAL: ALWAYS put owned (non-demo) companies FIRST for ALL users
      // This ensures live companies are preferred as default selection
      const validList = [...ownedCompanies, ...demoCompanies];
      
      const stored = await getStoredCompanyProfiles(userId);
      
      // Get preferred company ID - but never default to demo company for authenticated users
      let preferredId = requestedCompanyId || stored.activeCompanyId || null;
      
      console.log(`[GET /api/company] requestedCompanyId=${requestedCompanyId}, stored.activeCompanyId=${stored.activeCompanyId}, preferredId=${preferredId}`);
      
      // For authenticated users, validate that preferred company is NOT a demo company
      if (!isDemo && preferredId) {
        const preferred = normalized.find(p => p.id === preferredId);
        if (preferred?.is_demo) {
          // Ignore demo company preference for authenticated users
          console.log(`[GET /api/company] Ignoring demo company preference for authenticated user`);

          preferredId = null;
        }
      }
      
      const active = preferredId
        ? normalized.find(profile => profile.id === preferredId && (!isDemo ? !profile.is_demo : true)) ?? validList[0]
        : validList[0] ?? null;
      
      console.log(`[GET /api/company] FINAL SELECTION: active=${JSON.stringify({ id: active?.id, name: active?.name, is_demo: active?.is_demo })}`);
      
      if (active) {
        await replaceStoredCompanyProfiles(userId, validList, active.id);
      } else {
        await replaceStoredCompanyProfiles(userId, validList, null);
      }
      return NextResponse.json({ company: active ?? null, companies: validList });
    }

    // Fallback to localStorage
    const fallback = await getStoredCompanyProfiles(userId);
    if (fallback.profiles.length) {
      const fallbackPreferredId = requestedCompanyId || fallback.activeCompanyId || null;
      
      // Remove demo companies from fallback for authenticated users
      const fallbackProfiles = isDemo 
        ? fallback.profiles 
        : fallback.profiles.filter(p => !p.is_demo);
      
      // Validate preferred company is not demo for authenticated users
      let validPreferredId = fallbackPreferredId;
      if (!isDemo && validPreferredId) {
        const preferred = fallbackProfiles.find(p => p.id === validPreferredId);
        if (!preferred?.id) {
          validPreferredId = null;
        }
      }
      
      const fallbackActive = validPreferredId
        ? fallbackProfiles.find(profile => profile.id === validPreferredId) ?? fallbackProfiles[0]
        : fallbackProfiles[0] ?? null;
      if (fallbackActive) {
        await setActiveStoredCompanyProfile(userId, fallbackActive.id);
      }
      return NextResponse.json({ company: fallbackActive ?? null, companies: fallbackProfiles });
    }

    // No companies anywhere - this shouldn't happen for non-demo users now
    return NextResponse.json({ company: null, companies: [] });
  } catch (err) {
    console.error("GET /api/company exception", err);
    if (isMissingTableError(err)) {
      const fallback = await getStoredCompanyProfiles(userId);
      const fallbackPreferredId = url.searchParams.get("company_id") || fallback.activeCompanyId || fallback.profiles[0]?.id || null;
      const fallbackActive = fallbackPreferredId
        ? fallback.profiles.find(profile => profile.id === fallbackPreferredId) ?? fallback.profiles[0]
        : fallback.profiles[0] ?? null;
      return NextResponse.json({ company: fallbackActive ?? null, companies: fallback.profiles });
    }
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  let body: Record<string, unknown> | null = null;
  try {
    body = await req.json();
    const { userId } = await resolveUserContext(req, typeof body?.user_id === 'string' ? body.user_id : null);
    try {
      await ensureAuthUser(userId);
    } catch (error) {
      if (error instanceof EnsureAuthUserError) {
        return NextResponse.json({ error: error.message }, { status: error.statusCode });
      }
      console.error("PUT /api/company ensureAuthUser error", error);
      return NextResponse.json({ error: "Unable to verify user context" }, { status: 500 });
    }

    const name = sanitize(body?.name);
    if (!name) {
      return NextResponse.json({ error: "Company name is required" }, { status: 400 });
    }

    const erpTargets = Array.isArray(body?.erp_targets)
      ? body.erp_targets.map(value => `${value}`.trim().toLowerCase()).filter(value => ERP_OPTIONS.has(value))
      : [];
    const invoiceTemplate = TEMPLATE_OPTIONS.has(`${body?.invoice_template}`.toLowerCase())
      ? `${body.invoice_template}`.toLowerCase()
      : "standard";

    const payload = {
      user_id: userId,
      name,
      email: sanitize(body?.email),
      phone: sanitize(body?.phone),
      address_line1: sanitize(body?.address_line1),
      address_line2: sanitize(body?.address_line2),
      city: sanitize(body?.city),
      province: sanitize(body?.province),
      postal_code: sanitize(body?.postal_code),
      country: sanitize(body?.country) ?? "South Africa",
      logo_url: sanitize(body?.logo_url),
      logo_external_url: sanitize(body?.logo_external_url),
      invoice_template: invoiceTemplate,
      default_currency: sanitize(body?.default_currency)?.toUpperCase() ?? "ZAR",
      erp_targets: erpTargets,
      updated_at: new Date().toISOString(),
    };

    const requestedCompanyId = coerceCompanyId(body?.id ?? body?.company_id);
    let savedProfile: StoredCompanyProfile | null = null;
    let missingTable = false;

    if (requestedCompanyId) {
      const numericId = Number(requestedCompanyId);
      if (Number.isFinite(numericId)) {
        const { data, error } = await supabaseServer
          .from("company_profiles")
          .update(payload)
          .eq("id", numericId)
          .eq("user_id", userId)
          .select("*")
          .maybeSingle();
        if (error) {
          if (isMissingTableError(error)) {
            missingTable = true;
          } else {
            console.error("PUT /api/company error", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
          }
        } else if (data) {
          savedProfile = normalizeProfile(data, userId);
        }
      }
    }

    if (!savedProfile && !missingTable) {
      const { data, error } = await supabaseServer
        .from("company_profiles")
        .insert([payload])
        .select("*")
        .maybeSingle();
      if (error) {
        if (isMissingTableError(error)) {
          missingTable = true;
        } else {
          console.error("PUT /api/company insert error", error);
          return NextResponse.json({ error: error.message }, { status: 500 });
        }
      } else if (data) {
        savedProfile = normalizeProfile(data, userId);
      }
    }

    if (missingTable || !savedProfile) {
      const fallbackProfile = normalizeProfile({ ...payload, id: requestedCompanyId } as ProfileInput, userId);
      await saveStoredCompanyProfile(fallbackProfile, { setActive: true });
      const fallback = await getStoredCompanyProfiles(userId);
      return NextResponse.json({ company: fallbackProfile, companies: fallback.profiles });
    }

    const { data: listData, error: listError } = await supabaseServer
      .from("company_profiles")
      .select("*")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false });

    if (listError && !isMissingTableError(listError)) {
      console.error("PUT /api/company list error", listError);
      return NextResponse.json({ error: listError.message }, { status: 500 });
    }

    if (listError) {
      const fallback = await getStoredCompanyProfiles(userId);
      await saveStoredCompanyProfile(savedProfile, { setActive: true });
      return NextResponse.json({ company: savedProfile, companies: fallback.profiles });
    }

    const normalizedList = Array.isArray(listData)
      ? listData.map(entry => normalizeProfile(entry, userId))
      : [];
    await replaceStoredCompanyProfiles(userId, normalizedList, savedProfile.id);

    if (userId) {
      supabaseServer.auth.admin
        .updateUserById(userId, { user_metadata: { companyOnboarded: true } })
        .catch(err => console.warn("/api/company metadata update", err?.message ?? err));
    }

    const activeResponse = normalizedList.find(profile => profile.id === savedProfile?.id) ?? savedProfile;
    return NextResponse.json({ company: activeResponse, companies: normalizedList });
  } catch (err) {
    console.error("PUT /api/company exception", err);
    if (isMissingTableError(err) && body) {
      const { userId } = await resolveUserContext(req, typeof body?.user_id === 'string' ? body.user_id : null);
      const fallbackPayload = normalizeProfile(body as ProfileInput, userId);
      await saveStoredCompanyProfile(fallbackPayload, { setActive: true });
      const fallback = await getStoredCompanyProfiles(userId);
      return NextResponse.json({ company: fallbackPayload, companies: fallback.profiles });
    }
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
