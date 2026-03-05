import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabaseClient";
import { supabaseServer } from "../../../lib/supabaseServer";
import { resolveServerUserId } from "../../../lib/serverUser";
import { ensureAuthUser, EnsureAuthUserError } from "../../../lib/demoAuth";
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
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    console.warn("/api/company supabase auth lookup warning", error.message);
  }
  const authUserId = data?.user?.id;
  if (authUserId) {
    return { userId: authUserId };
  }
  const { searchParams } = new URL(req.url);
  const fallback = provided ?? searchParams.get("user_id");
  return { userId: resolveServerUserId(fallback) };
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
  };
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const requestedCompanyId = coerceCompanyId(url.searchParams.get("company_id"));
  let userId: string;
  try {
    ({ userId } = await resolveUserContext(req));
    const { data, error } = await supabaseServer
      .from("company_profiles")
      .select("*")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false });
    if (error && !isMissingTableError(error)) {
      console.error("GET /api/company error", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const list = Array.isArray(data) ? data : data ? [data] : [];
    if (list.length) {
      const normalized = list.map(entry => normalizeProfile(entry, userId));
      const stored = await getStoredCompanyProfiles(userId);
      const preferredId =
        requestedCompanyId || stored.activeCompanyId || normalized[0]?.id || null;
      const active = preferredId
        ? normalized.find(profile => profile.id === preferredId) ?? normalized[0]
        : normalized[0] ?? null;
      if (active) {
        await replaceStoredCompanyProfiles(userId, normalized, active.id);
      } else {
        await replaceStoredCompanyProfiles(userId, normalized, null);
      }
      return NextResponse.json({ company: active ?? null, companies: normalized });
    }

    const fallback = await getStoredCompanyProfiles(userId);
    const fallbackPreferredId = requestedCompanyId || fallback.activeCompanyId || fallback.profiles[0]?.id || null;
    const fallbackActive = fallbackPreferredId
      ? fallback.profiles.find(profile => profile.id === fallbackPreferredId) ?? fallback.profiles[0]
      : fallback.profiles[0] ?? null;
    if (fallbackActive) {
      await setActiveStoredCompanyProfile(userId, fallbackActive.id);
    }
    return NextResponse.json({ company: fallbackActive ?? null, companies: fallback.profiles });
  } catch (err) {
    console.error("GET /api/company exception", err);
    if (isMissingTableError(err)) {
      const fallback = await getStoredCompanyProfiles(userId);
      const fallbackPreferredId = requestedCompanyId || fallback.activeCompanyId || fallback.profiles[0]?.id || null;
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
    const { userId } = await resolveUserContext(req, body?.user_id);
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
      const { userId } = await resolveUserContext(req, body?.user_id);
      const fallbackPayload = normalizeProfile(body as ProfileInput, userId);
      await saveStoredCompanyProfile(fallbackPayload, { setActive: true });
      const fallback = await getStoredCompanyProfiles(userId);
      return NextResponse.json({ company: fallbackPayload, companies: fallback.profiles });
    }
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
