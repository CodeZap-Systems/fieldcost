/**
 * Company Context Helper
 * 
 * Provides utilities to scope all API operations to a specific company
 * This ensures complete data isolation per company (like Sage One)
 */

import { supabaseServer } from './supabaseServer';

export interface CompanyContext {
  userId: string;
  companyId: number;
}

/**
 * Get the company context for the current request
 * Validates that user owns the specified company
 */
export async function getCompanyContext(userId: string, companyId?: number | string | null): Promise<CompanyContext> {
  if (!userId) {
    throw new Error('User ID required');
  }

  let resolvedCompanyId: number;
  
  if (companyId) {
    // Validate company ownership
    resolvedCompanyId = typeof companyId === 'string' ? parseInt(companyId, 10) : companyId;
    
    const { data: company, error } = await supabaseServer
      .from('company_profiles')
      .select('id')
      .eq('id', resolvedCompanyId)
      .eq('user_id', userId)
      .single();
    
    if (error || !company) {
      throw new Error(`Company ${companyId} not found or access denied`);
    }
  } else {
    // Get the first company if not specified (or could use localStorage activeCompanyId)
    const { data: company, error } = await supabaseServer
      .from('company_profiles')
      .select('id')
      .eq('user_id', userId)
      .order('created_at', { ascending: true })
      .limit(1)
      .single();
    
    if (!error && company) {
      resolvedCompanyId = company.id;
    } else {
      // Create a default company for users who don't have one yet
      const { data: newCompany, error: createError } = await supabaseServer
        .from('company_profiles')
        .insert([{ user_id: userId, company_name: `${userId}'s Company`, currency: 'ZAR' }])
        .select('id')
        .single();
      
      if (createError || !newCompany) {
        throw new Error(`Unable to find or create company for user: ${createError?.message || 'Unknown error'}`);
      }
      
      resolvedCompanyId = newCompany.id;
    }
  }

  return { userId, companyId: resolvedCompanyId };
}

/**
 * Validates company ownership
 */
export async function validateCompanyOwnership(userId: string, companyId: number): Promise<boolean> {
  const { data, error } = await supabaseServer
    .from('company_profiles')
    .select('id', { count: 'exact', head: true })
    .eq('id', companyId)
    .eq('user_id', userId)
    .single();

  return !error && !!data;
}

/**
 * Helper to add company_id filter to Supabase query
 */
export function withCompanyScope<T extends Record<string, any>>(
  query: any,
  companyId: number
): any {
  return query.eq('company_id', companyId);
}
