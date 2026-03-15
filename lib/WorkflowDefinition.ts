// WorkflowDefinition.ts
// Data model for no-code workflow engine (per company)

export interface WorkflowStep {
  id: string;
  name: string;
  type: 'approval' | 'notification' | 'condition' | 'action';
  assignedRole?: string;
  condition?: string; // e.g. "amount > 5000"
  actions?: string[]; // e.g. ["send_email", "update_status"]
  nextStepIds?: string[];
}

export interface WorkflowDefinition {
  id: string;
  companyId: string;
  name: string;
  steps: WorkflowStep[];
  triggers: string[]; // e.g. ["invoice_created", "budget_exceeded"]
  isActive: boolean;
}

// Example usage:
// const workflow: WorkflowDefinition = { ... };
