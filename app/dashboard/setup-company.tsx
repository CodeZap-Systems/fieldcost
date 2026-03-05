"use client";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { ensureClientUserId } from "../../lib/clientUser";
import { persistActiveCompanyId, readActiveCompanyId } from "../../lib/companySwitcher";

type CompanyProfile = {
  id?: string;
  name: string;
  email: string;
  phone: string;
  address_line1: string;
  address_line2: string;
  city: string;
  province: string;
  postal_code: string;
  country: string;
  logo_url: string;
  logo_external_url: string;
  invoice_template: "standard" | "detailed";
  default_currency: string;
  erp_targets: string[];
};

const ERP_OPTIONS = [
  { value: "sage-bca-sa", label: "Sage Business Cloud Accounting (South Africa)" },
  { value: "xero", label: "Xero" },
  { value: "quickbooks", label: "QuickBooks Online" },
];

const DEFAULT_COMPANY: CompanyProfile = {
  id: undefined,
  name: "",
  email: "",
  phone: "",
  address_line1: "",
  address_line2: "",
  city: "",
  province: "",
  postal_code: "",
  country: "South Africa",
  logo_url: "",
  logo_external_url: "",
  invoice_template: "standard",
  default_currency: "ZAR",
  erp_targets: ["sage-bca-sa"],
};

function normalizeCompanyPayload(payload?: Partial<CompanyProfile> & { [key: string]: unknown } | null): CompanyProfile {
  if (!payload) return { ...DEFAULT_COMPANY, id: undefined };
  return {
    id: payload.id ? String(payload.id) : undefined,
    name: payload.name ?? "",
    email: payload.email ?? "",
    phone: payload.phone ?? "",
    address_line1: payload.address_line1 ?? "",
    address_line2: payload.address_line2 ?? "",
    city: payload.city ?? "",
    province: payload.province ?? "",
    postal_code: payload.postal_code ?? "",
    country: payload.country ?? "South Africa",
    logo_url: payload.logo_url ?? "",
    logo_external_url: payload.logo_external_url ?? "",
    invoice_template: (payload.invoice_template as CompanyProfile["invoice_template"]) ?? "standard",
    default_currency: payload.default_currency ?? "ZAR",
    erp_targets:
      Array.isArray(payload.erp_targets) && payload.erp_targets.length
        ? [...payload.erp_targets]
        : [...DEFAULT_COMPANY.erp_targets],
  };
}

const LOGO_BUCKET = "branding";

