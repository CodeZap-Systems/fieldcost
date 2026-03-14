import { randomUUID } from "node:crypto";
import { readStore, writeStore } from "./dataStore";

export type StoredCompanyProfile = {
  id: string;
  user_id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address_line1: string | null;
  address_line2: string | null;
  city: string | null;
  province: string | null;
  postal_code: string | null;
  country: string | null;
  logo_url: string | null;
  logo_external_url: string | null;
  invoice_template: string;
  default_currency: string;
  erp_targets: string[];
  reference?: string | null;
  updated_at?: string;
  is_demo?: boolean;
};

type CompanyProfileStoreEntry = {
  activeCompanyId: string | null;
  profiles: StoredCompanyProfile[];
};

type CompanyProfileStore = Record<string, CompanyProfileStoreEntry | StoredCompanyProfile>;

const FILE_NAME = "company-profiles.json";

async function readAll() {
  return readStore<CompanyProfileStore>(FILE_NAME, {});
}

async function writeAll(store: CompanyProfileStore) {
  await writeStore(FILE_NAME, store);
}

function isStoreEntry(value: unknown): value is CompanyProfileStoreEntry {
  return Boolean(
    value &&
    typeof value === "object" &&
    "profiles" in value &&
    Array.isArray((value as { profiles?: unknown }).profiles)
  );
}

function normalizeStoredProfile(payload: Partial<StoredCompanyProfile> | null | undefined, userId: string): StoredCompanyProfile {
  return {
    id:
      typeof payload?.id === "string" && payload.id.trim().length
        ? payload.id
        : randomUUID(),
    user_id: payload?.user_id ?? userId,
    name: payload?.name ?? "Untitled company",
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
    erp_targets: Array.isArray(payload?.erp_targets)
      ? payload.erp_targets.map(value => `${value}`.trim()).filter(Boolean)
      : [],
    reference: payload?.reference ?? null,
    updated_at: payload?.updated_at ?? new Date().toISOString(),
  };
}

function upgradeEntry(value: CompanyProfileStoreEntry | StoredCompanyProfile | undefined, userId: string): CompanyProfileStoreEntry {
  if (isStoreEntry(value)) {
    const normalizedProfiles = value.profiles.map(profile => normalizeStoredProfile(profile, userId));
    const activeCandidate = value.activeCompanyId;
    const resolvedActive =
      activeCandidate && normalizedProfiles.some(profile => profile.id === activeCandidate)
        ? activeCandidate
        : normalizedProfiles[0]?.id ?? null;
    return { activeCompanyId: resolvedActive, profiles: normalizedProfiles };
  }
  if (value && typeof value === "object") {
    const normalized = normalizeStoredProfile(value as StoredCompanyProfile, userId);
    return { activeCompanyId: normalized.id, profiles: [normalized] };
  }
  return { activeCompanyId: null, profiles: [] };
}

function ensureEntry(store: CompanyProfileStore, userId: string): CompanyProfileStoreEntry {
  const existing = store[userId];
  if (isStoreEntry(existing)) {
    return existing;
  }
  if (existing) {
    const upgraded = upgradeEntry(existing, userId);
    store[userId] = upgraded;
    return upgraded;
  }
  const created: CompanyProfileStoreEntry = { activeCompanyId: null, profiles: [] };
  store[userId] = created;
  return created;
}

export async function getStoredCompanyProfile(userId: string) {
  const entry = await getStoredCompanyProfiles(userId);
  if (entry.activeCompanyId) {
    const active = entry.profiles.find(profile => profile.id === entry.activeCompanyId);
    if (active) return active;
  }
  return entry.profiles[0] ?? null;
}

export async function getStoredCompanyProfiles(userId: string) {
  const store = await readAll();
  const entry = store[userId];
  if (isStoreEntry(entry)) {
    return entry;
  }
  if (entry) {
    const upgraded = upgradeEntry(entry, userId);
    store[userId] = upgraded;
    await writeAll(store);
    return upgraded;
  }
  return { activeCompanyId: null, profiles: [] };
}

export async function saveStoredCompanyProfile(profile: StoredCompanyProfile, options: { setActive?: boolean } = {}) {
  const store = await readAll();
  const entry = ensureEntry(store, profile.user_id);
  const idx = entry.profiles.findIndex(existing => existing.id === profile.id);
  if (idx >= 0) {
    entry.profiles[idx] = profile;
  } else {
    entry.profiles.push(profile);
  }
  if (options.setActive || !entry.activeCompanyId) {
    entry.activeCompanyId = profile.id;
  }
  await writeAll(store);
  return profile;
}

export async function replaceStoredCompanyProfiles(userId: string, profiles: StoredCompanyProfile[], activeCompanyId?: string | null) {
  const store = await readAll();
  store[userId] = {
    profiles,
    activeCompanyId: activeCompanyId ?? profiles[0]?.id ?? null,
  };
  await writeAll(store);
  return store[userId];
}

export async function setActiveStoredCompanyProfile(userId: string, companyId: string | null) {
  const store = await readAll();
  const entry = ensureEntry(store, userId);
  entry.activeCompanyId = companyId;
  await writeAll(store);
}
