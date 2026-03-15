/**
 * Company Context Utility
 * Provides user company context validation and retrieval
 */

import { supabaseServer } from './supabaseServer';
import { DEMO_COMPANY_ID } from './demoConstants';

export interface CompanyContext {
  userId: string;
  companyId: string;
  isDemo: boolean;
}

/**
 * Get and validate company context for a user
 * Ensures the user has access to the requested company
 * @param userId - The authenticated user ID
 * @param companyId - The company ID being accessed
 * @returns CompanyContext if user has access
 * @throws Error if user doesn't have access to the company
 */
export async function getCompanyContext(
  userId: string,
  companyId?: string | null
): Promise<CompanyContext> {
  if (!userId) {
    throw new Error('userId is required');
  }

  if (!companyId || !companyId.toString().trim()) {
    throw new Error('companyId parameter is required for data isolation');
  }

  const companyIdStr = companyId.toString();
  const isDemo = companyIdStr === DEMO_COMPANY_ID;

  // Demo company is accessible to all authenticated users
  if (isDemo) {
    return {
      userId,
      companyId: companyIdStr,
      isDemo: true,
    };
  }

  // For live companies, verify user ownership
  const { data: userCompany, error } = await supabaseServer
    .from('company_profiles')
    .select('id')
    .eq('user_id', userId)
    .eq('id', parseInt(companyIdStr, 10))
    .maybeSingle();

  if (error) {
    throw new Error(`Company context lookup failed: ${error.message}`);
  }

  if (!userCompany) {
    throw new Error('User does not have access to this company');
  }

  return {
    userId,
    companyId: companyIdStr,
    isDemo: false,
  };
}

/**
 * Check if a company is the demo company
 * @param companyId - The company ID to check
 * @returns true if the company is the demo company
 */
export function isDemoCompany(companyId?: string | null): boolean {
  return companyId === DEMO_COMPANY_ID || companyId === DEMO_COMPANY_ID.toString();
}
