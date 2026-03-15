/**
 * Settings Backup and Restore API
 * Allows companies to export and import their settings including encryption configurations
 */

import { NextResponse } from 'next/server';
import { supabaseServer } from '../../../../lib/supabaseServer';
import { resolveServerUserId } from '../../../../lib/serverUser';
import {
  exportCompanySettings,
  importCompanySettings,
  getDownloadBackupFilename,
  validateBackup,
  type CompanySettingsBackup,
} from '../../../../lib/settingsBackup';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = await resolveServerUserId(searchParams.get('user_id'));
    const action = searchParams.get('action') || 'export';

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's company
    const { data: company } = await supabaseServer
      .from('company_profiles')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();

    if (!company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }

    if (action === 'export') {
      // Export settings as downloadable JSON
      const result = await exportCompanySettings(userId, company.id.toString());

      if (!result.success || !result.data) {
        return NextResponse.json({ error: result.error }, { status: 500 });
      }

      const filename = getDownloadBackupFilename(result.data.companyName);

      return new NextResponse(JSON.stringify(result.data, null, 2), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Content-Disposition': `attachment; filename="${filename}"`,
        },
      });
    }

    if (action === 'validate') {
      // Validate a backup file format (called before import)
      const { data: backup } = await request.json();

      if (!validateBackup(backup)) {
        return NextResponse.json(
          { error: 'Invalid backup file format' },
          { status: 400 }
        );
      }

      return NextResponse.json({ valid: true });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (err) {
    console.error('GET /api/settings/backup error:', err);
    return NextResponse.json({ error: 'Failed to process backup request' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = await resolveServerUserId(searchParams.get('user_id'));
    const action = searchParams.get('action') || 'import';

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's company
    const { data: company } = await supabaseServer
      .from('company_profiles')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();

    if (!company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }

    const body = await request.json();
    const { backup, overwriteEncryption, overwriteAddress } = body;

    if (!backup || !validateBackup(backup)) {
      return NextResponse.json(
        { error: 'Invalid backup file format' },
        { status: 400 }
      );
    }

    if (action === 'import') {
      const result = await importCompanySettings(
        userId,
        company.id.toString(),
        backup as CompanySettingsBackup,
        {
          overwriteEncryption,
          overwriteAddress,
        }
      );

      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        message: result.message,
      });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (err) {
    console.error('POST /api/settings/backup error:', err);
    return NextResponse.json({ error: 'Failed to process backup request' }, { status: 500 });
  }
}

export const runtime = 'nodejs';
