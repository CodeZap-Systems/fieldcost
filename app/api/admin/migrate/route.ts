import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

// Create admin client with service role (unrestricted)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  {
    db: { schema: 'public' },
  }
);

export async function POST(request: NextRequest) {
  try {
    // Security: Only allow from localhost or verified sources
    const origin = request.headers.get('origin');
    const host = request.headers.get('host');
    
    if (process.env.NODE_ENV === 'production' && !origin?.includes('localhost')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('[MIGRATION] Starting table creation...');

    // Read SQL file from project root
    const sqlPath = path.join(process.cwd(), 'COPY_TO_SUPABASE.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf-8');

    // Split into statements
    const statements = sqlContent
      .split(';')
      .map(s => s.trim())
      .filter(s => s && !s.startsWith('--'));

    console.log(`[MIGRATION] Found ${statements.length} statements`);

    let successCount = 0;
    let failedStatements: string[] = [];

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const stmt = statements[i];
      
      try {
        // Execute through supabase admin client
        let error: any = null;
        let data: any = null;

        try {
          const result = await supabaseAdmin.rpc('exec_batch', {
            queries: [stmt],
          });
          error = result.error;
          data = result.data;
        } catch (rpcErr: any) {
          error = rpcErr;
        }

        if (error) {
          failedStatements.push(`Statement ${i + 1}: ${stmt.substring(0, 50)}`);
          console.log(`[MIGRATION] ✗ Statement ${i + 1} failed:`, error?.message || error);
        } else {
          successCount++;
          if (stmt.includes('CREATE TABLE')) {
            const match = stmt.match(/CREATE TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?(\w+)/i);
            console.log(`[MIGRATION] ✓ Created table: ${match?.[1] || 'unknown'}`);
          }
        }
      } catch (err: any) {
        failedStatements.push(`Statement ${i + 1}: ${err.message}`);
        console.error(`[MIGRATION] Error on statement ${i + 1}:`, err.message);
      }
    }

    return NextResponse.json({
      success: failedStatements.length === 0,
      message: `Migration completed. ${successCount}/${statements.length} statements executed`,
      successCount,
      totalStatements: statements.length,
      failedStatements,
      nextStep: 'Run: node seed-quotes-orders.mjs'
    });

  } catch (error: any) {
    console.error('[MIGRATION] Fatal error:', error);
    return NextResponse.json(
      { 
        error: error.message,
        suggestion: 'Use Supabase web console to execute SQL manually'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    status: 'Migration endpoint ready',
    method: 'POST',
    description: 'Executes COPY_TO_SUPABASE.sql to create tables',
    usage: 'curl -X POST http://localhost:3000/api/admin/migrate'
  });
}
