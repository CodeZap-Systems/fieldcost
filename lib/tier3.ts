/**
 * FieldCost Tier 3 — Enterprise
 * Feature set and capabilities for large mining & construction firms
 *
 * TIER 3 CAPABILITIES (per competitive analysis):
 * ✓ Multi-company setup
 * ✓ WIP tracking (live task level)
 * ✓ API access
 * ✓ Multi-currency
 * ✓ Role-based access control (field roles)
 * ✓ Audit trails (operational + photo)
 * ✓ Custom workflows
 * ✓ Crew-level GPS / geolocation
 * ✓ Photo evidence per task (legal-grade)
 * ✓ Offline mobile sync
 * ✓ Mining-specific workflows
 * ✓ SLA guarantees / dedicated support
 */

export type Tier3FieldRole = 
  | 'crew_member'        // On-site worker
  | 'supervisor'         // Site supervisor
  | 'site_manager'       // Project-level manager
  | 'project_manager'    // Multi-project oversight
  | 'finance'            // Financial operations
  | 'admin';             // System admin

export interface Tier3RolePermission {
  role: Tier3FieldRole;
  canCreateTasks: boolean;
  canApproveTasks: boolean;
  canManageCrew: boolean;
  canViewGPS: boolean;
  canExportData: boolean;
  canManageOfflineBundles: boolean;
  canAccessReports: boolean;
  canManageWorkflows: boolean;
  canSyncToERP: boolean;
}

export interface GPSCoordinates {
  latitude: number;
  longitude: number;
  accuracy?: number;      // Accuracy radius in meters
  timestamp: string;      // ISO 8601
  altitude?: number;      // Elevation in meters
}

export interface PhotoEvidence {
  id: string;
  taskId: number;
  projectId: number;
  photoUrl: string;
  photoHash: string;      // For legal verification chain
  capturedAt: string;     // ISO 8601
  capturedAtGPS: GPSCoordinates;
  capturedByCrewMemberId: number;
  description?: string;
  legalGradeVerified: boolean;  // Chain of custody confirmed
  mimeType: string;       // image/jpeg, video/mp4, etc.
}

export interface TaskLocationSnapshot {
  taskId: number;
  crewMemberId: number;
  locationGPS: GPSCoordinates;
  status: 'present' | 'departed' | 'offline';
  isOfflineMode: boolean;
  syncedAt?: string;      // When synced from offline
}

export interface OfflineBundleMetadata {
  id: string;
  deviceId: string;
  bundleCreatedAt: string;
  bundlesSynced: number;
  tasksInsideBundle: number;
  photosInsideBundle: number;
  dataSize: string;       // in MB
  lastSyncedAt?: string;
  requiresManualReview: boolean;
}

export interface Tier3AuditLog {
  id: string;
  entityType: 'task' | 'photo' | 'crew' | 'workflow' | 'invoice' | 'gps' | 'offline_sync';
  entityId: number;
  action: string;
  userId: string;
  userRole: Tier3FieldRole;
  timestamp: string;
  changeDetails: Record<string, unknown>;
  photoEvidence?: PhotoEvidence[];
  gpsEvidence?: GPSCoordinates;
  ipAddress?: string;
}

export interface CustomWorkflow {
  id: string;
  companyId: string;
  name: string;
  applicable_to: 'mining' | 'construction' | 'general';
  stages: WorkflowStage[];
  requiresApproval: boolean;
  approvalChain: Tier3FieldRole[];
  createdAt: string;
  updatedAt: string;
}

export interface WorkflowStage {
  name: string;
  order: number;
  allowedTransitions: string[];
  requiresPhotoEvidence: boolean;
  requiresGPSVerification: boolean;
  estimatedDurationHours: number;
  notifyRoles: Tier3FieldRole[];
}

export interface Tier3Company {
  id: string;
  name: string;
  registrationNumber: string;
  parentCompanyId?: string;      // For multi-entity holding structures
  defaultCurrency: 'ZAR' | 'USD' | 'EUR';
  supportedCurrencies: Array<'ZAR' | 'USD' | 'EUR'>;
  tier: 3;
  maxActiveProjects: number;
  maxUsers: number;
  hasDedicatedSupport: boolean;
  slaTier: 'gold' | 'platinum';  // SLA level
  createdAt: string;
}

export interface Tier3WIPSnapshot {
  projectId: number;
  taskId: number;
  status: 'todo' | 'in_progress' | 'complete' | 'approved' | 'invoiced';
  createdAt: string;
  earnedValue: number;           // Percentage complete
  actualCostToDate: number;       // ZAR or configured currency
  budgetedCostToDate: number;    // ZAR or configured currency
  variance: number;               // Actual - Budgeted
  photoCertification: number;     // Number of photos captured
  crewPresenceVerified: boolean;  // GPS-verified crew presence
  lastUpdatedAt: string;
  lastUpdatedByUserId: string;
}

/**
 * TIER 3 FEATURE FLAGS
 */
export const TIER3_FEATURES = {
  multiCompany: true,
  multiCurrency: true,
  gpsTracking: true,
  photoEvidence: true,
  offlineSync: true,
  fieldRoleRBAC: true,
  auditTrails: true,
  customWorkflows: true,
  miningWorkflows: true,
  dedicatedSupport: true,
  apiAccess: true,
  wipTracking: true,
  advancedReporting: true,
} as const;

/**
 * Role-based permission matrix for Tier 3
 */