export default function SetupCompanyPage() {
  const [company, setCompany] = useState<CompanyProfile>({
    ...DEFAULT_COMPANY,
    erp_targets: [...DEFAULT_COMPANY.erp_targets],
  });
  const [companies, setCompanies] = useState<CompanyProfile[]>([]);
  const [activeCompanyId, setActiveCompanyId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [logoUploading, setLogoUploading] = useState(false);
  const [logoUploadMessage, setLogoUploadMessage] = useState("");
  const [logoUploadError, setLogoUploadError] = useState("");
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const loadCompany = useCallback(async (targetCompanyId?: string | null) => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      const storedId = typeof window !== "undefined" ? readActiveCompanyId() : null;
      const resolvedId = targetCompanyId ?? storedId;
      if (resolvedId) params.set("company_id", resolvedId);
      const res = await fetch(`/api/company${params.toString() ? `?${params.toString()}` : ""}`);
      if (!res.ok) throw new Error("Failed to load company profile");
      const payload = await res.json();
      const list = Array.isArray(payload?.companies) ? payload.companies : payload?.company ? [payload.company] : [];
      const normalizedList = list.map(normalizeCompanyPayload);
      const activeProfile = payload?.company
        ? normalizeCompanyPayload(payload.company)
        : normalizedList[0] ?? { ...DEFAULT_COMPANY };
      setCompanies(normalizedList);
      setCompany(activeProfile);
      const resolvedActiveId = activeProfile.id ?? null;
      setActiveCompanyId(resolvedActiveId);
      persistActiveCompanyId(resolvedActiveId);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Unable to load company profile");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCompany();
  }, [loadCompany]);

  useEffect(() => {
    let active = true;
    ensureClientUserId()
      .then(id => {
        if (active) setUserId(id);
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (company.logo_external_url) {
      setLogoPreview(company.logo_external_url);
      return;
    }
    if (company.logo_url) {
      const { data } = supabase.storage.from(LOGO_BUCKET).getPublicUrl(company.logo_url);
      setLogoPreview(data?.publicUrl ?? null);
      return;
    }
    setLogoPreview(null);
  }, [company.logo_external_url, company.logo_url]);

  function update<K extends keyof CompanyProfile>(field: K, value: CompanyProfile[K]) {
    setCompany(prev => ({ ...prev, [field]: value }));
  }

  async function handleLogoFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoUploadMessage("");
    setLogoUploadError("");
    setLogoUploading(true);
    try {
      const payload = new FormData();
      payload.append("file", file);
      if (userId) payload.append("user_id", userId);
      const res = await fetch("/api/company/logo", {
        method: "POST",
        body: payload,
      });
      type UploadResponse = { path?: string; publicUrl?: string; error?: string };
      const body = (await res.json().catch(() => ({}))) as UploadResponse;
      if (!res.ok || !body?.path) {
        throw new Error(body?.error || "Unable to upload logo");
      }
      setCompany(prev => ({ ...prev, logo_url: body.path }));
      setLogoPreview(body.publicUrl ?? null);
      setLogoUploadMessage("Logo uploaded. Remember to save your profile.");
    } catch (err) {
      setLogoUploadError(err instanceof Error ? err.message : "Unable to upload logo");
    } finally {
      setLogoUploading(false);
      e.target.value = "";
    }
  }

  function toggleErp(value: string) {
    setCompany(prev => {
      const next = prev.erp_targets.includes(value)
        ? prev.erp_targets.filter(target => target !== value)
        : [...prev.erp_targets, value];
      return { ...prev, erp_targets: next };
    });
  }


  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSuccess("");
    setError("");
    try {
      const res = await fetch("/api/company", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(company),
      });
      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        throw new Error(payload?.error || "Failed to save");
      }
      const payload = await res.json();
      const saved = payload?.company ? normalizeCompanyPayload(payload.company) : normalizeCompanyPayload(company);
      const list = Array.isArray(payload?.companies)
        ? payload.companies.map(normalizeCompanyPayload)
        : [saved];
      setCompany(saved);
      setCompanies(list);
      const resolvedActiveId = saved.id ?? null;
      setActiveCompanyId(resolvedActiveId);
      persistActiveCompanyId(resolvedActiveId);
      setSuccess("Company profile saved. You can start working immediately.");
      supabase.auth.updateUser({ data: { companyOnboarded: true } }).catch(err => console.warn("setup-company metadata", err?.message ?? err));
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to save company profile");
    } finally {
      setSaving(false);
    }
  }

  function handleCompanySwitch(e: ChangeEvent<HTMLSelectElement>) {
    const nextId = e.target.value || null;
    setActiveCompanyId(nextId);
    persistActiveCompanyId(nextId);
    loadCompany(nextId);
  }

  function handleCreateNewCompany() {
    setCompany({ ...DEFAULT_COMPANY, erp_targets: [...DEFAULT_COMPANY.erp_targets] });
    setActiveCompanyId(null);
    persistActiveCompanyId(null);
  }

  if (loading) {
    return <main className="flex items-center justify-center min-h-screen">Loading company settings...</main>;
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-10">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">
        <header className="space-y-2">
          <p className="text-xs uppercase tracking-widest text-indigo-600">Workspace onboarding</p>
          <h1 className="text-3xl font-bold">Setup your company</h1>
          <p className="text-gray-600 max-w-2xl">
            Capture company identity, branding, and Tier 2 ERP preferences so invoices, exports, and logins all use the
            right context.
          </p>
          {success && <div className="text-green-600 text-sm">{success}</div>}
          {error && <div className="text-red-600 text-sm">{error}</div>}
        </header>

        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-semibold">Active company</h2>
              <p className="text-sm text-gray-500">Pick which company profile you are editing or viewing.</p>
            </div>
            <div className="flex flex-col gap-2 md:flex-row md:items-center">
              <select
                className="border rounded-lg p-3 min-w-[220px]"
                value={activeCompanyId ?? ""}
                onChange={handleCompanySwitch}
              >
                <option value="">Select a company</option>
                {companies.map(entry => (
                  <option key={entry.id ?? entry.name} value={entry.id ?? ""}>
                    {entry.name || "Untitled company"}
                  </option>
                ))}
              </select>
              <button
                type="button"
                className="border border-indigo-200 text-indigo-700 rounded-lg px-4 py-2 font-semibold hover:bg-indigo-50"
                onClick={handleCreateNewCompany}
              >
                Add new company
              </button>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
          <div>
            <h2 className="text-xl font-semibold">Company identity</h2>
            <p className="text-sm text-gray-500">Shows up on invoices, CSV exports, and onboarding emails.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              className="border rounded-lg p-3"
              placeholder="Company name"
              value={company.name}
              onChange={e => update("name", e.target.value)}
              required
            />
            <input
              className="border rounded-lg p-3"
              placeholder="Email address"
              value={company.email}
              onChange={e => update("email", e.target.value)}
            />
            <input
              className="border rounded-lg p-3"
              placeholder="Phone number"
              value={company.phone}
              onChange={e => update("phone", e.target.value)}
            />
            <select
              className="border rounded-lg p-3"
              value={company.default_currency}
              onChange={e => update("default_currency", e.target.value)}
            >
              <option value="ZAR">ZAR (South African Rand)</option>
              <option value="USD">USD (US Dollar)</option>
              <option value="EUR">EUR (Euro)</option>
            </select>
          </div>
        </section>

        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
          <div>
            <h2 className="text-xl font-semibold">Registered address</h2>
            <p className="text-sm text-gray-500">Display on invoices to meet compliance in Tier 1.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              className="border rounded-lg p-3"
              placeholder="Address line 1"
              value={company.address_line1}
              onChange={e => update("address_line1", e.target.value)}
            />
            <input
              className="border rounded-lg p-3"
              placeholder="Address line 2"
              value={company.address_line2}
              onChange={e => update("address_line2", e.target.value)}
            />
            <input
              className="border rounded-lg p-3"
              placeholder="City"
              value={company.city}
              onChange={e => update("city", e.target.value)}
            />
            <input
              className="border rounded-lg p-3"
              placeholder="Province / State"
              value={company.province}
              onChange={e => update("province", e.target.value)}
            />
            <input
              className="border rounded-lg p-3"
              placeholder="Postal code"
              value={company.postal_code}
              onChange={e => update("postal_code", e.target.value)}
            />
            <input
              className="border rounded-lg p-3"
              placeholder="Country"
              value={company.country}
              onChange={e => update("country", e.target.value)}
            />
          </div>
        </section>

        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
          <div>
            <h2 className="text-xl font-semibold">Branding & templates</h2>
            <p className="text-sm text-gray-500">Support storage uploads or external logo URLs and switch between PDF templates.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              className="border rounded-lg p-3"
              placeholder="Supabase storage logo path"
              value={company.logo_url}
              onChange={e => update("logo_url", e.target.value)}
            />
            <input
              className="border rounded-lg p-3"
              placeholder="External logo URL"
              value={company.logo_external_url}
              onChange={e => update("logo_external_url", e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-600">Upload a logo</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoFileChange}
                disabled={logoUploading}
                className="block w-full text-sm text-gray-700 file:mr-4 file:rounded file:border-0 file:bg-indigo-50 file:px-4 file:py-2 file:text-indigo-700"
              />
              <p className="text-xs text-gray-500">PNG / SVG up to 5 MB. Uploading stores the file in Supabase storage.</p>
              {logoUploading && <p className="text-xs text-gray-500">Uploading...</p>}
              {logoUploadMessage && <p className="text-xs text-green-600">{logoUploadMessage}</p>}
              {logoUploadError && <p className="text-xs text-red-600">{logoUploadError}</p>}
            </div>
            <div className="flex items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 p-4">
              {logoPreview ? (
                <img src={logoPreview} alt="Company logo preview" className="h-20 w-36 object-contain" />
              ) : (
                <p className="text-xs text-gray-500">No logo uploaded yet</p>
              )}
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            {(["standard", "detailed"] as const).map(template => (
              <label key={template} className={`flex-1 min-w-[160px] border rounded-lg p-3 cursor-pointer ${company.invoice_template === template ? "border-indigo-500 bg-indigo-50" : "border-gray-200"}`}>
                <input
                  type="radio"
                  className="mr-2"
                  name="invoice_template"
                  value={template}
                  checked={company.invoice_template === template}
                  onChange={e => update("invoice_template", e.target.value as CompanyProfile["invoice_template"])}
                />
                <span className="font-semibold capitalize">{template}</span>
                <p className="text-xs text-gray-500">{template === "standard" ? "Logo + totals" : "Adds timers, crew notes, payment block."}</p>
              </label>
            ))}
          </div>
        </section>

        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
          <div>
            <h2 className="text-xl font-semibold">Tier 2 ERP connections</h2>
            <p className="text-sm text-gray-500">We will sync invoices to the connectors you toggle on once credentials are supplied.</p>
          </div>
          <div className="space-y-3">
            {ERP_OPTIONS.map(option => (
              <label key={option.value} className="flex items-start gap-3 border rounded-lg p-3">
                <input
                  type="checkbox"
                  className="mt-1"
                  checked={company.erp_targets.includes(option.value)}
                  onChange={() => toggleErp(option.value)}
                />
                <span>
                  <span className="font-semibold block">{option.label}</span>
                  <span className="text-xs text-gray-500">Exports and API payloads will match this platform.</span>
                </span>
              </label>
            ))}
          </div>
        </section>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold shadow"
            disabled={saving}
          >
            {saving ? "Saving..." : "Save company profile"}
          </button>
        </div>
      </form>
    </main>
  );
}
