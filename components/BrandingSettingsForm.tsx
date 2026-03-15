// components/BrandingSettingsForm.tsx

import React, { useState } from "react";
import { BrandingSettings } from "@/lib/BrandingSettings";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "./Button";
import { FormField } from "./FormField";
import { ConfirmDialog } from "./ConfirmDialog";
import { Feedback } from "./Feedback";

const defaultColors = {
  primary: "#2563eb",
  secondary: "#64748b",
  accent: "#f59e42",
  background: "#f8fafc",
  text: "#1e293b",
};

export default function BrandingSettingsForm({
  companyId,
  initial,
  onSave,
}: {
  companyId: string;
  initial?: BrandingSettings;
  onSave?: (settings: BrandingSettings) => void;
}) {
  const [logoUrl, setLogoUrl] = useState(initial?.logoUrl || "");
  const [faviconUrl, setFaviconUrl] = useState(initial?.faviconUrl || "");
  const [colorPalette, setColorPalette] = useState(initial?.colorPalette || defaultColors);
  const [fontFamily, setFontFamily] = useState(initial?.fontFamily || "Inter, sans-serif");
  const [terminology, setTerminology] = useState(initial?.terminology || { project: "Project", crew: "Crew" });
  const [appName, setAppName] = useState(initial?.appName || "FieldCost");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const handleClearBranding = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error("Not authenticated");
      const res = await fetch(`/api/branding?companyId=${companyId}&userId=${user.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to clear branding");
      setSuccess("Branding settings cleared.");
      // Optionally reset local state
      setLogoUrl("");
      setFaviconUrl("");
      setColorPalette(defaultColors);
      setFontFamily("Inter, sans-serif");
      setTerminology({ project: "Project", crew: "Crew" });
      setAppName("FieldCost");
      onSave?.({
        companyId,
        logoUrl: "",
        faviconUrl: "",
        colorPalette: defaultColors,
        fontFamily: "Inter, sans-serif",
        terminology: { project: "Project", crew: "Crew" },
        appName: "FieldCost",
        emailTemplates: { header: "", footer: "", login: "" },
      });
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setSaving(false);
      setConfirmOpen(false);
    }
  };

  const handleColorChange = (key: string, value: string) => {
    setColorPalette({ ...colorPalette, [key]: value });
  };

  const handleTerminologyChange = (key: string, value: string) => {
    setTerminology({ ...terminology, [key]: value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const settings: BrandingSettings = {
      companyId,
      logoUrl,
      faviconUrl,
      colorPalette,
      fontFamily,
      terminology,
      appName,
      emailTemplates: initial?.emailTemplates || { header: "", footer: "", login: "" },
    };
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error("Not authenticated");
      const res = await fetch(`/api/branding?userId=${user.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (!res.ok) throw new Error("Failed to save");
      onSave?.(settings);
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSave} aria-busy={saving} aria-live="polite">
      <FormField label="App Name" htmlFor="appName">
        <input
          id="appName"
          className="input"
          value={appName}
          onChange={e => setAppName(e.target.value)}
          aria-required="true"
        />
      </FormField>
      <FormField label="Logo URL" htmlFor="logoUrl">
        <input
          id="logoUrl"
          className="input"
          value={logoUrl}
          onChange={e => setLogoUrl(e.target.value)}
          placeholder="https://..."
          aria-required="false"
        />
      </FormField>
      <FormField label="Favicon URL" htmlFor="faviconUrl">
        <input
          id="faviconUrl"
          className="input"
          value={faviconUrl}
          onChange={e => setFaviconUrl(e.target.value)}
          placeholder="https://..."
          aria-required="false"
        />
      </FormField>
      <FormField label="Color Palette" htmlFor="colorPalette-primary" helperText="Choose your brand colors.">
        <div className="flex gap-4">
          {Object.keys(colorPalette).map(key => (
            <div key={key} className="flex flex-col items-center">
              <span className="text-xs mb-1">{key}</span>
              <input
                id={`colorPalette-${key}`}
                type="color"
                value={colorPalette[key]}
                onChange={e => handleColorChange(key, e.target.value)}
                aria-label={`Color for ${key}`}
              />
              <input
                className="w-20 text-xs mt-1"
                value={colorPalette[key]}
                onChange={e => handleColorChange(key, e.target.value)}
                aria-label={`Hex for ${key}`}
              />
            </div>
          ))}
        </div>
      </FormField>
      <FormField label="Font Family" htmlFor="fontFamily">
        <input
          id="fontFamily"
          className="input"
          value={fontFamily}
          onChange={e => setFontFamily(e.target.value)}
          aria-required="false"
        />
      </FormField>
      <FormField label="Terminology Mapping" htmlFor="terminology-project" helperText="Customize key terms for your business.">
        <div className="flex gap-4">
          {Object.keys(terminology).map(key => (
            <div key={key} className="flex flex-col items-center">
              <span className="text-xs mb-1">{key}</span>
              <input
                id={`terminology-${key}`}
                className="w-24 text-xs"
                value={terminology[key]}
                onChange={e => handleTerminologyChange(key, e.target.value)}
                aria-label={`Term for ${key}`}
              />
            </div>
          ))}
        </div>
        <Button
          type="button"
          variant="secondary"
          className="text-xs mt-2"
          onClick={() => setTerminology({ ...terminology, newTerm: "" })}
          aria-label="Add new terminology term"
        >
          + Add Term
        </Button>
      </FormField>
      <Feedback type="error" message={error || ""} />
      <Feedback type="success" message={success || ""} />
      <div className="flex gap-4">
        <Button type="submit" variant="primary" loading={saving} disabled={saving} aria-label="Save branding settings">
          {saving ? "Saving..." : "Save Settings"}
        </Button>
        <Button
          type="button"
          variant="danger"
          onClick={() => setConfirmOpen(true)}
          disabled={saving}
          aria-label="Clear all branding settings"
        >
          Clear Branding
        </Button>
      </div>
      <ConfirmDialog
        open={confirmOpen}
        title="Clear Branding Settings"
        message="Are you sure you want to clear all branding settings? This cannot be undone."
        confirmLabel="Clear"
        cancelLabel="Cancel"
        onConfirm={handleClearBranding}
        onCancel={() => setConfirmOpen(false)}
      />
    </form>
  );
}