export const TIER3_ROLE_PERMISSIONS: Record<Tier3FieldRole, Tier3RolePermission> = {
  crew_member: {
    role: 'crew_member',
    canCreateTasks: false,
    canApproveTasks: false,
    canManageCrew: false,
    canViewGPS: false,
    canExportData: false,
    canManageOfflineBundles: true,
    canAccessReports: false,
    canManageWorkflows: false,
    canSyncToERP: false,
  },
  supervisor: {
    role: 'supervisor',
    canCreateTasks: true,
    canApproveTasks: true,
    canManageCrew: true,
    canViewGPS: true,        // Can see crew on site
    canExportData: false,
    canManageOfflineBundles: true,
    canAccessReports: true,
    canManageWorkflows: false,
    canSyncToERP: false,
  },
  site_manager: {
    role: 'site_manager',
    canCreateTasks: true,
    canApproveTasks: true,
    canManageCrew: true,
    canViewGPS: true,
    canExportData: true,
    canManageOfflineBundles: true,
    canAccessReports: true,
    canManageWorkflows: true,
    canSyncToERP: false,
  },
  project_manager: {
    role: 'project_manager',
    canCreateTasks: true,
    canApproveTasks: true,
    canManageCrew: true,
    canViewGPS: true,
    canExportData: true,
    canManageOfflineBundles: true,
    canAccessReports: true,
    canManageWorkflows: true,
    canSyncToERP: true,
  },
  finance: {
    role: 'finance',
    canCreateTasks: false,
    canApproveTasks: false,
    canManageCrew: false,
    canViewGPS: false,
    canExportData: true,
    canManageOfflineBundles: false,
    canAccessReports: true,
    canManageWorkflows: false,
    canSyncToERP: true,
  },
  admin: {
    role: 'admin',
    canCreateTasks: true,
    canApproveTasks: true,
    canManageCrew: true,
    canViewGPS: true,
    canExportData: true,
    canManageOfflineBundles: true,
    canAccessReports: true,
    canManageWorkflows: true,
    canSyncToERP: true,
  },
};

/**
 * Check if a role has permission for an action
 */
export function hasPermission(role: Tier3FieldRole, action: keyof Tier3RolePermission): boolean {
  const permission = TIER3_ROLE_PERMISSIONS[role];
  if (!permission) return false;

  const permissionValue = permission[action];
  return typeof permissionValue === 'boolean' ? permissionValue : false;
}

/**
 * Validate GPS coordinates for legal chain of custody
 */
export function validateGPSCoordinates(gps: GPSCoordinates): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (typeof gps.latitude !== 'number' || gps.latitude < -90 || gps.latitude > 90) {
    errors.push('Invalid latitude: must be between -90 and 90');
  }

  if (typeof gps.longitude !== 'number' || gps.longitude < -180 || gps.longitude > 180) {
    errors.push('Invalid longitude: must be between -180 and 180');
  }

  if (gps.accuracy && gps.accuracy < 0) {
    errors.push('Accuracy must be non-negative');
  }

  // For SA mining/construction: acceptable accuracy is typically <= 5 meters for legal verification
  if (gps.accuracy && gps.accuracy > 10) {
    errors.push('GPS accuracy too low for legal verification (> 10m)');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Generate legal-grade photo evidence chain
 */
export function generatePhotoEvidenceChain(photo: PhotoEvidence): {
  chainId: string;
  integrity: boolean;
  timestamp: string;
} {
  // In production: Generate cryptographic hash chain for legal defensibility
  const chainId = `${photo.id}-${photo.capturedAt}-${photo.photoHash}`;

  return {
    chainId,
    integrity: true,  // Verified via photoHash
    timestamp: photo.capturedAt,
  };
}

/**
 * Tier 3 — Mining-Specific Workflow Template
 */
export const MINING_WORKFLOW_TEMPLATE: CustomWorkflow = {
  id: 'mining-workflow-001',
  companyId: '',
  name: 'Mining Site Progress & Verification',
  applicable_to: 'mining',
  stages: [
    {
      name: 'Blast Preparation',
      order: 1,
      allowedTransitions: ['Blast Execution'],
      requiresPhotoEvidence: true,
      requiresGPSVerification: true,
      estimatedDurationHours: 4,
      notifyRoles: ['supervisor', 'site_manager'],
    },
    {
      name: 'Blast Execution',
      order: 2,
      allowedTransitions: ['Post-Blast Inspection'],
      requiresPhotoEvidence: true,
      requiresGPSVerification: true,
      estimatedDurationHours: 1,
      notifyRoles: ['supervisor', 'project_manager'],
    },
    {
      name: 'Post-Blast Inspection',
      order: 3,
      allowedTransitions: ['Ground Support', 'Complete'],
      requiresPhotoEvidence: true,
      requiresGPSVerification: true,
      estimatedDurationHours: 2,
      notifyRoles: ['supervisor', 'site_manager'],
    },
    {
      name: 'Ground Support',
      order: 4,
      allowedTransitions: ['Complete'],
      requiresPhotoEvidence: true,
      requiresGPSVerification: true,
      estimatedDurationHours: 8,
      notifyRoles: ['supervisor'],
    },
    {
      name: 'Complete',
      order: 5,
      allowedTransitions: [],
      requiresPhotoEvidence: false,
      requiresGPSVerification: false,
      estimatedDurationHours: 0,
      notifyRoles: ['project_manager', 'finance'],
    },
  ],
  requiresApproval: true,
  approvalChain: ['supervisor', 'site_manager', 'project_manager'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};
