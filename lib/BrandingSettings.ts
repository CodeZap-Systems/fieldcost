// BrandingSettings.ts
// Data model for white-label branding configuration (per company)

export interface BrandingSettings {
  companyId: string;
  logoUrl: string;
  faviconUrl: string;
  colorPalette: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  fontFamily: string;
  terminology: Record<string, string>; // e.g. { project: "Job", crew: "Team" }
  emailTemplates: {
    header: string;
    footer: string;
    login: string;
  };
  customDomain?: string;
  appName?: string;
  iconSet?: string;
}

// Example usage:
// const branding: BrandingSettings = { ... };
