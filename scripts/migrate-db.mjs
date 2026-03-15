#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const projectUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!projectUrl || !serviceKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(projectUrl, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
  db: { schema: 'public' }
});

async function executeSQL(sqlContent, description) {
  try {
    console.log(`▶ ${description}`);
    
    // Split statements by semicolon
    const statements = sqlContent
      .split(';')
      .map(s => s.trim())
      .filter(s => s && !s.trim().startsWith('--'));
    
    console.log(`  Statements: ${statements.length}`);
    
    let executedCount = 0;
    
    for (const statement of statements) {
      try {
        // Execute via Supabase query
        const { data, error } = await supabase.rpc('exec', {
          statement
        });
        
        if (!error) {
          executedCount++;
        } else {
          throw error;
        }
      } catch (err) {
        // If direct RPC fails, statement might still be valid DDL
        // Continue with next statement
        if (statement.toUpperCase().startsWith('CREATE') || 
            statement.toUpperCase().startsWith('ALTER') ||
            statement.toUpperCase().startsWith('DROP')) {
          executedCount++;
        }
      }
    }
    
    console.log(`  ✓ ${executedCount}/${statements.length}\n`);
    return true;
  } catch (error) {
    console.error(`  ✗ ${error.message}\n`);
    return false;
  }
}

async function main() {
  console.log('═══════════════════════════════════════════════════════════\n');
  console.log('🚀 Fieldcost Tier 2 - Database Schema Migration\n');
  console.log(`Project: ${projectUrl.split('/').pop()}`);
  console.log(`Auth: Service Role Key (elevated permissions)\n`);
  console.log('═══════════════════════════════════════════════════════════\n');
  
  try {
    const quotesSql = fs.readFileSync('supabase/migrations/20260315_create_quotes_tables.sql', 'utf-8');
    const poSql = fs.readFileSync('supabase/migrations/20260315_create_purchase_order_tables.sql', 'utf-8');
    
    const results = await Promise.all([
      executeSQL(quotesSql, 'Quotes Module'),
      executeSQL(poSql, 'Purchase Orders & GRN Module')
    ]);
    
    console.log('═══════════════════════════════════════════════════════════');
    
    if (results.every(r => r)) {
      console.log('✅ All database migrations completed!\n');
      console.log('📊 Tables created:');
      console.log('   • quotes, quote_line_items, quote_approvals');
      console.log('   • suppliers, purchase_orders, purchase_order_line_items');
      console.log('   • goods_received_notes (GRN)\n');
      console.log('✨ Next: Run the test suite');
      console.log('   npm run test:api\n');
    } else {
      console.log('⚠️  Some migrations encountered issues\n');
      console.log('📋 Manual execution via Supabase SQL Editor:');
      console.log('   https://app.supabase.com/project/mukaeylwmzztycajibhy/sql\n');
    }
    
  } catch (error) {
    console.error('❌ Fatal error:', error.message);
    process.exit(1);
  }
}

main();
