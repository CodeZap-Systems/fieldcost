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
    console.error('[getCompanyContext] No user ID provided');
    throw new Error('User ID required');
  }

  console.log(`[getCompanyContext] Processing user: "${userId}", companyId: ${companyId || 'not specified'}`);
  let resolvedCompanyId: number;
  
  if (companyId) {
    // Validate company ownership
    console.log(`[getCompanyContext] Validating company ownership for user "${userId}" and company "${companyId}"`);
    resolvedCompanyId = typeof companyId === 'string' ? parseInt(companyId, 10) : companyId;
    
    const { data: company, error } = await supabaseServer
      .from('company_profiles')
      .select('id')
      .eq('id', resolvedCompanyId)
      .eq('user_id', userId)
      .single();
    
    if (error || !company) {
      const errMsg = `Company ${companyId} not found or access denied for user "${userId}"`;
      console.error(`[getCompanyContext] ❌ ${errMsg} (error: ${error?.message || 'no match found'})`);
      throw new Error(errMsg);
    }
    
    console.log(`[getCompanyContext] ✅ Company ${resolvedCompanyId} validated for user "${userId}"`);
  } else {
    // Get the first company if not specified (or could use localStorage activeCompanyId)
    console.log(`[getCompanyContext] Looking up company for user "${userId}"...`);
    const { data: company, error } = await supabaseServer
      .from('company_profiles')
      .select('id')
      .eq('user_id', userId)
      .order('created_at', { ascending: true })
      .limit(1)
      .single();
    
    if (!error && company) {
      resolvedCompanyId = company.id;
      console.log(`[getCompanyContext] ✅ Found existing company ${resolvedCompanyId} for user "${userId}"`);
    } else {
      console.log(`[getCompanyContext] ⚠️  No existing company found (error: ${error?.message || 'not found'}), attempting to create...`);
      // Create a default company for users who don't have one yet
      const { data: newCompany, error: createError } = await supabaseServer
        .from('company_profiles')
        .insert([{ user_id: userId, name: `${userId}'s Company`, default_currency: 'ZAR' }])
        .select('id')
        .single();
      
      if (createError || !newCompany) {
        const errMsg = `Unable to find or create company for user "${userId}": ${createError?.message || 'Unknown error'}`;
        console.error(`[getCompanyContext] ❌ ${errMsg}`);
        throw new Error(errMsg);
      }
      
      resolvedCompanyId = newCompany.id;
      console.log(`[getCompanyContext] ✅ Created new company ${resolvedCompanyId} for user "${userId}"`);
    }
  }

  console.log(`[getCompanyContext] ✅ Returning context: userId="${userId}", companyId=${resolvedCompanyId}`);
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
