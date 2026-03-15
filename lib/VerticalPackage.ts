// VerticalPackage.ts
// Data model for industry vertical packages

export interface VerticalPackage {
  id: string;
  name: string;
  description: string;
  iconSet: string;
  customFields: Array<{
    key: string;
    label: string;
    type: string;
    options?: string[];
    required?: boolean;
    permissions?: string[];
  }>;
  workflows: string[]; // WorkflowDefinition ids
  reports: string[]; // Report ids
  terminology: Record<string, string>;
  complianceRules: string[];
}

// Example usage:
// const civilEngineering: VerticalPackage = { ... };
