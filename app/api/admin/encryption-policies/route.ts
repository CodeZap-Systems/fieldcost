/**
 * Encryption Policies API
 * Admin endpoint for managing encryption policies and viewing audit logs
 */

import { NextResponse } from 'next/server';
import { supabaseServer } from '../../../../lib/supabaseServer';
import { resolveServerUserId } from '../../../../lib/serverUser';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = await resolveServerUserId(searchParams.get('user_id'));

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch all company policies for the admin
    const { data: companies, error: companiesError } = await supabaseServer
      .from('company_profiles')
      .select('id, name, pdf_encryption_enabled, created_at, updated_at')
      .eq('user_id', userId);

    if (companiesError) {
      console.error('Failed to fetch companies:', companiesError);
      return NextResponse.json({ error: companiesError.message }, { status: 500 });
    }

    // Format policies
    const policies = (companies || []).map(company => ({
      id: company.id,
      name: company.name,
      encryptionEnabled: company.pdf_encryption_enabled === true,
      documentTypes: ['invoice', 'quote', 'purchase_order'],
      lastUpdated: company.updated_at || company.created_at,
      exportCount: 0, // Will be populated from audit logs
    }));

    // Fetch export audit logs (if table exists)
    let auditLogs: Array<{ id?: number; user_id?: string; exported_at?: string; [key: string]: unknown }> = [];
    try {
      const { data: logs } = await supabaseServer
        .from('document_export_logs')
        .select('*')
        .eq('user_id', userId)
        .order('exported_at', { ascending: false })
        .limit(500);

      if (logs) {
        auditLogs = logs.map(log => ({
          id: log.id,
          companyName: companies?.find(c => c.id === log.company_id)?.name || 'Unknown',
          documentType: log.document_type || 'unknown',
          encrypted: log.encrypted === true,
          exportedAt: log.exported_at,
          filename: log.filename,
        }));

        // Update export counts
        const exportCounts = new Map<number, number>();
        auditLogs.forEach(log => {
          const company = companies?.find(c => c.name === log.companyName);
          if (company) {
            exportCounts.set(company.id, (exportCounts.get(company.id) || 0) + 1);
          }
        });

        policies.forEach(policy => {
          policy.exportCount = exportCounts.get(policy.id) || 0;
        });
      }
    } catch (logError) {
      console.log('Audit log table may not exist yet, continuing without logs');
    }

    return NextResponse.json({
      policies,
      auditLogs,
      summary: {
        totalCompanies: policies.length,
        encryptionEnabled: policies.filter(p => p.encryptionEnabled).length,
        totalExports: auditLogs.length,
      },
    });
  } catch (err) {
    console.error('GET /api/admin/encryption-policies error:', err);
    return NextResponse.json({ error: 'Failed to fetch encryption policies' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = await resolveServerUserId(searchParams.get('user_id'));

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { companyId, encryptionEnabled, encryptionPassword } = body;

    if (!companyId) {
      return NextResponse.json({ error: 'companyId is required' }, { status: 400 });
    }

    // Update company encryption settings
    const { data: updated, error } = await supabaseServer
      .from('company_profiles')
      .update({
        pdf_encryption_enabled: encryptionEnabled,
        pdf_encryption_password: encryptionPassword || null,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId)
      .eq('id', companyId)
      .select('id, name, pdf_encryption_enabled')
      .maybeSingle();

    if (error) {
      console.error('Failed to update policy:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!updated) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      policy: {
        id: updated.id,
        name: updated.name,
        encryptionEnabled: updated.pdf_encryption_enabled,
      },
    });
  } catch (err) {
    console.error('PATCH /api/admin/encryption-policies error:', err);
    return NextResponse.json({ error: 'Failed to update encryption policy' }, { status: 500 });
  }
}

export const runtime = 'nodejs';
